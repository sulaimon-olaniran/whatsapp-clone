import {useState, useEffect, useCallback, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import axios from "axios";
import {useDebounce} from "use-debounce";
import {Button} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import {v4 as uuidv4} from "uuid";

import {RecentEmoji} from "../../../../../../../../../../icons";
import {sendNewChatMessage} from "../../../../../../../../../../store/actions/chat";

const MessageInputInsertStickersComponent = ({
  replyMessage,
  setReplyMessage,
}) => {
  const [stickers, setStickers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [stickersQuery, setStickersQuery] = useState("Trending");
  const [searchInput, setSearchInput] = useState("");
  const [transform, setTransfrom] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const [searchValue] = useDebounce(searchInput, 1000);

  const scrollRef = useRef(null);

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const currentChat = useSelector(state => state.chat.currentChat);

  const handleOnGifsScroll = () => {
    const {scrollTop} = scrollRef.current;
    if (scrollTop > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const handleSearchInputChange = event => {
    setSearchInput(event.target.value);
  };

  const handleToggleGifsQuery = (query, transform) => {
    setStickersQuery(query);
    setTransfrom(transform);
  };

  const handleSendMessageStickerType = sticker => {
    const message = {
      chatId: currentChat._id,
      sender: user._id,
      receiver: currentChat?.partnerData?._id,
      caption: "",
      type: "sticker",
      isSent: false,
      isReply: replyMessage ? true : false,
      repliedTo: replyMessage?._id,
      starred: [],
      time: Date.now(),
      subId: uuidv4(),
      sticker: sticker,
    };

    dispatch(sendNewChatMessage(message));
    setReplyMessage(null);
    // closeOption();
  };

  const handleFetchStickers = useCallback(() => {
    setFetching(true);
    setStickers([]);

    const query =
      stickersQuery.toLowerCase() === "trending" && searchValue === ""
        ? "trending"
        : "search";
    const search =
      searchValue === ""
        ? stickersQuery.toLowerCase()
        : searchValue.toLowerCase();

    axios
      .get(
        `https://api.giphy.com/v1/stickers/${query}?api_key=kiRWdESnkOayGIIHUotQSD0tV9cUutqa&limit=50${
          query === "search" && `&q=${search}`
        }`
      )
      .then(res => {
        console.log(res.data);
        setStickers(res.data.data);
        setFetching(false);
      })
      .catch(error => {
        console.log(error);
        setFetching(false);
      });
  }, [searchValue, stickersQuery]);

  useEffect(() => {
    handleFetchStickers();
    //console.log("okay");
  }, [handleFetchStickers]);

  const gifsHeaders = [
    {
      title: "Create",
      action: handleToggleGifsQuery,
      transformX: "0%",
      icon: <RecentEmoji />,
    },
    {
      title: "Love",
      action: handleToggleGifsQuery,
      transformX: "100%",
    },
    {
      title: "Greetings",
      action: handleToggleGifsQuery,
      transformX: "200%",
    },
    {
      title: "Happy",
      action: handleToggleGifsQuery,
      transformX: "300%",
    },
    {
      title: "Sad",
      action: handleToggleGifsQuery,
      transformX: "400%",
    },
    {
      title: "Angry",
      action: handleToggleGifsQuery,
      transformX: "500%",
    },
    {
      title: "Celebrate",
      action: handleToggleGifsQuery,
      transformX: "600%",
    },
  ];

  return (
    <div className={`message-input-insert-stickers-component-${theme}-theme`}>
      <header className="insert-stickers-header-container">
        <div
          className="button-is-active"
          style={{transform: `translateX(${transform})`}}
        />
        {gifsHeaders.map(header => {
          const {action, title, transformX} = header;
          return (
            <div key={title}>
              <Button
                onClick={() => {
                  action(title, transformX);
                }}
              >
                {title}
              </Button>
            </div>
          );
        })}
      </header>

      <div className="insert-stickers-body-component">
        {fetching && (
          <div className="linear-fetching-loader-container">
            <LinearProgress />
          </div>
        )}
        <div
          className={`insert-stickers-search-input-container ${
            isScrolled && "is-scrolled"
          }`}
        >
          <input
            value={searchInput}
            onChange={handleSearchInputChange}
            name="search_stickers"
            id="search_stickers"
            placeholder="Search Stickers Via Giphy Developers"
          />
        </div>

        <div
          className="stickers-contents-container"
          ref={scrollRef}
          onScroll={handleOnGifsScroll}
        >
          {stickers.map((sticker, index) => {
            const stickerImage = sticker.images.downsized.url;
            return (
              <div
                key={sticker.id}
                onClick={() => handleSendMessageStickerType(stickerImage)}
              >
                <img src={stickerImage} alt="Gif" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageInputInsertStickersComponent;

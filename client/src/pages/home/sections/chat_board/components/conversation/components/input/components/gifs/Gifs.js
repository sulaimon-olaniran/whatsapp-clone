import {useState, useEffect, useCallback, useRef} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import {useDebounce} from "use-debounce";
import {Button} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

const MessageInputInsertGifsComponent = ({
  showInsertOption,
  setInsertedMedias,
  setExpandOptions,
}) => {
  const [gifs, setGifs] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [gifsQuery, setGifsQuery] = useState("Trending");
  const [searchInput, setSearchInput] = useState("");
  const [transform, setTransfrom] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const [searchValue] = useDebounce(searchInput, 1000);

  const scrollRef = useRef(null);

  const theme = useSelector(state => state.app.theme);

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
    setGifsQuery(query);
    setTransfrom(transform);
  };

  const handleFetchGifs = useCallback(() => {
    setFetching(true);
    setGifs([]);

    const query =
      gifsQuery.toLowerCase() === "trending" && searchValue === ""
        ? "trending"
        : "search";
    const search =
      searchValue === "" ? gifsQuery.toLowerCase() : searchValue.toLowerCase();

    axios
      .get(
        `https://api.giphy.com/v1/gifs/${query}?api_key=kiRWdESnkOayGIIHUotQSD0tV9cUutqa&limit=50${
          query === "search" && `&q=${search}`
        }`
      )
      .then(res => {
        setGifs(res.data.data);
        setFetching(false);
      })
      .catch(error => {
        console.log(error);
        setFetching(false);
      });
  }, [searchValue, gifsQuery]);

  useEffect(() => {
    handleFetchGifs();
  }, [handleFetchGifs]);

  const gifsHeaders = [
    {
      title: "Trending",
      action: handleToggleGifsQuery,
      transformX: "0%",
    },
    {
      title: "Haha",
      action: handleToggleGifsQuery,
      transformX: "100%",
    },
    {
      title: "Sad",
      action: handleToggleGifsQuery,
      transformX: "200%",
    },
    {
      title: "Love",
      action: handleToggleGifsQuery,
      transformX: "300%",
    },
    {
      title: "Reactions",
      action: handleToggleGifsQuery,
      transformX: "400%",
    },
    {
      title: "Sports",
      action: handleToggleGifsQuery,
      transformX: "500%",
    },
    {
      title: "TV",
      action: handleToggleGifsQuery,
      transformX: "600%",
    },
  ];

  const handleSelectGif = gif => {
    setInsertedMedias([gif]);
    showInsertOption("photos & videos");
    setExpandOptions(false);
  };

  return (
    <div className={`message-input-insert-gifs-compnent-${theme}-theme`}>
      <header className="insert-gifs-header-container">
        <div
          className="button-is-active"
          style={{transform: `translateX(${transform})`}}
        />
        {gifsHeaders.map(header => {
          const {action, title, transformX} = header;
          return (
            <div key={title} className="insert-gifs-header-each-header">
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

      <div className="insert-gifs-body-component">
        {fetching && (
          <div className="linear-fetching-loader-container">
            <LinearProgress />
          </div>
        )}
        <div
          className={`insert-gifs-search-input-container ${
            isScrolled && "is-scrolled"
          }`}
        >
          <input
            value={searchInput}
            onChange={handleSearchInputChange}
            name="search_gifs"
            id="search_gifs"
            placeholder="Search GIFs Via Giphy Developers"
          />
        </div>

        <div
          className="gifs-contents-container"
          ref={scrollRef}
          onScroll={handleOnGifsScroll}
        >
          {gifs.map((gif, index) => {
            const gifFile = gif.images.downsized.url;
            //const ext = gifFile.split(".").pop();
            //const exx = ext.split("&");
            return (
              <div
                key={index}
                style={{
                  width: `${gif.images.downsized.width}`,
                }}
                onClick={() => handleSelectGif(gifFile)}
                //onClick={() => console.log(exx)}
              >
                <img src={gifFile} alt="Gif" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageInputInsertGifsComponent;

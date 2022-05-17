import {useState, useRef, useEffect} from "react";
import {useSelector} from "react-redux";
import {IconButton} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {useDebounce} from "use-debounce";

import emojis from "../../../jsons/emojis.json";
import EmojiTypesComponent from "./emoji_type/EmojiType";
import {
  Activities,
  AnimalsNature,
  Flags,
  FoodDrink,
  Objects,
  RecentEmoji,
  SmileysPeople,
  Symbols,
  TravelPlaces,
} from "../../../icons";

const EmojisComponent = ({setState, type}) => {
  const recentlyUsedEmojis =
    JSON.parse(localStorage.getItem("recent_emojis")) || [];
  const [searchInput, setSearchInput] = useState("");
  const [activeEmoji, setActiveEmoji] = useState(
    recentlyUsedEmojis.length > 0 ? "Recently Used" : "Smileys & People"
  );
  const [displayNumber, setDisplayNumber] = useState(type ? 100 : 48);

  const [searchValue] = useDebounce(searchInput, 500);

  const theme = useSelector(state => state.app.theme);

  const containerRef = useRef(null);

  const emojisHeader = [
    {
      icon: <RecentEmoji />,
      title: "Recently Used",
      action: setActiveEmoji,
      id: "recently_used",
    },

    {
      icon: <SmileysPeople />,
      title: "Smileys & People",
      action: setActiveEmoji,
      id: "smileys_people",
      ref: useRef(null),
    },

    {
      icon: <AnimalsNature />,
      title: "Animals & Nature",
      action: setActiveEmoji,
      id: "animals_nature",
    },

    {
      icon: <FoodDrink />,
      title: "Food & Drink",
      action: setActiveEmoji,
      id: "food_drink",
    },

    {
      icon: <Activities />,
      title: "Activities",
      action: setActiveEmoji,
      id: "activities",
    },

    {
      icon: <TravelPlaces />,
      title: "Travel & Places",
      action: setActiveEmoji,
      id: "travel_places",
    },

    {
      icon: <Objects />,
      title: "Objects",
      action: setActiveEmoji,
      id: "objects",
    },

    {
      icon: <Symbols />,
      title: "Symbols",
      action: setActiveEmoji,
      id: "symbols",
    },

    {
      icon: <Flags />,
      title: "Flags",
      action: setActiveEmoji,
      id: "flags,",
    },
  ];

  const handleInputChange = event => {
    setSearchInput(event.target.value);
  };

  const searchedEmojiResult = emojis.filter(emoji => {
    return (
      emoji.description.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
    );
  });

  const handleCancelSearch = () => {
    setSearchInput("");
  };

  const filterEmojiTypes = value => {
    if (activeEmoji !== "Smileys & People")
      return value.category.toLowerCase() === activeEmoji.toLowerCase();

    return (
      value.category.toLowerCase() === "smileys & emotion" ||
      value.category.toLowerCase() === "people & body"
    );
  };

  const handleOnScroll = () => {
    if (containerRef.current) {
      const {scrollTop, scrollHeight, clientHeight} = containerRef.current;

      const currentEmojiTypeLength = emojis.filter(filterEmojiTypes).length;

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        if (displayNumber < currentEmojiTypeLength) {
          setDisplayNumber(prev => prev + (type ? 60 : 32));
        }
      }
    }
  };

  useEffect(() => {
    containerRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const handleScrollToTop = () => {
    containerRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    setDisplayNumber(64);
  };

  return (
    <div className={`emojis-component-${theme}-theme-container`}>
      <div className="emojis-component-header-container">
        <div className="emojis-component-header-list-container">
          {emojisHeader.map(header => {
            return (
              <div
                key={header.id}
                className={
                  activeEmoji === header.title ? "active-emoji-header" : ""
                }
              >
                {header.id === "recently_used" &&
                  recentlyUsedEmojis.length > 0 && (
                    <IconButton
                      size="large"
                      onClick={() => {
                        handleScrollToTop();
                        header.action(header.title);
                      }}
                    >
                      {header.icon}
                    </IconButton>
                  )}

                {header.id !== "recently_used" && (
                  <IconButton
                    size="large"
                    onClick={() => {
                      handleScrollToTop();
                      header.action(header.title);
                    }}
                  >
                    {header.icon}
                  </IconButton>
                )}
              </div>
            );
          })}
        </div>
        <div className="emojis-component-search-container">
          <input
            placeholder="Search Emoji"
            value={searchInput}
            onChange={handleInputChange}
          />
          {searchInput !== "" && (
            <IconButton size="small" onClick={handleCancelSearch}>
              <CloseOutlinedIcon />
            </IconButton>
          )}
        </div>
      </div>

      <div
        className={`emojis-component-list-container ${
          type ? "is-chat-input" : ""
        }`}
        ref={containerRef}
        onScroll={handleOnScroll}
      >
        {searchValue !== "" && (
          <EmojiTypesComponent
            emojis={searchedEmojiResult.slice(0, displayNumber)}
            type="Searched Emojis"
            setState={setState}
          />
        )}
        {activeEmoji === "Recently Used" && searchValue === "" && (
          <EmojiTypesComponent
            emojis={
              JSON.parse(localStorage.getItem("recent_emojis")).slice(0, 72) ||
              []
            }
            type={activeEmoji}
            setState={setState}
          />
        )}

        {activeEmoji !== "Recently Used" && searchValue === "" && (
          <EmojiTypesComponent
            emojis={emojis.filter(filterEmojiTypes).slice(0, displayNumber)}
            type={activeEmoji}
            setState={setState}
          />
        )}
      </div>
    </div>
  );
};

export default EmojisComponent;

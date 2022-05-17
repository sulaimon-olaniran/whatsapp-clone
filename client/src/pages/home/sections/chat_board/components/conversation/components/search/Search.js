import {useState} from "react";
import {useSelector} from "react-redux";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {useDebounce} from "use-debounce";
import Highlighter from "react-highlight-words";
import ScrollTo from "react-scroll-into-view";

//import {createRoot} from "react-dom/client";

import SearchInputComponent from "../../../../../../../../components/search_input/SearchInput";
import MessageStatusComponent from "../../../../../../../../components/message/components/status/Status";

const ConversationSearchMessagesComponent = ({closeSideBar}) => {
  const [searchInputValue, setSearchInputValue] = useState("");

  const [searchValue] = useDebounce(searchInputValue, 500);

  const theme = useSelector(state => state.app.theme);

  const handleSearchMessagesInputChange = event => {
    setSearchInputValue(event.target.value);
  };

  const messages = useSelector(state => state.chat.currentChat.messages);

  const searchedMessages = messages.filter(message => {
    return (
      searchValue !== "" &&
      message?.message?.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  //console.log(searchedMessages);

  const handleBlah = ref => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className={`conversation-search-messages-component-${theme}-theme`}>
      <header>
        <IconButton onClick={closeSideBar}>
          <CloseIcon />
        </IconButton>
        <p>Search messages</p>
      </header>

      <div className="conversation-search-messages-body-container">
        <div className="conversation-search-input-container">
          <div className="input-inner-container">
            <SearchInputComponent
              handleChange={handleSearchMessagesInputChange}
              value={searchInputValue}
              id="messages_search"
              placeholder="Search message"
            />
          </div>
        </div>
        <div className="searched-messages-result-container">
          {searchedMessages.map(message => {
            const mediaId = message._id || message.subId;
            const my_object = {};
            return (
              <div
                className="each-search-message-container"
                key={message._id || message.subId}
                onClick={() => handleBlah(my_object[mediaId])}
              >
                <span>3:15pm</span>
                <div className="search-message-message-container">
                  <MessageStatusComponent message={message} />
                  <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={[`${searchValue}`]}
                    autoEscape={true}
                    textToHighlight={message.message}
                    activeIndex={1}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="no-searched-message-container">
          <p>Search for messages with Michael Sabitzer</p>
        </div> */}
      </div>
    </div>
  );
};

export default ConversationSearchMessagesComponent;

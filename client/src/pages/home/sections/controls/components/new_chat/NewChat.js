import {useState, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import Slide from "@mui/material/Slide";
import {useDebounce} from "use-debounce";

import ControlHeaderComponent from "../../../../../../components/headers/ControlsHeader";
import UsersListComponent from "../../../../../../components/users_list/UsersList";
import {AddPeopleIcon} from "../../../../../../icons";
import SearchInputComponent from "../../../../../../components/search_input/SearchInput";

import ControlsNewGroupComponent from "../new_group/NewGroup";
import {createChat, setCurrentChat} from "../../../../../../store/actions/chat";

const ControlsNewChatComponent = ({deactiveControl}) => {
  const [showSlide, setShowSlide] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState("");

  const dispatch = useDispatch();

  const containerRef = useRef(null);

  const [searchValue] = useDebounce(searchInputValue, 500);

  const theme = useSelector(state => state.app.theme);
  const users = useSelector(state => state.app.users);
  const chats = useSelector(state => state.chat.chats);

  const handleSearchContactInputChange = event => {
    setSearchInputValue(event.target.value);
  };

  const handleShowSlide = show => {
    setShowSlide(show);
  };

  const handleHideSlide = () => {
    setShowSlide(null);
  };

  const handleNewChatFunction = partner => {
    const existingChat = chats.find(chat => chat.partner === partner._id);
    if (existingChat === undefined) {
      dispatch(createChat(partner._id, deactiveControl));
    } else {
      deactiveControl();
      dispatch(setCurrentChat(existingChat));
    }
  };

  const filteredContacts = users.filter(user => {
    return user.username.toLowerCase().indexOf(searchValue) !== -1;
  });

  return (
    <div
      className={`controls-new-chat-component-${theme}-theme`}
      ref={containerRef}
    >
      <Slide
        direction="left"
        in={showSlide !== null}
        mountOnEnter
        unmountOnExit
        container={containerRef.current}
      >
        <div className="controls-new-chat-slide-container">
          {showSlide && showSlide === "group" && (
            <ControlsNewGroupComponent deactiveControl={handleHideSlide} />
          )}
        </div>
      </Slide>
      <ControlHeaderComponent action={deactiveControl} title="New chat" />

      <div className="controls-new-chat-search-container">
        <SearchInputComponent
          handleChange={handleSearchContactInputChange}
          value={searchInputValue}
          id="new_chat_search_contact"
          placeholder="Search contact"
        />
      </div>

      <div className="controls-new-chat-body-container">
        <div
          className="controls-new-chat-new-group-button"
          onClick={() => handleShowSlide("group")}
        >
          <span>
            <AddPeopleIcon />
          </span>
          <div>
            <p>New group</p>
          </div>
        </div>
        <UsersListComponent
          contacts={filteredContacts}
          action={handleNewChatFunction}
        />
      </div>
    </div>
  );
};

export default ControlsNewChatComponent;

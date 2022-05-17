import {useState} from "react";
import {useSelector} from "react-redux";
//import {useDebounce} from "use-debounce";

import SearchInputComponent from "../../../../../../components/search_input/SearchInput";
import ChatListEachChat from "./each_chat/EachChat";
import {ArchiveIcon} from "../../../../../../icons";

const ControlsChatListComponent = ({handleSetActiveControl, chats}) => {
  const [searchInputValue, setSearchInputValue] = useState("");

  // const [searchValue] = useDebounce(searchInputValue, 500);

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

  const handleSearchChat = event => {
    setSearchInputValue(event.target.value);
  };

  const sortedChats = chats?.sort((a, b) => {
    const compA = new Date(
      a?.messages[0] ? a.messages[a.messages.length - 1].time : a.createdAt
    );
    const compB = new Date(
      b?.messages[0] ? b.messages[b.messages.length - 1].time : b.createdAt
    );
    return compB - compA;
  });

  const removeArchivedChats = sortedChats?.filter(
    chat => !chat?.archived?.includes(user?._id)
  );

  const archievedChats = sortedChats.filter(chat =>
    chat?.archived?.includes(user?._id)
  );

  const pinnedChats = removeArchivedChats.filter(chat =>
    chat?.pinned?.some(item => item.id === user?._id)
  );

  const unpinnedChats = removeArchivedChats.filter(
    chat => !chat?.pinned?.some(item => item.id === user?._id)
  );

  const sortedPinnedChats = pinnedChats.sort((a, b) => {
    const A = a.pinned.find(item => item.id === user?._id);
    const B = b.pinned.find(item => item.id === user?._id);

    const compA = new Date(A.time);
    const compB = new Date(B.time);

    return compB - compA;
  });

  return (
    <div className={`controls-chat-list-component-${theme}-theme`}>
      <div className="chat-list-search-container">
        <SearchInputComponent
          handleChange={handleSearchChat}
          value={searchInputValue}
          id="chat_list_search_contact"
          placeholder="Search or start new chat"
        />
      </div>

      {archievedChats.length > 0 && (
        <div
          className="archive-chats-button-container"
          onClick={() => handleSetActiveControl("archived chat")}
        >
          <ArchiveIcon />
          <div>
            <p>Archived</p>
          </div>
        </div>
      )}

      <div className="chat-list-body-container">
        {sortedPinnedChats.map(chat => {
          return <ChatListEachChat key={chat._id} chat={chat} />;
        })}

        {unpinnedChats.map(chat => {
          return <ChatListEachChat key={chat._id} chat={chat} />;
        })}
      </div>
    </div>
  );
};

export default ControlsChatListComponent;

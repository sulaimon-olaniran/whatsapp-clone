import {useSelector} from "react-redux";

import {NoArchivedChatsIcon} from "../../../../../../icons";
import ControlHeaderComponent from "../../../../../../components/headers/ControlsHeader";
import ChatListEachChat from "../chat_list/each_chat/EachChat";

const ControlsArchivedComponent = ({deactiveControl}) => {
  const theme = useSelector(state => state.app.theme);
  const chats = useSelector(state => state.chat.chats);
  const user = useSelector(state => state.user.user);

  const sortedChats = chats.sort((a, b) => {
    var compA = new Date(
      a.messages[0] ? a.messages[a.messages.length - 1].time : a.createdAt
    );
    var compB = new Date(
      b.messages[0] ? b.messages[b.messages.length - 1].time : b.createdAt
    );
    return compB - compA;
  });

  const archievedChats = sortedChats.filter(chat =>
    chat?.archived?.includes(user._id)
  );

  return (
    <div className={`controls-archived-component-${theme}-theme`}>
      <ControlHeaderComponent title="Archived" action={deactiveControl} />
      {archievedChats.length > 0 ? (
        <div className="arhived-chats-chat-list-container">
          {archievedChats.map(chat => {
            return (
              <ChatListEachChat key={chat._id} chat={chat} type="archieved" />
            );
          })}
        </div>
      ) : (
        <div className="no-archieved-chats-container">
          <div className="no-archieved-chats-icon-container">
            <NoArchivedChatsIcon />
          </div>

          <p>No Archieved chats</p>
        </div>
      )}
    </div>
  );
};

export default ControlsArchivedComponent;

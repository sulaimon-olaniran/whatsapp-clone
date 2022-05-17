import {useSelector} from "react-redux";

import ChatBoardConversation from "./components/conversation/Converstation";
import ChatBoardDefault from "./components/default/Default";

const ChatBoard = () => {
  const theme = useSelector(state => state.app.theme);
  const currentChat = useSelector(state => state.chat.currentChat);
  return (
    <div className={`chat-board-${theme}-theme`}>
      {currentChat ? <ChatBoardConversation /> : <ChatBoardDefault />}
    </div>
  );
};

export default ChatBoard;

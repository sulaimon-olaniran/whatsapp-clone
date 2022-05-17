import {useSelector} from "react-redux";

const ReplyTextType = ({message, from}) => {
  const {sender} = message;

  const theme = useSelector(state => state.app.theme);
  const chatParner = useSelector(state => state.chat.currentChat.partnerData);
  const user = useSelector(state => state.user.user);

  return (
    <div
      className={`reply-text-type-container-${theme}-theme ${
        sender === user?._id && "reply-text-type-message-sent"
      } ${from && "reply-text-from-input"}`}
    >
      <div className="reply-text-type-sender-container">
        <p>{sender === user._id ? "You" : chatParner?.username}</p>
      </div>

      <div className="reply-text-type-message-container">
        <span>{message.message}</span>
      </div>
    </div>
  );
};

export default ReplyTextType;

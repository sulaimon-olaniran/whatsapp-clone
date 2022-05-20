import {useSelector} from "react-redux";
import moment from "moment";
import {SmallStarIcon} from "../../../../icons";

import MessageStatusComponent from "../../components/status/Status";

const MessageStickerType = ({message}) => {
  const {sender, isReply} = message;

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

  return (
    <div
      className={`message-sticker-type-${theme}-theme ${
        sender === user._id ? "sticker-was-sent" : "sticker-was-received"
      } ${isReply && "sticker-is-reply"} ${
        isReply && sender === user._id && "sticker-is-reply-sent"
      }`}
    >
      <div className="sticker-type-sticker-container">
        <img src={message.sticker} alt="" />
      </div>

      <div
        className={`sticker-type-time-container ${
          sender === user._id && "sender-time"
        }`}
      >
        {message?.starred?.includes(user._id) && <SmallStarIcon />}
        <p>{moment(message.time).format("LT")}</p>
        <MessageStatusComponent message={message} />
      </div>
    </div>
  );
};

export default MessageStickerType;

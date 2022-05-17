import {useSelector} from "react-redux";

const ReplyStickerType = ({message, from}) => {
  const {sender} = message;
  const theme = useSelector(state => state.app.theme);
  return (
    <div
      className={`reply-sticker-type-${theme}-theme ${
        sender && "replied-sticker-was-sent"
      } ${from && "reply-sticker-from-input"}`}
    >
      <div className="reply-sticker-type-sender-container">
        <p>{sender ? "You" : "Michael Sabitzer"}</p>
      </div>

      <div className="reply-sticker-type-sticker-container">
        <img src={message.sticker} alt="" />
      </div>
    </div>
  );
};

export default ReplyStickerType;

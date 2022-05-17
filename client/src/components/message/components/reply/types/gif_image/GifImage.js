import {useSelector} from "react-redux";

import {SmallGifIcon, SmallCameraIcon} from "../../../../../../icons";

const ReplyGifImageType = ({message, from}) => {
  const {sender, type} = message;
  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

  return (
    <div
      className={`reply-image-type-container-${theme}-theme ${
        sender === user?._id && `reply-image-type-message-sent-${theme}`
      } ${from && "reply-image-from-input"}`}
    >
      <div className="reply-image-type-details-container">
        <div className="reply-image-type-sender-container">
          <p>{sender === user?._id ? "You" : "Michael Sabitzer"}</p>
        </div>

        <div className="reply-image-type-caption-container">
          <div className="reply-image-type-caption-text">
            <div className="caption-icon">
              {type === "gif" ? <SmallGifIcon /> : <SmallCameraIcon />}
            </div>

            <span>
              {message.caption
                ? message.caption
                : type === "gif"
                ? "GIF"
                : "Photo"}
            </span>
          </div>
        </div>
      </div>

      <div className="reply-image-type-image-container">
        {type === "gif" ? (
          <div style={{backgroundImage: `url(${message.gif})`}} />
        ) : (
          <div style={{backgroundImage: `url(${message.image})`}} />
        )}
      </div>
    </div>
  );
};

export default ReplyGifImageType;

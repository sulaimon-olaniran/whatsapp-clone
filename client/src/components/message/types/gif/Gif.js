import {useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import moment from "moment";

import MessageStatusComponent from "../../components/status/Status";
import {SmallStarIcon} from "../../../../icons";
import {OPEN_MESSAGES_MEDIAS_DIALOG} from "../../../../store/types/app";

const MessageGifType = ({message}) => {
  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

  const gifRef = useRef(null);

  const dispatch = useDispatch();

  const handlePauseGif = () => {
    gifRef.current.pause();
  };

  const handleOpenMessagesMediaDialog = () => {
    dispatch({
      type: OPEN_MESSAGES_MEDIAS_DIALOG,
      payload: {open: true, media: message},
    });
  };

  return (
    <div
      className={`message-gif-type-${theme}-theme`}
      onClick={handleOpenMessagesMediaDialog}
    >
      <div className="gif-type-gif-container">
        <div className="gif-button-container" onClick={handlePauseGif}>
          <span>GIF</span>
        </div>
        <img src={message.gif} alt="message" ref={gifRef} />
        {!message.caption && (
          <div className="gif-type-time-container">
            {message?.starred?.includes(user._id) && <SmallStarIcon />}
            <p>{moment(message.time).format("LT")}</p>
            <MessageStatusComponent message={message} />
          </div>
        )}
      </div>

      {message.caption && (
        <div className="gif-type-gif-caption-container">
          <p>
            {message.caption} <span className="space" />
          </p>
        </div>
      )}

      {message.caption && (
        <div className="message-time-container">
          {message?.starred?.includes(user._id) && <SmallStarIcon />}
          <p>{moment(message.time).format("LT")}</p>
          <MessageStatusComponent message={message} />
        </div>
      )}
    </div>
  );
};

export default MessageGifType;

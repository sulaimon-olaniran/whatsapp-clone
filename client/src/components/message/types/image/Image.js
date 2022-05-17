import {useSelector, useDispatch} from "react-redux";
import moment from "moment";

import MessageStatusComponent from "../../components/status/Status";
import {Fragment} from "react";
import {SmallStarIcon} from "../../../../icons";
import {OPEN_MESSAGES_MEDIAS_DIALOG} from "../../../../store/types/app";

const MessageImageType = ({message}) => {
  const {image} = message;

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

  const handleOpenMessagesMediaDialog = () => {
    const data = dispatch({
      type: OPEN_MESSAGES_MEDIAS_DIALOG,
      payload: {open: true, media: message},
    });
  };

  return (
    <div
      className={`message-image-type-${theme}-theme`}
      onClick={handleOpenMessagesMediaDialog}
    >
      <Fragment>
        <div className="image-type-image-container">
          <img src={image} alt="message" />
          {!message.caption && (
            <div className="image-type-time-container">
              {message?.starred?.includes(user._id) && <SmallStarIcon />}
              <p>{moment(message.time).format("LT")}</p>
              <MessageStatusComponent message={message} />
            </div>
          )}
        </div>

        {message.caption && (
          <div className="image-type-image-caption-container">
            <p>
              {message.caption} <span className="space" />
            </p>
          </div>
        )}
      </Fragment>
      {/* )} */}

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

export default MessageImageType;

import {Fragment} from "react";
import {useSelector} from "react-redux";
import moment from "moment";
import emojiTree from "emoji-tree";

import MessageStatusComponent from "../../components/status/Status";
import {SmallStarIcon} from "../../../../icons";
import TextEmojiComponent from "../../../text_emoji/TextEmoji";

const MessageTextType = ({message}) => {
  //CHECK IF MESSAGE TEXT TYPE IS ONLY EMOJI
  //IF IT'S ONLY EMOJI, CHANGE FONT SIZE OF TEXT TO MAKE EMOJI BOLDER
  const checkMessagesType = emojiTree(message.message);

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

  const isOnlyEmoji = checkMessagesType.every(msg => msg.type === "emoji");

  return (
    <div className={`message-text-type-${theme}-theme`}>
      {isOnlyEmoji && checkMessagesType.length < 4 ? (
        <div
          className={`message-text-type-emoji-only emoji-only-${checkMessagesType.length}`}
        >
          <p
            id="message-text-emoji-only-text"
            className={
              //IF EMOJI IS ONE AND IS AN HEART EMOJI, ANIMATE EMOJI TO A BEATING HEART
              checkMessagesType.length < 2 && message.message === "❤️"
                ? "animate-emoji-text"
                : ""
            }
          >
            <TextEmojiComponent text={message.message} />
          </p>

          <div className="message-text-type-emoji-only-time">
            {message?.starred?.includes(user._id) && <SmallStarIcon />}
            <p>{moment(message.time).format("LT")}</p>
            <MessageStatusComponent message={message} />
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="text-type-message-container">
            <p>
              <TextEmojiComponent text={message.message} />
              <span className="space" />
            </p>
          </div>

          <div className="message-time-container">
            {message?.starred?.includes(user._id) && <SmallStarIcon />}
            <p>{moment(message.time).format("LT")}</p>
            <MessageStatusComponent message={message} />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default MessageTextType;

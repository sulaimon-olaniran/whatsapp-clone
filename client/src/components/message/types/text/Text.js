import {useSelector} from "react-redux";
import moment from "moment";
import emojiTree from "emoji-tree";

import MessageStatusComponent from "../../components/status/Status";
import {SmallStarIcon} from "../../../../icons";
import TextEmojiComponent from "../../../text_emoji/TextEmoji";
import {Fragment} from "react";

const MessageTextType = ({message}) => {
  const checkMessagesType = emojiTree(message.message);

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

  const isOnlyEmoji = checkMessagesType.every(msg => msg.type === "emoji");

  //checkMessageEmoji.map()

  return (
    <div className={`message-text-type-${theme}-theme`}>
      {isOnlyEmoji && checkMessagesType.length < 4 ? (
        <div
          className={`message-text-type-emoji-only emoji-only-${checkMessagesType.length}`}
        >
          <p
            id="message-text-emoji-only-text"
            className={
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

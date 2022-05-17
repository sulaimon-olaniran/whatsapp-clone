import {useSelector} from "react-redux";

import {
  MessageDeliveredIcon,
  MessageSentIcon,
  SendingMessageIcon,
} from "../../../../icons";

const MessageStatusComponent = ({message, from}) => {
  const {isSeen, isDelivered, isSent, sender, type} = message;

  const user = useSelector(state => state.user.user);
  const theme = useSelector(state => state.app.theme);

  const isImgageGif = type === "image" || type === "gif" ? true : false;

  if (sender !== user?._id) return <></>;
  return (
    <div
      className={`message-status-component-${theme}-theme ${
        isSeen && "message-is-seen"
      } ${isImgageGif && from !== "chat_list" && "status-type-image-gif"}`}
    >
      {isDelivered && <MessageDeliveredIcon />}
      {isSent && !isDelivered && <MessageSentIcon />}
      {!isSent && <SendingMessageIcon />}
    </div>
  );
};

export default MessageStatusComponent;

import {useSelector} from "react-redux";

import ReplyContactType from "./types/contact/Contact";
import ReplyDocumentType from "./types/document/Document";
import ReplyGifImageType from "./types/gif_image/GifImage";
import ReplyStickerType from "./types/sticker/Sticker";
import ReplyTextType from "./types/text/Text";

const MessageReplyComponent = ({message, sentMessage, from}) => {
  const {type, sender} = message;

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  return (
    <div
      className={`message-reply-component-${theme}-theme ${
        sender === user?._id
          ? `reply-was-sent-${theme}`
          : `reply-was-received-${theme}`
      } ${sentMessage && `original-message-was-sent-${theme}`} ${
        from && `reply-is-input-${theme}`
      }`}
    >
      {type === "text" && <ReplyTextType message={message} from={from} />}

      {(type === "image" || type === "gif") && (
        <ReplyGifImageType message={message} from={from} />
      )}

      {type === "sticker" && <ReplyStickerType message={message} />}

      {type === "contact" && <ReplyContactType message={message} from={from} />}
      {type === "document" && <ReplyDocumentType message={message} />}
    </div>
  );
};

export default MessageReplyComponent;

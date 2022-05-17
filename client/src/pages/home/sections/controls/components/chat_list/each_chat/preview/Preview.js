import {Fragment} from "react";
import {useSelector} from "react-redux";

import MessageStatusComponent from "../../../../../../../../components/message/components/status/Status";
//import TextEmojiComponent from "../../../../../../../../components/text_emoji/TextEmoji";
import {
  SmallCameraIcon,
  SmallGifIcon,
  SmallStickerIcon,
  SmallContactIcon,
  SmallDocumentIcon,
} from "../../../../../../../../icons";

const ChatListEachChatMessagePreview = ({messages}) => {
  const previewMessage = messages[messages.length - 1];

  const noMessagesContent =
    "Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Click to learn more.";

  const unSeenMsg = !previewMessage
    ? false
    : previewMessage.isSeen
    ? false
    : !previewMessage.isDelivered
    ? false
    : true;

  const theme = useSelector(state => state.app.theme);
  return (
    <div
      className={`message-preview-${theme}-theme ${
        unSeenMsg && "preview-message-is-unseen"
      }`}
    >
      {previewMessage && (
        <MessageStatusComponent message={previewMessage} from="chat_list" />
      )}
      {!previewMessage ? (
        <div className="message-preview-text-type">
          <p>{noMessagesContent}</p>
        </div>
      ) : (
        <Fragment>
          {previewMessage?.type === "text" && (
            <div className="message-preview-text-type">
              <p>{previewMessage.message}</p>
            </div>
          )}

          {(previewMessage.type === "image" ||
            previewMessage.type === "gif") && (
            <div className="message-preview-text-type">
              {previewMessage.type === "image" ? (
                <SmallCameraIcon />
              ) : (
                <SmallGifIcon />
              )}

              <p>
                {previewMessage.caption
                  ? previewMessage.caption
                  : `${previewMessage.type === "image" ? "Photo" : "GIF"}`}
              </p>
            </div>
          )}

          {previewMessage.type === "sticker" && (
            <div className="message-preview-text-type">
              <SmallStickerIcon />
              <p>Sticker</p>
            </div>
          )}

          {previewMessage.type === "contact" && (
            <div className="message-preview-text-type">
              <SmallContactIcon />
              <p>
                {previewMessage.contacts[0].username}{" "}
                {previewMessage.contacts.length > 1 &&
                  `and ${previewMessage.contacts.length - 1} other contacts`}
              </p>
            </div>
          )}

          {previewMessage.type === "document" && (
            <div className="message-preview-text-type">
              <SmallDocumentIcon />
              <p>{previewMessage.document.name}</p>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default ChatListEachChatMessagePreview;

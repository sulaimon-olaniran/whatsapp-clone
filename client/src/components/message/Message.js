import {Fragment, useRef} from "react";
import {useSelector} from "react-redux";
import MessageImageType from "./types/image/Image";
import MessageTextType from "./types/text/Text";
import {Checkbox} from "@mui/material";
import MessageGifType from "./types/gif/Gif";
import MessageStickerType from "./types/sticker/Sticker";
import MessageDocumentType from "./types/document/Document";
import MessageContactType from "./types/contact/Contact";

import {TailOutRightIcon, TailOutLeftIcon} from "../../icons";
import DeletedMessageComponent from "./components/deleted/Deleted";
import MessageOptionsComponent from "./components/options/Options";
import MessageReplyComponent from "./components/reply/Reply";
import MessageFailedComponent from "./components/failed/Failed";

const label = {inputProps: {"aria-label": "Checkbox demo"}};

const MessageComponent = ({
  message,
  prevMessage,
  setSelectedMessages,
  selectedMessages,
  setReplyMessage,
  messagesContainerRef,
  from,
}) => {
  const my_object = {};
  my_object[message._id] = useRef(null);

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const messages = useSelector(state => state?.chat.currentChat?.messages);

  const {type, sender, isReply, isSent} = message;
  const handleSelectMessage = message => {
    setSelectedMessages(prev =>
      prev.includes(message)
        ? prev.filter(item => item !== message)
        : [...prev, message]
    );
  };

  const sentTail =
    prevMessage &&
    prevMessage.sender === user._id &&
    message.sender === user._id
      ? false
      : true;

  const receivedTail =
    prevMessage &&
    prevMessage.sender !== user._id &&
    message.sender !== user._id
      ? false
      : true;

  const selectIsActive = selectedMessages && selectedMessages.length > 0;
  const isSelected = selectedMessages && selectedMessages.includes(message);
  const repliedMessage = messages
    ? messages.find(item => item._id === message.repliedTo)
    : null;

  const isDeleted = message?.delete_everyone;

  const isCleared = message?.cleared?.includes(user._id);

  return (
    <div
      className={`message-component-container-${theme}-theme ${
        isSelected && "message-is-selected"
      } ${selectIsActive && "select-is-active"} ${
        from === "starred" && `is-starred-message-${theme}`
      } ${isCleared && "message-is-cleared"}`}
      onClick={selectIsActive ? () => handleSelectMessage(message) : null}
      //onClick={() => console.log(message)}
      //onClick={blahBlah}
      ref={my_object[message._id]}
      id={`hello${message._id}`}
    >
      {from !== "starred" && (
        <div
          className={`checkbox-container ${selectIsActive && "show-checkbox"}`}
        >
          <Checkbox
            {...label}
            color="default"
            checked={selectedMessages && selectedMessages.includes(message)}
          />
        </div>
      )}

      <div
        className={`message-component-each-message-container ${
          sender === user?._id ? "message-is-sent" : "message-is-received"
        } ${type === "sticker" && "remove-message-background"}`}
      >
        <div
          className={`each-message-inner-container each-message-${type}-type ${
            sender === user?._id && sentTail && "sent-tail"
          } ${sender !== user?._id && receivedTail && "received-tail"} ${
            isDeleted && "message-is-deleted"
          }`}
        >
          {isReply && (
            <MessageReplyComponent
              sentMessage={sender === user?._id}
              message={repliedMessage}
            />
          )}

          {message.type !== "sticker" && (
            <span className="tail-out-span">
              {sender === user?._id ? (
                from === "starred" ? (
                  <TailOutLeftIcon />
                ) : (
                  <TailOutRightIcon />
                )
              ) : (
                <TailOutLeftIcon />
              )}
            </span>
          )}

          {isSent && !selectIsActive && from !== "starred" && (
            <div className="message-options-container">
              <MessageOptionsComponent
                message={message}
                selectMessage={handleSelectMessage}
                setReplyMessage={setReplyMessage}
              />
            </div>
          )}

          {isDeleted ? (
            <DeletedMessageComponent message={message} />
          ) : (
            <Fragment>
              {type === "text" && (
                <MessageTextType
                  message={message}
                  sentTail={sentTail}
                  receivedTail={receivedTail}
                  selectMessage={handleSelectMessage}
                />
              )}
              {type === "image" && (
                <MessageImageType
                  message={message}
                  sentTail={sentTail}
                  receivedTail={receivedTail}
                />
              )}
              {type === "gif" && (
                <MessageGifType
                  message={message}
                  sentTail={sentTail}
                  receivedTail={receivedTail}
                />
              )}
              {type === "sticker" && (
                <MessageStickerType
                  message={message}
                  sentTail={sentTail}
                  receivedTail={receivedTail}
                />
              )}
              {type === "document" && (
                <MessageDocumentType
                  message={message}
                  sentTail={sentTail}
                  receivedTail={receivedTail}
                />
              )}
              {type === "contact" && (
                <MessageContactType
                  message={message}
                  sentTail={sentTail}
                  receivedTail={receivedTail}
                />
              )}
            </Fragment>
          )}
        </div>
        {sender === user._id && message?.failed && (
          <MessageFailedComponent message={message} />
        )}

        {/* <h1>hello world</h1> */}
      </div>
    </div>
  );
};

export default MessageComponent;

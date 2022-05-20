import {useState, useRef, Fragment, useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";
import Zoom from "@mui/material/Zoom";
import Slide from "@mui/material/Slide";
import {IconButton, TextareaAutosize} from "@mui/material";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import {v4 as uuidv4} from "uuid";
import axios from "axios";
import moment from "moment";

import EmojisComponent from "../../../../../../../../components/emoji/emojis/Emojis";
import MessageInputInsertGifsComponent from "./components/gifs/Gifs";
import MessageInputInsertPopoverComponent from "./components/insert/Insert";
import MessageInputInsertStickersComponent from "./components/stickers/Stickers";
import {
  StickersIcon,
  SmileyButtonIcon,
  GifsIcon,
  MicrophoneIcon,
  SendIcon,
} from "../../../../../../../../icons";
import MessageReplyComponent from "../../../../../../../../components/message/components/reply/Reply";
import SelectedMessageInputActionsComponent from "./components/selected/Selected";
import {chatApi} from "../../../../../../../../api";
import {sendNewChatMessage} from "../../../../../../../../store/actions/chat";

export const ConversationMessageInputComponent = ({
  showInsertOption,
  setInsertedMedias,
  setInsertedDocs,
  setInsertedSticker,
  replyMessage,
  setReplyMessage,
  selectedMessages,
  setSelectedMessages,
}) => {
  const [expandOptions, setExpandOptions] = useState(false);
  const [currentOption, setCurrentOption] = useState("emojis");
  const [messageText, setMessageText] = useState("");

  const dispatch = useDispatch();

  const slideContainerRef = useRef(null);

  const theme = useSelector(state => state.app.theme);
  const token = useSelector(state => state.user.token);
  const user = useSelector(state => state.user.user);
  const currentChat = useSelector(state => state.chat.currentChat);

  const chatPartnerIsBlocked = user?.privacy?.blocked_contacts.includes(
    currentChat?.partnerData?._id
  );

  const handleUserIstyping = useCallback(() => {
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };
    const data = {
      chatId: currentChat._id,
    };

    setTimeout(() => {
      axios.post(`${chatApi}/typing`, data, config);
    }, 200);
  }, [token, currentChat]);

  const handleMessageInputChange = event => {
    setMessageText(event.target.value);
    handleUserIstyping();
  };

  const handleExpandOptions = () => {
    setExpandOptions(true);
  };

  const handleUnExpandOptions = () => {
    setExpandOptions(false);
  };

  const toggleCurrentOption = option => {
    setCurrentOption(option);
  };

  const handleSendMessageTextType = () => {
    const message = {
      chatId: currentChat._id,
      sender: user._id,
      receiver: currentChat?.partnerData?._id,
      message: messageText,
      type: "text",
      isSent: false,
      isReply: replyMessage ? true : false,
      repliedTo: replyMessage?._id,
      starred: [],
      time: moment().format(),
      subId: uuidv4(),
      isBlocked: currentChat.partnerData.privacy.blocked_contacts.includes(
        user._id
      )
        ? true
        : false,
    };

    dispatch(sendNewChatMessage(message));
    setExpandOptions(false);
    setMessageText("");
    setReplyMessage(null);
  };

  if (chatPartnerIsBlocked)
    return (
      <div className={`input-component-contact-is-blocked-${theme}-theme`}>
        <p>
          Can't send a message to blocked contact{" "}
          {currentChat?.partnerData?.username}
        </p>
      </div>
    );
  return (
    <Fragment>
      <SelectedMessageInputActionsComponent
        selectedMessages={selectedMessages}
        setSelectedMessages={setSelectedMessages}
      />
      <div
        className={`conversation-message-input-component-${theme}-theme ${
          selectedMessages.length > 0 && "hide-conversation-message-input"
        }`}
      >
        <Fragment>
          <div
            className={`input-component-emojis-gifs-stickers-container ${
              expandOptions && "chat-emojis-is-active"
            }`}
          >
            {expandOptions && currentOption === "emojis" && (
              <EmojisComponent setState={setMessageText} type={true} />
            )}

            {expandOptions && currentOption === "gifs" && (
              <MessageInputInsertGifsComponent
                setInsertedMedias={setInsertedMedias}
                showInsertOption={showInsertOption}
                setExpandOptions={setExpandOptions}
              />
            )}

            {expandOptions && currentOption === "stickers" && (
              <MessageInputInsertStickersComponent
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
              />
            )}
          </div>

          <div
            className={`input-component-reply-message-container ${
              replyMessage && "reply-message-is-active"
            }`}
          >
            {replyMessage && (
              <div className="input-component-reply-message-inner-container">
                <div className="input-component-reply-message-message">
                  <MessageReplyComponent message={replyMessage} from={true} />
                </div>

                <IconButton onClick={() => setReplyMessage(null)}>
                  <CloseOutlined />
                </IconButton>
              </div>
            )}
          </div>

          <div className="input-component-main-input-container">
            <div
              className={`message-input-insert-options-buttons-container ${
                expandOptions && "options-expanded"
              }`}
              ref={slideContainerRef}
            >
              <IconButton
                onClick={
                  expandOptions ? handleUnExpandOptions : handleExpandOptions
                }
              >
                {expandOptions ? <CloseOutlined /> : <SmileyButtonIcon />}
              </IconButton>

              <Slide
                direction="right"
                in={expandOptions}
                container={slideContainerRef.current}
              >
                {expandOptions ? (
                  <section>
                    <IconButton
                      style={
                        currentOption === "emojis" ? {color: "#008069"} : {}
                      }
                      onClick={() => toggleCurrentOption("emojis")}
                    >
                      <SmileyButtonIcon />
                    </IconButton>

                    <Zoom in={true} timeout={300}>
                      <IconButton
                        style={
                          currentOption === "gifs" ? {color: "#008069"} : {}
                        }
                        onClick={() => toggleCurrentOption("gifs")}
                      >
                        <GifsIcon />
                      </IconButton>
                    </Zoom>

                    <Zoom in={true} timeout={400}>
                      <IconButton
                        style={
                          currentOption === "stickers" ? {color: "#008069"} : {}
                        }
                        onClick={() => toggleCurrentOption("stickers")}
                      >
                        <StickersIcon />
                      </IconButton>
                    </Zoom>
                  </section>
                ) : (
                  <div></div>
                )}
              </Slide>

              <MessageInputInsertPopoverComponent
                showInsertOption={showInsertOption}
                setInsertedMedias={setInsertedMedias}
                setInsertedDocs={setInsertedDocs}
                setInsertedSticker={setInsertedSticker}
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
              />
            </div>

            <div className="message-input-textfield-input-container">
              <div className="text-input-textarea-container">
                <TextareaAutosize
                  aria-label="empty textarea"
                  maxRows={5}
                  minRows={1}
                  onChange={handleMessageInputChange}
                  value={messageText}
                  maxLength={500}
                  placeholder="Type a message"
                />
              </div>

              {messageText === "" ? (
                <IconButton>
                  <MicrophoneIcon />
                </IconButton>
              ) : (
                <IconButton onClick={handleSendMessageTextType}>
                  <SendIcon />
                </IconButton>
              )}
            </div>
          </div>
        </Fragment>
      </div>
    </Fragment>
  );
};

export default ConversationMessageInputComponent;

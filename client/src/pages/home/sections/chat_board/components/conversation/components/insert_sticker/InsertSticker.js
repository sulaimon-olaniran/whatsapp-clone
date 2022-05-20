import {useSelector, useDispatch} from "react-redux";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {v4 as uuidv4} from "uuid";

import {
  SendIcon,
  SmileyButtonIcon,
  StickersIcon,
  RedoIcon,
  UndoIcon,
  PenIcon,
  TextIcon,
} from "../../../../../../../../icons";
import {sendNewChatMessage} from "../../../../../../../../store/actions/chat";

const ConversationInsertStickerComponent = ({
  closeOption,
  sticker,
  setSticker,
  setReplyMessage,
  replyMessage,
}) => {
  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const currentChat = useSelector(state => state.chat.currentChat);

  const dispatch = useDispatch();

  const handleSendMessageStickerType = () => {
    const message = {
      chatId: currentChat._id,
      sender: user._id,
      receiver: currentChat?.partnerData?._id,
      caption: "",
      type: "sticker",
      isSent: false,
      isReply: replyMessage ? true : false,
      repliedTo: replyMessage?._id,
      starred: [],
      time: Date.now(),
      subId: uuidv4(),
      sticker: sticker,
      isBlocked: currentChat.partnerData.privacy.blocked_contacts.includes(
        user._id
      )
        ? true
        : false,
    };

    dispatch(sendNewChatMessage(message));
    setReplyMessage(null);
    setSticker([]);
    closeOption();
  };

  return (
    <div className={`conversation-insert-sticker-component-${theme}-theme`}>
      <header className="insert-sticker-component-header-container">
        <IconButton onClick={closeOption}>
          <CloseIcon />
        </IconButton>
        <section className="edit-sticker-options-container">
          <IconButton>
            <SmileyButtonIcon />
          </IconButton>

          <IconButton>
            <StickersIcon />
          </IconButton>

          <IconButton>
            <TextIcon />
          </IconButton>

          <IconButton>
            <PenIcon />
          </IconButton>

          <IconButton>
            <UndoIcon />
          </IconButton>

          <IconButton>
            <RedoIcon />
          </IconButton>
        </section>
      </header>

      <div className="insert-sticker-component-body-container">
        <div className="insert-sticker-inner-body-container">
          <div className="preview-sticker-container">
            <img src={sticker} alt="preview" />
          </div>
        </div>
      </div>

      <div className="insert-sticker-component-footer-container">
        <div className="insert-sticker-component-sticker-selection-container">
          <div className="sticker-listed-section-container">
            <div className="selected-images-list-container">
              <div className={`each-image-container image-selected`}>
                <IconButton onClick={closeOption}>
                  <CloseIcon />
                </IconButton>
                <img src={sticker} alt="preview" />
              </div>
            </div>
          </div>

          <IconButton onClick={handleSendMessageStickerType}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ConversationInsertStickerComponent;

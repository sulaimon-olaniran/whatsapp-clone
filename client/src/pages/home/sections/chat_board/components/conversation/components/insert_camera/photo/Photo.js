import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {IconButton, TextareaAutosize} from "@mui/material";
import {v4 as uuidv4} from "uuid";

import {
  ViewOnceIcon,
  SendIcon,
  SmileyButtonIcon,
  StickersIcon,
  RedoIcon,
  UndoIcon,
  PenIcon,
  TextIcon,
} from "../../../../../../../../../icons";
import InputEmojisComponent from "../../../../../../../../../components/emoji/input/Input";
import {sendNewChatMessage} from "../../../../../../../../../store/actions/chat";

const InsertCameraCapturedPhoto = ({
  closeOption,
  photo,
  setCapturedPhoto,
  replyMessage,
  setReplyMessage,
}) => {
  const [caption, setCaption] = useState("");

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const currentChat = useSelector(state => state.chat.currentChat);

  const handlePhotoCaptionChange = event => {
    setCaption(event.target.value);
  };

  const handleSendMessageMediaType = () => {
    const message = {
      chatId: currentChat._id,
      sender: user._id,
      receiver: currentChat?.partnerData?._id,
      caption: caption,
      type: "image",
      isSent: false,
      isReply: replyMessage ? true : false,
      repliedTo: replyMessage?._id,
      starred: [],
      time: Date.now(),
      subId: uuidv4(),
      image: photo,
      isBlocked: currentChat.partnerData.privacy.blocked_contacts.includes(
        user._id
      )
        ? true
        : false,
    };

    dispatch(sendNewChatMessage(message));

    setReplyMessage(null);
    setCapturedPhoto(null);
    closeOption();
  };

  return (
    <div className={`insert-camera-captured-photo-${theme}-theme`}>
      <div className="insert-camera-captured-photo-header-container">
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
      </div>

      <div className="insert-camera-captured-photo-body-container">
        <div className="preview-photo-container">
          <img src={photo} alt="preview" />
        </div>
      </div>

      <div className="insert-camera-captured-photo-footer-container">
        <div className="insert-camera-captured-photo-message-input-container">
          <div className="message-input-text-container">
            <TextareaAutosize
              type="text"
              placeholder="Type a message"
              onChange={handlePhotoCaptionChange}
              maxRows={5}
              minRows={1}
              value={caption}
            />
            <InputEmojisComponent setState={setCaption} />
          </div>

          <IconButton>
            <ViewOnceIcon />
          </IconButton>
        </div>

        <div className="insert-camera-captured-photo-send-button">
          <IconButton onClick={handleSendMessageMediaType}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default InsertCameraCapturedPhoto;

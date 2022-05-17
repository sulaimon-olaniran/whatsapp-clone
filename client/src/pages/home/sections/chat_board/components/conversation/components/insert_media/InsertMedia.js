import {useState, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {IconButton, TextareaAutosize} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Badge from "@mui/material/Badge";
import {styled} from "@mui/material/styles";
import {v4 as uuidv4} from "uuid";

import {
  ViewOnceIcon,
  SendIcon,
  AdditionIcon,
  SmileyButtonIcon,
  StickersIcon,
  RedoIcon,
  UndoIcon,
  PenIcon,
  TextIcon,
} from "../../../../../../../../icons";
//import EditImageComponent from "../../../../../../../../components/edit_image/EditImage";
import InputEmojisComponent from "../../../../../../../../components/emoji/input/Input";
import {sendNewChatMessage} from "../../../../../../../../store/actions/chat";

const StyledBadge = styled(Badge)(({theme}) => ({
  "& .MuiBadge-badge": {
    right: +6,
    top: 8,
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    color: "#243545",
  },
}));

const ConversationInsertMediaComponent = ({
  closeOption,
  images,
  setInsertedMedias,
  replyMessage,
  setReplyMessage,
}) => {
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const fileInputRef2 = useRef(null);

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const currentChat = useSelector(state => state.chat.currentChat);

  const handleMediaCaptionChange = event => {
    setCaption(event.target.value);
  };

  const handleOpenSelectFiles = () => {
    fileInputRef2.current.click();
  };

  const handleFileInputChange = async event => {
    const selectedFiles = Array.from(event.target.files);

    const base64Files = [];

    Promise.all(
      selectedFiles.map(async file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          base64Files.push(reader.result);
        };
      })
    );

    setTimeout(() => {
      setInsertedMedias(prev => prev.concat(base64Files));
    }, 10);
  };

  const handleRemoveInsertedMedia = media => {
    if (images.length < 2) return closeOption();

    setInsertedMedias(prev => prev.filter(item => item !== media));
    setSelectedImage(images[0]);
  };

  const handleSendMessageMediaType = () => {
    images.forEach((image, index) => {
      const mediaExtension = image.split(/[#?]/)[0].split(".").pop().trim();

      const message = {
        chatId: currentChat._id,
        sender: user._id,
        receiver: currentChat?.partnerData?._id,
        caption: index === 0 ? caption : "",
        type: mediaExtension.toLowerCase() === "gif" ? "gif" : "image",
        isSent: false,
        isReply: replyMessage && index === 0 ? true : false,
        repliedTo: replyMessage && index === 0 ? replyMessage?._id : null,
        starred: [],
        time: Date.now(),
        subId: uuidv4(),
        image: mediaExtension.toLowerCase() === "gif" ? null : image,
        gif: mediaExtension.toLowerCase() === "gif" ? image : null,
      };

      dispatch(sendNewChatMessage(message));
    });
    setReplyMessage(null);
    setInsertedMedias([]);
    closeOption();
  };

  return (
    <div className={`conversation-insert-media-component-${theme}-theme`}>
      <input
        type="file"
        name="insert_media_input_2"
        id="insert_media_input_2"
        accept="image/png, .jpeg, .jpg"
        ref={fileInputRef2}
        multiple
        onChange={handleFileInputChange}
      />

      <header className="insert-media-component-header-container">
        <IconButton onClick={closeOption}>
          <CloseIcon />
        </IconButton>
        <section className="edit-image-options-container">
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

      <div className="insert-media-component-body-container">
        <div className="preview-image-container">
          <img src={selectedImage} alt="preview" />
        </div>
      </div>

      <div className="insert-media-component-footer-container">
        <div className="insert-media-component-message-input-container">
          <div className="message-input-text-container">
            <TextareaAutosize
              type="text"
              placeholder="Type a message"
              onChange={handleMediaCaptionChange}
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

        <div className="insert-media-component-media-selection-container">
          <div className="media-listed-section-container">
            <div className="selected-images-list-container">
              {images.map((image, index) => {
                return (
                  <div
                    className={`each-image-container ${
                      selectedImage === image && "image-selected"
                    }`}
                    key={index}
                  >
                    <IconButton
                      onClick={() => handleRemoveInsertedMedia(image)}
                    >
                      <CloseIcon />
                    </IconButton>
                    <img
                      src={image}
                      alt="preview"
                      onClick={() => setSelectedImage(image)}
                    />
                  </div>
                );
              })}
            </div>

            <div className="add-image-button" onClick={handleOpenSelectFiles}>
              <AdditionIcon />
            </div>
          </div>
          <StyledBadge badgeContent={images.length} color="primary">
            <IconButton onClick={handleSendMessageMediaType}>
              <SendIcon />
            </IconButton>
          </StyledBadge>
        </div>
      </div>
    </div>
  );
};

export default ConversationInsertMediaComponent;

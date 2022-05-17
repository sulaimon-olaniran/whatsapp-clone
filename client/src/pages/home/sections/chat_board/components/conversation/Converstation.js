import {useState, Fragment, useRef} from "react";
import {useSelector} from "react-redux";
import Slide from "@mui/material/Slide";

import ConversationHeaderComponent from "./components/header/Header";
import ConversationMessagesComponent from "./components/messages/Messages";
import ConversationContactInfoComponent from "./components/contact/Contact";
import ConversationSearchMessagesComponent from "./components/search/Search";
import ConversationMessageInputCompoent from "./components/input/Input";
import ConversationInsertCameraComponent from "./components/insert_camera/InsertCamera";
//import EditImageComponent from "../../../../../../components/edit_image/EditImage";
import ConversationInsertMediaComponent from "./components/insert_media/InsertMedia";
import ConversationInsertDocsComponent from "./components/insert_docs/InsertDocs";
import ConversationInsertStickerComponent from "./components/insert_sticker/InsertSticker";
import chatBgImg from "../../../../../../images/whatsapp_chat_bg_image.png";

const ChatBoardConversation = () => {
  const [sideBar, setSideBar] = useState(false);
  const [sideBarContent, setSideBarContent] = useState("");
  // const [hasDropped, setHasDropped] = useState(false);
  // const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [insertOption, setInsertOption] = useState(false);
  const [insertOptionType, setInsertOptionType] = useState("");
  const [insertedMedias, setInsertedMedias] = useState([]);
  const [insertedDocs, setInsertedDocs] = useState([]);
  const [insertedSticker, setInsertedSticker] = useState("");
  const [replyMessage, setReplyMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);

  const containerRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const wallpaper = useSelector(state => state.app.wallpaper);
  const theme = useSelector(state => state.app.theme);
  const doodles = useSelector(state => state.app.doodles);

  const handleShowSideBar = content => {
    setSideBar(true);
    setSideBarContent(content);
  };

  const handleHideSideBar = () => {
    setSideBar(false);
    setSideBarContent("");
  };

  const handleShowInsertOption = option => {
    setInsertOptionType(option);
    setInsertOption(true);

    // console.log(option);
  };

  const handleHideInsertOption = () => {
    setInsertOption(false);
    setInsertOptionType("");
  };

  return (
    <div className={`chat-board-conversation-${theme}-theme`}>
      <section
        className={`chat-board-conversation-main-section ${
          sideBar && "sidebar-active-main-section"
        } `}
      >
        <div className="conversation-main-section-header-container">
          <ConversationHeaderComponent showSideBar={handleShowSideBar} />
        </div>

        <div
          className="conversation-main-section-messages-container"
          style={{background: wallpaper}}
        >
          {doodles && (
            <div
              className="whatsapp-chat-background-doodle"
              style={{backgroundImage: `url(${chatBgImg})`}}
            />
          )}
          <ConversationMessagesComponent
            setReplyMessage={setReplyMessage}
            selectedMessages={selectedMessages}
            setSelectedMessages={setSelectedMessages}
            messagesContainerRef={messagesContainerRef}
          />
        </div>

        <div className="conversation-main-section-input-container">
          <ConversationMessageInputCompoent
            showInsertOption={handleShowInsertOption}
            setInsertedMedias={setInsertedMedias}
            setInsertedDocs={setInsertedDocs}
            setInsertedSticker={setInsertedSticker}
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
            selectedMessages={selectedMessages}
            setSelectedMessages={setSelectedMessages}
          />
        </div>

        <Slide
          direction="up"
          in={insertOption}
          container={containerRef.current}
        >
          <div className="conversation-insert-options-option-container">
            {insertOptionType === "camera" && (
              <ConversationInsertCameraComponent
                closeOption={handleHideInsertOption}
                setReplyMessage={setReplyMessage}
                replyMessage={replyMessage}
              />
            )}
            {insertOptionType === "photos & videos" && (
              <ConversationInsertMediaComponent
                closeOption={handleHideInsertOption}
                images={insertedMedias}
                setInsertedMedias={setInsertedMedias}
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
              />
            )}

            {insertOptionType === "document" && (
              <ConversationInsertDocsComponent
                closeOption={handleHideInsertOption}
                docs={insertedDocs}
                setInsertedDocs={setInsertedDocs}
                setReplyMessage={setReplyMessage}
                replyMessage={replyMessage}
              />
            )}

            {insertOptionType === "sticker" && (
              <ConversationInsertStickerComponent
                closeOption={handleHideInsertOption}
                sticker={insertedSticker}
                setSticker={setInsertedSticker}
                setReplyMessage={setReplyMessage}
                replyMessage={replyMessage}
              />
            )}
          </div>
        </Slide>
      </section>

      <section
        className={`chat-board-conversation-profile-section ${
          sideBar && "side-bar-is-active"
        }`}
      >
        {sideBar && (
          <Fragment>
            {sideBarContent === "contact" ? (
              <ConversationContactInfoComponent
                closeSideBar={handleHideSideBar}
              />
            ) : (
              <ConversationSearchMessagesComponent
                closeSideBar={handleHideSideBar}
              />
            )}
          </Fragment>
        )}
      </section>
    </div>
  );
};

export default ChatBoardConversation;

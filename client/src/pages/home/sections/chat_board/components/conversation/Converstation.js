import {useState, Fragment, useRef} from "react";
import {useSelector} from "react-redux";
import Slide from "@mui/material/Slide";

import ConversationHeaderComponent from "./components/header/Header";
import ConversationMessagesComponent from "./components/messages/Messages";
import ConversationContactInfoComponent from "./components/contact/Contact";
import ConversationSearchMessagesComponent from "./components/search/Search";
import ConversationMessageInputCompoent from "./components/input/Input";
import ConversationInsertCameraComponent from "./components/insert_camera/InsertCamera";
import ConversationInsertMediaComponent from "./components/insert_media/InsertMedia";
import ConversationInsertDocsComponent from "./components/insert_docs/InsertDocs";
import ConversationInsertStickerComponent from "./components/insert_sticker/InsertSticker";
import chatBgImg from "../../../../../../images/whatsapp_chat_bg_image.png";

const ChatBoardConversation = () => {
  const [sideBar, setSideBar] = useState(false); //HANDLES SIDEBAR VISIBILITY, SIDEBAR SHOWS CHAT CONTACT INFORMATION AND OTHER ACTIONS
  const [sideBarContent, setSideBarContent] = useState(""); //SIDEBAR CONTENT CAN EITHER BE CHAT CONTACT OR SEARCH COMPONENT
  const [insertOption, setInsertOption] = useState(false); //TO SHOW OPTIONS ON BOTTOM OF CONVERSATION, SUCH OPTIONS INCLUDES EMOJIS AND STICKERS AND TO SHOW A MODAL SUCH FOR IMAGES
  const [insertOptionType, setInsertOptionType] = useState(""); //OPTIONS TYPE IS EITHER EMOJI, STICKER, PHOTOS & VIDEOS
  const [insertedMedias, setInsertedMedias] = useState([]); //HOLDS NUMBER OF MEDIAS(IMAGES) SELECTED BY THE USER
  const [insertedDocs, setInsertedDocs] = useState([]); //HOLDS NUMBER OF DOCUMENTS(PDF OR DOC FILES) SELECTED BY THE USER
  const [insertedSticker, setInsertedSticker] = useState(""); //IN CASE USER CHOSES TO UPLOAD STICKER, HOLDS THE STICKER IMAGE SOURCE
  const [replyMessage, setReplyMessage] = useState(null); //HOLDS THE MESSAGE A USER HAS CHOSEN TO REPLY TO
  const [selectedMessages, setSelectedMessages] = useState([]); //HOLDS ALL MESSAGES A USER AS SELECTED, USER CAN SELECT MESSAGE FROM THE MESSAGE COMPONENT, BUT STATE IS DECLARED HERE SO IT CAN BE EASILY PASSED DOWN TO OTHER MULTIPLE COMPONENTS SUCH HAS INPUT COMPOENT

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

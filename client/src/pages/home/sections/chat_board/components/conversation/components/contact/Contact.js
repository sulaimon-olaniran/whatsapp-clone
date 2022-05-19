import {useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Avatar, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Switch from "@mui/material/Switch";
import Slide from "@mui/material/Slide";

import {
  StarredIcon,
  NotificationIcon,
  DisappearingIcon,
  PadlockIcon,
  BlockIcon,
  ThumbsDownIcon,
  DeleteIcon,
} from "../../../../../../../../icons";
import ContactMediaComponent from "./media/Media";
import ConversationStarredMessages from "./components/starred_messages/Starred";
import ConversationMediaDocsLinks from "./components/media_links_docs/MediaLinksDocs";
import ConversationDisappearingdMessages from "./components/dissapearing/Disappearing";
import ConversationContactActionsDialog from "./components/dialog/Dialog";
import {viewProfilePhoto} from "../../../../../../../../store/actions/app";

const ConversationContactInfoComponent = ({closeSideBar}) => {
  const [slide, setSlide] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [slideComponent, setSlideComponent] = useState("");
  const [dialogAction, setDialogAction] = useState("");
  const containerRef = useRef(null);

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const currentChat = useSelector(state => state.chat.currentChat);

  const messages = currentChat.messages;

  const medias = messages.filter(
    message => message.type === "image" || message.type === "gif"
  );

  const docs = messages.filter(message => message.type === "document");

  const contactIsBlocked = user?.privacy?.blocked_contacts?.includes(
    currentChat?.partner
  );

  const handleOpenSlide = component => {
    setSlideComponent(component);
    setSlide(true);
  };

  const handleCloseSlide = () => {
    setSlideComponent("");
    setSlide(false);
  };

  const handleOpenDialog = action => {
    setDialogAction(action);
    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialogAction("");
    setDialog(false);
  };

  const handleViewProfilePhoto = () => {
    const payload = {
      name: currentChat?.partnerData?.username,
      url: currentChat?.partnerData?.profile_photo,
    };

    dispatch(viewProfilePhoto(payload));
  };

  return (
    <div
      className={`conversation-contact-info-component-${theme}-theme`}
      ref={containerRef}
    >
      <ConversationContactActionsDialog
        open={dialog}
        handleClose={handleCloseDialog}
        actionType={dialogAction}
      />

      <header className="conversation-contact-info-header-container">
        <IconButton onClick={closeSideBar}>
          <CloseIcon />
        </IconButton>
        <p>Contact info</p>
      </header>
      <div className="conversation-contact-information-body-container">
        <div className="contact-information-profile-container">
          <Avatar
            src={currentChat?.partnerData?.profile_photo}
            onClick={handleViewProfilePhoto}
          />
          <div className="profile-name-number-container">
            <h2>{currentChat?.partnerData?.username}</h2>
            <p>{currentChat?.partnerData?.phone_number}</p>
          </div>
        </div>

        <div className="contact-information-about-container">
          <h4>About</h4>
          <p>{currentChat?.partnerData?.about}</p>
        </div>

        <div className="contact-information-media-links-docs">
          <div
            className="media-links-docs-button"
            onClick={() => handleOpenSlide("media_docs_links")}
          >
            <p>Media, links and docs</p>
            <div>
              <p>{medias.length + docs.length}</p>
              <ArrowForwardIosIcon />
            </div>
          </div>

          {medias.length > 0 && (
            <div className="media-links-docs-medias-container">
              {medias.slice(0, 3).map(media => {
                return (
                  <div
                    key={media._id || media.subId}
                    className="each-media-container"
                  >
                    <ContactMediaComponent media={media} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className="starred-messages-button-container"
          onClick={() => handleOpenSlide("starred")}
        >
          <div>
            <StarredIcon />
            <p>Starred messages</p>
          </div>
          <ArrowForwardIosIcon />
        </div>

        <div className="conversation-information-actions-container">
          <div className="each-conversation-information-action">
            <div>
              <NotificationIcon />
              <p>Mute notifications</p>
            </div>
            <Switch />
          </div>

          <div
            className="each-conversation-information-action"
            onClick={() => handleOpenSlide("disappearing")}
          >
            <div>
              <DisappearingIcon />
              <div>
                <p>Disappearing messages</p>
                <small>None</small>
              </div>
            </div>
            <ArrowForwardIosIcon />
          </div>

          <div className="each-conversation-information-action">
            <div>
              <PadlockIcon width="20" height="20" />
              <div>
                <p>Encrption</p>
                <small>
                  Messages are end-to-end encrypted. Click to verify.
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="conversation-account-actions-container">
          <div
            className={`each-conversation-account-action ${
              contactIsBlocked && "contact-is-blocked"
            }`}
            onClick={() => handleOpenDialog("block")}
          >
            <BlockIcon />
            <p>
              {contactIsBlocked ? "Unblock" : "Block"}{" "}
              {currentChat?.partnerData?.username}
            </p>
          </div>
          <div
            className="each-conversation-account-action"
            onClick={() => handleOpenDialog("report")}
          >
            <ThumbsDownIcon />
            <p>Report {currentChat?.partnerData?.username}</p>
          </div>
        </div>

        <div
          className="conversation-delete-action-container"
          onClick={() => handleOpenDialog("delete")}
        >
          <DeleteIcon />
          <p>Delete chat</p>
        </div>
      </div>

      <Slide
        direction="left"
        in={slide}
        mountOnEnter
        unmountOnExit
        container={containerRef.current}
      >
        <div className="conversation-information-slide-container">
          {slideComponent === "starred" && (
            <ConversationStarredMessages deactiveControl={handleCloseSlide} />
          )}
          {slideComponent === "disappearing" && (
            <ConversationDisappearingdMessages
              deactiveControl={handleCloseSlide}
            />
          )}
          {slideComponent === "media_docs_links" && (
            <ConversationMediaDocsLinks goBack={handleCloseSlide} />
          )}
        </div>
      </Slide>
    </div>
  );
};

export default ConversationContactInfoComponent;

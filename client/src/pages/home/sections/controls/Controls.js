import {useState, useRef, Fragment, useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import Slide from "@mui/material/Slide";
import {Helmet} from "react-helmet";

import ControlsHeaderComponent from "./components/header/Header";
import ControlsProfileComponent from "./components/profile/Profile";
import ControlsSettingsComponent from "./components/settings/Settings";
import ControlsNewGroupComponent from "./components/new_group/NewGroup";
import ControlsNewChatComponent from "./components/new_chat/NewChat";
import ControlsChatListComponent from "./components/chat_list/ChatList";
import ControlsArchivedComponent from "./components/archived/Archived";
import StarredMessagesComponent from "../../../../components/starred_messages/StarredMessages";

const HomepageControlsSection = () => {
  const [activeControl, setActiveControl] = useState("default");
  const [showControl, setShowControl] = useState(false);
  const [unSeenMsgs, setUnseenMsgs] = useState([]);

  const containerRef = useRef(null);

  const user = useSelector(state => state.user.user);
  const theme = useSelector(state => state.app.theme);
  const chats = useSelector(state => state.chat.chats);
  const starredMessages = useSelector(state => state.chat.starredMessages);

  const handleSetActiveControl = control => {
    setActiveControl(control);
    setShowControl(true);
  };

  const handleDeactivateControl = () => {
    setActiveControl("default");
    setShowControl(false);
  };

  //GET NUMBER OF MESSAGES USER HAVEN'T READ
  //THE NUMBER WILL BE SHOWN ON PAGE TITLE
  const getNumberOfUnseenMessages = useCallback(() => {
    const messages = [];
    chats.map(chat => {
      const chatMsgs = chat.messages;
      if (chatMsgs.length < 1) return null;
      return chatMsgs.map(msg => {
        if (msg.sender !== user._id && !msg.isSeen) {
          return messages.push(msg);
        }
        return null;
      });
    });

    setUnseenMsgs(messages);
  }, [chats, user]);

  useEffect(() => {
    getNumberOfUnseenMessages();
  }, [getNumberOfUnseenMessages]);

  return (
    <div
      className={`homepage-controls-section-${theme}-theme`}
      ref={containerRef}
    >
      <Helmet>
        <meta charSet="utf-8" />
        {unSeenMsgs.length > 0 ? (
          <title>{`(${unSeenMsgs.length})`} OS-WhatsApp-Clone</title>
        ) : (
          <title>OS-WhatsApp-Clone</title>
        )}
      </Helmet>
      {activeControl === "default" && (
        <Fragment>
          <ControlsHeaderComponent activateControl={handleSetActiveControl} />
          <ControlsChatListComponent
            handleSetActiveControl={handleSetActiveControl}
            chats={chats}
          />
        </Fragment>
      )}

      <Slide
        direction="right"
        in={showControl}
        mountOnEnter
        unmountOnExit
        container={containerRef.current}
      >
        <div className={`homepage-controls-control-container`}>
          {activeControl === "profile" && (
            <ControlsProfileComponent
              deactiveControl={handleDeactivateControl}
            />
          )}

          {activeControl === "settings" && (
            <ControlsSettingsComponent
              deactiveControl={handleDeactivateControl}
              handleSetActiveControl={handleSetActiveControl}
            />
          )}

          {activeControl === "new group" && (
            <ControlsNewGroupComponent
              deactiveControl={handleDeactivateControl}
            />
          )}

          {activeControl === "new chat" && (
            <ControlsNewChatComponent
              deactiveControl={handleDeactivateControl}
              handleSetActiveControl={handleSetActiveControl}
            />
          )}

          {activeControl === "archived chat" && (
            <ControlsArchivedComponent
              deactiveControl={handleDeactivateControl}
              //handleSetActiveControl={handleSetActiveControl}
            />
          )}

          {activeControl === "starred messages" && (
            <StarredMessagesComponent
              goBack={handleDeactivateControl}
              messages={starredMessages}
            />
          )}
        </div>
      </Slide>
    </div>
  );
};

export default HomepageControlsSection;

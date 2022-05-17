import {useState, useEffect, useRef, Fragment} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Avatar, Button, IconButton} from "@mui/material";
import Popover from "@mui/material/Popover";
import moment from "moment";
//import axios from "axios";

import {MenuIcon, SearchIcon} from "../../../../../../../../icons";
//import {messagApi} from "../../../../../../../../api";
import {pusher} from "../../../../../../../../constants";

import {closeCurrentChat} from "../../../../../../../../store/actions/chat";
import ClearMessagesDialog from "./components/clear/ClearMessages";
import DeleteChatDialog from "./components/delete/DeleteChat";

const ConversationHeaderComponent = ({showSideBar, showSearch}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [userLastSeen, setUserLastSeen] = useState(null);
  const [clearMsgsDialog, setClearMsgsDialog] = useState(false);
  const [deleteChatDialog, setDeleteChatDialog] = useState(false);

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  //const token = useSelector(state => state.user.token);
  const currentChat = useSelector(state => state.chat.currentChat);

  const handleShowMenuOptions = event => {
    setMenuAnchor(event.currentTarget);
  };

  const handleHideMenuOptions = () => {
    setMenuAnchor(null);
  };

  const handleOpenClearMsgsDialog = () => {
    setClearMsgsDialog(true);
  };

  const handleCloseClearMsgsDialog = () => {
    setClearMsgsDialog(false);
  };

  const handleOpenDeleteChatDialog = () => {
    setDeleteChatDialog(true);
  };

  const handleCloseDeleteChatDialog = () => {
    setDeleteChatDialog(false);
  };

  const chatPartner = currentChat?.partnerData;
  const lastSeen = userLastSeen
    ? userLastSeen
    : chatPartner?.last_seen
    ? chatPartner?.last_seen
    : chatPartner?.presence.last_seen;

  const lastSeenDay = moment(lastSeen);
  const currentDay = moment(new Date());
  const prevDay = moment().subtract(1, "day");
  const weekDifference = currentDay
    .startOf("day")
    .diff(lastSeenDay.startOf("day"), "weeks");
  const isCurrentDay = lastSeenDay.isSame(currentDay, "day");
  const isPrevDay = lastSeenDay.isSame(prevDay, "day");

  const menuOptions = [
    {
      option: "Contact info",
      action: () => showSideBar("contact"),
    },
    {
      option: "Select messages",
      action: () => console.log("archived"),
    },
    {
      option: "Close chat",
      action: () => dispatch(closeCurrentChat()),
    },
    {
      option: "Mute notifications",
      action: () => console.log("settings"),
    },
    {
      option: "Clear messages",
      action: handleOpenClearMsgsDialog,
    },
    {
      option: "Delete chat",
      action: handleOpenDeleteChatDialog,
    },
  ];

  let typingInterval = useRef(null);
  useEffect(() => {
    const channel = pusher.subscribe("chat-channel");

    channel.bind("user-typing", function (data) {
      if (data?.chatId === currentChat?._id && data?.userId !== user._id) {
        setIsTyping(true);
        clearInterval(typingInterval.current);

        typingInterval.current = setTimeout(() => setIsTyping(false), 900);
      }
    });

    return () => {
      channel.unbind("user-typing");
    };
  }, [currentChat, user]);

  useEffect(() => {
    const channel = pusher.subscribe("user-channel");

    channel.bind("user-online", function (data) {
      if (data?.userId === chatPartner?._id && data?.userId !== user._id) {
        setIsOnline(true);
      }
    });

    return () => {
      channel.unbind("user-online");
    };
  }, [chatPartner, user]);

  useEffect(() => {
    const channel = pusher.subscribe("user-channel");

    channel.bind("user-online", function (data) {
      if (data?.userId === chatPartner?._id && data?.userId !== user._id) {
        //console.log(data);
        setIsOnline(true);
      }
    });

    return () => {
      channel.unbind("user-online");
    };
  }, [chatPartner, user]);

  useEffect(() => {
    const channel = pusher.subscribe("user-channel");

    channel.bind("user-offline", function (data) {
      if (data?.userId === chatPartner?._id && data?.userId !== user._id) {
        setUserLastSeen(data?.last_seen);
        setIsOnline(false);
      }
    });

    return () => {
      channel.unbind("user-offline");
    };
  }, [chatPartner, user]);

  return (
    <header className={`conversation-header-component-${theme}-theme`}>
      <ClearMessagesDialog
        open={clearMsgsDialog}
        handleClose={handleCloseClearMsgsDialog}
        messages={currentChat.messages}
      />

      <DeleteChatDialog
        open={deleteChatDialog}
        handleClose={handleCloseDeleteChatDialog}
        chat={currentChat}
      />
      <div
        className="universal-button"
        onClick={() => showSideBar("contact")}
      />

      <div className="header-contact-name-image">
        <Avatar src={chatPartner?.profile_photo} />
        <div className="name-typing-container">
          <p id="header_username_text">{chatPartner?.username}</p>
          {isTyping && <small>Typing ...</small>}

          {/* SHOW ONLINE PRESENCE WHEN USER IS ONLINE AND NOT TYPING */}
          {isOnline && !isTyping && <p id="header_last_seen_text">Online</p>}

          {/* ONLY SHOW LAST SEEN WHEN PRIVACY ALLOWS IT AND USER IS NOT ONLINE AND USER NOT TYPING */}
          {chatPartner?.privacy.last_seen === "everyone" &&
            !isOnline &&
            !isTyping && (
              <Fragment>
                {weekDifference > 0 ? (
                  <p id="header_last_seen_text">
                    Last seen {moment(lastSeen).format("L")} at{" "}
                    {moment(lastSeen).format("LT")}
                  </p>
                ) : (
                  <p id="header_last_seen_text">
                    Last seen{" "}
                    {isCurrentDay
                      ? "Today"
                      : isPrevDay
                      ? "Yesterday"
                      : moment(lastSeen).format("dddd")}{" "}
                    at {moment(lastSeen).format("LT")}
                  </p>
                )}
              </Fragment>
            )}
        </div>
      </div>

      <div className="header-action-buttons">
        <IconButton onClick={() => showSideBar("search")}>
          <SearchIcon />
        </IconButton>

        <IconButton onClick={handleShowMenuOptions}>
          <MenuIcon />
        </IconButton>
      </div>
      <Popover
        //id={id}
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={handleHideMenuOptions}
        anchorOrigin={{
          vertical: 50,
          horizontal: -170,
        }}
      >
        <div
          className={`conversation-header-menu-options-container-${theme}-theme`}
        >
          {menuOptions.map(option => {
            return (
              <Button
                key={option.option}
                onClick={() => {
                  option.action();
                  handleHideMenuOptions();
                }}
              >
                <p>{option.option}</p>
              </Button>
            );
          })}
        </div>
      </Popover>
    </header>
  );
};

export default ConversationHeaderComponent;

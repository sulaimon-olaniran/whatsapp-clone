import {useState, useEffect, useRef, useCallback, useMemo} from "react";
import {Avatar, Button, IconButton} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Popover from "@mui/material/Popover";
import moment from "moment";
import axios from "axios";

import {pusher} from "../../../../../../../constants";
import {PinnedIcon} from "../../../../../../../icons";
import {
  deleteChat,
  editChat,
  setCurrentChat,
} from "../../../../../../../store/actions/chat";
import {messagApi, chatApi} from "../../../../../../../api";
import ChatListEachChatMessagePreview from "./preview/Preview";
import {OPEN_SNACKBAR} from "../../../../../../../store/types/universal";

const ChatListEachChat = ({chat, type}) => {
  const [optionsAnchor, setOptionsAnchor] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unReadMessages, setUnreadMessages] = useState([]);

  let isTypingInterval = useRef(null);

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const currentChat = useSelector(state => state.chat.currentChat);

  const config = useMemo(() => {
    return {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };
  }, [token]);

  const handleShowMenuOptions = event => {
    event.preventDefault();

    setOptionsAnchor(event.currentTarget);
  };

  const handleHideMenuOptions = () => {
    setOptionsAnchor(null);
  };

  const handleSetCurrentChat = () => {
    dispatch(setCurrentChat(chat));
  };

  useEffect(() => {
    const channel = pusher.subscribe("chat-channel");

    channel.bind("user-typing", function (data) {
      //CHECK IF THE USER THAT IS TYPING ISN'T CURRENT LOGGED IN USER, AND ALSO USER IS AN INTERLOCUTOR IN THE CHAT TO PREVENT TYPING SHOWING ON ALL CHATS IN THE CHAT LIST
      if (data?.chatId === chat?._id && data?.userId !== user?._id) {
        setIsTyping(true);
        clearInterval(isTypingInterval.current);
        //WAIT 0.9 SECONDS BEFONE DISPLAYING IF USER IS TYPING
        isTypingInterval.current = setTimeout(() => setIsTyping(false), 900);
      }
    });

    return () => {
      channel.unbind("user-typing");
    };
  }, [currentChat, user, chat]);

  //GET AMOUNT OF MESSAGES UNREAD BY THE LOGGED IN USER
  //TO DISPLAY NEXT TO THE CHAT INFORMATION IN THE CHAT LIST
  useEffect(() => {
    const messages = chat?.messages;
    const unread = messages?.filter(
      message => message?.sender !== user?._id && message?.isSeen === false
    );
    setUnreadMessages(unread);
  }, [chat, user]);

  //UPDATE ALL UNDELIVERED MESSAGE AS DELIVERED
  const handleUnDeliveredMessages = useCallback(() => {
    const unDeliveredMessages = chat?.messages?.filter(
      message => message?.sender !== user?._id && message?.isDelivered === false
    );

    if (unDeliveredMessages.length < 1) return;
    unDeliveredMessages.map(async message => {
      const messageId = message._id;
      const res = await axios.patch(
        `${messagApi}/delivered`,
        {messageId},
        config
      );
      console.log(res.data);
    });
  }, [config, chat, user]);

  useEffect(() => {
    handleUnDeliveredMessages();
  }, [handleUnDeliveredMessages]);

  const handleUnarchiveChat = () => {
    const chatId = chat._id;
    axios
      .patch(`${chatApi}/unarchive`, {chatId}, config)
      .then(res => {
        dispatch(editChat(res.data));
        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: "Chat unarchived",
            undoAction: () => {
              const chatId = chat._id;
              axios.patch(`${chatApi}/archive`, {chatId}, config).then(res => {
                dispatch(editChat(res.data));
              });
            },
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleArchiveChat = () => {
    const chatId = chat._id;
    axios
      .patch(`${chatApi}/archive`, {chatId}, config)
      .then(res => {
        dispatch(editChat(res.data));
        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: "Chat archived",
            undoAction: () => {
              const chatId = chat._id;
              axios
                .patch(`${chatApi}/unarchive`, {chatId}, config)
                .then(res => {
                  dispatch(editChat(res.data));
                });
            },
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handlePinChat = () => {
    const chatId = chat._id;
    axios
      .patch(`${chatApi}/pin`, {chatId}, config)
      .then(res => {
        dispatch(editChat(res.data));
        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: "Chat pinned",
            undoAction: () => {
              const chatId = chat._id;
              axios.patch(`${chatApi}/unpin`, {chatId}, config).then(res => {
                dispatch(editChat(res.data));
              });
            },
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleUnPinChat = () => {
    const chatId = chat._id;
    axios
      .patch(`${chatApi}/unpin`, {chatId}, config)
      .then(res => {
        dispatch(editChat(res.data));
        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: "Chat unpinned",
            undoAction: () => {
              const chatId = chat._id;
              axios.patch(`${chatApi}/pin`, {chatId}, config).then(res => {
                dispatch(editChat(res.data));
              });
            },
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleMarkChatAsUnread = () => {
    const chatId = chat._id;
    axios
      .patch(`${chatApi}/mark/unread`, {chatId}, config)
      .then(res => {
        dispatch(editChat(res.data));

        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: "Chat marked as unread",
            undoAction: () => {
              axios
                .patch(`${chatApi}/mark/read`, {chatId}, config)
                .then(res => {
                  dispatch(editChat(res.data));
                });
            },
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleMarkChatAsRead = () => {
    const chatId = chat._id;
    axios
      .patch(`${chatApi}/mark/read`, {chatId}, config)
      .then(res => {
        dispatch(editChat(res.data));

        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: "Chat marked as read",
            undoAction: () => {
              axios
                .patch(`${chatApi}/mark/unread`, {chatId}, config)
                .then(res => {
                  dispatch(editChat(res.data));
                });
            },
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  //////////////////////INTEGRATE DELETE POPUP DIALOG FOR THIS ACTION//////////////////////////////////////////
  const handleDeleteChat = () => {
    dispatch(deleteChat(chat._id));
  };

  const menuOptions = [
    {
      option: "Archive chat",
      action: chat?.archived?.includes(user?._id)
        ? handleUnarchiveChat
        : handleArchiveChat,
    },

    {
      option: "Mute notifications",
      action: () => console.log(chat),
    },

    {
      option: "Delete chat",
      action: handleDeleteChat,
    },

    {
      option: chat?.pinned?.some(item => item?.id === user?._id)
        ? "Unpin chat"
        : "Pin chat",
      action: chat?.pinned?.some(item => item?.id === user?._id)
        ? handleUnPinChat
        : handlePinChat,
    },

    {
      option: chat?.unread?.includes(user?._id)
        ? "Mark as read"
        : "Mark as unread",
      action: chat?.unread?.includes(user?._id)
        ? handleMarkChatAsRead
        : handleMarkChatAsUnread,
    },
  ];

  //OPTIONS TO DISPLAY IF CHAT HAS BEEN ARCHIVED
  const archivedOptions = [
    {
      option: "Unarchive chat",
      action: handleUnarchiveChat,
    },
    {
      option: "Delete chat",
      action: () => console.log(chat),
    },
    {
      option: chat?.unread?.includes(user?._id)
        ? "Mark as read"
        : "Mark as unread",
      action: chat?.unread?.includes(user?._id)
        ? handleMarkChatAsRead
        : handleMarkChatAsUnread,
    },
  ];

  //GET THE MOST RECENT MESSAGE IN THE CHAT
  const recentMessage = chat.messages[chat.messages.length - 1];

  //GET TIME OF THE MOST RECENT MESSAGE
  const messagesDay = recentMessage
    ? moment(recentMessage.time)
    : moment(chat.createdAt);
  const currentDay = moment(new Date());
  const prevDay = moment().subtract(1, "day");
  const weekDifference = currentDay
    .startOf("day")
    .diff(messagesDay.startOf("day"), "weeks");
  const isCurrentDay = messagesDay.isSame(currentDay, "day");
  const isPrevDay = messagesDay.isSame(prevDay, "day");

  return (
    <div
      className={`chat-list-each-chat-${theme}-theme`}
      onContextMenu={handleShowMenuOptions}
    >
      <div className="action-button" onClick={handleSetCurrentChat} />
      <Avatar src={chat?.partnerData?.profile_photo} />
      <div className="each-chat-information">
        <section className="each-chat-information-top-section">
          <p>{chat?.partnerData?.username}</p>
          {chat.messages.length > 0 ? (
            weekDifference > 0 ? (
              <small>{moment(recentMessage.time).format("L")}</small>
            ) : (
              <small>
                {isCurrentDay
                  ? moment(recentMessage.time).format("LT")
                  : isPrevDay
                  ? "Yesterday"
                  : moment(recentMessage.time).format("dddd")}
              </small>
            )
          ) : weekDifference > 0 ? (
            <small>{moment(chat.createdAt).format("L")}</small>
          ) : (
            <small>
              {isCurrentDay
                ? moment(chat.createdAt).format("LT")
                : isPrevDay
                ? "Yesterday"
                : moment(chat.createdAt).format("dddd")}
            </small>
          )}
        </section>

        <section className="each-chat-information-bottom-section">
          {isTyping ? (
            <div className="user-is-typing-container">
              <span>Typing...</span>
            </div>
          ) : (
            <ChatListEachChatMessagePreview messages={chat.messages} />
          )}

          <div className="message-options">
            {chat?.pinned?.some(item => item?.id === user?._id) && (
              <PinnedIcon />
            )}

            {currentChat?._id !== chat?._id &&
              (unReadMessages.length > 0 ||
                chat?.unread?.includes(user?._id)) && (
                <div className="unread-message-icon">
                  {!chat?.unread?.includes(user?._id) && (
                    <p>{unReadMessages.length}</p>
                  )}
                </div>
              )}
            <IconButton size="medium" onClick={handleShowMenuOptions}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </div>
        </section>
      </div>

      {Boolean(optionsAnchor) && (
        <Popover
          open={Boolean(optionsAnchor)}
          anchorEl={optionsAnchor}
          onClose={handleHideMenuOptions}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div
            className={`controls-each-chat-menu-options-container-${theme}-theme`}
          >
            {type === "archieved"
              ? archivedOptions.map(option => {
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
                })
              : menuOptions.map(option => {
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
      )}
    </div>
  );
};

export default ChatListEachChat;

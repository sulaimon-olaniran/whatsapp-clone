import {useState, useEffect} from "react";
import {Avatar} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {IconButton, Button} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";
import axios from "axios";

import MessageComponent from "../message/Message";
import {messagApi} from "../../api";
import {editMessage} from "../../store/actions/chat";
import {REMOVE_STARRED_MESSAGE} from "../../store/types/chat";

const StarredMessagesComponent = ({goBack, messages}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const dispatch = useDispatch();

  //console.log(messages);

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const chats = useSelector(state => state.chat.chats);

  // const messages = useSelector(state => state.chat.currentChat.messages);

  const sortedMessages = messages.sort((a, b) => {
    const compA = new Date(a.time);
    const compB = new Date(b.time);
    return compB - compA;
  });

  const handleShowMenuOptions = event => {
    setMenuAnchor(event.currentTarget);
  };

  const handleHideMenuOptions = () => {
    setMenuAnchor(null);
  };

  const handleUnstarAllStarredMessages = () => {
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    messages.map(message => {
      const messageId = message._id;
      return axios
        .patch(`${messagApi}/unstar`, {messageId}, config)
        .then(res => {
          dispatch(editMessage(res.data));
          dispatch({
            type: REMOVE_STARRED_MESSAGE,
            payload: res.data,
          });
        });
    });
  };

  return (
    <div className={`starred-messages-component-${theme}-theme`}>
      <header className={`starred-messages-header-container`}>
        <section className="starred-messages-header-left-section">
          <IconButton onClick={goBack}>
            <ArrowBackIcon />
          </IconButton>

          <p>Starred messages</p>
        </section>

        <section className="starred-messages-header-right-section">
          <IconButton onClick={handleShowMenuOptions}>
            <MoreVertIcon />
          </IconButton>
          <Popover
            //id={id}
            open={Boolean(menuAnchor)}
            anchorEl={menuAnchor}
            onClose={handleHideMenuOptions}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <div className="starred-messages-header-menu-container">
              <Button onClick={handleUnstarAllStarredMessages}>
                Unstar All
              </Button>
            </div>
          </Popover>
        </section>
      </header>

      {sortedMessages.length > 0 ? (
        <div className="starred-messages-body-container">
          {sortedMessages.slice(0, 10).map(message => {
            const {sender, time} = message;

            //FETCH THE CHAT THAT THE MESSAGE BELONGS TO
            const chat = chats.find(chat => chat._id === message.chatId);
            const {partnerData} = chat;

            const messagesDay = moment(time);
            const currentDay = moment(new Date());
            const prevDay = moment().subtract(1, "day");
            const weekDifference = currentDay
              .startOf("day")
              .diff(messagesDay.startOf("day"), "weeks");
            const isCurrentDay = messagesDay.isSame(currentDay, "day");
            const isPrevDay = messagesDay.isSame(prevDay, "day");
            return (
              <div
                className="each-starred-message-container"
                key={message._id || message.subId}
              >
                <div className="starred-message-details-container">
                  <div className="messaage-users-container">
                    <Avatar
                      src={
                        sender === user._id
                          ? user.profile_photo
                          : partnerData?.profile_photo
                      }
                    />
                    <p>{sender === user._id ? "You" : partnerData?.username}</p>
                    <span>▸</span>
                    <p>{sender !== user._id ? "You" : partnerData?.username}</p>
                  </div>

                  <div className="starred-message-time-container">
                    {weekDifference > 0 ? (
                      <p>{moment(time).format("L")}</p>
                    ) : (
                      <p>
                        {isCurrentDay
                          ? moment(time).format("LT")
                          : isPrevDay
                          ? "Yesterday"
                          : moment(time).format("dddd")}
                      </p>
                    )}

                    <ChevronRightIcon />
                  </div>
                </div>

                <div className="starred-message-message-container">
                  <MessageComponent message={message} from="starred" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-starred-messages-body-container">
          <p>No messages</p>
        </div>
      )}
    </div>
  );
};

export default StarredMessagesComponent;

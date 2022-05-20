import {Fragment, useEffect, useState, useCallback} from "react";
import {useSelector} from "react-redux";
import {IconButton} from "@mui/material";
import Zoom from "@mui/material/Zoom";
import moment from "moment";

import MessageComponent from "../../../../../../../../components/message/Message";
import {MoveDownwardsIcon} from "../../../../../../../../icons";
import NoMessagesComponent from "./no_messages/NoMessages";
import axios from "axios";
import {messagApi} from "../../../../../../../../api";
import {groupArrayByDatesFunction} from "../../../../../../../../functions";

const ConversationMessagesComponent = ({
  setReplyMessage,
  selectedMessages,
  setSelectedMessages,
  messagesContainerRef,
}) => {
  const [showButton, setShowButton] = useState(false);

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const currentChat = useSelector(state => state.chat.currentChat);

  const {messages} = currentChat;

  const sortedMessages = messages.sort((a, b) => {
    const compA = moment(a.time);
    const compB = moment(b.time);
    return compA - compB;
  });

  const groupedMessages = groupArrayByDatesFunction(sortedMessages, "D");

  const sortedGroupedMessages = groupedMessages.sort((a, b) => {
    const compA = moment(a[0].time);
    const compB = moment(b[0].time);
    return compA - compB;
  });

  const scrollToBottom = useCallback(() => {
    const scroll =
      messagesContainerRef.current.scrollHeight -
      messagesContainerRef.current.clientHeight;

    messagesContainerRef.current.scrollTo({
      top: scroll,
      behaviour: "smooth",
    });
  }, [messagesContainerRef]);

  const handleOnScroll = event => {
    const {scrollHeight, scrollTop, clientHeight} = event.target;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;

    if (scrollPosition > 100) {
      setShowButton(true);
    } else if (scrollPosition <= 0) {
      setShowButton(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleUnreadMessages = useCallback(
    messages => {
      const config = {
        headers: {
          "content-type": "application/json",
          "oswc-auth-token": token,
        },
      };

      messages.map(message => {
        const messageId = message._id;
        return axios.patch(`${messagApi}/read`, {messageId}, config);
      });
    },
    [token]
  );

  //SET UNREAD MESSAGES FROM FA
  useEffect(() => {
    const unreadMessages = messages.filter(
      message => message.sender !== user._id && message.isSeen === false
    );

    if (unreadMessages.length < 1) return;

    handleUnreadMessages(unreadMessages);
  }, [messages, user, handleUnreadMessages]);

  return (
    <Fragment>
      <div
        className={`conversation-messages-component-container-${theme}-theme`}
        ref={messagesContainerRef}
        onScroll={handleOnScroll}
      >
        {sortedGroupedMessages.length > 0 ? (
          sortedGroupedMessages.map(group => {
            const time = group[0].time;
            const messagesDay = moment(time);
            const currentDay = moment(new Date());
            const prevDay = moment().subtract(1, "day");
            const weekDifference = currentDay.diff(messagesDay, "weeks");
            const isCurrentDay = messagesDay.isSame(currentDay, "day");
            const isPrevDay = messagesDay.isSame(prevDay, "day");
            return (
              <div
                className="each-grouped-messages-container"
                key={group[0]._id || group[0].subId}
              >
                <div className="each-grouped-messages-day-container">
                  {weekDifference > 0 ? (
                    <p>{moment(time).format("L")}</p>
                  ) : (
                    <p>
                      {isCurrentDay
                        ? "Today"
                        : isPrevDay
                        ? "Yesterday"
                        : moment(time).format("dddd")}
                    </p>
                  )}
                </div>

                {group.map((message, index) => {
                  const prevMessage = index > 0 ? messages[index - 1] : null;

                  return (
                    <MessageComponent
                      key={message._id || message.subId}
                      message={message}
                      prevMessage={prevMessage}
                      selectedMessages={selectedMessages}
                      setSelectedMessages={setSelectedMessages}
                      setReplyMessage={setReplyMessage}
                      messagesContainerRef={messagesContainerRef}
                    />
                  );
                })}
              </div>
            );
          })
        ) : (
          <NoMessagesComponent time={currentChat.createdAt} />
        )}
      </div>

      <Zoom in={showButton}>
        <div className={`messages-scroll-down-button-container-${theme}-theme`}>
          <IconButton onClick={scrollToBottom}>
            <MoveDownwardsIcon />
          </IconButton>
        </div>
      </Zoom>
    </Fragment>
  );
};

export default ConversationMessagesComponent;

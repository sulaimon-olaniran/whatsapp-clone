import {useState, forwardRef, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import {useDebounce} from "use-debounce";
import Zoom from "@mui/material/Zoom";
import {IconButton} from "@mui/material";
import {v4 as uuidv4} from "uuid";
import axios from "axios";

import SearchInputComponent from "../search_input/SearchInput";
import {SendIcon} from "../../icons";
import {sendNewChatMessage} from "../../store/actions/chat";
import ForwardMessageEachContact from "./EachContact";
import {chatApi} from "../../api";
import {CREATE_NEW_CHAT_SUCCESSFUL} from "../../store/types/chat";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const ForwardMessageComponent = ({
  open,
  handleClose,
  messages,
  closeSelectedMessages,
}) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  const containerRef = useRef(null);

  const [searchValue] = useDebounce(searchInputValue, 500);

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const users = useSelector(state => state.app.users);
  const chats = useSelector(state => state.chat.chats);

  const handleSearchContact = event => {
    setSearchInputValue(event.target.value);
  };

  const handleCloseDialog = () => {
    setSelectedContacts([]);
    handleClose();
  };

  const handleForwardMessageToSelectedContacts = () => {
    selectedContacts.map(contact => {
      //CHECK IF  THERE IS AN EXISTING CHAT BETWEEN SELECTED CHAT AND LOGGED IN USER
      //IF CHAT EXISTS ? SEND MESSAGE, ELSE CREATE A NEW CHAT BEFORE SENDING MESSAGE
      if (chats.some(chat => chat.partnerData._id === contact._id)) {
        //FIND THE CURRENT CHAT DATA BETWEEN BOTH INTERLOCUTORS
        const contactChat = chats.find(
          chat => chat.partnerData._id === contact._id
        );

        return messages.map(message => {
          const forwardMessage = {
            ...message,
            chatId: contactChat._id,
            sender: user._id,
            time: Date.now(),
            subId: uuidv4(),
            isDelivered: false,
            isSent: false,
            isSeen: false,
            //CHECK IF CONTACT THE MESSAGE IS BEING SENT TO HASN'T BLOCKED USER SENDING THE MESSAGE
            //IF USER IS BLOCKED, ADD MESSAGE AS MESSAGE SENT WHILST USER WAS ON BLOCKLIST
            //THIS PREVENTS THE CONTACT THAT BLOCKED THE USER FROM SEEING THE SENT MESSAGE
            isBlocked:
              contactChat?.partnerData?.privacy?.blocked_contacts?.includes(
                user._id
              )
                ? true
                : false,
          };
          delete forwardMessage._id;
          dispatch(sendNewChatMessage(forwardMessage));
        });
      } else {
        const config = {
          headers: {
            "content-type": "application/json",
            "oswc-auth-token": token,
          },
        };

        const data = {partner: contact._id};
        axios.post(`${chatApi}/create/chat`, data, config).then(res => {
          const chat = res.data;

          dispatch({
            type: CREATE_NEW_CHAT_SUCCESSFUL,
            payload: chat,
          });
          return messages.map(message => {
            const forwardMessage = {
              ...message,
              chatId: chat._id,
              sender: user._id,
              time: Date.now(),
              subId: uuidv4(),
              isDelivered: false,
              isSent: false,
              isSeen: false,
              //CHECK IF CONTACT THE MESSAGE IS BEING SENT TO HASN'T BLOCKED USER SENDING THE MESSAGE
              //IF USER IS BLOCKED, ADD MESSAGE AS MESSAGE SENT WHILST USER WAS ON BLOCKLIST
              //THIS PREVENTS THE CONTACT THAT BLOCKED THE USER FROM SEEING THE SENT MESSAGE
              isBlocked: chat?.partnerData?.privacy?.blocked_contacts?.includes(
                user._id
              )
                ? true
                : false,
            };
            //DELETE PREVIOUS MESSAGE _ID AND LET MONGODB GENERATE A NEW ID TO TREAT MESSAGE AS A NEW MESSAGE
            delete forwardMessage._id;
            dispatch(sendNewChatMessage(forwardMessage));
          });
        });
      }
    });

    handleCloseDialog();
    closeSelectedMessages();
  };

  //RETURNS CONTACTS THE USER HAD RECENTLY HAD A CHAT WITH
  const recentChats = users.filter(user =>
    chats.find(({partnerData}) => user._id === partnerData._id)
  );

  //RETURNS CONTACTS THE USER HAVEN'T CHATTED WITH
  const otherUsers = users.filter(
    user => !chats.find(({partnerData}) => user._id === partnerData._id)
  );

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={`forward-message-component-${theme}-theme`}>
        <header className={`forward-message-component-header-container`}>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>

          <h1>Forward message to</h1>
        </header>

        <div className="forward-message-component-search-input-container">
          <div className="search-input-body-container">
            <SearchInputComponent
              value={searchValue}
              handleChange={handleSearchContact}
            />
          </div>
        </div>

        <div className="forward-message-component-contacts-list-container">
          <div className="contacts-list-inner-container">
            <div className="recent-chats-contact-list">
              <h1>Recent chats</h1>
              {recentChats.map(contact => {
                return (
                  <ForwardMessageEachContact
                    key={contact.username}
                    contact={contact}
                    setSelectedContacts={setSelectedContacts}
                    selectedContacts={selectedContacts}
                  />
                );
              })}
            </div>

            <div className="other-contacts-contact-list">
              <h1>Other contacts</h1>
              {otherUsers.map(contact => {
                return (
                  <ForwardMessageEachContact
                    key={contact.username}
                    contact={contact}
                    setSelectedContacts={setSelectedContacts}
                    selectedContacts={selectedContacts}
                  />
                );
              })}
            </div>
          </div>

          <div
            className={`forward-message-action-container ${
              selectedContacts.length > 0 && "forward-message-action-active"
            }`}
          >
            <div
              className="selected-contacts-list-container"
              ref={containerRef}
            >
              <span className="selected-contacts-names-container">
                {selectedContacts.reverse().map(contact => {
                  return (
                    <Zoom in={true} key={contact.username} timeout={400}>
                      <p>
                        {contact.username}
                        <span>,</span>
                      </p>
                    </Zoom>
                  );
                })}
              </span>
            </div>

            <IconButton onClick={handleForwardMessageToSelectedContacts}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ForwardMessageComponent;

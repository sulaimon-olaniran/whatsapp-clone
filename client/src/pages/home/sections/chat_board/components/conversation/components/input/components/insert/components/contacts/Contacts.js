import {useState, forwardRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import {useDebounce} from "use-debounce";
import Zoom from "@mui/material/Zoom";
import {IconButton} from "@mui/material";
import {v4 as uuidv4} from "uuid";

import {SendIcon} from "../../../../../../../../../../../../icons";
import SearchInputComponent from "../../../../../../../../../../../../components/search_input/SearchInput";
import InsertContactsEachContact from "./EachContact";
import {sendNewChatMessage} from "../../../../../../../../../../../../store/actions/chat";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const InsertContactsComponent = ({
  open,
  handleClose,
  replyMessage,
  setReplyMessage,
}) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  const [searchValue] = useDebounce(searchInputValue, 500);

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const users = useSelector(state => state.app.users);
  const user = useSelector(state => state.user.user);
  const currentChat = useSelector(state => state.chat.currentChat);

  const handleSearchContact = event => {
    setSearchInputValue(event.target.value);
  };

  const handleCloseDialog = () => {
    setSelectedContacts([]);
    handleClose();
  };

  const sendMessageContactType = () => {
    const message = {
      chatId: currentChat._id,
      sender: user._id,
      receiver: currentChat?.partnerData?._id,
      type: "contact",
      isSent: false,
      isReply: replyMessage ? true : false,
      repliedTo: replyMessage?._id,
      starred: [],
      time: Date.now(),
      subId: uuidv4(),
      contacts: selectedContacts,
    };

    dispatch(sendNewChatMessage(message));

    //console.log(message);

    setReplyMessage(null);
    handleCloseDialog();
  };

  const filteredContacts = users.filter(user => {
    return user.username.toLowerCase().indexOf(searchValue) !== -1;
  });

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={`insert-contacts-component-${theme}-theme`}>
        <header className="insert-contacts-component-header-container">
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>

          <h1>Send contacts</h1>
        </header>

        <div className="insert-contacts-component-search-input-container">
          <div className="search-input-body-container">
            <SearchInputComponent
              handleChange={handleSearchContact}
              value={searchInputValue}
            />
          </div>
        </div>

        <div className="insert-contacts-component-contacts-list-container">
          <div className="contacts-list-inner-container">
            <div className="contacts-list-listed-container">
              <h1>Contacts</h1>
              {filteredContacts.map(contact => {
                return (
                  <InsertContactsEachContact
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
            className={`insert-contacts-action-container ${
              selectedContacts.length > 0 && "insert-contacts-action-active"
            }`}
          >
            <div className="selected-contacts-list-container">
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

            <IconButton onClick={sendMessageContactType}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default InsertContactsComponent;

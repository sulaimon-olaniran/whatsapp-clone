import {useState, forwardRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import CloseIcon from "@mui/icons-material/Close";
import {
  AddPersonIcon,
  NoContactsIcon,
} from "../../../../../../../../../../icons";
import {Button, IconButton} from "@mui/material";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import {useDebounce} from "use-debounce";
//

import ControlHeaderComponent from "../../../../../../../../../../components/headers/ControlsHeader";
import UsersListComponent from "../../../../../../../../../../components/users_list/UsersList";
import {
  blockContact,
  unBlockContact,
} from "../../../../../../../../../../store/actions/user";
import UserComponent from "../../../../../../../../../../components/user/User";
import SearchInputComponent from "../../../../../../../../../../components/search_input/SearchInput";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const PrivacyBlockContactsComponent = ({closePrivacy}) => {
  const [contactsDialog, setContactsDialog] = useState(false);
  const [unblockDialog, setUnblockDialog] = useState(false);
  const [unblockContact, setUnblockContact] = useState({});
  const [searchInputValue, setSearchInputValue] = useState("");

  const [searchValue] = useDebounce(searchInputValue, 500);

  const theme = useSelector(state => state.app.theme);
  const users = useSelector(state => state.app.users);
  const privacy = useSelector(state => state.user.user.privacy);

  const {blocked_contacts} = privacy;

  const blockedContacts = users.filter(user =>
    blocked_contacts.includes(user._id)
  );

  // console.log(blocked_contacts);

  const dispatch = useDispatch();

  const handleOpenContactDialogs = () => {
    setContactsDialog(true);
  };

  const handleCloseContactsDialogs = () => {
    setContactsDialog(false);
  };

  const handleOpenUnblockDialog = contact => {
    setUnblockDialog(true);
    setUnblockContact(contact);
  };

  const handleCloseUnblockDialog = () => {
    setUnblockDialog(false);
  };

  const handleBlockContact = contact => {
    dispatch(blockContact(contact._id));
    handleCloseContactsDialogs();
  };

  const handleUnblockContact = () => {
    dispatch(unBlockContact(unblockContact._id));
    handleCloseUnblockDialog();
  };

  const handleSearchContactInputChange = event => {
    setSearchInputValue(event.target.value);
  };

  const filteredContacts = users.filter(user => {
    return user.username.toLowerCase().indexOf(searchValue) !== -1;
  });

  return (
    <div className={`privacy-block-contact-component-${theme}-theme`}>
      <ControlHeaderComponent title="Blocked Contacts" action={closePrivacy} />

      <div
        className="privacy-block-contact-component-dialog-button"
        onClick={handleOpenContactDialogs}
      >
        <AddPersonIcon />
        <p>Add blocked contact</p>
      </div>

      {blockedContacts.length > 0 ? (
        <div className="privacy-block-contact-blocked-contacts-list">
          {blockedContacts.map(contact => {
            return (
              <UserComponent
                key={contact._id}
                user={contact}
                icon={<CloseIcon />}
                userAction={handleOpenUnblockDialog}
                type="block"
              />
            );
          })}
        </div>
      ) : (
        <div className="privacy-block-contact-no-contacts">
          <div>
            <NoContactsIcon />
          </div>

          <p>No blocked contacts yet</p>
        </div>
      )}

      <div className="privacy-block-contact-footer">
        <p>
          Blocked contacts will no longer be able to call you or send you
          messages
        </p>
      </div>

      <Dialog
        open={contactsDialog}
        TransitionComponent={Transition}
        //keepMounted
        onClose={handleCloseContactsDialogs}
        aria-describedby="alert-dialog-slide-description"
      >
        <div
          className={`privacy-block-contact-select-contact-dialog-${theme}-theme`}
        >
          <div className="contact-select-contact-header">
            <div className="contact-select-header-actions-container">
              <IconButton onClick={handleCloseContactsDialogs}>
                <CloseOutlined />
              </IconButton>
              <p>Add blocked contact</p>
            </div>

            <div className="contact-select-header-search-input">
              <SearchInputComponent
                handleChange={handleSearchContactInputChange}
                value={searchInputValue}
                id="blocked_search-contact"
              />
            </div>
          </div>

          <div className="contact-select-contact-body">
            <UsersListComponent
              contacts={filteredContacts}
              action={handleBlockContact}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={unblockDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseUnblockDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className={`privacy-unblock-contact-dialog-${theme}-theme`}>
          <div className="unblock-contact-dialog-header">
            <p>Unblock {unblockContact?.username}?</p>
          </div>
          <div className="unblock-contaction-buttons-container">
            <Button variant="outlined" onClick={handleCloseUnblockDialog}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleUnblockContact}>
              Unblock
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PrivacyBlockContactsComponent;

import {forwardRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import {Button} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {deleteChat} from "../../../../../../../../../../store/actions/chat";
import {
  blockContact,
  unBlockContact,
} from "../../../../../../../../../../store/actions/user";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const label = {inputProps: {"aria-label": "Checkbox demo"}};

const ConversationContactActionsDialog = ({open, handleClose, actionType}) => {
  const theme = useSelector(state => state.app.theme);

  const chat = useSelector(state => state.chat.currentChat);
  const user = useSelector(state => state.user.user);

  const contactIsBlocked = user?.privacy?.blocked_contacts?.includes(
    chat?.partner
  );

  const dispatch = useDispatch();

  const handleDeleteChat = () => {
    dispatch(deleteChat(chat._id));
    handleClose();
  };

  const handleBlockContact = () => {
    dispatch(blockContact(chat.partner));
    handleClose();
  };

  const handleUnblockContact = () => {
    dispatch(unBlockContact(chat.partner));
    handleClose();
  };

  const handleReportContact = () => {
    handleClose();
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={`conversation-contact-actions-dialog-${theme}-theme`}>
        {actionType === "block" && (
          <div className="block-contact-container">
            <p>
              Block <span>+2349035793269</span> ? Blocked contacts will no
              longer be able to call you or send you messages.
            </p>
          </div>
        )}

        {actionType === "report" && (
          <div className="report-contact-container">
            <div className="report-contact-header-container">
              <h1>Report this contact to O-S WhatsApp?</h1>
              <div className="header-container-checkbox-action">
                <Checkbox {...label} defaultChecked color="default" />
                <p>Block contact and clear chat</p>
              </div>
            </div>

            <div className="report-contact-body-container">
              <p>
                The last 5 messages from this contact will be forwarded to
                WhatsApp. If you block this contact and clear the chat, it will
                be deleted from this device only.
              </p>

              <span>This contact will not be notified</span>
            </div>
          </div>
        )}

        {actionType === "delete" && (
          <div className="delete-chat-container">
            <h1>Delete this chat?</h1>
            <p>Messages will be removed from this device only.</p>
          </div>
        )}

        <div className="conversation-contact-actions-dialog-buttons-container">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>

          {actionType === "block" &&
            (contactIsBlocked ? (
              <Button variant="contained" onClick={handleUnblockContact}>
                Unblock
              </Button>
            ) : (
              <Button variant="contained" onClick={handleBlockContact}>
                Block
              </Button>
            ))}

          {actionType === "report" && (
            <Button variant="contained" onClick={handleReportContact}>
              Report
            </Button>
          )}

          {actionType === "delete" && (
            <Button variant="contained" onClick={handleDeleteChat}>
              Delete chat
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ConversationContactActionsDialog;

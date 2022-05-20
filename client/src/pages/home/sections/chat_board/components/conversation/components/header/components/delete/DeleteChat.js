import {forwardRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import {Button} from "@mui/material";

import {deleteChat} from "../../../../../../../../../../store/actions/chat";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const DeleteChatDialog = ({open, handleClose, chat}) => {
  const theme = useSelector(state => state.app.theme);

  const dispatch = useDispatch();

  const handleDeleteChat = () => {
    dispatch(deleteChat(chat._id));
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={`delete-chat-dialog-${theme}-theme`}>
        <h1>Delete this chat?</h1>

        <div className="delete-chat-dialog-body-container">
          <p>Messages will be removed from this device only.</p>
        </div>

        <div className="delete-chat-dialog-footer-container">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDeleteChat}>
            Delete chat
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteChatDialog;

import {forwardRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import {Button} from "@mui/material";
import axios from "axios";

import {messagApi} from "../../../../../../../../../../api";
import {CLEAR_CHAT_MESSAGES_SUCCESSFUL} from "../../../../../../../../../../store/types/chat";
import {OPEN_SNACKBAR} from "../../../../../../../../../../store/types/universal";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const ClearMessagesDialog = ({open, handleClose, messages}) => {
  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const token = useSelector(state => state.user.token);

  const handleClearMessages = () => {
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    // messages.map(message => {
    //   const messageId = message._id;
    //   return axios.patch(`${messagApi}/delete/for/me`, {messageId}, config);
    // });

    dispatch({
      type: CLEAR_CHAT_MESSAGES_SUCCESSFUL,
      payload: messages[0].chatId,
    });

    dispatch({
      type: OPEN_SNACKBAR,
      payload: {
        message: "Chat cleared from this device",
        undoAction: null,
      },
    });

    handleClose();

    //axios.delete(`${messagApi}/clear`, {messageId}, config);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      //onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={`clear-messages-dialog-${theme}-theme`}>
        <h1>Clear this chat?</h1>

        <div className="clear-messages-dialog-body-container">
          <p>Messages will be removed from this device only.</p>
        </div>

        <div className="clear-messages-dialog-footer-container">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleClearMessages}>
            Clear chat
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ClearMessagesDialog;

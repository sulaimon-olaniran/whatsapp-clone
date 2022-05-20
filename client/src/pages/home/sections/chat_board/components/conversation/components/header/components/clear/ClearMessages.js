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

    //DELETE ALL MESSAGES FOR USER ALONE AS CLEARING MESSAGE ONLY REMOVES MESSAGES FROM USER'S SIDE
    //DUE TO SHARING ONE MESSAGE DOCUMENT BETWEEN THE TWO INTERLOCUTORS, CAN'T SIMPLE CLEAR THE MESSAGE FROM DATABASE, SO DELETE FOR USER REQUESTING IT TO BE CLEARED AND LEAVE IT FOR OTHER USER
    messages.map(message => {
      const messageId = message._id;
      return axios.patch(`${messagApi}/delete/for/me`, {messageId}, config);
    });

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
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
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

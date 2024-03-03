import {forwardRef, useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import {Button} from "@mui/material";
import moment from "moment";
import axios from "axios";

import {messagApi} from "../../../../api";
import {DELETE_MESSAGE_SUCCESSFUL} from "../../../../store/types/chat";
import {OPEN_SNACKBAR} from "../../../../store/types/universal";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const DeleteMessageDialogComponent = ({open, handleClose, message}) => {
  const [pastTime, setPastTime] = useState(false); // DECIDES IF MESSAGE CAN STILL BE DELETED FOR EVERYONE

  const dispatch = useDispatch();

  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const theme = useSelector(state => state.app.theme);

  const isDeleted = message?.delete_everyone;

  const config = {
    headers: {
      "content-type": "application/json",
      "oswc-auth-token": token,
    },
  };

  const messageId = message._id;

  const handleDeleteMessageForEveryone = () => {
    axios
      .patch(`${messagApi}/delete/for/everyone`, {messageId}, config)
      .then(() => {
        handleClose();
        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: "1 message deleted",
            undoAction: null,
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDeleteMessageForMe = () => {
    axios
      .patch(`${messagApi}/delete/for/me`, {messageId}, config)
      .then(() => {
        dispatch({
          type: DELETE_MESSAGE_SUCCESSFUL,
          payload: message,
        });
        handleClose();
        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: "1 message deleted",
            undoAction: null,
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    //30 MINUTES FROM CURRENT
    const halfAnHourAgo = moment().subtract(30, "minutes").toDate().getTime();
    //TIME THE MESSAGE WAS SENT
    const messageTime = moment(message.time).toDate().getTime();

    //CHECK IF TIME MESSAGE WAS SENT IS MORE THAN 30MINS AGO
    if (halfAnHourAgo > messageTime) {
      setPastTime(true);
    } else {
      setPastTime(false);
    }
  }, [message]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={`delete-message-dialog-component-${theme}-theme`}>
        <header className="delete-message-dialog-component-header">
          <h1>Delete Message ?</h1>
        </header>

        <div className="delete-message-dialog-body-container">
          {!pastTime && !isDeleted && message.sender === user._id ? (
            <div className="delete-message-for-everyone">
              <Button
                variant="outlined"
                onClick={() => handleDeleteMessageForEveryone()}
              >
                Delete for everyone
              </Button>

              <Button
                variant="outlined"
                onClick={() => handleDeleteMessageForMe()}
              >
                Delete for me
              </Button>

              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="delete-message-for-me">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={() => handleDeleteMessageForMe()}
              >
                Delete for me
              </Button>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteMessageDialogComponent;

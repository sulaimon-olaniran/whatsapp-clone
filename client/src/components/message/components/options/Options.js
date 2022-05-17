import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {IconButton, Button} from "@mui/material";
import Popover from "@mui/material/Popover";
import axios from "axios";

import {messagApi} from "../../../../api/";
import DeleteMessageDialogComponent from "../delete_message/DeleteMessage";
import {editMessage} from "../../../../store/actions/chat";
import {
  ADD_STARRED_MESSAGE,
  REMOVE_STARRED_MESSAGE,
} from "../../../../store/types/chat";
import {OPEN_SNACKBAR} from "../../../../store/types/universal";

const MessageOptionsComponent = ({message, selectMessage, setReplyMessage}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(false);

  const {sender, type} = message;

  const isDeleted = message?.delete_everyone;

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);

  const handleShowMenuOptions = event => {
    setMenuAnchor(event.currentTarget);
  };

  const handleHideMenuOptions = () => {
    setMenuAnchor(null);
  };

  const handleOpenDeleteMessageDialog = () => {
    setDeleteMessage(true);
  };

  const handleCloseDeleteMessageDialog = () => {
    setDeleteMessage(false);
  };

  const config = {
    headers: {
      "content-type": "application/json",
      "oswc-auth-token": token,
    },
  };
  const messageId = message._id;

  const handleStarMessage = () => {
    axios
      .patch(`${messagApi}/star`, {messageId}, config)
      .then(res => {
        //console.log(res.data);
        dispatch(editMessage(res.data));
        dispatch({
          type: ADD_STARRED_MESSAGE,
          payload: res.data,
        });

        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: "1 message starred",
            undoAction: () => {
              axios
                .patch(`${messagApi}/unstar`, {messageId}, config)
                .then(res => {
                  dispatch(editMessage(res.data));
                  dispatch({
                    type: REMOVE_STARRED_MESSAGE,
                    payload: res.data,
                  });
                });
            },
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleUnstarMessage = () => {
    axios
      .patch(`${messagApi}/unstar`, {messageId}, config)
      .then(res => {
        dispatch(editMessage(res.data));
        dispatch({
          type: REMOVE_STARRED_MESSAGE,
          payload: res.data,
        });

        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: "1 message unstarred",
            undoAction: () => {
              axios
                .patch(`${messagApi}/star`, {messageId}, config)
                .then(res => {
                  dispatch(editMessage(res.data));
                  dispatch({
                    type: ADD_STARRED_MESSAGE,
                    payload: res.data,
                  });
                });
            },
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const options = [
    // {
    //   title: "Message Info",
    //   action: () => console.log("hello"),
    //   style: (isDeleted || !sender) && {display: "none"},
    // },
    {
      title: "Reply",
      action: () => setReplyMessage(message),
      style: isDeleted && {display: "none"},
    },
    {
      title: "Download",
      action: () => console.log("hello"),
      style: (isDeleted || type !== "image") && {display: "none"},
    },
    {
      title: "Forward Message",
      action: () => selectMessage(message),
      style: isDeleted && {display: "none"},
    },
    {
      title: message?.starred?.includes(user._id)
        ? "Unstar Message"
        : "Star message",
      action: message?.starred?.includes(user._id)
        ? handleUnstarMessage
        : handleStarMessage,
      style: isDeleted && {display: "none"},
    },
    {
      title: "Delete Message",
      action: handleOpenDeleteMessageDialog,
      //style: isDeleted && {display: "none"},
    },
  ];
  return (
    <div className={`message-options-component-${theme}-theme`}>
      <DeleteMessageDialogComponent
        open={deleteMessage}
        handleClose={handleCloseDeleteMessageDialog}
        message={message}
      />

      <IconButton onClick={handleShowMenuOptions}>
        <KeyboardArrowDownIcon />
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
          horizontal: "center",
        }}
      >
        <div className="message-options-menu-options-container">
          {options.map(option => {
            const {title, style} = option;
            return (
              <Button
                key={title}
                onClick={() => {
                  option.action();
                  handleHideMenuOptions();
                }}
                style={style ? style : {display: "flex"}}
              >
                <p>{title}</p>
              </Button>
            );
          })}
        </div>
      </Popover>
    </div>
  );
};

export default MessageOptionsComponent;

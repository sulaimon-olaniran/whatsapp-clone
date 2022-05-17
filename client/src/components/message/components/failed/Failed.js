import {Fragment, useState, forwardRef} from "react";
import {Button} from "@mui/material";
import Zoom from "@mui/material/Zoom";
import {useSelector, useDispatch} from "react-redux";
import {styled} from "@mui/material/styles";
import Tooltip, {tooltipClasses} from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";

import {MessageFailedIcon} from "../../../../icons";
import {resendChatMessage} from "../../../../store/actions/chat";

const BootstrapTooltipDarkTheme = styled(({className, ...props}) => (
  <Tooltip {...props} classes={{popper: className}} />
))(({theme}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    height: "30px",
    color: "black",
    display: "flex",
    alignItems: "center",
    justifyContents: "center",
    fontSize: "13px",
    borderRadius: "15px",
    padding: "15px",
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const MessageFailedComponent = ({message}) => {
  // console.log(message);
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useSelector(state => state.app.theme);

  const dispatch = useDispatch();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResendMessage = () => {
    dispatch(resendChatMessage(message));
    handleCloseDialog();
  };

  return (
    <Fragment>
      {" "}
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className={`resend-message-dialog-component-${theme}-theme`}>
          <header className="resend-message-dialog-component-header">
            <h1>Could not deliver message</h1>
            <div className="resend-message-dialog-body-container">
              <Button variant="outlined" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleResendMessage}>
                Try again
              </Button>
            </div>
          </header>
        </div>
      </Dialog>
      <BootstrapTooltipDarkTheme
        title="Could not deliver message"
        placement="left"
      >
        <div
          className={`message-failed-component-${theme}-theme`}
          onClick={handleOpenDialog}
        >
          <MessageFailedIcon />
        </div>
      </BootstrapTooltipDarkTheme>
    </Fragment>
  );
};

export default MessageFailedComponent;

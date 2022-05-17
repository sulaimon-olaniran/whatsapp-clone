import {useState, forwardRef} from "react";
import {useSelector} from "react-redux";
import moment from "moment";
import Zoom from "@mui/material/Zoom";
import Dialog from "@mui/material/Dialog";

import {PadlockIcon} from "../../../../../../../../../icons";
import {Button} from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const NoMessagesComponent = ({time}) => {
  const [showDialog, setShowDialog] = useState(false);

  const theme = useSelector(state => state.app.theme);

  const handleShowDialog = () => {
    setShowDialog(true);
  };

  const handleHideDialog = () => {
    setShowDialog(false);
  };

  const messagesDay = moment(time);
  const currentDay = moment(new Date());
  const prevDay = moment().subtract(1, "day");
  const weekDifference = currentDay.diff(messagesDay, "weeks");
  const isCurrentDay = messagesDay.isSame(currentDay, "day");
  const isPrevDay = messagesDay.isSame(prevDay, "day");

  return (
    <div className={`no-message-component-${theme}-theme`}>
      <Dialog
        open={showDialog}
        TransitionComponent={Transition}
        onClose={handleHideDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className={`no-message-component-dialog-container-${theme}-theme`}>
          <section className="no-message-dialog-header-section">
            <h1>
              WhatsApp secures your conversations with end-to-end encryption.
            </h1>
          </section>
          <section className="no-message-dialog-body-section">
            <p>
              Your messages stay between you and the people and businesses you
              choose. Not even WhatsApp can read or listen to them.{" "}
              <span>Learn more</span>
            </p>
          </section>
          <section className="no-message-dialog-footer-section">
            <Button onClick={handleHideDialog} variant="contained">
              OK
            </Button>
          </section>
        </div>
      </Dialog>
      <div className="no-message-component-time-container">
        {weekDifference > 0 ? (
          <p>{moment(time).format("L")}</p>
        ) : (
          <p>
            {isCurrentDay
              ? "Today"
              : isPrevDay
              ? "Yesterday"
              : moment(time).format("dddd")}
          </p>
        )}
      </div>
      <div
        className="no-message-component-text-container"
        onClick={handleShowDialog}
      >
        <p>
          <PadlockIcon />
          Messages are end-to-end encrypted. No one outside of this chat, not
          even WhatsApp, can read or listen to them. Click to learn more.
        </p>
      </div>
    </div>
  );
};

export default NoMessagesComponent;

import {useState} from "react";
import {useSelector} from "react-redux";
import {forwardRef} from "react";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {Button, FormControl} from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const MuteNotificationsDialog = ({
  open,
  handleClose,
  muted,
  muteNotifications,
  unmuteNotifications,
  setExpiringTime,
}) => {
  const prevMuteType = localStorage.getItem("mute_type");

  const [muteType, setMuteType] = useState(
    prevMuteType ? prevMuteType : "8 hours"
  );

  const theme = useSelector(state => state.app.theme);

  const handleMuteNotifications = () => {
    muteNotifications();
    handleClose();

    localStorage.setItem("mute_type", muteType);
    localStorage.removeItem("mute_expires");

    if (muteType === "always") return;

    const now = new Date();
    const time = now.getTime();
    const duration = muteType === "8 hours" ? 28800 : 604800;
    const expireTime = time + 1000 * duration;

    localStorage.setItem("mute_expires", expireTime);

    setExpiringTime(expireTime);
  };

  const handleUnmuteNotifications = () => {
    localStorage.setItem("mute_type", "8 hours");
    localStorage.removeItem("mute_expires");
    setExpiringTime(null);
    unmuteNotifications();
    handleClose();
  };

  const handleRadioInputChange = event => {
    setMuteType(event.target.value);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={`mute-notifications-dialog-${theme}-theme`}>
        {muted === false ? (
          <div className="mute-notification-unmuted-container">
            <h1>Turn off all desktop notificatins for:</h1>

            <div className="unmuted-body-container">
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={muteType}
                  onChange={handleRadioInputChange}
                >
                  <FormControlLabel
                    value="8 hours"
                    control={<Radio size="small" />}
                    label="8 Hours"
                  />
                  <FormControlLabel
                    value="1 week"
                    control={<Radio size="small" />}
                    label="1 Week"
                  />
                  <FormControlLabel
                    value="always"
                    control={<Radio size="small" />}
                    label="Always"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="unmuted-footer-container">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>

              <Button variant="contained" onClick={handleMuteNotifications}>
                Mute notifications
              </Button>
            </div>
          </div>
        ) : (
          <div className="mute-notification-muted-container">
            <h1>Enable sounds and notifications</h1>
            <div className="muted-footer-container">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>

              <Button variant="contained" onClick={handleUnmuteNotifications}>
                Unmute
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default MuteNotificationsDialog;

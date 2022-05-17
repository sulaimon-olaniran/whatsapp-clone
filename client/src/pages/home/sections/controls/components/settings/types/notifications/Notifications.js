import {useState, useEffect, useMemo} from "react";
import {useSelector} from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import moment from "moment";

import ControlHeaderComponent from "../../../../../../../../components/headers/ControlsHeader";
import MuteNotificationDialog from "./mute/Mute";

const NotificationsSettings = ({closeSetting}) => {
  const prevSounds = localStorage.getItem("sounds");
  const prevAlerts = localStorage.getItem("alerts");
  const prevPreviews = localStorage.getItem("previews");
  const prevMuted = localStorage.getItem("muted");
  const muteType = localStorage.getItem("mute_type");
  //const prevExpiringTime = localStorage.getItem("mute_expires");

  const [sounds, setSounds] = useState(
    prevSounds ? JSON.parse(prevSounds) : true
  );
  const [alerts, setAlerts] = useState(
    prevAlerts ? JSON.parse(prevAlerts) : true
  );
  const [previews, setPreviews] = useState(
    prevPreviews ? JSON.parse(prevPreviews) : false
  );
  const [muted, setMuted] = useState(prevMuted ? JSON.parse(prevMuted) : false);

  const [muteDialog, setMuteDialog] = useState(false);

  const [expiringTime, setExpiringTime] = useState(
    localStorage.getItem("mute_expires")
  );

  const theme = useSelector(state => state.app.theme);

  const handleToggleNotification = (setState, notification) => {
    const getPrevNotifcation = localStorage.getItem(notification);

    const prevNotification = getPrevNotifcation
      ? JSON.parse(getPrevNotifcation)
      : notification === "sounds" || notification === "alerts"
      ? true
      : false;

    localStorage.setItem(notification, !prevNotification);

    setState(prev => !prev);
  };

  const handleMuteAllNotifications = () => {
    localStorage.setItem("muted", "true");
    setMuted(true);
  };

  const handleUnmuteAllNotifications = () => {
    localStorage.setItem("muted", "false");
    setMuted(false);
  };

  const handleShowMuteDialog = () => {
    setMuteDialog(true);
  };

  const handleHideMuteDilaog = () => {
    setMuteDialog(false);
  };

  const currentTime = useMemo(() => new Date(), []);

  useEffect(() => {
    if (parseInt(expiringTime) < Date.now()) {
      setExpiringTime(null);
      handleUnmuteAllNotifications();
      localStorage.removeItem("mute_type");
      localStorage.removeItem("mute_expires");
    }
  }, [expiringTime, currentTime]);

  return (
    <div className={`notification-settings-${theme}-theme`}>
      <MuteNotificationDialog
        open={muteDialog}
        handleClose={handleHideMuteDilaog}
        muted={muted}
        muteNotifications={handleMuteAllNotifications}
        unmuteNotifications={handleUnmuteAllNotifications}
        setExpiringTime={setExpiringTime}
      />
      <ControlHeaderComponent title="Notifications" action={closeSetting} />

      <div className="notification-settings-body">
        <div
          className={`each-notification-settings-option ${
            sounds && "is-checked"
          } ${muted && "is-disabled"}`}
          onClick={() => handleToggleNotification(setSounds, "sounds")}
        >
          <Checkbox checked={sounds} />
          <div>
            <p>Sounds</p>
          </div>
        </div>

        <div
          className={`each-notification-settings-option ${
            alerts && "is-checked"
          } ${muted && "is-disabled"}`}
          onClick={() => handleToggleNotification(setAlerts, "alerts")}
        >
          <Checkbox checked={alerts} />
          <div>
            <p>Desktop Alerts</p>
          </div>
        </div>

        <div
          className={`each-notification-settings-option ${
            previews && "is-checked"
          } ${(!alerts || muted) && "is-disabled"}`}
          onClick={() => handleToggleNotification(setPreviews, "previews")}
        >
          <Checkbox checked={previews} />
          <div>
            <p>Show Previews</p>
            <span>Display message text in desktop alerts</span>
          </div>
        </div>

        <div
          className={`each-notification-settings-option ${
            muted && "is-checked"
          }`}
          onClick={handleShowMuteDialog}
        >
          <Checkbox checked={muted} />
          <div>
            <p>Turn off all desktop notifications</p>
            {muted && expiringTime ? (
              muteType === "8 hours" ? (
                <span>
                  Until {moment(currentTime.setTime(expiringTime)).calendar()}
                </span>
              ) : (
                <span>
                  Until{" "}
                  {moment(currentTime.setTime(expiringTime)).format("LLL")}
                </span>
              )
            ) : (
              muteType === "always" && <span>Always</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettings;

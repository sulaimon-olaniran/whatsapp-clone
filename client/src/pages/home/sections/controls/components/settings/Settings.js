import {useState, useRef} from "react";
import {Avatar, IconButton} from "@mui/material";
import {useSelector} from "react-redux";
import Slide from "@mui/material/Slide";

import {
  NotificationIcon,
  PrivacyIcon,
  SecurityIcon,
  ThemeIcon,
  WallpaperIcon,
  HelpIcon,
  KeyboardIcon,
} from "../../../../../../icons";
import ControlHeaderComponent from "../../../../../../components/headers/ControlsHeader";
import NotificationsSettings from "./types/notifications/Notifications";
import PrivacySettings from "./types/privacy/Privacy";
import ThemeSettings from "./types/theme/Theme";
import WallPaperSettings from "./types/wallpaper/Wallpaper";

const ControlsSettingsComponent = ({
  deactiveControl,
  handleSetActiveControl,
}) => {
  const [activeSettings, setActiveSettings] = useState("");
  const [showActiveSettings, setShowActivieSettings] = useState(false);
  const [themeDialog, setThemeDialog] = useState(false);

  const containerRef = useRef(null);

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

  const handleSetActiveSettings = type => {
    setActiveSettings(type);
    setShowActivieSettings(true);
  };

  const handleCloseActiveSettings = () => {
    setActiveSettings("");
    setShowActivieSettings(false);
  };

  const handleOpenThemeSettingsDialog = () => {
    setThemeDialog(true);
  };

  const handleCloseThemeSettingsDialog = () => {
    setThemeDialog(false);
  };

  const settings = [
    {
      title: "Notifications",
      icon: <NotificationIcon />,
      action: handleSetActiveSettings,
    },
    {
      title: "Privacy",
      icon: <PrivacyIcon />,
      action: handleSetActiveSettings,
    },
    {
      title: "Securtiy",
      icon: <SecurityIcon />,
      action: () => console.log("settings"),
    },
    {
      title: "Theme",
      icon: <ThemeIcon />,
      action: handleOpenThemeSettingsDialog,
    },
    {
      title: "Chat wallpaper",
      icon: <WallpaperIcon />,
      action: handleSetActiveSettings,
    },
    {
      title: "Keyboard shortcuts",
      icon: <KeyboardIcon />,
      action: () => console.log("settings"),
    },
    {
      title: "Help",
      icon: <HelpIcon />,
      action: () => console.log("settings"),
    },
  ];

  return (
    <div
      className={`controls-settings-component-${theme}-theme-container`}
      ref={containerRef}
    >
      <ControlHeaderComponent title={"Settings"} action={deactiveControl} />

      <div className="controls-settings-component-body-container">
        <div
          className="settings-profile-settings-container"
          onClick={() => handleSetActiveControl("profile")}
        >
          <Avatar
            src={user.profile_photo}
            style={{width: "80px", height: "80px"}}
          />
          <div className="settings-user-profile-details">
            <p>{user.username}</p>
            <small>{user.about}</small>
          </div>
        </div>

        {settings.map(setting => (
          <div
            className="each-setting-container"
            key={setting.title}
            onClick={() => setting.action(setting.title)}
          >
            <IconButton>{setting.icon}</IconButton>
            <div>
              <p>{setting.title}</p>
            </div>
          </div>
        ))}
      </div>

      <Slide
        direction="left"
        in={showActiveSettings}
        mountOnEnter
        unmountOnExit
        container={containerRef.current}
      >
        <div className="settings-setting-display-container">
          {activeSettings.toLowerCase() === "notifications" && (
            <NotificationsSettings closeSetting={handleCloseActiveSettings} />
          )}

          {activeSettings.toLowerCase() === "privacy" && (
            <PrivacySettings closeSetting={handleCloseActiveSettings} />
          )}

          {activeSettings.toLowerCase() === "chat wallpaper" && (
            <WallPaperSettings closeSetting={handleCloseActiveSettings} />
          )}
        </div>
      </Slide>

      {themeDialog && (
        <ThemeSettings
          open={themeDialog}
          handleClose={handleCloseThemeSettingsDialog}
        />
      )}
    </div>
  );
};

export default ControlsSettingsComponent;

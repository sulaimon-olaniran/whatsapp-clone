import {Fragment, useState} from "react";
import {Avatar, Button, IconButton, Tooltip} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import Popover from "@mui/material/Popover";

import {ChatIcon, MenuIcon, StatusIcon} from "../../../../../../icons";

import {logoutUser} from "../../../../../../store/actions/user";

const ControlsHeaderComponent = ({activateControl}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

  const dispatch = useDispatch();

  const handleShowMenuOptions = event => {
    setMenuAnchor(event.currentTarget);
  };

  const handleHideMenuOptions = () => {
    setMenuAnchor(null);
  };

  const menuOptions = [
    {
      option: "New group",
      action: () => activateControl("new group"),
    },
    {
      option: "Archived",
      action: () => activateControl("archived chat"),
    },
    {
      option: "Starred message",
      action: () => activateControl("starred messages"),
    },
    {
      option: "Settings",
      action: () => activateControl("settings"),
    },
    {
      option: "Logout",
      action: () => dispatch(logoutUser()),
    },
  ];

  return (
    <header className={`controls-header-component-${theme}-theme`}>
      <Avatar
        src={user?.profile_photo}
        onClick={() => activateControl("profile")}
      />

      <div className="controls-header-button-actions-container">
        <Tooltip placement="bottom" title="Status" enterDelay={1000}>
          <IconButton size="medium">
            <StatusIcon />
          </IconButton>
        </Tooltip>

        <Tooltip placement="bottom" title="New chat" enterDelay={1000}>
          <IconButton size="medium" onClick={() => activateControl("new chat")}>
            <ChatIcon />
          </IconButton>
        </Tooltip>

        <Fragment>
          <Tooltip placement="bottom" title="Menu" enterDelay={1000}>
            <IconButton
              size="medium"
              onClick={handleShowMenuOptions}
              style={{
                backgroundColor: `${
                  Boolean(menuAnchor) ? "#ffffff1a" : "inherit"
                }`,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Popover
            //id={id}
            open={Boolean(menuAnchor)}
            anchorEl={menuAnchor}
            onClose={handleHideMenuOptions}
            anchorOrigin={{
              vertical: 50,
              horizontal: -170,
            }}
          >
            <div
              className={`controls-header-menu-options-container-${theme}-theme`}
            >
              {menuOptions.map(option => {
                return (
                  <Button
                    key={option.option}
                    onClick={() => {
                      option.action();
                      handleHideMenuOptions();
                    }}
                  >
                    <p>{option.option}</p>
                  </Button>
                );
              })}
            </div>
          </Popover>
        </Fragment>
      </div>
    </header>
  );
};

export default ControlsHeaderComponent;

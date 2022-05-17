import {forwardRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import {Button} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {FormControl} from "@mui/material";

import {
  TOGGLE_APP_THEME,
  SET_CHAT_WALLPAPER,
} from "../../../../../../../../store/types/app";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const ThemeSettings = ({open, handleClose}) => {
  const theme = useSelector(state => state.app.theme);
  const themeValue = useSelector(state => state.app.themeType);

  const [themeType, setThemeType] = useState(themeValue);

  const dispatch = useDispatch();

  const handleDefaultThemeType = () => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    const themeType = darkThemeMq.matches ? "dark" : "light";

    dispatch({
      type: TOGGLE_APP_THEME,
      payload: "default",
    });

    if (themeType === "light") {
      dispatch({
        type: SET_CHAT_WALLPAPER,
        payload: "#efeae2",
      });
    } else {
      dispatch({
        type: SET_CHAT_WALLPAPER,
        payload: "#0b141a",
      });
    }
  };

  const handleRadioInputChange = event => {
    setThemeType(event.target.value);
  };

  const handleSetTheme = () => {
    if (themeType === "default") {
      handleDefaultThemeType();
      handleClose();
    } else {
      dispatch({
        type: TOGGLE_APP_THEME,
        payload: themeType,
      });

      if (themeType === "light") {
        dispatch({
          type: SET_CHAT_WALLPAPER,
          payload: "#efeae2",
        });
      } else {
        dispatch({
          type: SET_CHAT_WALLPAPER,
          payload: "#0b141a",
        });
      }
      handleClose();
    }
  };

  //const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={`theme-settings-${theme}-theme-container`}>
        <div className="theme-settings-header-container">
          <p>Choose theme</p>
        </div>

        <div className="theme-settings-body-container">
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={themeType}
              onChange={handleRadioInputChange}
            >
              <FormControlLabel
                value="light"
                control={<Radio size="small" />}
                label="Light"
              />
              <FormControlLabel
                value="dark"
                control={<Radio size="small" />}
                label="Dark"
              />
              <FormControlLabel
                value="default"
                control={<Radio size="small" />}
                label="System default"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="theme-settings-footer-container">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSetTheme}>
            OK
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ThemeSettings;

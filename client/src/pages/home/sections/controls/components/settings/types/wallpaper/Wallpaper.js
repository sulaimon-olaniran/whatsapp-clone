import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";

import dark_wallpapers from "../../../../../../../../jsons/dark_wallpapers.json";
import light_wallpapers from "../../../../../../../../jsons/light_wallpapers.json";
import ControlHeaderComponent from "../../../../../../../../components/headers/ControlsHeader";
import {
  SET_CHAT_WALLPAPER,
  TOGGLE_CHAT_DOODLES,
} from "../../../../../../../../store/types/app";
import Checkbox from "@mui/material/Checkbox";

const WallPaperSettings = ({closeSetting}) => {
  const theme = useSelector(state => state.app.theme);
  const doodles = useSelector(state => state.app.doodles);
  const currentWallpaper = useSelector(state => state.app.wallpaper);

  const dispatch = useDispatch();

  const handleSetWallpaper = data => {
    dispatch({
      type: SET_CHAT_WALLPAPER,
      payload: data,
    });
  };

  const handleShowDoodles = () => {
    dispatch({
      type: TOGGLE_CHAT_DOODLES,
    });
  };

  const wallpapers = theme === "dark" ? dark_wallpapers : light_wallpapers;

  return (
    <div className={`wallpaper-settings-${theme}-theme-container`}>
      <ControlHeaderComponent
        action={closeSetting}
        title="Set Chat Wallpaper"
      />

      <div className="wallpaper-settings-body-container">
        <div className="wallpaper-doodle-checkbox-container">
          <Checkbox checked={doodles} onClick={handleShowDoodles} />
          <p>Add WhatSapp Doodles</p>
        </div>

        <div className="wallpapers-list-container">
          {wallpapers.map((wallpaper, index) => {
            return (
              <div
                key={wallpaper}
                className={`each-wallpaper-container ${
                  currentWallpaper === wallpaper && "default"
                }`}
                style={{
                  background: `${wallpaper}`,
                }}
                onClick={() => handleSetWallpaper(wallpaper)}
              >
                {index === 0 && <p>Default</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WallPaperSettings;

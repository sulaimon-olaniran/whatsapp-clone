import {
  VIEW_PROFILE_PHOTO,
  CLOSE_PROFILE_PHOTO,
  GET_APP_USERS,
  GET_APP_USERS_SUCCESSFUL,
  GET_APP_USERS_FAILED,
} from "../types/app";
import axios from "axios";

import {userApi} from "../../api";

export const viewProfilePhoto = payload => {
  return dispatch => {
    dispatch({
      type: VIEW_PROFILE_PHOTO,
      payload,
    });
  };
};

export const closeProfilePhoto = () => {
  return dispatch => {
    dispatch({
      type: CLOSE_PROFILE_PHOTO,
    });
  };
};

export const getAppUsers = () => {
  return (dispatch, getState) => {
    dispatch({
      type: GET_APP_USERS,
    });

    const token = getState().user.token;
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    axios
      .get(`${userApi}/fetch/all`, config)
      .then(res => {
        dispatch({
          type: GET_APP_USERS_SUCCESSFUL,
          payload: res.data,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_APP_USERS_FAILED,
          payload: error.response.data.message,
        });
      });
  };
};

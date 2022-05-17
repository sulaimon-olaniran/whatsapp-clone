import axios from "axios";

import {CONTACT_IS_UPDATED} from "../types/universal";
import {userApi} from "../../api";

export const contactIsUpated = id => {
  return (dispatch, getState) => {
    const token = getState().user.token;
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    axios.get(`${userApi}/fetch/${id}`, config).then(res => {
      dispatch({
        type: CONTACT_IS_UPDATED,
        payload: res.data,
      });
    });
  };
};

export const openToast = () => {
  return (dispatch, getState) => {
    dispatch({});
  };
};

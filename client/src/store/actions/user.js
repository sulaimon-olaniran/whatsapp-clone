import axios from "axios";

import {userApi} from "../../api";
import {OPEN_SNACKBAR} from "../types/universal";

import {
  SIGNING_UP_USER,
  SIGN_UP_USER_SUCCESS,
  SIGN_UP_USER_FAILED,
  SIGNING_IN_USER,
  SIGN_IN_USER_SUCCESS,
  SIGN_IN_USER_FAILED,
  LOGOUT_USER_SUCCESS,
  FETCHING_ACCOUNT_DATA,
  FETCH_ACCOUNT_DATA_SUCCESS,
  FETCH_ACCOUNT_DATA_FAILED,
  UPDATING_USER_DATA,
  UPDATE_USER_DATA_SUCCESS,
  UPDATE_USER_DATA_FAILED,
  UPDATE_USER_PRIVACY_SETTINGS_SUCCESS,
  UPDATE_USER_PRIVACY_SETTINGS_FAILED,
  BLOCKING_CONTACT,
  BLOCK_CONTACT_SUCCESS,
  UNBLOCKING_CONTACT,
  UNBLOCK_CONTACT_SUCCESS,
} from "../types/user";

//CREATE NEW USER ACCOUNT**************
export const signUpUser = data => {
  return dispatch => {
    dispatch({
      type: SIGNING_UP_USER,
    });

    axios
      .post(`${userApi}/signup`, data)
      .then(res => {
        dispatch({
          type: SIGN_UP_USER_SUCCESS,
          payload: res.data,
        });
      })
      .catch(error => {
        console.log(error.response.data);
        dispatch({
          type: SIGN_UP_USER_FAILED,
          payload: error.response.data.message,
        });
      });
  };
};

//SIGN IN USER INTO HIS/HER ACCOUNT**********
export const signInUser = data => {
  return dispatch => {
    dispatch({
      type: SIGNING_IN_USER,
    });

    axios
      .post(`${userApi}/signin`, data)
      .then(res => {
        dispatch({
          type: SIGN_IN_USER_SUCCESS,
          payload: res.data,
        });
      })
      .catch(error => {
        //console.log(error.response.data);
        dispatch({
          type: SIGN_IN_USER_FAILED,
          payload: error.response.data.message,
        });
      });
  };
};

//LOG USER ACCOUNT OUT OF THE APP************
export const logoutUser = () => {
  return dispatch => {
    dispatch({
      type: LOGOUT_USER_SUCCESS,
    });
  };
};

//USED TO CONSTANTLY GET ACCOUNT DATA WHEN APP REFRESHED OR PAGE CHANGES************
export const fetchAccountData = () => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCHING_ACCOUNT_DATA,
    });

    const token = getState().user.token;
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    axios
      .get(`${userApi}/fetch/account/data`, config)
      .then(res => {
        dispatch({
          type: FETCH_ACCOUNT_DATA_SUCCESS,
          payload: res.data,
        });
      })
      .catch(error => {
        console.log(error.response);
        dispatch({
          type: FETCH_ACCOUNT_DATA_FAILED,
        });
      });
  };
};

export const updateUserData = (data, closeUpdate) => {
  return (dispatch, getState) => {
    const token = getState().user.token;
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    dispatch({
      type: UPDATING_USER_DATA,
      payload: data.type,
    });

    const update = {
      ...data.update,
    };

    axios
      .patch(`${userApi}/update/user/data`, update, config)
      .then(res => {
        dispatch({
          type: UPDATE_USER_DATA_SUCCESS,
          payload: res.data,
        });

        if (closeUpdate === null) return;
        closeUpdate();
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: UPDATE_USER_DATA_FAILED,
          payload: error.response.data.message,
        });
      });
  };
};

export const updateUserPrivacySettings = data => {
  return (dispatch, getState) => {
    const token = getState().user.token;

    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    const settings = {
      privacy: {...data},
    };

    axios
      .patch(`${userApi}/update/user/privacy/settings`, settings, config)
      .then(res => {
        dispatch({
          type: UPDATE_USER_PRIVACY_SETTINGS_SUCCESS,
          payload: res.data,
        });
      })
      .catch(error => {
        dispatch({
          type: UPDATE_USER_PRIVACY_SETTINGS_FAILED,
          payload: error.response.data.message,
        });
      });
  };
};

export const blockContact = contactId => {
  return (dispatch, getState) => {
    const token = getState().user.token;
    const users = getState().app.users;

    const contact = users.find(user => user._id === contactId);

    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    dispatch({
      type: BLOCKING_CONTACT,
    });

    axios
      .patch(`${userApi}/block/contact`, {contactId}, config)
      .then(res => {
        dispatch({
          type: BLOCK_CONTACT_SUCCESS,
          payload: contactId,
        });
        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: `${contact.username} blocked`,
            undoAction: () => {
              axios
                .patch(`${userApi}/unblock/contact`, {contactId}, config)
                .then(() => {
                  dispatch({
                    type: UNBLOCK_CONTACT_SUCCESS,
                    payload: contactId,
                  });
                });
            },
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const unBlockContact = contactId => {
  return (dispatch, getState) => {
    const token = getState().user.token;
    const users = getState().app.users;

    const contact = users.find(user => user._id === contactId);

    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    dispatch({
      type: UNBLOCKING_CONTACT,
    });

    axios
      .patch(`${userApi}/unblock/contact`, {contactId}, config)
      .then(res => {
        dispatch({
          type: UNBLOCK_CONTACT_SUCCESS,
          payload: contactId,
        });
        dispatch({
          type: OPEN_SNACKBAR,
          payload: {
            message: `${contact.username} unblocked`,
            undoAction: () => {
              axios
                .patch(`${userApi}/block/contact`, {contactId}, config)
                .then(() => {
                  dispatch({
                    type: BLOCK_CONTACT_SUCCESS,
                    payload: contactId,
                  });
                });
            },
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

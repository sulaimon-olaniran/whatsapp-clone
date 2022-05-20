import {
  CREATING_NEW_CHAT,
  CREATE_NEW_CHAT_SUCCESSFUL,
  CREATE_NEW_CHAT_FAILED,
  FETCHING_ALL_CHATS,
  FETCH_ALL_CHATS_FAILED,
  FETCH_ALL_CHATS_SUCCESSFUL,
  SET_CURRENT_CHAT,
  CLOSE_CURRENT_CHAT,
  SENDING_CHAT_MESSAGE,
  SENT_CHAT_MESSEAGE_SUCCESSFUL,
  SENT_CHAT_MESSEAGE_FAILED,
  RECEIVED_NEW_CHAT_MESSAGE,
  // MESSAGE_READ_SUCCESSFUL,
  //MESSAGE_READ_FAILED,
  MESSAGE_IS_EDITED,
  // CLEARING_CHAT_MESSAGES,
  // CLEAR_CHAT_MESSAGES_SUCCESSFUL,
  // CLEAR_CHAT_MESSAGES_FAILED,
  EDIT_CHAT_SUCCESSFUL,
  DELETE_CHAT_SUCCESSFUL,
  //NEW_STARRED_MESSAGE,
  FETCHING_STARRED_MESSAGES,
  FETCH_STARRED_MESSAGES_SUCCESSFUL,
  FETCH_STARRED_MESSAGES_FAILED,
  DELETE_MESSAGE_SUCCESSFUL,
} from "../types/chat";

import axios from "axios";

import {chatApi, messagApi} from "../../api";
import {OPEN_SNACKBAR} from "../types/universal";

export const fetchChats = () => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCHING_ALL_CHATS,
    });

    const token = getState().user.token;
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    axios
      .get(`${chatApi}/fetch/chats`, config)
      .then(res => {
        dispatch({
          type: FETCH_ALL_CHATS_SUCCESSFUL,
          payload: res.data,
        });
      })
      .catch(error => {
        dispatch({
          type: FETCH_ALL_CHATS_FAILED,
          payload: error.response.data.message,
        });
      });
  };
};

export const createChat = (partner, closeContactsList) => {
  return (dispatch, getState) => {
    dispatch({
      type: CREATING_NEW_CHAT,
    });

    const token = getState().user.token;
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    const data = {partner: partner};

    //CHECK IF THERE IS AN EXISTING CHAT BETWEEN BOTH PARTIES
    axios
      .get(`${chatApi}/fetch/single/chat/${partner}`, config)
      .then(res => {
        const existingChat = res.data;
        if (existingChat) {
          //console.log(existingChat);
          //IF CHAT EXIST AND WASN'T IN THE CHATLIST, MEANS CHAT HAD BEAN DELETED BY THE LOGGED IN USER AND HAS BEEN HIDDEN FROM THE USER
          //UPDATE THE EXISTING CHAT BY UNHIDING THE CHAT FROM THE LOGGED IN USER REQUESTING A NEW CHAT
          return axios
            .patch(`${chatApi}/unhide`, {chatId: existingChat._id}, config)
            .then(res => {
              dispatch({
                type: CREATE_NEW_CHAT_SUCCESSFUL,
                payload: {...existingChat, ...res.data},
              });

              dispatch({
                type: SET_CURRENT_CHAT,
                payload: res.data,
              });

              closeContactsList();
            });
        } else {
          //IF THERE IS NO EXISTING CHAT, JUST SIMPLY CREATE THE CHAT
          return axios
            .post(`${chatApi}/create/chat`, data, config)
            .then(res => {
              dispatch({
                type: CREATE_NEW_CHAT_SUCCESSFUL,
                payload: res.data,
              });

              dispatch({
                type: SET_CURRENT_CHAT,
                payload: res.data,
              });
              closeContactsList();
            });
        }
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: CREATE_NEW_CHAT_FAILED,
          payload: error.response.data.message,
        });
      });
  };
};

export const sendNewChatMessage = message => {
  return (dispatch, getState) => {
    //console.log(message);
    dispatch({
      type: SENDING_CHAT_MESSAGE,
      payload: message,
    });

    const messageData = message;

    delete messageData.isSent;

    const token = getState().user.token;
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    axios
      .post(`${messagApi}/send`, messageData, config)
      .then(res => {
        dispatch({
          type: SENT_CHAT_MESSEAGE_SUCCESSFUL,
          payload: res.data,
        });
      })
      .catch(error => {
        console.log(error);
        const failedMessage = {
          ...message,
          failed: true,
          isSent: false,
        };
        console.log(failedMessage);
        dispatch({
          type: SENT_CHAT_MESSEAGE_FAILED,
          payload: failedMessage,
        });
      });
  };
};

export const resendChatMessage = message => {
  return (dispatch, getState) => {
    dispatch({
      type: DELETE_MESSAGE_SUCCESSFUL,
      payload: message,
    });

    const newMessage = message;

    delete newMessage.failed;

    dispatch(sendNewChatMessage(newMessage));
  };
};

export const editChat = data => {
  return dispatch => {
    dispatch({
      type: EDIT_CHAT_SUCCESSFUL,
      payload: data,
    });
  };
};

export const newChatMessage = id => {
  return (dispatch, getState) => {
    //CURRENT STATE OF APPLICATION
    const token = getState().user.token;
    const chats = getState().chat.chats;
    const user = getState().user.user;
    const users = getState().app.users;

    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    //GET THE NEW MESSAGE THAT WAS RECEIVED
    axios.get(`${messagApi}/fetch/${id}`, config).then(res => {
      //THE NEW MESSAGE THAT WAS RECEIVED AND FETCHED

      const message = res.data;

      const chatId = message.chatId;

      //GET THE CHAT THAT THE MESSAGE BELONGS TO
      const chat = chats.find(chat => chat._id === chatId);

      //IF THE CHAT EXISTS IN THE USER'S CHAT LIST, SIMPLY ADD THE MESSAGE TO THE CHAT
      if (chat) {
        dispatch({
          type: RECEIVED_NEW_CHAT_MESSAGE,
          payload: message,
        });
      }
      //IF CHAT DOESN'T EXIST, MEANS IT'S HIDDEN FOR USER, UNHIDE THE CHAT, GET THE CHAT AND UPDATE IT WITH THE NEW MESSAGE
      else {
        //THE FACT THAT ONE USER WAS ABLE TO SEND A CHAT MESSAGE MEANS THE CHAT ALREADY EXISTS AND IS HIDDEN TO THE OTHER PARTY
        //SO UNHIDE CHAT AND ADD IT TO THE CHAT LIST OF THE PARTY THAT THE CHAT WAS PREVIOUSLY HIDDEN TO
        return axios.patch(`${chatApi}/unhide`, {chatId}, config).then(res => {
          //UPDATED CHAT DATA
          const chat = res.data;

          //RETURNS ID OF PARTNER MAKING SURE THE ID ISN'T THE LOGGED IN USER
          const partnerId =
            chat.initiator === user._id ? chat.partner : chat.initiator;

          // GETS PARTNER DATA FROM LIST OF USERS
          const partnerData = users.find(user => user._id === partnerId);
          //MESSAGES THAT WILL BE ASSIGNED TO THE CHAT
          const messages = [message];

          // THE NEW CHAT DOCUMENT CREATED
          const newChat = {
            ...chat,
            messages: messages,
            partnerData: partnerData,
          };

          dispatch({
            type: CREATE_NEW_CHAT_SUCCESSFUL,
            payload: newChat,
          });
        });
      }
    });
  };
};

export const editMessage = data => {
  return dispatch => {
    dispatch({
      type: MESSAGE_IS_EDITED,
      payload: data,
    });
  };
};

export const setCurrentChat = chat => {
  return dispatch => {
    dispatch({
      type: SET_CURRENT_CHAT,
      payload: chat,
    });
  };
};

export const closeCurrentChat = () => {
  return dispatch => {
    dispatch({
      type: CLOSE_CURRENT_CHAT,
    });
  };
};

export const deleteChat = id => {
  return (dispatch, getState) => {
    const token = getState().user.token;
    const currentChat = getState().chat.currentChat;
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    axios.patch(`${chatApi}/hide`, {chatId: id}, config).then(res => {
      dispatch({
        type: DELETE_CHAT_SUCCESSFUL,
        payload: id,
      });

      dispatch({
        type: OPEN_SNACKBAR,
        payload: {
          message: "Chat deleted from this device",
          undoAction: null,
        },
      });

      if (currentChat && id !== currentChat._id) return;
      dispatch({
        type: CLOSE_CURRENT_CHAT,
      });
    });
  };
};

export const fetchStarredMessages = () => {
  return (dispatch, getState) => {
    const token = getState().user.token;

    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    dispatch({
      type: FETCHING_STARRED_MESSAGES,
    });

    axios
      .get(`${messagApi}/fetch/starred`, config)
      .then(res => {
        dispatch({
          type: FETCH_STARRED_MESSAGES_SUCCESSFUL,
          payload: res.data,
        });
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: FETCH_STARRED_MESSAGES_FAILED,
          payload: error.response.data.message,
        });
      });
  };
};

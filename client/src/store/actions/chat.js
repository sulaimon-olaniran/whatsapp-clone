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

    axios
      .get(`${chatApi}/fetch/single/chat/${partner}`, config)
      .then(res => {
        const existingChat = res.data;
        if (existingChat) {
          console.log(existingChat);
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
  return (dispatch, getState) => {
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

      //console.log(message);

      const chatId = message.chatId;

      //GET THE CHAT THAT THE MESSAGE BELONGS TO
      const chat = chats.find(chat => chat._id === chatId);

      //IF THE CHAT EXISTS IN THE USER'S CHAT LIST, SIMPLY ADD THE MESSAGE TO THE CHAT
      if (chat) {
        //console.log("chat does exist");
        // const newChats = chats.map(chat => {
        //   if (chat._id === message.chatId) {
        //     return {...chat, messages: [...chat.messages, message]};
        //   }
        //   return chat;
        // });

        // const newCurrentChat =
        //   currentChat && currentChat._id === message.chatId
        //     ? newChats.find(chat => chat._id === currentChat._id)
        //     : null;

        dispatch({
          type: RECEIVED_NEW_CHAT_MESSAGE,
          payload: message,
        });
      }
      //IF CHAT DOESN'T EXIST, MEANS IT'S HIDDEN FOR USER, UNHIDE THE CHAT, GET THE CHAT AND UPDATE IT WITH THE NEW MESSAGE
      else {
        console.log("chat does not exist");
        //UNHIDE CHAT
        return axios.patch(`${chatApi}/unhide`, {chatId}, config).then(res => {
          //UPDATED CHAT DATA
          const chat = res.data;

          // console.log("updated chat", chat);

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

          // console.log("new chat", newChat);

          // ADD THE NEW CHAT TO THE LIST OF CHATS LIST
          // const newChats = [...chats, newChat];

          dispatch({
            type: CREATE_NEW_CHAT_SUCCESSFUL,
            payload: newChat,
          });

          //console.log("new chats all", newChats);

          // //DISPATCH UPDATES STATE
          // dispatch({
          //   type: RECEIVED_NEW_CHAT_MESSAGE,
          //   payload: {
          //     chats: newChats,
          //     currentChat: currentChat,
          //   },
          // });
        });
      }
    });
  };
};

export const editMessage = data => {
  return (dispatch, getState) => {
    // const chats = getState().chat.chats;
    // const currentChat = getState().chat.currentChat;

    // const newChats = chats.map(chat => {
    //   if (chat._id === data.chatId) {
    //     const newMessages = chat.messages.map(message => {
    //       return message._id === data._id ? {...message, ...data} : message;
    //     });
    //     return {...chat, messages: newMessages};
    //   }
    //   return chat;
    // });

    // const newCurrentChat =
    //   currentChat && currentChat._id === data.chatId
    //     ? newChats.find(chat => chat._id === currentChat._id)
    //     : null;

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

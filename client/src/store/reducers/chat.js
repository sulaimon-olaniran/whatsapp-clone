import {
  deleteMessageInChatsList,
  deleteMessageInCurrentChat,
  editChatInChatsList,
  editChatInCurrentChat,
  updateChatsEditedMessage,
  updateChatsWithNewMessage,
  updateContactInChatsList,
  updateContactInCurrentChat,
  updateCurrentChatEditedMessage,
  updateCurrentChatWithNewMessage,
} from "../helpers/chat";
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
  MESSAGE_IS_EDITED,
  //CLEARING_CHAT_MESSAGES,
  CLEAR_CHAT_MESSAGES_SUCCESSFUL,
  // CLEAR_CHAT_MESSAGES_FAILED,
  DELETE_MESSAGE_SUCCESSFUL,
  EDIT_CHAT_SUCCESSFUL,
  DELETE_CHAT_SUCCESSFUL,
  FETCHING_STARRED_MESSAGES,
  FETCH_STARRED_MESSAGES_SUCCESSFUL,
  FETCH_STARRED_MESSAGES_FAILED,
  ADD_STARRED_MESSAGE,
  REMOVE_STARRED_MESSAGE,
} from "../types/chat";
import {CONTACT_IS_UPDATED} from "../types/universal";

//CHECK IF BROWSER IS MAKING USE OF DARK OR LIGHT THEME

const initState = {
  chats: [],
  starredMessages: [],
  creatingChat: false,
  fetchingChats: true,
  fetchingStaredMessages: true,
  clearingMessages: false,
  currentChat: null,
  //loading : false,
};

const chat = (state = initState, action) => {
  switch (action.type) {
    case CREATING_NEW_CHAT:
      return {
        ...state,
        creatingChat: true,
      };

    case CREATE_NEW_CHAT_SUCCESSFUL:
      return {
        ...state,
        creatingChat: false,
        chats: [...state.chats, action.payload],
        //currentChat: action.payload,
      };

    case CREATE_NEW_CHAT_FAILED:
      return {
        ...state,
        creatingChat: false,
      };

    case SENDING_CHAT_MESSAGE:
      return {
        ...state,
        chats: updateChatsWithNewMessage(state.chats, action.payload),
        currentChat: updateCurrentChatWithNewMessage(
          state.currentChat,
          action.payload
        ),
      };

    case SENT_CHAT_MESSEAGE_SUCCESSFUL:
      // case SENT_CHAT_MESSEAGE_FAILED:
      return {
        ...state,
        chats: updateChatsEditedMessage(state.chats, action.payload),
        currentChat: state.currentChat
          ? updateCurrentChatEditedMessage(state.currentChat, action.payload)
          : null,
      };

    case SENT_CHAT_MESSEAGE_FAILED:
      return {
        ...state,
        chats: updateChatsEditedMessage(state.chats, action.payload),
        currentChat: state.currentChat
          ? updateCurrentChatEditedMessage(state.currentChat, action.payload)
          : null,
      };

    case RECEIVED_NEW_CHAT_MESSAGE:
      return {
        ...state,
        chats: updateChatsWithNewMessage(state.chats, action.payload),
        currentChat: state.currentChat
          ? updateCurrentChatWithNewMessage(state.currentChat, action.payload)
          : null,
      };

    case DELETE_MESSAGE_SUCCESSFUL:
      return {
        ...state,
        chats: deleteMessageInChatsList(state.chats, action.payload),
        currentChat: state.currentChat
          ? deleteMessageInCurrentChat(state.currentChat, action.payload)
          : null,
      };

    case FETCHING_STARRED_MESSAGES:
      return {
        ...state,
        fetchingStaredMessages: true,
      };

    case FETCH_STARRED_MESSAGES_SUCCESSFUL:
      return {
        ...state,
        starredMessages: action.payload,
        fetchingStaredMessages: false,
      };

    case FETCH_STARRED_MESSAGES_FAILED:
      return {
        ...state,
        fetchingStaredMessages: false,
      };

    case ADD_STARRED_MESSAGE:
      return {
        ...state,
        starredMessages: [...state.starredMessages, action.payload],
      };

    case REMOVE_STARRED_MESSAGE:
      return {
        ...state,
        starredMessages: state.starredMessages.filter(
          msg => msg._id !== action.payload._id
        ),
      };

    case FETCHING_ALL_CHATS:
      return {
        ...state,
        fetchingChats: true,
      };

    case FETCH_ALL_CHATS_SUCCESSFUL:
      return {
        ...state,
        fetchingChats: false,
        chats: action.payload,
      };

    case FETCH_ALL_CHATS_FAILED:
      return {
        ...state,
        fetchingChats: false,
      };

    case EDIT_CHAT_SUCCESSFUL:
      return {
        ...state,
        chats: editChatInChatsList(state.chats, action.payload),
        currentChat: state.currentChat
          ? editChatInCurrentChat(state.currentChat, action.payload)
          : null,
      };

    case SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: action.payload,
      };

    case CLOSE_CURRENT_CHAT:
      return {
        ...state,
        currentChat: null,
      };

    case CLEAR_CHAT_MESSAGES_SUCCESSFUL:
      const clearChatId = action.payload;
      const clearMsgsCurrentChat = state.currentChat;

      const clearMsgsNewChats = state.chats.map(chat => {
        if (chat._id === clearChatId) {
          return {...chat, messages: []};
        }
        return chat;
      });
      return {
        ...state,
        chats: clearMsgsNewChats,
        currentChat: clearMsgsCurrentChat
          ? {...clearMsgsCurrentChat, messages: []}
          : null,
      };

    case DELETE_CHAT_SUCCESSFUL:
      return {
        ...state,
        chats: state.chats.filter(chat => chat._id !== action.payload),
      };

    //*********************** UPDATE MESSAGE WHEN IT IS EDITED ***********************************************/
    case MESSAGE_IS_EDITED:
      //console.log(action.payload);
      return {
        ...state,
        chats: updateChatsEditedMessage(state.chats, action.payload),
        currentChat: state.currentChat
          ? updateCurrentChatEditedMessage(state.currentChat, action.payload)
          : null,
        // chats: action.payload.chats,
        // currentChat: action.payload.currentChat,
      };

    case CONTACT_IS_UPDATED:
      return {
        ...state,
        currentChat: updateContactInCurrentChat(
          state.currentChat,
          action.payload
        ),
        chats: updateContactInChatsList(state.chats, action.payload),
      };

    default:
      return state;
  }
};

export default chat;

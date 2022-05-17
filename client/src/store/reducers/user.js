import {
  SIGNING_IN_USER,
  SIGN_IN_USER_SUCCESS,
  SIGN_IN_USER_FAILED,
  SIGNING_UP_USER,
  SIGN_UP_USER_SUCCESS,
  SIGN_UP_USER_FAILED,
  LOGOUT_USER_SUCCESS,
  CLEAR_USER_ERROR,
  FETCHING_ACCOUNT_DATA,
  FETCH_ACCOUNT_DATA_SUCCESS,
  FETCH_ACCOUNT_DATA_FAILED,
  UPDATING_USER_DATA,
  UPDATE_USER_DATA_SUCCESS,
  UPDATE_USER_DATA_FAILED,
  UPDATE_USER_PRIVACY_SETTINGS_SUCCESS,
  BLOCK_CONTACT_SUCCESS,
  UNBLOCK_CONTACT_SUCCESS,
  BLOCKING_CONTACT,
  UNBLOCKING_CONTACT,
} from "../types/user";

const initState = {
  user: null,
  fetchingUserData: true,
  token: localStorage.getItem("oswc-token") || null,
  signingIn: false,
  signingUp: false,
  authError: null,
  loading: false,
};

const user = (state = initState, action) => {
  switch (action.type) {
    case SIGNING_IN_USER:
      return {
        ...state,
        signingIn: true,
      };

    case SIGNING_UP_USER:
      return {
        ...state,
        signingUp: true,
      };

    case SIGN_UP_USER_SUCCESS:
    case SIGN_IN_USER_SUCCESS:
      localStorage.setItem("oswc-token", action.payload.token);
      return {
        ...state,
        signingUp: false,
        signingIn: false,
        //PAYLOAD RETURNS USER AND TOKEN FROM SERVER, AND BOTH ADDED TO STATE
        ...action.payload,
      };

    case SIGN_UP_USER_FAILED:
    case SIGN_IN_USER_FAILED:
      localStorage.removeItem("oswc-token");
      return {
        ...state,
        signingUp: false,
        signingIn: false,
        user: null,
        token: null,
        authError: action.payload,
      };

    case FETCHING_ACCOUNT_DATA:
      return {
        ...state,
        fetchingUserData: true,
      };

    case FETCH_ACCOUNT_DATA_SUCCESS:
      return {
        ...state,
        user: action.payload,
        fetchingUserData: false,
      };

    case FETCH_ACCOUNT_DATA_FAILED:
      return {
        ...state,
        fetchingUserData: false,
      };

    case UPDATING_USER_DATA:
      return {
        ...state,
        loading: true,
        updatingUser: {
          ...state.updatingUser,
          isUpdating: true,
          type: action.payload,
        },
      };

    case UPDATE_USER_DATA_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        loading: false,
      };

    case UPDATE_USER_DATA_FAILED:
      return {
        ...state,
        loading: false,
      };

    case UPDATE_USER_PRIVACY_SETTINGS_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          privacy: action.payload.user.privacy,
        },
      };

    case BLOCKING_CONTACT:
      return {
        ...state,
        loading: true,
      };

    case BLOCK_CONTACT_SUCCESS:
      const prevBlocked = state.user.privacy.blocked_contacts;
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          privacy: {
            ...state.user.privacy,
            blocked_contacts: [...prevBlocked, action.payload],
          },
        },
      };

    case UNBLOCKING_CONTACT:
      return {
        ...state,
        loading: true,
      };

    case UNBLOCK_CONTACT_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          privacy: {
            ...state.user.privacy,
            blocked_contacts: state.user.privacy.blocked_contacts.filter(
              item => item !== action.payload
            ),
          },
        },
        loading: false,
      };

    case CLEAR_USER_ERROR:
      return {
        ...state,
        authError: null,
      };

    case LOGOUT_USER_SUCCESS:
      localStorage.removeItem("oswc-token");
      return {
        ...state,
        user: null,
        token: null,
        authError: null,
      };

    default:
      return state;
  }
};

export default user;

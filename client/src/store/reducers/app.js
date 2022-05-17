import {
  VIEW_PROFILE_PHOTO,
  CLOSE_PROFILE_PHOTO,
  SET_CHAT_WALLPAPER,
  TOGGLE_APP_THEME,
  GET_APP_USERS_SUCCESSFUL,
  TOGGLE_CHAT_DOODLES,
  OPEN_MESSAGES_MEDIAS_DIALOG,
  CLOSE_MESSAGES_MEDIAS_DIALOG,
  GET_APP_USERS,
  GET_APP_USERS_FAILED,
} from "../types/app";
import {
  CLOSE_SNACKBAR,
  CONTACT_IS_UPDATED,
  OPEN_SNACKBAR,
} from "../types/universal";

//CHECK IF BROWSER IS MAKING USE OF DARK OR LIGHT THEME
const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

const chat_wallpaper = localStorage.getItem("chat_wallpaper");
const chat_theme = localStorage.getItem("theme");
const defaultWallpaper = chat_wallpaper
  ? chat_wallpaper
  : chat_theme
  ? chat_theme === "light"
    ? "#efeae2"
    : "#0b141a"
  : darkThemeMq.matches
  ? "#0b141a"
  : "#efeae2";

const initState = {
  users: [],
  gettingAppUsers: true,

  themeType: localStorage.getItem("theme-type")
    ? localStorage.getItem("theme-type")
    : darkThemeMq.matches
    ? "dark"
    : "light",

  theme: localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : darkThemeMq.matches
    ? "dark"
    : "light",

  wallpaper: defaultWallpaper,
  profilePhotoDialog: {
    open: false,
    image: "",
    name: "",
  },
  doodles: true,
  messagesMediaDialog: {
    open: false,
    media: null,
  },
  snackbar: {
    message: "",
    open: false,
    undoAction: null,
  },
};

const app = (state = initState, action) => {
  switch (action.type) {
    case GET_APP_USERS:
      return {
        ...state,
        gettingAppUsers: true,
      };

    case GET_APP_USERS_SUCCESSFUL:
      return {
        ...state,
        users: action.payload,
        gettingAppUsers: false,
      };

    case GET_APP_USERS_FAILED:
      return {
        ...state,
        gettingAppUsers: false,
      };

    case VIEW_PROFILE_PHOTO:
      return {
        ...state,
        profilePhotoDialog: {
          ...state.profilePhotoDialog,
          open: true,
          image: action.payload.url,
          name: action.payload.name,
        },
      };

    case CLOSE_PROFILE_PHOTO:
      return {
        ...state,
        profilePhotoDialog: {
          ...state.profilePhotoDialog,
          open: false,
          image: "",
          name: "",
        },
      };

    case OPEN_MESSAGES_MEDIAS_DIALOG:
      //const data = action.payload
      return {
        ...state,
        messagesMediaDialog: {...action.payload},
      };

    case CLOSE_MESSAGES_MEDIAS_DIALOG:
      return {
        ...state,
        messagesMediaDialog: {open: false, media: null},
      };

    case SET_CHAT_WALLPAPER:
      localStorage.setItem("chat_wallpaper", action.payload);
      return {
        ...state,
        wallpaper: action.payload,
      };

    case TOGGLE_APP_THEME:
      const theme =
        action.payload === "default"
          ? darkThemeMq.matches
            ? "dark"
            : "light"
          : action.payload;
      localStorage.setItem("theme-type", action.payload);
      localStorage.setItem("theme", theme);
      return {
        ...state,
        themeType: action.payload,
        theme: theme,
      };

    case TOGGLE_CHAT_DOODLES:
      return {
        ...state,
        doodles: !state.doodles,
      };

    case CONTACT_IS_UPDATED:
      return {
        ...state,
        users: state.users.map(user => {
          if (user._id === action.payload._id) {
            return {...user, ...action.payload};
          }
          return user;
        }),
      };

    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbar: {
          open: true,
          message: action.payload.message,
          undoAction: action.payload.undoAction,
        },
      };

    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbar: {
          message: "",
          undoAction: null,
          open: false,
        },
      };

    default:
      return state;
  }
};

export default app;

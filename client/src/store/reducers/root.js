import {combineReducers} from "redux";

import app from "./app";
import chat from "./chat";
import user from "./user";

export default combineReducers({
  app,
  chat,
  user,
});

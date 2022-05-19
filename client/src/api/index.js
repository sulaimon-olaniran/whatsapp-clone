//require("dotenv").config();

let user_api = "";
let chat_api = "";
let message_api = "";

//CHECK IF IN DEVELOPMENT MODE OR PRODUCTOION MODE TO USE LOCAL SEVER OR HOSTED SERVER
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  user_api = "http://localhost:5000/user";
  chat_api = "http://localhost:5000/chat";
  message_api = "http://localhost:5000/message";
} else {
  user_api = process.env.REACT_APP_USER_API;
  chat_api = process.env.REACT_APP_CHAT_API;
  message_api = process.env.REACT_APP_MESSAGE_API;
}

export const userApi = "https://os-whatsapp-clone.herokuapp.com/user";
export const chatApi = "https://os-whatsapp-clone.herokuapp.com/chat";
export const messagApi = "https://os-whatsapp-clone.herokuapp.com/message";

import Pusher from "pusher";
import dotnev from "dotenv";

dotnev.config();

const {PUSHER_SECRET, PUSHER_KEY, PUSHER_APP_ID} = process.env;

//USING PUSHER TO UPDATE CLIENT IN REAL TIME

export const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: "mt1",
  useTLS: true,
});

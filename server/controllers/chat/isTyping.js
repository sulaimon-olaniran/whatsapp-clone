import {pusher} from "../../pusher/pusher.js";

export const isTyping = (req, res) => {
  const {chatId} = req.body;
  const {id} = req.user;
  pusher.trigger("chat-channel", "user-typing", {userId: id, chatId});
  res.status(200).send();
};

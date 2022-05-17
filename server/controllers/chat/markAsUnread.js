import Chat from "../../models/chat.js";

import {pusher} from "../../pusher/pusher.js";

export const markChatAsUnread = (req, res) => {
  const {id} = req.user;
  const {chatId} = req.body;

  Chat.findByIdAndUpdate(
    {_id: chatId},
    {
      $addToSet: {
        unread: id,
      },
    },
    {new: true}
  )
    .then(chat => {
      //pusher.trigger("chat-channel", "chat-edited", chat);
      //res.status(200).send()
      res.status(200).json(chat);
    })
    .catch(error => {
      res.status(500).json({error, message: "Failed to mark chat as unread"});
    });
};

import Chat from "../../models/chat.mjs";

import {pusher} from "../../pusher/pusher.mjs";

export const markChatAsRead = (req, res) => {
  const {id} = req.user;
  const {chatId} = req.body;

  Chat.findByIdAndUpdate(
    {_id: chatId},
    {
      $pull: {
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
      res.status(500).json({error, message: "Failed to unarchive chat"});
    });
};
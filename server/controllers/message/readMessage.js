import Message from "../../models/message.js";

import {pusher} from "../../pusher/pusher.js";

export const readMessage = (req, res) => {
  const {messageId} = req.body;

  Message.findByIdAndUpdate({_id: messageId}, {isSeen: true}, {new: true})
    .then(message => {
      const data = {
        sender: message.sender,
        _id: message._id,
        subId: message.subId,
        chatId: message.chatId,
        isSeen: true,
      };
      pusher.trigger("chat-channel", "message-edited", data);
      //res.status(200).send()
      res.status(200).json(message);
    })
    .catch(error => {
      res.status(500).json({error, message: "Failed to read message"});
    });
};

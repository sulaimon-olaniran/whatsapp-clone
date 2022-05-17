import Message from "../../models/message.js";
import {pusher} from "../../pusher/pusher.js";

export const deleteMessageForMe = (req, res) => {
  const {id} = req.user;
  const {messageId} = req.body;

  Message.findByIdAndUpdate(
    {_id: messageId},
    {
      $addToSet: {
        deleted: id,
      },
    },
    {new: true}
  )
    .then(message => {
      //pusher.trigger("chat-channel", "message-edited", message);
      res.status(200).json(message);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error, message: "Failed to delete message"});
    });
};

export const deleteMessageForEveryone = (req, res) => {
  const {id} = req.user;
  const {messageId} = req.body;

  Message.findByIdAndUpdate(
    {_id: messageId},
    {delete_everyone: true},
    {new: true}
  )
    .then(message => {
      const data = {
        sender: message.sender,
        id: message._id,
        chatId: message.chatId,
        delete_everyone: true,
        subId: message.subId,
      };
      pusher.trigger("chat-channel", "message-edited", data);
      res.status(200).json(message);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error, message: "Failed to deliver message"});
    });
};

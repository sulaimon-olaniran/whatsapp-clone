import Message from "../../models/message.js";
import Chat from "../../models/chat.js";
import {pusher} from "../../pusher/pusher.js";

//REMOVES MESSAGE FROM DATABASE COMPLETELY
export const clearMessage = (req, res) => {
  const {id} = req.user;
  const {messageId, isSingle} = req.body;

  Message.findByIdAndUpdate(
    {_id: messageId},
    {
      $addToSet: {
        cleared: id,
      },
    },
    {new: true}
  )
    .then(message => {
      // return Chat.findByIdAndUpdate
      //pusher.trigger("chat-channel", "message-edited", message);
      res.status(200).json(message);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error, message: "Failed to deliver message"});
    });
};

import Message from "../../models/message.mjs";
//import {pusher} from "../../pusher/pusher.js";

export const unStarMessage = (req, res) => {
  const {id} = req.user;
  const {messageId} = req.body;

  Message.findByIdAndUpdate(
    {_id: messageId},
    {
      $pull: {
        starred: id,
      },
    },
    {new: true}
  )
    .then(message => {
      //pusher.trigger("chat-channel", "message-edited", message);
      //res.status(200).send()
      res.status(200).json(message);
    })
    .catch(error => {
      res.status(500).json({error, message: "Failed to deliver message"});
    });
};

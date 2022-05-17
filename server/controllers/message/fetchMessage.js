import Message from "../../models/message.js";
import mongoose from "mongoose";

export const fetchMessage = (req, res) => {
  const userId = req.user.id;
  const {id} = req.params;

  Message.findById(id)
    .then(message => {
      const messageTime =
        message.sender === userId ? message.time : message.delivered_at;

      const newMessage = {...message.toObject(), time: messageTime};

      return res.status(201).json(newMessage);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({error, message: "Server error"});
    });
};

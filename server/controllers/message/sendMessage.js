import mongoose from "mongoose";

import {pusher} from "../../pusher/pusher.js";
import Message from "../../models/message.js";
import moment from "moment";

export const sendMessage = (req, res) => {
  const messageData = req.body;

  const {
    sender,
    type,
    pdf,
    doc,
    message,
    image,
    contact,
    gif,
    sticker,
    chatId,
    receiver,
  } = messageData;

  //CHECK IF MESSAGE SEND FROM CLIENT IS VALID
  if (
    !sender ||
    !type ||
    !chatId ||
    (!pdf &&
      !doc &&
      !message &&
      !image &&
      !contact &&
      !gif &&
      !sticker &&
      !receiver)
  )
    return res.status(500).json({message: "Invalid message body"});

  const newMessageData = {...messageData, delivered_at: moment().format()};

  const newMessage = new Message(newMessageData);

  newMessage
    .save()
    .then(message => {
      const data = {
        sender: message.sender,
        receiver: message.receiver,
        _id: message._id,
      };
      pusher.trigger("chat-channel", "new-message", data);
      //res.status(200).send()
      res.status(200).json(message);
    })
    .catch(error => {
      res.status(500).json({error, message: "Failed to send message"});
    });

  //res.status(300).json(newMessage);
};

import moment from "moment";

import Chat from "../../models/chat.js";

export const pinChat = (req, res) => {
  const {id} = req.user;
  const {chatId} = req.body;

  const pinData = {
    time: moment().format(),
    id: id,
  };

  Chat.findByIdAndUpdate(
    {_id: chatId},
    {
      $addToSet: {
        pinned: pinData,
      },
    },
    {new: true}
  )
    .then(chat => {
      res.status(200).json(chat);
    })
    .catch(error => {
      res.status(500).json({error, message: "Failed to archive chat"});
    });
};

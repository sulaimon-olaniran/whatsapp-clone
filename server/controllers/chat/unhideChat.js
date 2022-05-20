import Chat from "../../models/chat.js";
import moment from "moment";

export const unhideChat = (req, res) => {
  const {id} = req.user;
  const {chatId} = req.body;

  const newTime = moment().format();

  Chat.findById({_id: chatId})
    .then(data => {
      if (data.initiator === id) {
        return Chat.findByIdAndUpdate(
          {_id: chatId},
          {
            $pull: {
              hidden: id,
            },
            initiatorTime: newTime,
          },
          {new: true}
        ).then(chat => {
          const newChat = chat.toObject();
          newChat.createdAt = newTime;
          res.status(200).json(newChat);
        });
      } else {
        return Chat.findByIdAndUpdate(
          {_id: chatId},
          {
            $pull: {
              hidden: id,
            },
            partnerTime: newTime,
          },
          {new: true}
        ).then(chat => {
          const newChat = chat.toObject();
          newChat.createdAt = newTime;
          res.status(200).json(newChat);
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error, message: "Failed to unhide chat"});
    });
};

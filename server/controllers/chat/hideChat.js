import Chat from "../../models/chat.js";
import moment from "moment";

export const hideChat = (req, res) => {
  const {id} = req.user;
  const {chatId} = req.body;

  const newTime = moment().format();

  Chat.findByIdAndUpdate(
    {_id: chatId},
    {
      $addToSet: {
        hidden: id,
      },
    },
    {new: true}
  )
    .then(chat => {
      res.status(200).send();
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error, message: "Failed to unpin chat"});
    });
};

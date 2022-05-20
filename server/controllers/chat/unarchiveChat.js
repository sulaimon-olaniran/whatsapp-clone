import Chat from "../../models/chat.js";

export const unarchiveChat = (req, res) => {
  const {id} = req.user;
  const {chatId} = req.body;

  Chat.findByIdAndUpdate(
    {_id: chatId},
    {
      $pull: {
        archived: id,
      },
    },
    {new: true}
  )
    .then(chat => {
      res.status(200).json(chat);
    })
    .catch(error => {
      res.status(500).json({error, message: "Failed to unarchive chat"});
    });
};

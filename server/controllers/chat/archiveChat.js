import Chat from "../../models/chat.js";

export const archiveChat = (req, res) => {
  const {id} = req.user;
  const {chatId} = req.body;

  Chat.findByIdAndUpdate(
    {_id: chatId},
    {
      $addToSet: {
        archived: id,
      },
      $pull: {
        pinned: {id},
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

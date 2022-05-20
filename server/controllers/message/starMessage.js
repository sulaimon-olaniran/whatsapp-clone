import Message from "../../models/message.js";

export const starMessage = (req, res) => {
  const {id} = req.user;
  const {messageId} = req.body;

  Message.findByIdAndUpdate(
    {_id: messageId},
    {
      $addToSet: {
        starred: id,
      },
    },
    {new: true}
  )
    .then(message => {
      res.status(200).json(message);
    })
    .catch(error => {
      res.status(500).json({error, message: "Failed to star message"});
    });
};

import Message from "../../models/message.js";

export const fetchStarredMessages = (req, res) => {
  const {id} = req.user;

  Message.aggregate([{$match: {starred: {$in: [id]}}}])
    .then(messages => {
      return res.status(200).json(messages);
    })
    .catch(error => {
      console.log(error);
      return res
        .status(500)
        .json({message: "Failed to fetch starred messages", error});
    });
};

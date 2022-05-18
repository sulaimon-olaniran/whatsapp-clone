import User from "../../models/user.mjs";
import {pusher} from "../../pusher/pusher.mjs";

export const unblockContact = (req, res) => {
  const {id} = req.user;
  const {contactId} = req.body;

  User.findByIdAndUpdate(
    {_id: id},
    {
      $pull: {
        "privacy.blocked_contacts": contactId,
      },
    },
    {new: true}
  )
    .then(user => {
      const data = {id: user._id};
      pusher.trigger("user-channel", "user-updated", data);
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({error, message: "Failed to unblock user"});
    });
};

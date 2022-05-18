import User from "../../models/user.mjs";
import mongoose from "mongoose";
import {pusher} from "../../pusher/pusher.mjs";

export const updatePrivacySettings = (req, res) => {
  const {id} = req.user;

  const update = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({message: "User does not exist"});
  }

  User.findByIdAndUpdate(id, {...update}, {new: true})
    .then(user => {
      const data = {id: user._id};
      pusher.trigger("user-channel", "user-updated", data);
      res.status(200).json({message: "Privacy settings updated", user});
    })
    .catch(error => {
      console.log(error);
      return res
        .status(404)
        .json({message: "Failed to update privacy settings", error});
    });
};

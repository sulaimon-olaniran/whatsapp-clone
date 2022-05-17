import User from "../../models/user.js";
import mongoose from "mongoose";
import {pusher} from "../../pusher/pusher.js";

export const updateUserData = (req, res) => {
  const {id} = req.user;

  const update = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({message: "User does not exist"});
  }

  User.findByIdAndUpdate(id, {...update}, {new: true})
    .then(user => {
      const data = {id: user._id};
      pusher.trigger("user-channel", "user-updated", data);
      res.status(200).json({message: "Profile updated", user});
    })
    .catch(error => {
      console.log(error);
      return res.status(404).json({message: "Failed to update profile", error});
    });
};

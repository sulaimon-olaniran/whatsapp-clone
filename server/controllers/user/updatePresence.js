import mongoose from "mongoose";
import moment from "moment";

import User from "../../models/user.js";
import {pusher} from "../../pusher/pusher.js";

export const updateUserPresence = (req, res) => {
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

export const userIsOnline = (req, res) => {
  const {id} = req.user;
  pusher.trigger("user-channel", "user-online", {userId: id});
  res.status(200).send();
};

export const userIsOffline = (req, res) => {
  const {id} = req.user;

  const lastSeen = moment().format();

  User.findByIdAndUpdate(id, {last_seen: lastSeen}, {new: true})
    .then(() => {
      pusher.trigger("user-channel", "user-offline", {
        last_seen: lastSeen,
        userId: id,
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(404).json({message: "Failed to update profile", error});
    });
};

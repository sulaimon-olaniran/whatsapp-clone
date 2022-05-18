import User from "../../models/user.js";
import mongoose from "mongoose";

export const fetchAppUsers = (req, res) => {
  const {id} = req.user;

  User.aggregate([{$match: {_id: {$ne: mongoose.Types.ObjectId(id)}}}])
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(error => {
      return res.status(500).json({error, message: "Server error"});
    });
};

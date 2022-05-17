import User from "../../models/user.js";
import mongoose from "mongoose";

export const fetchUser = (req, res) => {
  const {id} = req.params;

  //User.aggregate([{$match: {_id: mongoose.Types.ObjectId(id)}}])
  User.findById(id)
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({error, message: "Server error"});
    });
};

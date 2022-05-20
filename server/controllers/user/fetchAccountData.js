import User from "../../models/user.js";

export const fetchAccountData = (req, res) => {
  const {id} = req.user;

  User.findById(id)
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({error, message: "Server error"});
    });
};

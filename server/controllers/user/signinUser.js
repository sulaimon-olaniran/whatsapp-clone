import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const {JWT_SECRET} = process.env;

export const signinUser = (req, res) => {
  const {phone_number, password} = req.body;

  if (!phone_number || !password)
    return res.status(404).json({message: "Please enter all fields"});

  User.aggregate([{$match: {phone_number: phone_number}}])
    .then(response => {
      const user = response[0];
      if (!user)
        return res.status(400).json({message: "Incorrect credentials"});

      return bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch)
          return res.status(400).json({message: "Incorrect credentials"});

        return jwt.sign(
          {
            id: user._id,
            time: Date.now(),
            number: user.phone_number,
          },
          JWT_SECRET,

          (err, token) => {
            if (err) throw err;

            return res.status(200).json({
              token,
              user,
              message: "Signed user in successfully",
            });
          }
        );
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(409).json({message: "Signing user in failed", error});
    });
};

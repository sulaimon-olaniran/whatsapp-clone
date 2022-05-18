import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const {JWT_SECRET} = process.env;

export const signupUser = (req, res) => {
  const {username, phone_number, password, confirm_password, profile_photo} =
    req.body;

  if (!username || !phone_number || !password || !confirm_password) {
    return res.status(400).json({message: "Please enter all fields."});
  }

  if (password !== confirm_password)
    return res
      .status(400)
      .json({message: "Password and confirm password don't match."});

  User.findOne({phone_number})
    .then(user => {
      if (user)
        return res
          .status(422)
          .json({message: "The phone number is already taken."});

      const newUser = new User({
        username,
        phone_number,
        password,
        profile_photo,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err)
            return res.status(500).json({message: "Server Error", error: err});

          newUser.password = hash;

          newUser.save().then(user => {
            jwt.sign(
              {
                id: user._id,
                time: Date.now(),
                number: user.phone_number,
              },
              JWT_SECRET,

              (err, token) => {
                if (err) throw err;

                return res.status(201).json({
                  message: "Signed up successfully",
                  token,
                  user: {...user._doc, password: undefined},
                });
              }
            );
          });
        });
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({message: "Sign up failed", error});
    });
};

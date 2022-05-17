import moment from "moment";
import mongoose from "mongoose";

import Chat from "../../models/chat.js";
import User from "../../models/user.js";

export const createChat = (req, res) => {
  const initiator = req.user.id;
  const {partner} = req.body;

  //FETCH CHAT PARTNER DETAILS
  if (!partner) {
    return res.status(400).json({message: "Bad request"});
  }

  if (!mongoose.Types.ObjectId.isValid(partner)) {
    return res.status(404).json({message: "No user with such ID"});
  }

  const interlocutors = [initiator, partner];

  const newChat = new Chat({
    interlocutors,
    initiator,
    partner,
    createdAt: moment().format(),
    hidden: [partner],
  });

  User.aggregate([{$match: {_id: mongoose.Types.ObjectId(partner)}}])
    .then(user => {
      return newChat.save().then(chat => {
        res
          .status(201)
          .json({partnerData: user[0], ...chat._doc, messages: []});
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({message: "Failed to start chat", error});
    });
};

// export const createChat = (req, res) => {
//   const initiator = req.user.id;
//   const {partner} = req.body;

//   if (!partner) {
//     return res.status(400).json({message: "Bad request"});
//   }

//   //CHECK IF A CHAT BETWEEN BOTH PARTIES ALREADY EXISTS IN DATABASE
//   Chat.findOne({
//     $and: [
//       {interlocutors: {$in: [initiator]}},
//       {interlocutors: {$in: [partner]}},
//     ],
//   })
//     .then(async chat => {
//       if (chat) {
//         const newChat = chat.toObject();
//         //IF CHAT EXISTS, REMOVE USER ID FROM HIDDEN, "HIDDEN MAKES CHAT NOT AVAILABLE TO USER AT CLIENT SIDE"
//         const editedChat = await Chat.findByIdAndUpdate(
//           {_id: mongoose.Types.ObjectId(newChat._id).toString()},
//           {
//             $pull: {
//               hidden: initiator,
//             },
//             partnerTime: moment().format(),
//           },
//           {new: true}
//         );
//         const user = await User.findById(partner);

//         res
//           .status(201)
//           .json({partnerData: user, ...editedChat.toObject(), messages: []});
//         //console.log(chat);
//       } else {
//         // const interlocutors = [initiator, partner];

//         // const newChat = new Chat({
//         //   interlocutors,
//         //   initiator,
//         //   partner,
//         //   hidden: [partner],
//         // });

//         // User.aggregate([
//         //   {$match: {_id: mongoose.Types.ObjectId(partner)}},
//         // ]).then(user => {
//         //   return newChat.save().then(chat => {
//         //     res
//         //       .status(201)
//         //       .json({partnerData: user[0], ...chat._doc, messages: []});
//         //   });
//         // });
//         console.log("chat doesn't already exist");
//       }
//     })
//     .catch(error => {
//       console.log(error);
//       return res.status(500).json({message: "Failed to start chat", error});
//     });
// };

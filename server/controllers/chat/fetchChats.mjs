import moment from "moment";
import Chat from "../../models/chat.mjs";

export const fetchChats = (req, res) => {
  const {id} = req.user;

  Chat.aggregate([
    {
      $match: {
        $and: [{interlocutors: {$in: [id]}}, {hidden: {$nin: [id]}}],
      },
    },

    {
      $set: {
        //createdAt: moment().format(),
        createdAt: {
          $cond: {
            if: {$eq: ["$partner", id]},
            then: "$partnerTime",
            else: "$initiatorTime",
          },
        },
      },
    },

    {
      $lookup: {
        from: "users",
        let: {
          userObjId: {
            $cond: {
              if: {$eq: ["$partner", id]},
              then: {$toObjectId: "$initiator"},
              else: {$toObjectId: "$partner"},
            },
          },
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$userObjId"],
              },
            },
          },
        ],
        as: "partnerData",
      },
    },

    {
      $lookup: {
        from: "messages",
        let: {id: {$toString: "$_id"}},
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$chatId", "$$id"],
                  },
                  {$not: {$in: [id, "$deleted"]}},
                ],
              },
            },
          },
          {
            $sort: {time: +1},
          },
          {
            $set: {
              time: {
                $cond: {
                  if: {$eq: ["$sender", id]},
                  then: "$time",
                  else: "$delivered_at",
                },
              },
            },
          },
        ],
        as: "messages",
      },
    },

    {
      $unwind: {
        path: "$partnerData",
        preserveNullAndEmptyArrays: true,
      },
    },
  ])
    .then(chats => {
      return res.status(200).json(chats);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({message: "Failed to fetch chats", error});
    });
};

import Chat from "../../models/chat.js";

export const fetchSingleChat = (req, res) => {
  const {id} = req.user;
  const partner = req.params.id;

  Chat.aggregate([
    {
      $match: {
        $and: [{interlocutors: {$in: [id]}}, {interlocutors: {$in: [partner]}}],
      },
    },

    {
      $set: {
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
      return res.status(200).json(chats[0]);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({message: "Failed to fetch chats", error});
    });
};

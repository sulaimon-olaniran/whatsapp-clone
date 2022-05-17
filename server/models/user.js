import mongoose from "mongoose";
import moment from "moment";

const userSchema = mongoose.Schema({
  username: String,

  password: {
    type: String,
    select: false,
  },

  profile_photo: {
    type: String,
    default: "",
  },

  phone_number: {
    type: String,
    unique: true,
  },

  about: {
    type: String,
    default: "Hey there I'm using O-S Whatsapp Clone",
  },

  pinned_chats: Array,

  archived_chats: Array,

  last_seen: {
    type: Date,
    default: moment().format(),
  },

  presence: {
    type: Map,
    default: {
      last_seen: {
        type: Date,
        default: moment().format(),
      },

      is_online: {
        type: Boolean,
        default: true,
      },
    },
  },

  privacy: {
    type: Map,
    default: {
      last_seen: "everyone",

      profile_photo: "everyone",

      about: "everyone",

      read_receipts: true,

      groups: "everyone",

      selected_contacts: [],

      blocked_contacts: [],
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;

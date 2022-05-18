import mongoose from "mongoose";
import moment from "moment";

const chatSchema = mongoose.Schema({
  initiator: String,
  interlocutors: Array,
  partner: String,

  pinned: {
    type: Array,
    default: [],
  },

  unread: {
    type: Array,
    default: [],
  },

  deleted: {
    type: Array,
    default: [],
  },

  archived: {
    type: Array,
    default: [],
  },

  mute_notifications: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: moment().format(),
  },

  initiatorTime: {
    type: Date,
    default: moment().format(),
  },

  partnerTime: {
    type: Date,
    default: moment().format(),
  },

  hidden: {
    type: Array,
    default: [],
  },

  isActivated: {
    type: Boolean,
    default: false,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;

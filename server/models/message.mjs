import mongoose from "mongoose";
import moment from "moment";

const messageSchema = mongoose.Schema({
  sender: String,
  receiver: String,
  chatId: String,
  subId: String,
  time: {
    type: Date,
    default: moment().format(),
  },

  isSent: {
    type: Boolean,
    default: true,
  },

  isDelivered: {
    type: Boolean,
    default: false,
  },

  isSeen: {
    type: Boolean,
    default: false,
  },

  type: String,
  doc: Array,
  pdf: Array,
  message: String,
  caption: String,
  sticker: String,
  image: Array,
  gif: Array,
  contacts: Array,

  isReply: {
    type: Boolean,
    default: false,
  },

  starred: Array,

  repliedTo: String,

  delete_everyone: {
    type: Boolean,
    default: false,
  },

  deleted: {
    type: Array,
    default: [],
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  cleared: {
    type: Array,
    default: [],
  },

  read_at: Date,

  delivered_at: {
    type: Date,
    default: moment().format(),
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;

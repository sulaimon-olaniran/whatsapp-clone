import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
  name: String,
  contact: String,
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";

import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import messageRoute from "./routes/message.js";

dotenv.config();

const {PORT, MONGODB_URI} = process.env;

const app = express();

app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit: "30mb", extended: true}));

app.use(cors());

app.use(express.Router());
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Sulaimon-Olaniran Whatsapp-Clone API");
});

const SERVER_PORT = PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Application is connected to MongoDB...");

    app.listen(SERVER_PORT, () =>
      console.log(`Server running on port: ${SERVER_PORT}...`)
    );
  })
  .catch(err => {
    console.log(err);
  });

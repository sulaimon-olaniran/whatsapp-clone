import express from "express";

import jwtAuthentication from "../controllers/middleware/jwtAuth.js";

import {deliverMessage} from "../controllers/message/deliverMessage.js";
import {readMessage} from "../controllers/message/readMessage.js";
import {sendMessage} from "../controllers/message/sendMessage.js";
import {starMessage} from "../controllers/message/starMessage.js";
import {unStarMessage} from "../controllers/message/unStarMessage.js";
import {
  deleteMessageForMe,
  deleteMessageForEveryone,
} from "../controllers/message/deleteMessage.js";
import {fetchStarredMessages} from "../controllers/message/fetchStarredMessages.js";
import {fetchMessage} from "../controllers/message/fetchMessage.js";
//import {clearMessage} from "../controllers/message/clearMessage.js";

const router = express.Router();

router.post("/send", jwtAuthentication, sendMessage);
router.patch("/read", jwtAuthentication, readMessage);
router.patch("/delivered", jwtAuthentication, deliverMessage);
router.patch("/star", jwtAuthentication, starMessage);
router.patch("/unstar", jwtAuthentication, unStarMessage);
router.patch("/delete/for/me", jwtAuthentication, deleteMessageForMe);
router.patch(
  "/delete/for/everyone",
  jwtAuthentication,
  deleteMessageForEveryone
);
router.get("/fetch/starred", jwtAuthentication, fetchStarredMessages);
router.get("/fetch/:id", jwtAuthentication, fetchMessage);
//router.delete("/clear", jwtAuthentication, clearMessage);

export default router;

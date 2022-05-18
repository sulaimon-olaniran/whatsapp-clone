import express from "express";

import jwtAuthentication from "../controllers/middleware/jwtAuth.mjs";

import {deliverMessage} from "../controllers/message/deliverMessage.mjs";
import {readMessage} from "../controllers/message/readMessage.mjs";
import {sendMessage} from "../controllers/message/sendMessage.mjs";
import {starMessage} from "../controllers/message/starMessage.mjs";
import {unStarMessage} from "../controllers/message/unStarMessage.mjs";
import {
  deleteMessageForMe,
  deleteMessageForEveryone,
} from "../controllers/message/deleteMessage.mjs";
import {fetchStarredMessages} from "../controllers/message/fetchStarredMessages.mjs";
import {fetchMessage} from "../controllers/message/fetchMessage.mjs";
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

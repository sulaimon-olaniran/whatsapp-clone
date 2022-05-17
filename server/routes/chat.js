import express from "express";

import jwtAuthentication from "../controllers/middleware/jwtAuth.js";
import {isTyping} from "../controllers/chat/isTyping.js";
import {createChat} from "../controllers/chat/createChat.js";
import {fetchChats} from "../controllers/chat/fetchChats.js";
import {pinChat} from "../controllers/chat/pinChat.js";
import {unpinChat} from "../controllers/chat/unpinChat.js";
import {archiveChat} from "../controllers/chat/archiveChat.js";
import {unarchiveChat} from "../controllers/chat/unArchiveChat.js";
import {markChatAsUnread} from "../controllers/chat/markAsUnread.js";
import {markChatAsRead} from "../controllers/chat/markAsRead.js";
import {unhideChat} from "../controllers/chat/unhideChat.js";
import {hideChat} from "../controllers/chat/hideChat.js";
import {fetchSingleChat} from "../controllers/chat/fetchSingleChat.js";

const router = express.Router();

router.post("/typing", jwtAuthentication, isTyping);
router.post("/create/chat", jwtAuthentication, createChat);
router.get("/fetch/chats", jwtAuthentication, fetchChats);
router.get("/fetch/single/chat/:id", jwtAuthentication, fetchSingleChat);
router.patch("/pin", jwtAuthentication, pinChat);
router.patch("/unpin", jwtAuthentication, unpinChat);
router.patch("/archive", jwtAuthentication, archiveChat);
router.patch("/unarchive", jwtAuthentication, unarchiveChat);
router.patch("/mark/unread", jwtAuthentication, markChatAsUnread);
router.patch("/mark/read", jwtAuthentication, markChatAsRead);
router.patch("/unhide", jwtAuthentication, unhideChat);
router.patch("/hide", jwtAuthentication, hideChat);

export default router;

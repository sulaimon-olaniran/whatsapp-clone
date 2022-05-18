import express from "express";

import jwtAuthentication from "../controllers/middleware/jwtAuth.mjs";
import {isTyping} from "../controllers/chat/isTyping.mjs";
import {createChat} from "../controllers/chat/createChat.mjs";
import {fetchChats} from "../controllers/chat/fetchChats.mjs";
import {pinChat} from "../controllers/chat/pinChat.mjs";
import {unpinChat} from "../controllers/chat/unpinChat.mjs";
import {archiveChat} from "../controllers/chat/archiveChat.mjs";
import {unarchiveChat} from "../controllers/chat/unarchiveChat.mjs";
import {markChatAsUnread} from "../controllers/chat/markAsUnread.mjs";
import {markChatAsRead} from "../controllers/chat/markAsRead.mjs";
import {unhideChat} from "../controllers/chat/unhideChat.mjs";
import {hideChat} from "../controllers/chat/hideChat.mjs";
import {fetchSingleChat} from "../controllers/chat/fetchSingleChat.mjs";

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

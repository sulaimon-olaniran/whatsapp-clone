import express from "express";

const router = express.Router();

import jwtAuthentication from "../controllers/middleware/jwtAuth.js";

import {signupUser} from "../controllers/user/signupUser.js";
import {signinUser} from "../controllers/user/signinUser.js";
import {fetchAccountData} from "../controllers/user/fetchAccountData.js";
import {updateUserData} from "../controllers/user/updateUserData.js";
import {updatePrivacySettings} from "../controllers/user/updatePrivacySettings.js";
import {fetchAppUsers} from "../controllers/user/fetchAppUsers.js";
import {blockContact} from "../controllers/user/blockContact.js";
import {unblockContact} from "../controllers/user/unblockContact.js";
import {fetchUser} from "../controllers/user/fetchUser.js";
import {
  userIsOffline,
  userIsOnline,
} from "../controllers/user/updatePresence.js";

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/fetch/account/data", jwtAuthentication, fetchAccountData);
router.patch("/update/user/data", jwtAuthentication, updateUserData);
router.patch(
  "/update/user/privacy/settings",
  jwtAuthentication,
  updatePrivacySettings
);
router.get("/fetch/all", jwtAuthentication, fetchAppUsers);
router.patch("/block/contact", jwtAuthentication, blockContact);
router.patch("/unblock/contact", jwtAuthentication, unblockContact);
router.get("/fetch/:id", jwtAuthentication, fetchUser);
router.post("/online", jwtAuthentication, userIsOnline);
router.post("/offline", jwtAuthentication, userIsOffline);

export default router;

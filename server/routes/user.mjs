import express from "express";

const router = express.Router();

import jwtAuthentication from "../controllers/middleware/jwtAuth.mjs";

import {signupUser} from "../controllers/user/signupUser.mjs";
import {signinUser} from "../controllers/user/signinUser.mjs";
import {fetchAccountData} from "../controllers/user/fetchAccountData.mjs";
import {updateUserData} from "../controllers/user/updateUserData.mjs";
import {updatePrivacySettings} from "../controllers/user/updatePrivacySettings.mjs";
import {fetchAppUsers} from "../controllers/user/fetchAppUsers.mjs";
import {blockContact} from "../controllers/user/blockContact.mjs";
import {unblockContact} from "../controllers/user/unblockContact.mjs";
import {fetchUser} from "../controllers/user/fetchUser.mjs";
import {
  userIsOffline,
  userIsOnline,
} from "../controllers/user/updatePresence.mjs";

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

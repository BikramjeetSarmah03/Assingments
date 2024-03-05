import express from "express";

import { isAuthenticatedUser } from "../../middlewares";
import {
  loginUser,
  logout,
  registerUser,
  verifyUser,
} from "../../controllers/user";

const router = express.Router();

router.post("/sign-up", registerUser);
router.post("/sign-in", loginUser);
router.get("/verify", isAuthenticatedUser, verifyUser);
router.get("/logout", isAuthenticatedUser, logout);

export default router;

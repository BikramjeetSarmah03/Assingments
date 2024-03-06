import express from "express";

import { isAuthenticated } from "../middlewares";
import {
  loginUser,
  logout,
  registerUser,
  verifyUser,
  loginAdmin,
} from "../controllers/auth.controllers";

const router = express.Router();

router.post("/user/sign-up", registerUser);
router.post("/user/sign-in", loginUser);
router.post("/admin/sign-in", loginAdmin);

router.get("/verify", isAuthenticated, verifyUser);
router.get("/logout", isAuthenticated, logout);

export default router;

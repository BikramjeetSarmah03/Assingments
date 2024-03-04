import express from "express";

import { loginUser, logout, registerUser, verifyUser } from "../controllers";
import { isAuthenticated } from "../middlewares";

const router = express.Router();

router.post("/sign-up", registerUser);
router.post("/sign-in", loginUser);
router.get("/verify", isAuthenticated, verifyUser);
router.get("/logout", isAuthenticated, logout);

export default router;

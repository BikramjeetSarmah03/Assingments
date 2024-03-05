import express from "express";

import { loginAdmin, logout, verifyAdmin } from "../../controllers/admin";
import { isAuthenticatedAdmin } from "../../middlewares";

const router = express.Router();

router.use("/sign-in", loginAdmin);
router.use("/logout", isAuthenticatedAdmin, logout);
router.use("/verify", isAuthenticatedAdmin, verifyAdmin);

export default router;

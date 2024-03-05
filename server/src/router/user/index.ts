import express from "express";
import authRoutes from "./auth.routes";
import proposalRoutes from "./proposal.routes";

import { isAuthenticatedUser } from "../../middlewares";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/proposal", isAuthenticatedUser, proposalRoutes);

export default router;

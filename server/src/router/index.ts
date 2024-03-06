import express from "express";
import authRoutes from "./auth.routes";
import proposalRoutes from "./proposal.routes";
import dashboardRoutes from "./dashboard.routes";
import { isAuthenticated } from "../middlewares";

const router = express.Router();

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/proposal", isAuthenticated, proposalRoutes);
router.use("/api/v1", isAuthenticated, dashboardRoutes);

export default router;

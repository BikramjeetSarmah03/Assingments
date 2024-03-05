import express from "express";
import userRoutes from "./user";
import adminRoutes from "./admin";

const router = express.Router();

router.use("/api/v1/user", userRoutes);
router.use("/api/v1/admin", adminRoutes);

export default router;

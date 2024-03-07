import express from "express";

import { authorizeRoles, isAuthenticated } from "../middlewares";
import {
  getAdminDashboard,
  getUserDashboard,
  getAllUsers,
} from "../controllers/dashboard.controllers";
import { ROLE } from "@prisma/client";

const router = express.Router();

router.get(
  "/admin/dashboard",
  isAuthenticated,
  authorizeRoles(ROLE.ADMIN),
  getAdminDashboard
);
router.get(
  "/user/dashboard",
  isAuthenticated,
  authorizeRoles(ROLE.USER),
  getUserDashboard
);
router.get("/users", isAuthenticated, authorizeRoles(ROLE.ADMIN), getAllUsers);

export default router;

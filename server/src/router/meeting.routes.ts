import express from "express";
import { createMeeting } from "../controllers/meeting.controllers";
import { authorizeRoles } from "../middlewares";
import { ROLE } from "@prisma/client";

const router = express.Router();

router.post("/", authorizeRoles(ROLE.ADMIN), createMeeting);

export default router;

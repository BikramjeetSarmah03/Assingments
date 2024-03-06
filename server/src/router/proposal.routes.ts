import express from "express";
import {
  createProposal,
  deletePropsal,
  getAllProposals,
  getProposal,
  getProposals,
  changeProposalStatus,
} from "../controllers/proposal.controller";
import { authorizeRoles } from "../middlewares";
import { ROLE } from "@prisma/client";

const router = express.Router();

router.post("/", createProposal);
router.get("/", getProposals);
router.get("/all", authorizeRoles(ROLE.ADMIN), getAllProposals);

router.get("/:id", getProposal);
router.delete("/:id", deletePropsal);

router.patch("/:id", authorizeRoles(ROLE.ADMIN), changeProposalStatus);

export default router;

import express from "express";
import {
  createProposal,
  getProposals,
} from "../../controllers/proposal.controller";

const router = express.Router();

router.post("/", createProposal);
router.get("/", getProposals);

export default router;

import { NextFunction, Response } from "express";
import { Request } from "../@types/types";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import { db } from "../config/db";
import { ROLE } from "@prisma/client";

export const getAdminDashboard = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalUsers = await db.user.count({
      where: {
        role: ROLE.USER,
      },
    });

    const proposals = await db.proposal.findMany();

    const pendingProposals = proposals.filter(
      (prop) => prop.status === "PENDING"
    );
    const approvedProposals = proposals.filter(
      (prop) => prop.status === "APPROVED"
    );
    const rejectedProposals = proposals.filter(
      (prop) => prop.status === "REJECTED"
    );

    res.status(200).json({
      success: true,
      totalUsers,
      totalProposals: proposals.length,
      pendingProposals,
      approvedProposals,
      rejectedProposals,
    });
  }
);

export const getUserDashboard = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const proposals = await db.proposal.findMany({
      where: {
        userId: req.user.id,
      },
    });

    const pendingProposals = proposals.filter(
      (prop) => prop.status === "PENDING"
    ).length;

    const approvedProposals = proposals.filter(
      (prop) => prop.status === "APPROVED"
    ).length;
    const rejectedProposals = proposals.filter(
      (prop) => prop.status === "REJECTED"
    ).length;

    res.status(200).json({
      success: true,
      totalProposals: proposals.length,
      proposals,
      pendingProposals,
      approvedProposals,
      rejectedProposals,
    });
  }
);

import { NextFunction, Response } from "express";
import { Request } from "../@types/types";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import { db } from "../config/db";

export const createProposal = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      description,
      objective,
      duration,
      budget,
      state,
      district,
      pincode,
      postOffice,
      policeStation,
      address,
      bankName,
      ifsc,
      accountNumber,
      bankBranch,
      incomeSource,
      incomeAmount,
      ownerName,
      ownerNumber,
      ownerEmail,
      landLocation,
      landArea,
      landType,
      usage,
      ownershipStatus,
      landDescription,
      remarks,
    } = req.body;

    const proposal = await db.proposal.create({
      data: {
        title,
        description,
        objective,
        duration,
        budget,
        address: {
          address,
          state,
          district,
          pincode,
          postOffice,
          policeStation,
        },
        bankDetails: {
          accountNumber,
          bankName,
          branch: bankBranch,
          ifsc,
        },
        incomeDetails: {
          amount: incomeAmount,
          source: incomeSource,
        },
        landDetails: {
          area: landArea,
          description: landDescription,
          location: landLocation,
          ownerEmail,
          ownerName,
          ownerNumber,
          ownershipStatus,
          type: landType,
          usage,
        },
        documents: {
          addressProof: "",
          incomeProof: "",
          photo: "",
        },
        remarks,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Proposal Added",
      proposal,
    });
  }
);

export const getProposals = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const proposals = await db.proposal.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      proposals,
    });
  }
);

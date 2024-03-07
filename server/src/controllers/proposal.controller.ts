import { NextFunction, Response } from "express";
import { Request } from "../@types/types";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import { db } from "../config/db";
import { ROLE } from "@prisma/client";
import ErrorHandler from "../utils/errorHandler";
import { deleteFile, uploadFile } from "../utils/cloudinary";
import { removeFileFromDisk } from "../utils/multer";

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
          photo: { public_id: "", secure_url: "" },
          addressProof: { public_id: "", secure_url: "" },
          incomeProof: { public_id: "", secure_url: "" },
        },
        remarks,
        userId: req.user.id,
      },
    });

    const files = req.files as any[];
    let imageUrls = [{ public_id: "", secure_url: "" }];

    if (!files?.length)
      return next(new ErrorHandler("Please send the files", 400));

    try {
      await Promise.all(
        files.map(async (file) => {
          const res = await uploadFile(
            file.path,
            `${req.user.id}/${proposal.id}`
          );

          if (!res) {
            throw new ErrorHandler("Error while uploading files", 500);
          }

          imageUrls.push({
            public_id: res.public_id,
            secure_url: res.secure_url,
          });

          await removeFileFromDisk(file.path);
        })
      );
    } catch (error) {
      console.error(error);

      imageUrls.map(async (url) => {
        await deleteFile(url.public_id);
        return;
      });
      return new ErrorHandler("Error while processing files", 500);
    }

    const finalProposal = await db.proposal.update({
      where: {
        id: proposal.id,
      },
      data: {
        documents: {
          photo: imageUrls[3],
          addressProof: imageUrls[2],
          incomeProof: imageUrls[1],
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Proposal Added",
      proposal: finalProposal,
    });
  }
);

export const getProposals = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const user = req.user;

    const proposals = await db.proposal.findMany({
      where: {
        userId: userId,
      },
    });

    if (user.role === ROLE.USER) {
      proposals.map((proposal) => {
        proposal.editEnable = proposal.status === "REJECTED" ? true : false;
        proposal.deleteEnable = true;
      });
    }

    if (user.role === ROLE.ADMIN) {
      proposals.map((proposal) => {
        proposal.editEnable = true;
        proposal.deleteEnable = false;
      });
    }

    res.status(200).json({
      success: true,
      proposals,
    });
  }
);

export const getProposal = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === ROLE.ADMIN;

    const proposal = await db.proposal.findUnique({
      where: {
        id,
        ...(isAdmin ? {} : { userId }),
      },
    });

    if (!proposal) return next(new ErrorHandler("Proposal Not Found", 500));

    if (proposal.status !== "APPROVED" && isAdmin) {
      proposal.editEnable = true;
    }

    res.status(200).json({
      success: true,
      proposal,
    });
  }
);

export const deletePropsal = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const userId = req.user.id;

    const proposal = await db.proposal.delete({
      where: {
        userId,
        id,
      },
    });

    if (!proposal) return next(new ErrorHandler("Proposal Not Found", 500));

    res.status(200).json({
      success: true,
      message: "Proposal Deleted Successfully",
    });
  }
);

export const getAllProposals = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const proposals = await db.proposal.findMany({});

    res.status(200).json({
      success: true,
      proposals,
    });
  }
);

export const changeProposalStatus = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { status, rejectedFields, remarks } = req.body;

    const proposal = await db.proposal.update({
      where: {
        id,
      },
      data: {
        status,
        highlightedFields: rejectedFields,
        editEnable: status === "REJECTED" ? true : false,
        remarks,
      },
    });

    if (!proposal) return next(new ErrorHandler("Proposal Not Found", 500));

    res.status(200).json({
      success: true,
      proposal,
    });
  }
);

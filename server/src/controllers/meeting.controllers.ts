import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import { db } from "../config/db";
import { Request } from "../@types/types";
import { NextFunction, Response } from "express";

export const createMeeting = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
    });
  }
);

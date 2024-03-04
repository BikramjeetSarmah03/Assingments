import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";

import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import { sendToken, validEmail } from "../utils";
import ErrorHandler from "../utils/errorHandler";
import { db } from "../config/db";

export const registerUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, number, password } = req.body;

    const isValidEmail = validEmail(email);

    if (!isValidEmail)
      return next(
        new ErrorHandler("Please enter a valid email", StatusCodes.BAD_REQUEST)
      );

    const isExist = await db.user.findMany({
      where: {
        OR: [
          {
            email,
            number,
          },
        ],
      },
    });

    if (isExist.length)
      return next(
        new ErrorHandler("User already exists", StatusCodes.BAD_REQUEST)
      );

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const user = await db.user.create({
      data: {
        name,
        email,
        number,
        password: hashPassword,
        salt,
      },
    });

    sendToken(res, user, StatusCodes.CREATED);
  }
);

export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const isValidEmail = validEmail(email);
    if (!isValidEmail)
      return next(
        new ErrorHandler("Please enter a valid email", StatusCodes.BAD_REQUEST)
      );

    const isUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!isUser)
      return next(
        new ErrorHandler("Invalid Email or Password", StatusCodes.UNAUTHORIZED)
      );

    const comparePassword = await bcryptjs.compare(password, isUser.password);

    if (!comparePassword)
      return next(
        new ErrorHandler("Invalid Email or Passsword", StatusCodes.UNAUTHORIZED)
      );

    sendToken(res, isUser, StatusCodes.ACCEPTED);
  }
);

export const logout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logout",
    });
  }
);

export const verifyUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user)
      return next(
        new ErrorHandler(
          "Internal Server Error",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );

    const { password, salt, ...parserUser } = user;

    res.status(200).json({
      success: true,
      user: parserUser,
    });
  }
);

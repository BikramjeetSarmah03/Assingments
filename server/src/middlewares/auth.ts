import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import ErrorHandler from "../utils/errorHandler";
import { db } from "../config/db";
import { Request } from "../@types/types";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  if (!token)
    return next(new ErrorHandler("Token not found", StatusCodes.UNAUTHORIZED));

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || "");

    if (!decodedToken)
      return next(new ErrorHandler("Invalid token", StatusCodes.UNAUTHORIZED));

    const user = await db.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    req.user = user as any;

    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Token Expired", StatusCodes.UNAUTHORIZED));
  }
};

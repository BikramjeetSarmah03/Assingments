import { CookieOptions, Response } from "express";
import { Admin, User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const sendToken = (
  res: Response,
  user: User | Admin,
  statusCode: StatusCodes
) => {
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET || "",
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  const COOKIE_EXPIRE = process.env.COOKIE_EXPIRE as any;

  const options: CookieOptions = {
    expires: new Date(Date.now() + COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

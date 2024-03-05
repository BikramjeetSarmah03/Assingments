import { User as IUser, Admin } from "@prisma/client";
import { Request as ExpressRequest } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | Admin;
    }
    interface User extends IUser, Admin {}
  }
}

export interface Request extends ExpressRequest {
  user?: User | Admin;
}

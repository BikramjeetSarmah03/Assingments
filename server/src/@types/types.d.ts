import { User as IUser } from "@prisma/client";
import { Request as ExpressRequest } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
    interface User extends IUser {}
  }
}

export interface Request extends ExpressRequest {
  user?: User;
}

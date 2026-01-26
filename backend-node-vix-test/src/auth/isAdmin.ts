import { Response, NextFunction } from "express";
import { authUser } from "./authUser";
import { STATUS_CODE } from "../constants/statusCode";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { CustomRequest } from "../types/custom";
import { ERole, user } from "@prisma/client";

export const isAdmin = async (
  req: CustomRequest<user>,
  res: Response,
  next: NextFunction,
) => {
  await authUser(req, res, async () => {
    if (req.user?.role !== ERole.admin) {
      return res.status(STATUS_CODE.FORBIDDEN).json({ message: ERROR_MESSAGE.FORBIDDEN });
    }
    next();
  });
};

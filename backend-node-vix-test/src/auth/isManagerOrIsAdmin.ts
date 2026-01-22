import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { ERole, user } from "@prisma/client";
import { authUser } from "./authUser";

export const isManagerOrIsAdmin = async (
  req: CustomRequest<user>,
  res: Response,
  next: NextFunction,
) => {
  await authUser(req, res, async () => {
    const role = req.user?.role;

    if (role !== ERole.admin && role !== ERole.manager) {
      return res.status(STATUS_CODE.FORBIDDEN).json(ERROR_MESSAGE.FORBIDDEN);
    }

    next();
  });
};

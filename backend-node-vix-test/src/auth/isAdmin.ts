// import { NextFunction, Response } from "express";
// import { CustomRequest } from "../types/custom";
// import { AppError } from "../errors/AppError";
// import { ERROR_MESSAGE } from "../constants/erroMessages";
// import { STATUS_CODE } from "../constants/statusCode";
// import { user } from "@prisma/client";

// export const isAdmin = (
//   req: CustomRequest<unknown>,
//   _res: Response,
//   next: NextFunction,
// ) => {
//   const user = req.user as user;
//   if (user.role !== "admin") {
//     throw new AppError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
//   }
//   return next();
// };

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
      return res.status(STATUS_CODE.FORBIDDEN).json(ERROR_MESSAGE.FORBIDDEN);
    }
    next();
  });
};

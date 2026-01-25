import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { ERole, user } from "@prisma/client";
import { authUser } from "./authUser";

export const isSelfOrIsManagerOrIsAdm = async (
  req: CustomRequest<user>,
  res: Response,
  next: NextFunction,
) => {
  // const user = req.user as user;
  // const idUserFromParams = Number(req.params.idUser);
  // // Logic to check if the user is self, manager, or admin

  // if (user.role !== "admin" && user.role !== "manager") {
  //   throw new AppError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
  // }
  // return next();
  await authUser(req, res, async () => {
    const role = req.user?.role;
    const user = req.user as user;
    const idUserFromParams = req.params.idUser;

    if (role !== ERole.admin && role !== ERole.manager && user.idUser !== idUserFromParams) {
      throw new AppError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }

    next();
  });
};

import { NextFunction, Response } from "express";
import { user } from "@prisma/client";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { STATUS_CODE } from "../constants/statusCode";
import { CustomRequest } from "../types/custom";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { jwtVerifySign } from "../utils/jwtVerifySign";
import { prisma } from "../database/client";

export const authUser = async (
  req: CustomRequest<user>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(ERROR_MESSAGE.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(ERROR_MESSAGE.UNAUTHORIZED);
    }

    const decode = jwtVerifySign(token);

    const user = await prisma.user.findUnique({
      where: { idUser: decode?.idUser },
    });

    if (!user) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(ERROR_MESSAGE.UNAUTHORIZED);
    }

    if (!user.isActive) {
      return res.status(STATUS_CODE.FORBIDDEN).json(ERROR_MESSAGE.FORBIDDEN);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(ERROR_MESSAGE.INVALID_TOKEN);
    }
    if (error instanceof TokenExpiredError) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(ERROR_MESSAGE.TOKEN_EXPIRED);
    }
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ERROR_MESSAGE.SERVER_ERROR);
  }
};

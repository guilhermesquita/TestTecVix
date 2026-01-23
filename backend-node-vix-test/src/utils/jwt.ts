import jwt, { TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { IPayload } from "./interface/IPayload";

const secret = process.env.JWT_SECRET;

export const genToken = (payload: IPayload) => {
  return jwt.sign(payload, secret as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): IPayload => {
  if (!token || !token.trim()) {
    throw new AppError(ERROR_MESSAGE.TOKEN_MISSING, STATUS_CODE.UNAUTHORIZED);
  }

  try {
    const payload = jwt.verify(token, secret as string) as IPayload;
    return payload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError(ERROR_MESSAGE.TOKEN_EXPIRED, STATUS_CODE.UNAUTHORIZED);
    }
    throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }
};

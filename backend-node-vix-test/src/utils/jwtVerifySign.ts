import jwt from "jsonwebtoken";
import { IPayload } from "./interface/IPayload";

const secret = process.env.JWT_SECRET;

export const jwtVerifySign = (token: string): IPayload | null => {
  try {
    const data = jwt.verify(token, secret as string) as IPayload;
    return data;
  } catch {
    return null;
  }
};

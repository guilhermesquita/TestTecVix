import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const errorHandler = (
  err:
    | AppError
    | ZodError
    | {
      status?: number;
    },
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    const { status, message } = err;
    return res.status(status).json({ message });
  }
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ message: err.issues.map((issue) => issue.message).join(",\n ") });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    return res.status(400).json(err);
  }
  console.log(err);
  return res.status(err?.status || 500).json(err);
};

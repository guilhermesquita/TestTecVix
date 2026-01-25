import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import multer from "multer";

export const errorHandler = (
  err:
    | AppError
    | ZodError
    | Error
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

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "The file is too large. The maximum limit is 50MB." });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    return res.status(400).json(err);
  }
  const status = (err as any)?.status || 500;
  const message = (err as any)?.message || "Internal Server Error";
  return res.status(status).json({ message });
};

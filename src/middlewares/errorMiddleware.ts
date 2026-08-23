import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || res.statusCode || 500;
  const finalStatus = statusCode < 400 ? 500 : statusCode;

  res.status(finalStatus).json({
    message: err.message || "Internal Server Error",
  });
};

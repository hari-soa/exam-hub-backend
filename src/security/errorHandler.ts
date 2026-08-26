import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

const mapPgError = (err: any): ApiError | null => {
  if (!err || !err.code) return null;

  switch (err.code) {
    case "23505":
      return ApiError.conflict(
        "A resource with this identifier already exists or violates a uniqueness constraint.",
      );
    case "23514":
      return ApiError.badRequest(err.message);
    case "23503":
      return ApiError.conflict(
        "Cannot delete or update this resource because it is referenced elsewhere.",
      );
    default:
      return null;
  }
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    const status = err.status;
    return res.status(status).json({ message: err.message });
  }

  const pgError = mapPgError(err);
  if (pgError) {
    const status = pgError.status;
    return res.status(status).json({ message: pgError.message });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Internal server error." });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

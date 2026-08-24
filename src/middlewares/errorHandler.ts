import { NextFunction, Request, Response } from "express";
import { ApiError } from "./ApiError";

function mapPgError(err: any): ApiError | null {
    if (!err || !err.code) return null;

    switch (err.code) {
        case "23505":
            return ApiError.conflict("Conflict: resource already exists or violates a uniqueness constraint.");
        case "23514":
            return ApiError.badRequest(err.message || "Invalid data.");
        case "23503":
            return ApiError.conflict("Conflict: this resource is referenced elsewhere and cannot be modified or deleted.");
        default:
            return null;
    }
}

export function notFoundHandler(_req: Request, res: Response) {
    res.status(404).json({ message: "Route not found" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }

    const pgError = mapPgError(err);
    if (pgError) {
        return res.status(pgError.status).json({ message: pgError.message });
    }

    // eslint-disable-next-line no-console
    console.error("Unhandled error:", err);
    return res.status(500).json({ message: "Internal server error." });
}

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
}
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../middlewares/ApiError";
import { UserRole } from "./jwt";

export function requireRole(role: UserRole) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(ApiError.unauthorized());
        }
        if (req.user.role !== role) {
            return next(ApiError.forbidden("You do not have permission to access this resource"));
        }
        return next();
    };
}
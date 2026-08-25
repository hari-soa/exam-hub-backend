import { NextFunction, Request, Response } from "express";
import { verifyToken, JwtPayload } from "./jwt";
import { ApiError } from "../middlewares/ApiError";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return next(ApiError.unauthorized("Missing authentication token"));
    }

    const token = header.slice("Bearer ".length).trim();

    try {
        const payload = verifyToken(token);
        req.user = payload;
        return next();
    } catch {
        return next(ApiError.unauthorized("Invalid or expired authentication token"));
    }
}
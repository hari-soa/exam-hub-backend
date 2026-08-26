import { JwtPayload } from "jsonwebtoken";
import { JwtPayload } from "../security/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        name?: string;
      };
    }
  }
}

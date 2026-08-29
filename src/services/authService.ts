import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "24h";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: "admin" | "student";
  };
}

export class AuthService {
  static async login(credentials: LoginDTO): Promise<LoginResponse> {
    const { email, password } = credentials;

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (user.is_active === false) {
      const error: any = new Error("Account disabled");
      error.statusCode = 401;
      throw error;
    }

    if (user.password !== password) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };
  }
}

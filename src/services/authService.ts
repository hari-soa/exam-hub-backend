import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';

// Clé secrète JWT (à placer idéalement dans un fichier .env)
const JWT_SECRET = process.env.JWT_SECRET || 'votre_super_cle_secrete_jwt';
const JWT_EXPIRES_IN = '24h';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: 'admin' | 'student';
  };
}

export class AuthService {
  /**
   * Authentifie un utilisateur (Admin ou Étudiant)
   */
  static async login(credentials: LoginDTO): Promise<LoginResponse> {
    const { email, password } = credentials;

    // 1. Recherche de l'utilisateur par son email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 2. Vérification si le compte est désactivé (pour les étudiants)
    if (user.is_active === false) {
      const error: any = new Error('Account disabled');
      error.statusCode = 401;
      throw error;
    }

    // 3. Vérification directe du mot de passe en texte brut (sans hachage)
    if (user.password !== password) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 4. Génération du JWT (payload: userId et role)
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 5. Retourne le token et les infos de l'utilisateur sans le mot de passe
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
/**
 * Service d'authentification
 * Responsabilité: toute la logique métier liée à l'auth
 */
import { IUser, RegisterInput } from ".//interfaces/index.ts";
/**
 * Génère un token JWT
 */
export declare const generateToken: (user: IUser) => string;
/**
 * Recherche un utilisateur par email
 */
export declare const findUserByEmail: (email: string) => Promise<IUser | null>;
/**
 * Recherche un utilisateur par ID
 */
export declare const findUserById: (id: string) => Promise<IUser | null>;
/**
 * Crée un nouvel utilisateur
 */
export declare const createUser: (data: RegisterInput) => Promise<IUser>;
/**
 * Vérifie le mot de passe
 */
export declare const verifyPassword: (password: string, hashedPassword: string) => Promise<boolean>;
//# sourceMappingURL=AuthService.d.ts.map
/**
 * Interfaces pour les utilisateurs
 */

// Type pour le rôle utilisateur
export type UserRole = "client" | "prestataire" | "admin";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IUserCreate {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "client" | "prestataire" | "admin";
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

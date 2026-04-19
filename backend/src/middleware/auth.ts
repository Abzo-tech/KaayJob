/**
 * Middleware d'authentification JWT
 */

import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "kaayjob-secret-key-change-in-production";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token requis" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };
    (req as AuthRequest).user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token invalide" });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as AuthRequest).user;
  if (!user || user.role?.toUpperCase() !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Accès refusé" });
  }
  next();
};

export const requireProvider = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as AuthRequest).user;
  if (!user || user.role?.toUpperCase() !== "PRESTATAIRE") {
    return res.status(403).json({ success: false, message: "Accès refusé" });
  }
  next();
};

export default { authenticate, requireAdmin, requireProvider };

/**
 * Composant modal pour voir les détails d'un utilisateur
 */

import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  is_verified?: boolean;
  created_at: string;
}

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

function getRoleBadge(role: string) {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return (
        <Badge className="bg-purple-100 text-purple-800">
          Admin
        </Badge>
      );
    case "PRESTATAIRE":
      return (
        <Badge className="bg-blue-100 text-blue-800">
          Prestataire
        </Badge>
      );
    case "CLIENT":
      return (
        <Badge className="bg-green-100 text-green-800">
          Client
        </Badge>
      );
    default:
      return <Badge>{role}</Badge>;
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR");
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de l'utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nom complet</label>
            <p className="text-lg">
              {user.first_name} {user.last_name}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p>{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Téléphone</label>
            <p>{user.phone || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Rôle</label>
            <div className="mt-1">{getRoleBadge(user.role)}</div>
          </div>
          <div>
            <label className="text-sm font-medium">Vérifié</label>
            <p>{user.is_verified ? "Oui" : "Non"}</p>
          </div>
          <div>
            <label className="text-sm font-medium">
              Date d'inscription
            </label>
            <p>{formatDate(user.created_at)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

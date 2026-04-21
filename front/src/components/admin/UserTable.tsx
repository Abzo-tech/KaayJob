/**
 * Composant de tableau pour la liste des utilisateurs
 */

import { MoreVertical, Eye, Loader2, Check, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isVerified?: boolean;
  bookingCount?: number;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  actionLoading: string | null;
  onViewUser: (user: User) => void;
  onVerifyProvider: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

function getRoleBadge(role: string) {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Admin
        </Badge>
      );
    case "PRESTATAIRE":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Prestataire
        </Badge>
      );
    case "CLIENT":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
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

export function UserTable({
  users,
  actionLoading,
  onViewUser,
  onVerifyProvider,
  onDeleteUser,
}: UserTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Réservations</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                  {user.role === "PRESTATAIRE" && !user.isVerified && (
                    <Badge className="ml-2 bg-orange-100 text-orange-800">
                      Non vérifié
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{user.bookingCount || 0}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewUser(user)}>
                        <Eye size={14} className="mr-2" />
                        Voir le profil
                      </DropdownMenuItem>
                      {user.role === "PRESTATAIRE" && !user.isVerified && (
                        <DropdownMenuItem
                          className="text-green-600"
                          onClick={() => onVerifyProvider(user.id)}
                          disabled={actionLoading === user.id}
                        >
                          {actionLoading === user.id ? (
                            <Loader2
                              size={14}
                              className="mr-2 animate-spin"
                            />
                          ) : (
                            <Check size={14} className="mr-2" />
                          )}
                          Vérifier le prestataire
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDeleteUser(user.id)}
                        disabled={actionLoading === user.id}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

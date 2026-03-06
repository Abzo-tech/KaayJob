import { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Calendar,
  Shield,
  UserCog,
  Loader2,
  Check,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
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
import { api } from "../../lib/api";
import { toast } from "sonner";

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token ? "exists" : "missing");
      
      const response = await api.get("/admin/users?limit=100");
      console.log("Admin users response:", response);
      
      // La réponse est directement dans response.data (pas response.data.data)
      const usersData = response?.data || [];
      console.log("Users loaded:", usersData.length);
      setUsers(usersData);
    } catch (error: any) {
      console.error("Erreur chargement utilisateurs:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.message || "Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
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
  };

  const handleVerifyProvider = async (userId: string) => {
    try {
      setActionLoading(userId);
      await api.put(`/admin/users/${userId}/verify`);
      toast.success("Prestataire vérifié avec succès !");
      loadUsers();
    } catch (error: any) {
      console.error("Erreur vérification:", error);
      toast.error(error.message || "Erreur lors de la vérification");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR");
  };

  // Statistiques
  const totalUsers = users.length;
  const totalProviders = users.filter((u) => u.role === "PRESTATAIRE").length;
  const totalClients = users.filter((u) => u.role === "CLIENT").length;

  if (loading) {
    return (
      <div className="p-6 lg:p-8 lg:ml-64">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#000080]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 lg:ml-64">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#000080]">
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les clients, prestataires et administrateurs
          </p>
        </div>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={roleFilter === "all" ? "default" : "outline"}
                onClick={() => setRoleFilter("all")}
                className={roleFilter === "all" ? "bg-[#000080]" : ""}
              >
                Tous
              </Button>
              <Button
                variant={roleFilter === "client" ? "default" : "outline"}
                onClick={() => setRoleFilter("client")}
                className={roleFilter === "client" ? "bg-[#000080]" : ""}
              >
                Clients
              </Button>
              <Button
                variant={roleFilter === "prestataire" ? "default" : "outline"}
                onClick={() => setRoleFilter("prestataire")}
                className={roleFilter === "prestataire" ? "bg-[#000080]" : ""}
              >
                Prestataires
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserCog className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total utilisateurs</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Prestataires</p>
                <p className="text-2xl font-bold">{totalProviders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Clients</p>
                <p className="text-2xl font-bold">{totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des utilisateurs */}
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
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.booking_count || 0}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                        {user.role === "PRESTATAIRE" && !user.is_verified && (
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={() => handleVerifyProvider(user.id)}
                            disabled={actionLoading === user.id}
                          >
                            {actionLoading === user.id ? (
                              <Loader2 size={14} className="mr-2 animate-spin" />
                            ) : (
                              <Check size={14} className="mr-2" />
                            )}
                            Vérifier le prestataire
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

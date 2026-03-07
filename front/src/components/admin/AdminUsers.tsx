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
  Plus,
  Eye,
  Edit,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { api } from "../../lib/api";
import { toast } from "sonner";

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal states
  const [viewUser, setViewUser] = useState<any>(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "CLIENT",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!createForm.email) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email)) {
      errors.email = "Format d'email invalide";
    }

    if (!createForm.password) {
      errors.password = "Le mot de passe est requis";
    } else if (createForm.password.length < 4) {
      errors.password = "Minimum 4 caractères";
    }

    if (!createForm.firstName) {
      errors.firstName = "Le prénom est requis";
    }

    if (!createForm.lastName) {
      errors.lastName = "Le nom est requis";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
      toast.error(
        error.message || "Erreur lors du chargement des utilisateurs",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName =
      `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.role?.toLowerCase() === roleFilter.toLowerCase();
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

  const handleDeleteUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      await api.delete(`/admin/users/${userId}`);
      toast.success("Utilisateur supprimé avec succès!");
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async () => {
    try {
      setActionLoading("create");
      await api.post("/admin/users", {
        email: createForm.email,
        password: createForm.password,
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        phone: createForm.phone,
        role: createForm.role,
      });
      toast.success("Utilisateur créé avec succès!");
      setCreateUserOpen(false);
      setCreateForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "CLIENT",
      });
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
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
  const unverifiedProviders = users.filter(
    (u) => u.role === "PRESTATAIRE" && !u.is_verified,
  ).length;

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
        <Button
          onClick={() => setCreateUserOpen(true)}
          className="mt-4 md:mt-0 bg-[#000080]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Check className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {unverifiedProviders}
                </p>
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
                  <TableCell>
                    {getRoleBadge(user.role)}
                    {user.role === "PRESTATAIRE" && !user.is_verified && (
                      <Badge className="ml-2 bg-orange-100 text-orange-800">
                        Non vérifié
                      </Badge>
                    )}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => setViewUser(user)}>
                          <Eye size={14} className="mr-2" />
                          Voir le profil
                        </DropdownMenuItem>
                        {user.role === "PRESTATAIRE" && !user.is_verified && (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => handleVerifyProvider(user.id)}
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
                          onClick={() => handleDeleteUser(user.id)}
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

      {/* Modal View User */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom complet</label>
                <p className="text-lg">
                  {viewUser.first_name} {viewUser.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p>{viewUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Téléphone</label>
                <p>{viewUser.phone || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Rôle</label>
                <div className="mt-1">{getRoleBadge(viewUser.role)}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Vérifié</label>
                <p>{viewUser.is_verified ? "Oui" : "Non"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Date d'inscription
                </label>
                <p>{formatDate(viewUser.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Create User */}
      <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900 border-0 shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-[#000080] flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Créer un nouvel utilisateur
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Remplissez les informations pour créer un nouveau compte
              utilisateur
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={createForm.email}
                onChange={(e) => {
                  setCreateForm({ ...createForm, email: e.target.value });
                  setFormErrors({ ...formErrors, email: "" });
                }}
                className={`${formErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="email@exemple.com"
              />
              {formErrors.email && (
                <p className="text-xs text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={createForm.password}
                onChange={(e) => {
                  setCreateForm({ ...createForm, password: e.target.value });
                  setFormErrors({ ...formErrors, password: "" });
                }}
                className={`${formErrors.password ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="Minimum 4 caractères"
              />
              <p className="text-xs text-gray-500">
                Le mot de passe sera visible
              </p>
              {formErrors.password && (
                <p className="text-xs text-red-500">{formErrors.password}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <Input
                  value={createForm.firstName}
                  onChange={(e) => {
                    setCreateForm({ ...createForm, firstName: e.target.value });
                    setFormErrors({ ...formErrors, firstName: "" });
                  }}
                  className={`${formErrors.firstName ? "border-red-500 focus:border-red-500" : ""}`}
                  placeholder="Prénom"
                />
                {formErrors.firstName && (
                  <p className="text-xs text-red-500">{formErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input
                  value={createForm.lastName}
                  onChange={(e) => {
                    setCreateForm({ ...createForm, lastName: e.target.value });
                    setFormErrors({ ...formErrors, lastName: "" });
                  }}
                  className={`${formErrors.lastName ? "border-red-500 focus:border-red-500" : ""}`}
                  placeholder="Nom"
                />
                {formErrors.lastName && (
                  <p className="text-xs text-red-500">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Téléphone
              </label>
              <Input
                value={createForm.phone}
                onChange={(e) =>
                  setCreateForm({ ...createForm, phone: e.target.value })
                }
                placeholder="+221..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rôle <span className="text-red-500">*</span>
              </label>
              <select
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm({ ...createForm, role: e.target.value })
                }
                className="w-full mt-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#000080] focus:border-transparent"
              >
                <option value="CLIENT">Client</option>
                <option value="PRESTATAIRE">Prestataire</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCreateUserOpen(false);
                setFormErrors({});
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                if (validateForm()) {
                  handleCreateUser();
                }
              }}
              disabled={actionLoading === "create"}
              className="flex-1 bg-[#000080] hover:bg-[#000060]"
            >
              {actionLoading === "create" ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Créer l'utilisateur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

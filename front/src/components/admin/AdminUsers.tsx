/**
 * Page de gestion des utilisateurs - Admin
 * Refactorisé avec des composants réutilisables
 */

import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useNotifications } from "../../contexts/NotificationContext";

// Composants réutilisables
import { UserFilters } from "./UserFilters";
import { UserStats } from "./UserStats";
import { UserTable } from "./UserTable";
import { UserDetailsModal } from "./UserDetailsModal";
import { CreateUserForm, CreateUserData } from "./CreateUserForm";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  is_verified?: boolean;
  booking_count?: number;
  created_at: string;
}

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { fetchNotifications } = useNotifications();

  // Modal states
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [createUserOpen, setCreateUserOpen] = useState(false);

  // Charger les utilisateurs au montage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (useCache: boolean = true) => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users?limit=100", useCache);
      const usersData = response?.data || [];
      setUsers(usersData);
    } catch (error: any) {
      console.error("Erreur chargement utilisateurs:", error);
      toast.error(error.message || "Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  // Statistiques
  const totalUsers = users.length;
  const totalProviders = users.filter((u) => u.role === "PRESTATAIRE").length;
  const totalClients = users.filter((u) => u.role === "CLIENT").length;
  const unverifiedProviders = users.filter(
    (u) => u.role === "PRESTATAIRE" && !u.is_verified,
  ).length;

   // Actions
   const handleVerifyProvider = async (userId: string) => {
     try {
       setActionLoading(userId);
       await api.put(`/admin/users/${userId}/verify`);
       toast.success("Prestataire vérifié avec succès !");
       loadUsers(false);
       setTimeout(() => fetchNotifications(), 500);
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
      loadUsers(false);
      setTimeout(() => fetchNotifications(), 500);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async (data: CreateUserData) => {
    try {
      setActionLoading("create");
      await api.post("/admin/users", data);
      toast.success("Utilisateur créé avec succès!");
      setCreateUserOpen(false);
      loadUsers(false);
      setTimeout(() => fetchNotifications(), 500);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    } finally {
      setActionLoading(null);
    }
  };

  // Affichage du chargement
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
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Statistiques */}
      <UserStats
        totalUsers={totalUsers}
        totalProviders={totalProviders}
        totalClients={totalClients}
        unverifiedProviders={unverifiedProviders}
      />

      {/* Tableau des utilisateurs */}
      <UserTable
        users={filteredUsers}
        actionLoading={actionLoading}
        onViewUser={setViewUser}
        onVerifyProvider={handleVerifyProvider}
        onDeleteUser={handleDeleteUser}
      />

      {/* Modal Détails utilisateur */}
      <UserDetailsModal user={viewUser} onClose={() => setViewUser(null)} />

      {/* Modal Création utilisateur */}
      <CreateUserForm
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        onSubmit={handleCreateUser}
        loading={actionLoading === "create"}
      />
    </div>
  );
}

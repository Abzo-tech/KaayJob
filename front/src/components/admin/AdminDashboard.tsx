import { useState, useEffect } from "react";
import { Users, Briefcase, Calendar, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { api } from "../../lib/api";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            <div
              className={`flex items-center mt-2 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}
            >
              <TrendingUp
                size={16}
                className={`mr-1 ${trend === "down" && "rotate-180"}`}
              />
              <span>{change}</span>
            </div>
          </div>
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}
          >
            <Icon size={28} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalClients: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = localStorage.getItem("user");
      
      if (userData) {
        const user = JSON.parse(userData);
        setAdminName(user.firstName || "Admin");
      }

      // Charger les statistiques depuis l'endpoint admin
      const statsRes = await api.get("/admin/stats");
      const usersRes = await api.get("/admin/users?limit=100");
      const servicesRes = await api.get("/admin/services?limit=100");
      const bookingsRes = await api.get("/admin/bookings?limit=100");

      const stats = statsRes?.data;
      // La réponse est directement dans response.data (pas response.data.data)
      const users = usersRes?.data || [];
      const services = servicesRes?.data || [];
      const bookings = bookingsRes?.data || [];

      // Compter par rôle
      const clients = users.filter((u: any) => u.role === "CLIENT" || u.role === "client");

      setStats({
        totalUsers: users.length,
        totalProviders: stats?.providers?.total || 0,
        totalClients: clients.length,
        totalServices: services.length,
        totalBookings: bookings.length,
        totalRevenue: stats?.revenue || 0,
      });

      // Prendre les 5 dernières réservations
      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Confirmé
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            En attente
          </Badge>
        );
      case "CANCELLED":
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Annulé
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Terminé
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 lg:ml-64">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000080]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 lg:ml-64">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#000080]">
          Tableau de bord Admin
        </h1>
        <p className="text-gray-500 mt-1">
          Bienvenue {adminName} dans votre espace d'administration
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Utilisateurs"
          value={stats.totalUsers}
          change={`${stats.totalClients} clients, ${stats.totalProviders} prestataires`}
          trend="up"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Prestataires"
          value={stats.totalProviders}
          change="Prestataires actifs"
          trend="up"
          icon={Briefcase}
          color="bg-green-500"
        />
        <StatCard
          title="Réservations"
          value={stats.totalBookings}
          change="Total réservations"
          trend="up"
          icon={Calendar}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Réservations récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity size={20} className="text-[#000080]" />
              Réservations récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.client?.firstName} {booking.client?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.service?.name || "Service"}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status)}
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(booking.bookingDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
               Aucune réservation pour le moment
              </p>
            )}
          </CardContent>
        </Card>

        {/* Services populaires */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Briefcase size={20} className="text-[#000080]" />
              Services ({stats.totalServices})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              {stats.totalServices} services disponibles sur la plateforme
            </p>
            <p className="text-xs text-gray-500">
              Note: Les paiements sont gérés directement entre client et
              prestataire
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

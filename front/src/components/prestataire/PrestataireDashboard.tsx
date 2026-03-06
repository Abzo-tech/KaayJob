import { useState, useEffect } from "react";
import { Users, Briefcase, Calendar, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { api, ApiResponse } from "../../lib/api";

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

export function PrestataireDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeServices: 0,
    rating: 0,
    totalReviews: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [myServices, setMyServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [providerName, setProviderName] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (!token) {
        setLoading(false);
        return;
      }

      let user: any = null;
      if (userData) {
        user = JSON.parse(userData);
        setProviderName(user.firstName || "Prestataire");
      }

      // Charger les services du prestataire
      const servicesRes = await api.get("/services");
      // La réponse est directement dans response.data (pas response.data.data)
      const allServices = servicesRes?.data || [];
      
      // Filtrer les services par provider (par ID utilisateur)
      const myServicesList = allServices.filter(
        (s: any) => s.providerId === user?.id
      );
      setMyServices(myServicesList);

      // Charger les bookings
      const bookingsRes = await api.get("/bookings");
      // La réponse est directement dans response.data (pas response.data.data)
      const allBookings = bookingsRes?.data || [];
      
      // Filtrer les bookings par provider (par ID)
      const myBookings = allBookings.filter(
        (b: any) => b.service?.providerId === user?.id
      );

      // Calculer les statistiques
      const pending = myBookings.filter(
        (b: any) => b.status === "PENDING" || b.status === "pending"
      ).length;
      const completed = myBookings.filter(
        (b: any) => b.status === "COMPLETED" || b.status === "completed"
      ).length;

      setStats({
        totalBookings: myBookings.length,
        activeServices: myServicesList.filter((s: any) => s.isActive).length,
        rating: 4.5, // Par défaut si pas de reviews
        totalReviews: 0,
        pendingBookings: pending,
        completedBookings: completed,
      });

      // Prendre les 5 dernières réservations
      setRecentBookings(myBookings.slice(0, 5));
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
        );
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>;
      case "CANCELLED":
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
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
          Bienvenue, {providerName} !
        </h1>
        <p className="text-gray-500 mt-1">Gérez vos services et réservations</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Réservations totales"
          value={stats.totalBookings}
          change={`${stats.pendingBookings} en attente`}
          trend={stats.totalBookings > 0 ? "up" : "down"}
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Services actifs"
          value={stats.activeServices}
          change={`${myServices.length} total`}
          trend="up"
          icon={Briefcase}
          color="bg-green-500"
        />
        <StatCard
          title="Note moyenne"
          value={stats.rating > 0 ? stats.rating.toFixed(1) : "N/A"}
          change={stats.totalReviews > 0 ? `${stats.totalReviews} avis` : "Aucun avis"}
          trend="up"
          icon={Star}
          color="bg-yellow-500"
        />
        <StatCard
          title="Réservations terminées"
          value={stats.completedBookings}
          change="Terminées"
          trend="up"
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Réservations récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar size={20} className="text-[#000080]" />
              Réservations récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
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
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(booking.bookingDate)} à {booking.bookingTime}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status)}
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

        {/* Mes services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Briefcase size={20} className="text-[#000080]" />
              Mes services
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {myServices.length > 0 ? (
              <div className="space-y-4">
                {myServices.map((service: any) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        {service.price} € - {service.duration} min
                      </p>
                    </div>
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucun service créé pour le moment
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

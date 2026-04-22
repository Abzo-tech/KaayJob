import { useState, useEffect } from "react";
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Activity,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  UserCheck,
  UserPlus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { api } from "../../lib/api";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, subtitle, trend, trendValue, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: color.replace('bg-', '') }}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            {trend && trendValue && (
              <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                {trend === 'up' ? <ArrowUp size={14} className="mr-1" /> : trend === 'down' ? <ArrowDown size={14} className="mr-1" /> : null}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={28} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

interface UserStats {
  total: number;
  clients: number;
  providers: number;
  admins: number;
  verifiedProviders: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalClients: 0,
    verifiedProviders: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [topServices, setTopServices] = useState<any[]>([]);
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

      const results = await Promise.allSettled([
        api.get("/admin/stats"),
        api.get("/admin/users?limit=50"),
        api.get("/admin/services?limit=50"),
        api.get("/admin/bookings?limit=100"),
        api.get("/admin/analytics"),
      ]);

      const statsRes = results[0].status === "fulfilled" ? results[0].value : null;
      const usersRes = results[1].status === "fulfilled" ? results[1].value : null;
      const servicesRes = results[2].status === "fulfilled" ? results[2].value : null;
      const bookingsRes = results[3].status === "fulfilled" ? results[3].value : null;
      const analyticsRes = results[4].status === "fulfilled" ? results[4].value : null;

      const users = usersRes?.data?.data || usersRes?.data || [];
      const services = servicesRes?.data?.data || servicesRes?.data || [];
      const bookings = bookingsRes?.data?.data || bookingsRes?.data || [];
      const analytics = analyticsRes?.data?.data || analyticsRes?.data || {};

      // Calculate user stats
      const clients = users.filter((u: any) => (u.role || "").toUpperCase() === "CLIENT");
      const providers = users.filter((u: any) => (u.role || "").toUpperCase() === "PRESTATAIRE");
      const verifiedProviders = providers.filter((p: any) => p.isVerified);

      setStats({
        totalUsers: users.length,
        totalProviders: providers.length,
        totalClients: clients.length,
        verifiedProviders: verifiedProviders.length,
        totalServices: services.length,
        totalBookings: bookings.length,
        totalRevenue: statsRes?.data?.revenue || 0,
      });

      // Calculate booking stats
      const pending = bookings.filter((b: any) => (b.status || "").toUpperCase() === "PENDING");
      const confirmed = bookings.filter((b: any) => (b.status || "").toUpperCase() === "CONFIRMED");
      const completed = bookings.filter((b: any) => (b.status || "").toUpperCase() === "COMPLETED");
      const cancelled = bookings.filter((b: any) => (b.status || "").toUpperCase() === "CANCELLED" || (b.status || "").toUpperCase() === "REJECTED");

      setBookingStats({
        total: bookings.length,
        pending: pending.length,
        confirmed: confirmed.length,
        completed: completed.length,
        cancelled: cancelled.length,
      });

      // Top services by bookings
      const serviceBookings: Record<string, number> = {};
      bookings.forEach((b: any) => {
        const serviceName = b.service?.name || "Service";
        serviceBookings[serviceName] = (serviceBookings[serviceName] || 0) + 1;
      });
      const sortedServices = Object.entries(serviceBookings)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setTopServices(sortedServices);

      setRecentBookings(bookings.slice(0, 6));
      setRecentUsers(users.slice(0, 5));
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-800 text-xs">Confirmé</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">En attente</Badge>;
      case "CANCELLED":
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 text-xs">Annulé</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Terminé</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">{status}</Badge>;
    }
  };

  const getUserRoleBadge = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return <Badge className="bg-purple-100 text-purple-800 text-xs">Admin</Badge>;
      case "PRESTATAIRE":
        return <Badge className="bg-green-100 text-green-800 text-xs">Prestataire</Badge>;
      case "CLIENT":
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Client</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">{role}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price || 0) + " XOF";
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
    <div className="p-6 lg:p-8 lg:ml-64 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#000080]">
          Tableau de bord Admin
        </h1>
        <p className="text-gray-500 mt-1">
          Bienvenue {adminName} - Voici un aperçu de votre plateforme
        </p>
      </div>

      {/* Statistiques principales - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Utilisateurs Totaux"
          value={stats.totalUsers}
          subtitle={`${stats.totalClients} clients, ${stats.totalProviders} prestataires`}
          trend="up"
          trendValue="Actifs"
          icon={Users}
          color="#000080"
        />
        <StatCard
          title="Prestataires"
          value={stats.totalProviders}
          subtitle={`${stats.verifiedProviders} vérifiés`}
          trend="up"
          trendValue={`${Math.round((stats.verifiedProviders / (stats.totalProviders || 1)) * 100)}% vérifiés`}
          icon={Briefcase}
          color="#10B981"
        />
        <StatCard
          title="Réservations"
          value={stats.totalBookings}
          subtitle="Total des réservations"
          icon={Calendar}
          color="#8B5CF6"
        />
        <StatCard
          title="Revenus Totaux"
          value={formatPrice(stats.totalRevenue)}
          subtitle="Revenus générés"
          trend="up"
          trendValue="Ce mois"
          icon={DollarSign}
          color="#F59E0B"
        />
      </div>

      {/* Statistiques des réservations - Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                <Clock className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-700">{bookingStats.pending}</p>
                <p className="text-sm text-yellow-600">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <CheckCircle className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{bookingStats.confirmed}</p>
                <p className="text-sm text-green-600">Confirmées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Activity className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{bookingStats.completed}</p>
                <p className="text-sm text-blue-600">Terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                <XCircle className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{bookingStats.cancelled}</p>
                <p className="text-sm text-red-600">Annulées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau de bord principal - Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Réservations récentes */}
        <Card className="lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-[#000080] to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Réservations Récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Prestataire</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentBookings.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">
                            {booking.clientFirstName || booking.client?.firstName || "N/A"} {booking.clientLastName || booking.client?.lastName || ""}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-600">{booking.serviceName || booking.service?.name || "Service"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-600">
                            {booking.providerFirstName || booking.provider?.firstName || "N/A"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-500 text-sm">{formatDate(booking.scheduledAt || booking.bookingDate)}</p>
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(booking.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Calendar size={40} className="mx-auto mb-2 text-gray-300" />
                <p>Aucune réservation pour le moment</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services populaires */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Star size={20} />
              Services Populaires
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {topServices.length > 0 ? (
              <div className="space-y-3">
                {topServices.map((service, index) => (
                  <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-700">{service.name}</span>
                    </div>
                    <Badge variant="outline">{service.count} réservations</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Briefcase size={40} className="mx-auto mb-2 text-gray-300" />
                <p>Aucun service</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Utilisateurs récents - Row 4 */}
      <div className="mt-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <UserPlus size={20} />
              Utilisateurs Récents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nom</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Rôle</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Vérifié</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentUsers.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-600 text-sm">{user.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          {getUserRoleBadge(user.role)}
                        </td>
                        <td className="px-4 py-3">
                          {user.isVerified || user.is_verified ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">Vérifié</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 text-xs">Non vérifié</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-500 text-sm">{formatDate(user.createdAt)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Users size={40} className="mx-auto mb-2 text-gray-300" />
                <p>Aucun utilisateur</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Résumé rapide en bas */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-[#000080]">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Total utilisateurs</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.verifiedProviders}</p>
            <p className="text-sm text-gray-500">Prestataires vérifiés</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{bookingStats.completed}</p>
            <p className="text-sm text-gray-500">Réservations terminées</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{formatPrice(stats.totalRevenue)}</p>
            <p className="text-sm text-gray-500">Revenus totaux</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
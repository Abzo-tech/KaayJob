import { useState, useEffect } from "react";
import { Search, Check, X, Phone, Calendar, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { api } from "../../lib/api";
import { toast } from "sonner";

export function PrestataireBookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // Le backend filtre déjà par prestataire (providerId = user.id)
      // Donc pas besoin de filtrer côté frontend
      const response = await api.get("/bookings");
      // La réponse est dans response.data (le backend retourne { success: true, data: bookings })
      const allBookings = response?.data || [];
      setBookings(allBookings);
    } catch (error) {
      console.error("Erreur chargement réservations:", error);
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      await api.put(`/bookings/${bookingId}/status`, { status: "CONFIRMED" });
      toast.success("Réservation confirmée !");
      loadBookings();
    } catch (error: any) {
      console.error("Erreur confirmation:", error);
      toast.error(error.message || "Erreur lors de la confirmation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      await api.put(`/bookings/${bookingId}/status`, { status: "REJECTED" });
      toast.success("Réservation refusée");
      loadBookings();
    } catch (error: any) {
      console.error("Erreur rejet:", error);
      toast.error(error.message || "Erreur lors du rejet");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      await api.put(`/bookings/${bookingId}/status`, { status: "COMPLETED" });
      toast.success("Réservation marquée comme terminée !");
      loadBookings();
    } catch (error: any) {
      console.error("Erreur complétion:", error);
      toast.error(error.message || "Erreur lors de la complétion");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const clientName =
      `${booking.client?.firstName || ""} ${booking.client?.lastName || ""}`.toLowerCase();
    const matchesSearch = clientName.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      booking.status?.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

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

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (b: any) => b.status === "PENDING",
  ).length;
  const confirmedBookings = bookings.filter(
    (b: any) => b.status === "CONFIRMED",
  ).length;
  const completedBookings = bookings.filter(
    (b: any) => b.status === "COMPLETED",
  ).length;

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:pl-72 lg:pr-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#000080]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:pl-72 lg:pr-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#000080]">Mes réservations</h1>
        <p className="text-gray-500 mt-1">Gérez vos réservations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingBookings}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Confirmées</p>
              <p className="text-2xl font-bold text-green-600">
                {confirmedBookings}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Terminées</p>
              <p className="text-2xl font-bold text-blue-600">
                {completedBookings}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Rechercher par client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-[#000080]" : ""}
              >
                Toutes
              </Button>
              <Button
                variant={statusFilter === "PENDING" ? "default" : "outline"}
                onClick={() => setStatusFilter("PENDING")}
                className={statusFilter === "PENDING" ? "bg-[#000080]" : ""}
              >
                En attente
              </Button>
              <Button
                variant={statusFilter === "CONFIRMED" ? "default" : "outline"}
                onClick={() => setStatusFilter("CONFIRMED")}
                className={statusFilter === "CONFIRMED" ? "bg-[#000080]" : ""}
              >
                Confirmées
              </Button>
              <Button
                variant={statusFilter === "COMPLETED" ? "default" : "outline"}
                onClick={() => setStatusFilter("COMPLETED")}
                className={statusFilter === "COMPLETED" ? "bg-[#000080]" : ""}
              >
                Terminées
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredBookings.map((bookingItem) => (
          <Card key={bookingItem.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">
                      {bookingItem.client?.firstName}{" "}
                      {bookingItem.client?.lastName}
                    </h3>
                    {getStatusBadge(bookingItem.status)}
                  </div>
                  <p className="text-gray-600">
                    {bookingItem.service?.name || "Service"}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(bookingItem.bookingDate)} à{" "}
                      {bookingItem.bookingTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} />
                      {bookingItem.phone}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {bookingItem.status === "PENDING" && (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleConfirmBooking(bookingItem.id)}
                        disabled={actionLoading === bookingItem.id}
                      >
                        {actionLoading === bookingItem.id ? (
                          <Loader2 size={16} className="mr-1 animate-spin" />
                        ) : (
                          <Check size={16} className="mr-1" />
                        )}
                        Accepter
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleRejectBooking(bookingItem.id)}
                        disabled={actionLoading === bookingItem.id}
                      >
                        {actionLoading === bookingItem.id ? (
                          <Loader2 size={16} className="mr-1 animate-spin" />
                        ) : (
                          <X size={16} className="mr-1" />
                        )}
                        Refuser
                      </Button>
                    </>
                  )}
                  {bookingItem.status === "CONFIRMED" && (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleCompleteBooking(bookingItem.id)}
                      disabled={actionLoading === bookingItem.id}
                    >
                      {actionLoading === bookingItem.id ? (
                        <Loader2 size={16} className="mr-1 animate-spin" />
                      ) : (
                        <Check size={16} className="mr-1" />
                      )}
                      Terminer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

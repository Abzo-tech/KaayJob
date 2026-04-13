import { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Calendar,
  Check,
  X,
  Clock,
  Loader2,
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

export function AdminBookings() {
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
      const response = await api.get("/admin/bookings?limit=100");
      console.log("Admin bookings response:", response);
      // La réponse est directement dans response.data (pas response.data.data)
      const bookingsData = response?.data || [];
      console.log("Bookings loaded:", bookingsData.length);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Erreur chargement réservations:", error);
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const clientName = `${booking.client_first_name || ""} ${booking.client_last_name || ""}`.toLowerCase();
    const matchesSearch =
      clientName.includes(searchTerm.toLowerCase()) ||
      (booking.service_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || 
      booking.status?.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <Check size={12} /> Confirmé
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <Clock size={12} /> En attente
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Terminé
          </Badge>
        );
      case "CANCELLED":
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
            <X size={12} /> Annulé
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const bookingDate = new Date(dateStr);
    return bookingDate.toLocaleDateString("fr-FR");
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      // Utiliser l'endpoint admin pour mettre à jour le statut
      await api.put(`/admin/bookings/${bookingId}`, { status: "CONFIRMED" });
      toast.success("Réservation confirmée !");
      loadBookings();
    } catch (error: any) {
      console.error("Erreur confirmation:", error);
      toast.error(error.message || "Erreur lors de la confirmation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      // Utiliser l'endpoint admin pour mettre à jour le statut
      await api.put(`/admin/bookings/${bookingId}`, { status: "CANCELLED" });
      toast.success("Réservation annulée");
      loadBookings();
    } catch (error: any) {
      console.error("Erreur annulation:", error);
      toast.error(error.message || "Erreur lors de l'annulation");
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (price: string | number) => {
    if (price === null || price === undefined) return "0";

    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    // Vérifier si le résultat est un nombre valide
    if (isNaN(numPrice)) return "0";

    return numPrice.toLocaleString();
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b: any) => b.status === "PENDING").length;
  const confirmedBookings = bookings.filter((b: any) => b.status === "CONFIRMED").length;
  const completedBookings = bookings.filter((b: any) => b.status === "COMPLETED").length;

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#000080]">
            Gestion des réservations
          </h1>
          <p className="text-gray-500 mt-1">
            Suivez et gérez toutes les réservations
          </p>
        </div>
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
                placeholder="Rechercher par client ou service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-[#000080]" : ""}
              >
                Toutes
              </Button>
              <Button
                variant={statusFilter === "CONFIRMED" ? "default" : "outline"}
                onClick={() => setStatusFilter("CONFIRMED")}
                className={statusFilter === "CONFIRMED" ? "bg-[#000080]" : ""}
              >
                Confirmées
              </Button>
              <Button
                variant={statusFilter === "PENDING" ? "default" : "outline"}
                onClick={() => setStatusFilter("PENDING")}
                className={statusFilter === "PENDING" ? "bg-[#000080]" : ""}
              >
                En attente
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Total réservations</p>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingBookings}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Confirmées</p>
              <p className="text-2xl font-bold text-green-600">{confirmedBookings}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-500">Terminées</p>
              <p className="text-2xl font-bold text-blue-600">{completedBookings}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des réservations</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <p className="text-sm text-gray-500 mb-4">
            Note: Les paiements sont gérés directement entre le client et le
            prestataire
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Prestataire</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((bookingItem) => (
                <TableRow key={bookingItem.id}>
                  <TableCell>
                    <span className="text-gray-500">#{bookingItem.id.slice(0, 8)}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      {bookingItem.client_first_name} {bookingItem.client_last_name}
                    </p>
                  </TableCell>
                  <TableCell>{bookingItem.service_name || "-"}</TableCell>
                  <TableCell>
                    {bookingItem.provider_first_name} {bookingItem.provider_last_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span>
                        {formatDate(bookingItem.booking_date)} {bookingItem.booking_time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(bookingItem.total_amount)} CFA</TableCell>
                  <TableCell>{getStatusBadge(bookingItem.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        {bookingItem.status === "PENDING" && (
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={() => handleConfirmBooking(bookingItem.id)}
                            disabled={actionLoading === bookingItem.id}
                          >
                            {actionLoading === bookingItem.id ? (
                              <Loader2 size={14} className="mr-2 animate-spin" />
                            ) : (
                              <Check size={14} className="mr-2" />
                            )}
                            Confirmer
                          </DropdownMenuItem>
                        )}
                        {bookingItem.status !== "CANCELLED" &&
                          bookingItem.status !== "COMPLETED" && (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleCancelBooking(bookingItem.id)}
                              disabled={actionLoading === bookingItem.id}
                            >
                              {actionLoading === bookingItem.id ? (
                                <Loader2 size={14} className="mr-2 animate-spin" />
                              ) : (
                                <X size={14} className="mr-2" />
                              )}
                              Annuler
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

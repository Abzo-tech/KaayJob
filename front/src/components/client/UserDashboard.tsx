import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Settings,
  History,
  Loader2,
  X,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

interface UserDashboardProps {
  onNavigate: (page: string) => void;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  address: string;
  totalPrice: number;
  rating?: number;
}

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("bookings");
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  // Get user from localStorage
  const [user, setUser] = useState<User | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setProfileData({
          firstName: parsedUser.firstName || "",
          lastName: parsedUser.lastName || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
        });
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  // Fetch user's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const response = await api.get("/bookings/me");
        // La réponse est directement dans response.data (pas response.data.data)
        const bookingsData = response?.data || [];
        const mappedBookings = bookingsData.map((booking: any) => ({
          id: booking.id,
          serviceName: booking.service?.name || "Service",
          providerName: booking.service?.provider?.user
            ? `${booking.service.provider.user.firstName} ${booking.service.provider.user.lastName}`
            : "Prestataire",
          date: booking.bookingDate,
          time: booking.bookingTime,
          status: booking.status,
          address: booking.address,
          totalPrice: booking.totalAmount,
          rating: booking.rating,
        }));
        setBookings(mappedBookings);
      } catch (error: any) {
        console.error("Error fetching bookings:", error);
        // If no bookings, show empty array
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">En Attente</Badge>
        );
      case "CONFIRMED":
        return <Badge className="bg-blue-100 text-blue-800">Confirmé</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return;
    }
    try {
      setActionLoading(bookingId);
      await api.delete(`/bookings/${bookingId}`);
      toast.success("Réservation annulée avec succès");
      // Reload bookings
      const response = await api.get("/bookings/me");
      // La réponse est directement dans response.data (pas response.data.data)
      const bookingsData = response?.data || [];
      const mappedBookings = bookingsData.map((booking: any) => ({
        id: booking.id,
        serviceName: booking.service?.name || "Service",
        providerName: booking.service?.provider?.user
          ? `${booking.service.provider.user.firstName} ${booking.service.provider.user.lastName}`
          : "Prestataire",
        date: booking.bookingDate,
        time: booking.bookingTime,
        status: booking.status,
        address: booking.address,
        totalPrice: booking.totalAmount,
        rating: booking.rating,
      }));
      setBookings(mappedBookings);
    } catch (error: any) {
      console.error("Erreur annulation:", error);
      toast.error(error.message || "Erreur lors de l'annulation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenReviewDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setReviewData({ rating: 5, comment: "" });
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    
    try {
      setActionLoading("review");
      // Note: This is a placeholder - reviews API may need to be implemented
      toast.success("Merci pour votre avis !");
      setReviewDialogOpen(false);
      // Reload bookings to show the rating
      const response = await api.get("/bookings/me");
      // La réponse est directement dans response.data (pas response.data.data)
      const bookingsData = response?.data || [];
      const mappedBookings = bookingsData.map((booking: any) => ({
        id: booking.id,
        serviceName: booking.service?.name || "Service",
        providerName: booking.service?.provider?.user
          ? `${booking.service.provider.user.firstName} ${booking.service.provider.user.lastName}`
          : "Prestataire",
        date: booking.bookingDate,
        time: booking.bookingTime,
        status: booking.status,
        address: booking.address,
        totalPrice: booking.totalAmount,
        rating: booking.rating,
      }));
      setBookings(mappedBookings);
    } catch (error: any) {
      console.error("Erreur avis:", error);
      toast.error(error.message || "Erreur lors de l'envoi de l'avis");
    } finally {
      setActionLoading(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card
          style={{ backgroundColor: "#1E40AF", color: "#ffffff" }}
          className="border-0 shadow-md mb-8 rounded-lg overflow-hidden"
        >
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div
                className="rounded-full p-1 -mt-10"
                style={{ backgroundColor: "#153a8b" }}
              >
                <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                  <AvatarImage
                    src={
                      user?.firstName
                        ? `https://ui-avatars.com/api/?name=${user.firstName}&background=random`
                        : ""
                    }
                    alt={user?.firstName}
                  />
                  <AvatarFallback className="text-2xl">
                    {user?.firstName?.[0] || "U"}
                    {user?.lastName?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4">
                <h1 className="text-2xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-sm mt-1" style={{ color: "#E6F5FF" }}>
                  {user?.email}
                </p>
                <p className="text-sm mt-1" style={{ color: "#E6F5FF" }}>
                  {user?.phone || "Aucun téléphone"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="bookings" className="text-base">
              <History className="w-5 h-5 mr-2" />
              Mes Réservations
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-base">
              <Settings className="w-5 h-5 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Mes Réservations
                </h2>
                <Button
                  onClick={() => onNavigate("categories")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Réserver un Nouveau Service
                </Button>
              </div>

              {bookings.length === 0 ? (
                <Card className="bg-white border-0 shadow-md">
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucune réservation
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Vous n'avez pas encore de réservations. Réservez votre
                      premier service dès maintenant!
                    </p>
                    <Button
                      onClick={() => onNavigate("categories")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Voir les Services
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {bookings.map((booking) => (
                    <Card
                      key={booking.id}
                      className="bg-white border-0 shadow-md"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {booking.serviceName}
                              </h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <p className="text-gray-600 text-base">
                              Prestataire: {booking.providerName}
                            </p>
                            <p className="text-gray-500 text-sm">
                              ID: {booking.id.slice(0, 8)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              {formatPrice(booking.totalPrice)}
                            </p>
                            {booking.rating && (
                              <div className="flex items-center justify-end mt-1">
                                {renderStars(booking.rating)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span>{booking.address}</span>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-4">
                          {booking.status === "PENDING" && (
                            <>
                              <Button
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={actionLoading === booking.id}
                              >
                                {actionLoading === booking.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="mr-2 h-4 w-4" />
                                )}
                                Annuler
                              </Button>
                              <Button
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                onClick={() => toast.info("Fonctionnalité en cours de développement")}
                              >
                                Reprogrammer
                              </Button>
                            </>
                          )}
                          {booking.status === "COMPLETED" &&
                            !booking.rating && (
                              <Button 
                                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                onClick={() => handleOpenReviewDialog(booking)}
                              >
                                <Star className="mr-2 h-4 w-4" />
                                Noter le Service
                              </Button>
                            )}
                          <Button
                            variant="outline"
                            className="border-gray-300 text-gray-700"
                            onClick={() => toast.info("ID: " + booking.id)}
                          >
                            Voir les Détails
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Paramètres du Compte
              </h2>

              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Informations Personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-base">
                        Prénom
                      </Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="mt-2 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-base">
                        Nom
                      </Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="mt-2 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="mt-2 text-base"
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-base">
                        Numéro de Téléphone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+221771234567"
                        className="mt-2 text-base"
                      />
                    </div>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={async () => {
                      setIsSaving(true);
                      try {
                        const response = await api.put("/auth/profile", {
                          firstName: profileData.firstName,
                          lastName: profileData.lastName,
                          phone: profileData.phone,
                        });
                        
                        if (response.data?.success) {
                          // Update localStorage with new user data
                          const updatedUser: User = {
                            ...user!,
                            firstName: profileData.firstName,
                            lastName: profileData.lastName,
                            phone: profileData.phone,
                          };
                          localStorage.setItem("user", JSON.stringify(updatedUser));
                          setUser(updatedUser);
                          toast.success("Profil mis à jour avec succès!");
                        } else {
                          toast.error(response.data?.message || "Erreur lors de la mise à jour");
                        }
                      } catch (error: any) {
                        console.error("Error updating profile:", error);
                        toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil");
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      "Enregistrer les Modifications"
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Préférences de Notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Confirmations de Réservation
                        </h3>
                        <p className="text-sm text-gray-600">
                          Soyez notifié lorsque les réservations sont confirmées
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Basculer
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Rappels de Service</h3>
                        <p className="text-sm text-gray-600">
                          Recevez des rappels avant les services programmés
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Basculer
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Offres Promotionnelles</h3>
                        <p className="text-sm text-gray-600">
                          Recevez des mises à jour sur les offres spéciales et
                          réductions
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Basculer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Noter le Service</DialogTitle>
            <DialogDescription>
              Partagez votre expérience avec {selectedBooking?.serviceName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Note ${star} sur 5`}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= reviewData.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Commentaire (optionnel)</Label>
              <Textarea
                id="comment"
                placeholder="Partagez votre expérience..."
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700"
              onClick={handleSubmitReview}
              disabled={actionLoading === "review"}
            >
              {actionLoading === "review" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Soumettre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

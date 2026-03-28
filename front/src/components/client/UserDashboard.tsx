import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ImageUpload } from "../common/ImageUpload";
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
  FileText,
  CheckCircle2,
  Hourglass,
  Heart,
  ChevronRight,
  CreditCard,
  Bell,
  BookMarked,
  Plus,
  X,
  Loader2,
  LogOut,
  Lock,
  User,
  Shield,
  Trash2,
  Wallet,
  History,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";

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
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "reservations" | "favoris" | "paiements" | "notifications" | "parametres"
  >("reservations");
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
      const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await api.get("/bookings/me");
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
      } catch (error) {
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  const reloadBookings = async () => {
    try {
      const response = await api.get("/bookings/me");
      const bookingsData = response?.data || [];
      setBookings(
        bookingsData.map((booking: any) => ({
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
        })),
      );
    } catch {}
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            En Attente
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Confirmé
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Terminé
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Annulé
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price) + " XOF";

  const handleImageUpload = (image: string | null) => {
    if (image) {
      setProfileImage(image);
      localStorage.setItem("profileImage", image);
      toast.success("Photo de profil mise à jour!");
    } else {
      setProfileImage(null);
      localStorage.removeItem("profileImage");
      toast.success("Photo de profil supprimée!");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = await confirm(
      "Annuler la réservation",
      "Êtes-vous sûr de vouloir annuler cette réservation ?",
      "Annuler",
      "Conserver"
    );

    if (!confirmed) return;

    try {
      setActionLoading(bookingId);
      await api.delete(`/bookings/${bookingId}`);
      toast.success("Réservation annulée avec succès");
      await reloadBookings();
    } catch (error: any) {
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
      toast.success("Merci pour votre avis !");
      setReviewDialogOpen(false);
      await reloadBookings();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi de l'avis");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#000080]" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: FileText, value: bookings.length, label: "Total" },
    {
      icon: CheckCircle2,
      value: bookings.filter((b) => b.status === "COMPLETED").length,
      label: "Terminées",
    },
    {
      icon: Hourglass,
      value: bookings.filter((b) => b.status === "PENDING").length,
      label: "En attente",
    },
    { icon: Heart, value: 0, label: "Favoris" },
  ];

  const menuItems = [
    {
      icon: BookMarked,
      label: "Mes Réservations",
      tab: "reservations" as const,
    },
    { icon: Heart, label: "Mes Favoris", tab: "favoris" as const },
    { icon: Wallet, label: "Mes Paiements", tab: "paiements" as const },
    { icon: Bell, label: "Notifications", tab: "notifications" as const },
    {
      icon: Settings,
      label: "Paramètres du Compte",
      tab: "parametres" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {/* Background Blue Card */}
        <div className="bg-gradient-to-r from-[#000080] to-[#001a99] rounded-2xl p-6 -mt-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <ImageUpload
                value={profileImage}
                onChange={handleImageUpload}
                label="Photo de profil"
                size="lg"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            <p className="text-sm text-gray-500">
              {user?.phone || "Aucun téléphone"}
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setSettingsOpen(true)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Modifier
              </button>
              <button
                onClick={() => setAccountSettingsOpen(true)}
                className="px-5 py-2 rounded-lg bg-[#000080] text-sm font-medium text-white hover:bg-[#001a99] transition-colors"
              >
                Paramètres
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center text-center"
            >
              <div className="w-11 h-11 bg-[#000080] rounded-full flex items-center justify-center mb-2">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              <span className="text-xs text-gray-500 mt-0.5">{label}</span>
            </div>
          ))}
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {menuItems.map(({ icon: Icon, label, tab }, i) => (
            <button
              key={i}
              onClick={() => {
                if (tab === "parametres") {
                  setAccountSettingsOpen(true);
                } else {
                  setActiveTab(tab);
                }
              }}
              className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                activeTab === tab ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 ${activeTab === tab ? "text-[#000080]" : "text-[#000080]"}`}
                />
                <span
                  className={`text-sm font-medium ${activeTab === tab ? "text-[#000080]" : "text-gray-800"}`}
                >
                  {label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "reservations" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">
                Historique des Réservations
              </h2>
              <button
                onClick={() => onNavigate("categories")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#000080] text-white text-sm font-medium hover:bg-[#001a99] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouvelle
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">
                  Aucune réservation pour le moment
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {booking.serviceName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {booking.providerName}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {booking.address}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600 text-sm">
                          {formatPrice(booking.totalPrice)}
                        </span>
                        {booking.rating && (
                          <div className="flex items-center">
                            {renderStars(booking.rating)}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Actions */}
                    {(booking.status === "PENDING" ||
                      (booking.status === "COMPLETED" && !booking.rating)) && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        {booking.status === "PENDING" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={actionLoading === booking.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs hover:bg-red-50 transition-colors"
                          >
                            {actionLoading === booking.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            Annuler
                          </button>
                        )}
                        {booking.status === "COMPLETED" && !booking.rating && (
                          <button
                            onClick={() => handleOpenReviewDialog(booking)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500 text-white text-xs hover:bg-yellow-600 transition-colors"
                          >
                            <Star className="w-3 h-3" />
                            Noter
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favoris" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">
              Mes Favoris
            </h2>
            <div className="text-center py-12">
              <Heart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">
                Aucun favori pour le moment
              </p>
              <button
                onClick={() => onNavigate("categories")}
                className="mt-4 px-4 py-2 rounded-lg bg-[#000080] text-white text-sm font-medium hover:bg-[#001a99] transition-colors"
              >
                Découvrir des services
              </button>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "paiements" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">
              Mes Paiements
            </h2>
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">
                Aucun paiement pour le moment
              </p>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">
              Mes Notifications
            </h2>
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Aucune notification</p>
            </div>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Informations Personnelles</DialogTitle>
            <DialogDescription>
              Modifiez vos informations de profil
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Prénom</Label>
                <Input
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      firstName: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Nom</Label>
                <Input
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, lastName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <Input
                value={profileData.email}
                disabled
                className="mt-1 bg-gray-50"
              />
            </div>
            <div>
              <Label className="text-sm">Téléphone</Label>
              <Input
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                placeholder="+221 77 XXX XX XX"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={async () => {
                setIsSaving(true);
                try {
                  const response = await api.put("/auth/profile", {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phone: profileData.phone,
                  });
                  if (response.data?.success) {
                    const updatedUser: User = { ...user!, ...profileData };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    setUser(updatedUser);
                    toast.success("Profil mis à jour !");
                    setSettingsOpen(false);
                  } else {
                    toast.error("Erreur lors de la mise à jour");
                  }
                } catch (error: any) {
                  toast.error(error.response?.data?.message || "Erreur");
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className="bg-[#000080] hover:bg-[#001a99]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  aria-label={`Noter ${star} étoile${star > 1 ? "s" : ""}`}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${star <= reviewData.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
            <div>
              <Label className="text-sm">Commentaire (optionnel)</Label>
              <Textarea
                placeholder="Partagez votre expérience..."
                value={reviewData.comment}
                onChange={(e) =>
                  setReviewData({ ...reviewData, comment: e.target.value })
                }
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setReviewDialogOpen(false)}
              variant="outline"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={actionLoading === "review"}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              {actionLoading === "review" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Soumettre"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Settings Dialog */}
      <Dialog open={accountSettingsOpen} onOpenChange={setAccountSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Paramètres du Compte</DialogTitle>
            <DialogDescription>
              Gérez les paramètres de votre compte
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Account Info Section */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4" />
                Informations du compte
              </h3>
              <div className="pl-6 space-y-2">
                <button
                  onClick={() => {
                    setAccountSettingsOpen(false);
                    setSettingsOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Informations personnelles
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Sécurité
              </h3>
              <div className="pl-6 space-y-2">
                <button
                  onClick={() => {
                    setAccountSettingsOpen(false);
                    setPasswordDialogOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Changer le mot de passe
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-3">
              <h3 className="font-medium text-red-600 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Zone dangereuse
              </h3>
              <div className="pl-6 space-y-2">
                <button
                  onClick={() => {
                    setAccountSettingsOpen(false);
                    setDeleteDialogOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-red-200 hover:bg-red-50"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">
                      Supprimer mon compte
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAccountSettingsOpen(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre mot de passe actuel et votre nouveau mot de passe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm">Mot de passe actuel</Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Nouveau mot de passe</Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Confirmer le mot de passe</Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                  toast.error("Les mots de passe ne correspondent pas", {
                    position: "top-center",
                  });
                  return;
                }
                if (passwordData.newPassword.length < 6) {
                  toast.error(
                    "Le mot de passe doit contenir au moins 6 caractères",
                    { position: "top-center" },
                  );
                  return;
                }
                setIsSaving(true);
                try {
                  const response = await api.put("/auth/password", {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                  });
                  if (response.data?.success) {
                    toast.success("Mot de passe modifié avec succès !", {
                      position: "top-center",
                    });
                    setPasswordDialogOpen(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  } else {
                    toast.error(
                      response.data?.message ||
                        "Erreur lors du changement de mot de passe",
                      { position: "top-center" },
                    );
                  }
                } catch (error: any) {
                  toast.error(
                    error.response?.data?.message ||
                      "Erreur lors du changement de mot de passe",
                    { position: "top-center" },
                  );
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className="bg-[#000080] hover:bg-[#001a99]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Supprimer mon compte
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                En supprimant votre compte, vous perdrez :
              </p>
              <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                <li>Toutes vos réservations</li>
                <li>Vos favoris</li>
                <li>Votre historique de paiements</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                const confirmed = await confirm(
                  "Supprimer le compte",
                  "Êtes-vous sûr ? Cette action est irréversible et supprimera toutes vos données.",
                  "Supprimer",
                  "Annuler"
                );

                if (!confirmed) return;
                setIsSaving(true);
                try {
                  const response = await api.delete("/auth/account");
                  if (response.data?.success) {
                    toast.success("Compte supprimé avec succès", {
                      position: "top-center",
                    });
                    setDeleteDialogOpen(false);
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    window.location.href = "/";
                  } else {
                    toast.error(
                      response.data?.message || "Erreur lors de la suppression",
                      { position: "top-center" },
                    );
                  }
                } catch (error: any) {
                  toast.error(
                    error.response?.data?.message ||
                      "Erreur lors de la suppression",
                    { position: "top-center" },
                  );
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Supprimer mon compte"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}

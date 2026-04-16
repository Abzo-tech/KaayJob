import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Award,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { api } from "../../lib/api";

interface ServiceDetailPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  params?: Record<string, string>;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  priceType: string;
  duration?: number;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface Provider {
  id: string;
  userId: string;
  specialty?: string;
  bio?: string;
  hourlyRate?: number | string;
  yearsExperience?: number;
  location?: string;
  isAvailable: boolean;
  rating: number | string;
  totalReviews: number;
  totalBookings: number;
  isVerified: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  services: Service[];
  reviews: Review[];
}

export function ServiceDetailPage({
  onNavigate,
  params = {},
}: ServiceDetailPageProps) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const providerId = params.providerId;
  const categoryId = params.categoryId;

  console.log("📄 ServiceDetailPage - params reçus:", params);
  console.log("🆔 providerId:", providerId, "categoryId:", categoryId);

  // Fetch provider from API
  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/providers/${providerId}`);
        if (response.success && response.data) {
          setProvider(response.data);
        } else {
          setError(response.message || "Prestataire non trouvé");
        }
      } catch (err) {
        console.error("Erreur chargement prestataire:", err);
        setError("Impossible de charger les informations du prestataire");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  const getProviderAvatar = (provider: Provider) => {
    if (provider.user.avatar) return provider.user.avatar;
    return `https://ui-avatars.com/api/?name=${provider.user.firstName}+${provider.user.lastName}&background=000080&color=fff`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  };

  const formatPrice = (service: Service) => {
    const price = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
    const priceType = service.priceType?.toLowerCase();
    if (priceType === "quote") return "Sur devis";
    if (priceType === "fixed") return `${price.toLocaleString('fr-SN')} CFA`;
    return `À partir de ${price.toLocaleString('fr-SN')} CFA/h`;
  };

  const handleBookNow = () => {
    if (provider) {
      onNavigate("booking", { providerId: provider.id });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#000080] mx-auto mb-4" />
          <p className="text-gray-600">Chargement du prestataire...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Prestataire non trouvé"}</p>
          <Button onClick={() => onNavigate("categories")}>
            Retour aux catégories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 text-gray-600 hover:text-gray-900"
          onClick={() => {
            console.log("🔙 Bouton retour cliqué, categoryId:", categoryId);
            if (categoryId) {
              console.log("📍 Navigation vers service-providers avec categoryId:", categoryId);
              onNavigate("service-providers", { categoryId });
            } else {
              console.log("📍 Navigation vers service-providers sans categoryId");
              onNavigate("service-providers");
            }
          }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux prestataires
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <Card className="bg-white border-2 border-[#000080]/10 shadow-lg hover:border-[#000080]/30 transition-all animate-slide-up">
              <CardContent className="p-8 bg-gradient-to-br from-white to-[#FFF4EA]/30">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <ImageWithFallback
                    src={getProviderAvatar(provider)}
                    alt={`${provider.user.firstName} ${provider.user.lastName}`}
                    className="w-32 h-32 rounded-xl object-cover border-4 border-[#000080]/20 shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-[#000080]">
                        {provider.user.firstName} {provider.user.lastName}
                      </h1>
                      {provider.isVerified && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <p className="text-xl text-[#000080] font-semibold mb-3">
                      {provider.specialty || "Prestataire de services"}
                    </p>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(Number(provider.rating || 0))
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-lg font-semibold text-[#000080]">
                          {Number(provider.rating || 0).toFixed(1)} ({provider.totalReviews || 0} avis)
                        </span>
                      </div>
                      {provider.yearsExperience && (
                        <div className="flex items-center text-[#000080] font-semibold">
                          <Award className="w-5 h-5 mr-1" />
                          <span>{provider.yearsExperience} ans d'expérience</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6 text-gray-600">
                      {provider.location && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-1" />
                          <span>{provider.location}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-1" />
                        <span>
                          {provider.isAvailable
                            ? "Disponible"
                            : "Indisponible actuellement"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            {provider.bio && (
              <Card className="bg-white border-0 shadow-md">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">À propos</h2>
                  <p className="text-gray-700 leading-relaxed">{provider.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Services & Pricing */}
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Services et Tarifs</h2>
                {provider.services && provider.services.length > 0 ? (
                  <div className="space-y-4">
                    {provider.services.map((service) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <span className="text-lg font-medium">{service.name}</span>
                          {service.description && (
                            <p className="text-sm text-gray-500">{service.description}</p>
                          )}
                        </div>
                        <span className="font-semibold text-lg text-blue-600">
                          {formatPrice(service)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun service disponible pour le moment.</p>
                )}
                <Separator className="my-6" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg">Tarif Horaire</p>
                    <p className="text-2xl font-bold text-green-600">
                      {provider.hourlyRate ? `${Number(provider.hourlyRate).toLocaleString('fr-SN')} CFA/h` : "Sur devis"}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                    Réservation minimum 1 heure
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Avis Clients ({provider.reviews?.length || 0})
                </h2>
                {provider.reviews && provider.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {provider.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-6 last:border-b-0"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#000080] text-white flex items-center justify-center font-semibold">
                              {review.client.firstName[0]}
                              {review.client.lastName?.[0] || ""}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {review.client.firstName} {review.client.lastName}
                              </h3>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed">
                          {review.comment || "Sans commentaire"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun avis pour le moment.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="bg-white border-0 shadow-md sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {provider.hourlyRate ? `${Number(provider.hourlyRate).toLocaleString('fr-SN')} CFA/h` : "Sur devis"}
                  </p>
                  <p className="text-gray-600">Tarif de départ</p>
                </div>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
                    onClick={handleBookNow}
                    disabled={!provider.isAvailable}
                  >
                    Réserver Maintenant
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 py-4 text-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Message
                  </Button>

                  {provider.user.phone && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-4 text-lg"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Appeler {provider.user.phone}
                    </Button>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="text-center text-sm text-gray-600">
                  {provider.isVerified && <p>✓ Vérifié par historique</p>}
                  <p>✓ Service de qualité</p>
                  <p>✓ 100% garantie de satisfaction</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  Informations de Contact
                </h3>
                <div className="space-y-3">
                  {provider.user.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-gray-500" />
                      <span>{provider.user.phone}</span>
                    </div>
                  )}
                  {provider.location && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                      <span>{provider.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-gray-500" />
                    <span>
                      {provider.isAvailable
                        ? "Disponible maintenant"
                        : "Indisponible"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

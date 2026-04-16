import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Star, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface ServiceProvidersListPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  params?: Record<string, string>;
}

interface Provider {
  id: string;
  userId: string;
  specialty?: string;
  bio?: string;
  hourlyRate?: number;
  yearsExperience?: number;
  location?: string;
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  isVerified: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export function ServiceProvidersListPage({
  onNavigate,
  params = {},
}: ServiceProvidersListPageProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const categoryId = params.categoryId;
  const categoryName = params.categoryName || "Services";

  console.log("📋 ServiceProvidersListPage - categoryId:", categoryId, "params:", params);

  // Fetch providers from API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        console.log("🔍 Chargement prestataires pour categoryId:", categoryId);

        // Build query string with category filter
        let query = "/providers?limit=50";
        if (categoryId) {
          query += `&category=${encodeURIComponent(categoryId)}`;
          console.log("📋 Requête avec filtre catégorie:", query);
        } else {
          console.log("📋 Requête sans filtre catégorie:", query);
        }

        const response = await api.get(query);
        if (response.success && response.data) {
          console.log("✅ Prestataires chargés:", response.data.length);
          setProviders(response.data);
        } else {
          console.log("❌ Réponse API:", response);
        }
      } catch (err) {
        console.error("Erreur chargement prestataires:", err);
        setError("Impossible de charger les prestataires");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [categoryId]);

  const filteredProviders = searchQuery
    ? providers.filter(
        (p) =>
          p.user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : providers;

  // Get default avatar
  const getProviderAvatar = (provider: Provider) => {
    if (provider.user.avatar) return provider.user.avatar;
    return `https://ui-avatars.com/api/?name=${provider.user.firstName}+${provider.user.lastName}&background=000080&color=fff`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#000080] mx-auto mb-4" />
          <p className="text-gray-600">Chargement des prestataires...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <section className="bg-[#000080] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => onNavigate("categories")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux catégories
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Prestataires {categoryName}
          </h1>
          <p className="text-lg opacity-90">
            {filteredProviders.length} prestataires disponibles
          </p>
          
          {/* Search */}
          <div className="mt-4 max-w-md">
            <input
              type="text"
              placeholder="Rechercher un prestataire..."
              className="w-full px-4 py-2 rounded-lg text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Providers List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                Aucun prestataire trouvé.
              </p>
              <Button
                onClick={() => onNavigate("categories")}
                variant="outline"
                className="mt-4"
              >
                Retour aux catégories
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                  onClick={() => {
                    console.log("🖱️ Clic sur prestataire:", provider.id, "categoryId:", categoryId);
                    onNavigate("service-detail", { providerId: provider.id, categoryId });
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="overflow-hidden rounded-xl flex-shrink-0">
                        <ImageWithFallback
                          src={getProviderAvatar(provider)}
                          alt={`${provider.user.firstName} ${provider.user.lastName}`}
                          className="w-24 h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-xl font-bold text-[#000080]">
                            {provider.user.firstName} {provider.user.lastName}
                          </h3>
                          {provider.isVerified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Vérifié
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">
                          {provider.specialty || "Prestataire de services"}
                        </p>

                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-semibold">
                              {Number(provider.rating || 0).toFixed(1)}
                            </span>
                            <span className="text-gray-500 text-sm ml-1">
                              ({provider.totalReviews || 0})
                            </span>
                          </div>
                          {provider.location && (
                            <div className="flex items-center text-gray-500 text-sm">
                              <MapPin className="w-4 h-4 mr-1" />
                              {provider.location}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div>
                            {provider.hourlyRate ? (
                              <>
                                <span className="text-2xl font-bold text-green-600">
                                  {Number(provider.hourlyRate).toLocaleString('fr-SN')} CFA
                                </span>
                                <span className="text-gray-500">/h</span>
                              </>
                            ) : (
                              <span className="text-gray-500">Prix sur devis</span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              onNavigate("service-detail", { providerId: provider.id, categoryId });
                            }}
                          >
                            Voir le profil
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import {
  MapPin,
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  Navigation,
  Loader2,
  ArrowLeft,
  MapIcon,
  List,
  Grid,
  User
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  useMapEvents
} from "react-leaflet";
import L from "leaflet";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { api } from "../../lib/api";
import { toast } from "sonner";

// Fix for default marker icon
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const providerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ServiceProvidersMapPageProps {
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
  latitude?: number;
  longitude?: number;
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  isVerified: boolean;
  distance?: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function LocationMarker({ position, onLocationSelect }: {
  position: [number, number] | null;
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <strong>Votre position</strong>
      </Popup>
    </Marker>
  );
}

export function ServiceProvidersMapPage({
  onNavigate,
  params = {},
}: ServiceProvidersMapPageProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [userAddress, setUserAddress] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([14.7167, -17.4677]); // Dakar, Sénégal
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxDistance: 50,
    minRating: 0,
    availableOnly: false, // Désactivé par défaut car données manquantes
    maxPrice: 100,
    verifiedOnly: false,
  });

  const categoryId = params.categoryId;
  const categoryName = params.categoryName || "Services";

  // Fetch categories and providers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [categoriesResponse, providersResponse] = await Promise.all([
          api.get("/categories"),
          api.get("/providers/map")
        ]);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
        }

        if (providersResponse.success) {
          console.log("Prestataires chargés:", providersResponse.data);
          setProviders(providersResponse.data || []);
        }
      } catch (err) {
        console.error("Erreur chargement données:", err);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);
          setMapCenter([lat, lng]);

          // Reverse geocoding to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            );
            const data = await response.json();
            if (data.display_name) {
              setUserAddress(data.display_name);
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
          }

          toast.success("Position détectée avec succès");
        },
        () => {
          toast.error("Impossible d'obtenir votre position. Veuillez autoriser l'accès à la géolocalisation.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      toast.error("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter providers based on criteria
  const filteredProviders = providers.filter((provider) => {
    console.log("Filtrage prestataire:", provider.user.firstName, provider.isAvailable);
    // Text search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        provider.user.firstName?.toLowerCase().includes(searchLower) ||
        provider.user.lastName?.toLowerCase().includes(searchLower) ||
        provider.specialty?.toLowerCase().includes(searchLower) ||
        provider.location?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all" && provider.specialty !== selectedCategory) {
      return false;
    }

    // Distance filter
    if (userLocation && provider.latitude && provider.longitude) {
      const distance = calculateDistance(
        userLocation[0], userLocation[1],
        provider.latitude, provider.longitude
      );
      provider.distance = distance;
      if (distance > filters.maxDistance) return false;
    }

    // Rating filter
    if (provider.rating < filters.minRating) return false;

    // Availability filter
    if (filters.availableOnly && provider.isAvailable === false) return false;

    // Price filter
    if (provider.hourlyRate && provider.hourlyRate > filters.maxPrice) return false;

    // Verified filter
    if (filters.verifiedOnly && !provider.isVerified) return false;

    console.log("Prestataire accepté:", provider.user.firstName);
    return true;
  });

  // Get provider avatar
  const getProviderAvatar = (provider: Provider) => {
    if (provider.user.avatar) return provider.user.avatar;
    return `https://ui-avatars.com/api/?name=${provider.user.firstName}+${provider.user.lastName}&background=000080&color=fff`;
  };

  // Handle location selection on map
  const handleLocationSelect = (lat: number, lng: number) => {
    setUserLocation([lat, lng]);
    setMapCenter([lat, lng]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#000080] mx-auto mb-4" />
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <section className="bg-[#000080] text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => onNavigate("categories")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux catégories
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Trouver un prestataire
              </h1>
              <p className="text-lg opacity-90">
                Localisez les meilleurs artisans près de chez vous
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="bg-white text-[#000080] hover:bg-gray-100"
              >
                <MapIcon className="w-4 h-4 mr-2" />
                Carte
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="bg-white text-[#000080] hover:bg-gray-100"
              >
                <List className="w-4 h-4 mr-2" />
                Liste
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher par nom, spécialité, ou lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base bg-white text-gray-900 border-0"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-12 bg-white text-gray-900 border-0">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-[#000080] hover:bg-gray-100 border-0"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtres
              </Button>

              <Button
                onClick={getCurrentLocation}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Ma position
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <Card className="bg-white text-gray-900 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Distance max (km)</Label>
                    <Slider
                      value={[filters.maxDistance]}
                      onValueChange={([value]) => setFilters({...filters, maxDistance: value})}
                      max={100}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-sm text-gray-600">{filters.maxDistance} km</span>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Note minimale</Label>
                    <Slider
                      value={[filters.minRating]}
                      onValueChange={([value]) => setFilters({...filters, minRating: value})}
                      max={5}
                      min={0}
                      step={0.5}
                      className="mt-2"
                    />
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">{filters.minRating}+</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Prix max (CFA/h)</Label>
                    <Slider
                      value={[filters.maxPrice]}
                      onValueChange={([value]) => setFilters({...filters, maxPrice: value})}
                      max={200}
                      min={10}
                      step={10}
                      className="mt-2"
                    />
                    <span className="text-sm text-gray-600">{filters.maxPrice} CFA</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={filters.availableOnly}
                        onCheckedChange={(checked) => setFilters({...filters, availableOnly: checked})}
                      />
                      <Label className="text-sm">Disponibles uniquement</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={filters.verifiedOnly}
                        onCheckedChange={(checked) => setFilters({...filters, verifiedOnly: checked})}
                      />
                      <Label className="text-sm">Prestataires vérifiés</Label>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === "map" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                <CardContent className="p-0 h-full">
                  <MapContainer
                    center={mapCenter}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <MapController center={mapCenter} />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LocationMarker position={userLocation} onLocationSelect={handleLocationSelect} />

                    {userLocation && (
                      <Circle
                        center={userLocation}
                        radius={filters.maxDistance * 1000}
                        pathOptions={{
                          color: '#000080',
                          fillColor: '#000080',
                          fillOpacity: 0.1,
                          weight: 2
                        }}
                      />
                    )}

                    {filteredProviders.map((provider) => (
                      provider.latitude && provider.longitude ? (
                        <Marker
                          key={provider.id}
                          position={[provider.latitude, provider.longitude]}
                          icon={providerIcon}
                        >
                          <Popup>
                            <div className="min-w-[200px]">
                              <div className="flex items-center gap-2 mb-2">
                                <img
                                  src={getProviderAvatar(provider)}
                                  alt={`${provider.user.firstName} ${provider.user.lastName}`}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                  <h3 className="font-semibold text-[#000080]">
                                    {provider.user.firstName} {provider.user.lastName}
                                  </h3>
                                  {provider.isVerified && (
                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                      Vérifié
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-2">
                                {provider.specialty || "Prestataire de services"}
                              </p>

                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs ml-1">
                                    {Number(provider.rating || 0).toFixed(1)}
                                  </span>
                                </div>
                                {provider.distance && (
                                  <span className="text-xs text-gray-500">
                                    {provider.distance.toFixed(1)} km
                                  </span>
                                )}
                              </div>

                              {provider.hourlyRate && (
                                <p className="text-sm font-semibold text-green-600 mb-2">
                                  {Number(provider.hourlyRate).toLocaleString('fr-SN')} CFA/h
                                </p>
                              )}

                              <Button
                                size="sm"
                                className="w-full bg-[#000080] hover:bg-blue-700"
                                onClick={() => onNavigate("service-detail", { providerId: provider.id })}
                              >
                                Voir le profil
                              </Button>
                            </div>
                          </Popup>
                        </Marker>
                      ) : null
                    ))}
                  </MapContainer>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Prestataires trouvés ({filteredProviders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto">
                  {filteredProviders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      Aucun prestataire trouvé avec ces critères.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {filteredProviders.slice(0, 10).map((provider) => (
                        <div
                          key={provider.id}
                          className="flex gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => onNavigate("service-detail", { providerId: provider.id })}
                        >
                          <img
                            src={getProviderAvatar(provider)}
                            alt={`${provider.user.firstName} ${provider.user.lastName}`}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#000080] truncate">
                              {provider.user.firstName} {provider.user.lastName}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              {provider.specialty || "Prestataire"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs ml-1">
                                  {Number(provider.rating || 0).toFixed(1)}
                                </span>
                              </div>
                              {provider.distance && (
                                <span className="text-xs text-gray-500">
                                  {provider.distance.toFixed(1)} km
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredProviders.length > 10 && (
                        <p className="text-center text-sm text-gray-500 pt-2">
                          Et {filteredProviders.length - 10} autres...
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProviders.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-500">
                  Aucun prestataire trouvé avec ces critères.
                </p>
                <Button
                  onClick={() => setShowFilters(false)}
                  variant="outline"
                  className="mt-4"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              filteredProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                  onClick={() => onNavigate("service-detail", { providerId: provider.id })}
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
                          <div className="flex gap-1">
                            {provider.isVerified && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Vérifié
                              </Badge>
                            )}
                            {!provider.isAvailable && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Indisponible
                              </Badge>
                            )}
                          </div>
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
                          {provider.distance && (
                            <div className="flex items-center text-gray-500 text-sm">
                              <MapPin className="w-4 h-4 mr-1" />
                              {provider.distance.toFixed(1)} km
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
                              onNavigate("service-detail", { providerId: provider.id });
                            }}
                          >
                            Voir le profil
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
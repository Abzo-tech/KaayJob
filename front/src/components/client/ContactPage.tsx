import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Navigation,
  MapPinned,
  Car,
  User,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

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

const officeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function LocationSearch({
  onLocationSelect,
  placeholder,
  label,
  initialValue,
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  placeholder: string;
  label: string;
  initialValue?: string;
}) {
  const [query, setQuery] = useState(initialValue || "");
  const [results, setResults] = useState<
    { lat: number; lng: number; display_name: string }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&country=sn`,
        );
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Error searching location:", error);
      }
    }, 500);
  };

  const handleSelect = (result: {
    lat: number;
    lng: number;
    display_name: string;
  }) => {
    onLocationSelect(result.lat, result.lng, result.display_name);
    setQuery(result.display_name);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-9 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <MapPinned className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b last:border-0"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [activeTab, setActiveTab] = useState<"contact" | "route">("contact");
  const [officeLocation] = useState<[number, number]>([14.7167, -17.4677]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [userAddress, setUserAddress] = useState("");
  const [providerLocation, setProviderLocation] = useState<
    [number, number] | null
  >(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);

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
        },
        () => alert("Impossible d'obtenir votre position."),
      );
    }
  };

  const calculateRoute = async () => {
    if (!userLocation || !providerLocation) return;
    setIsCalculating(true);
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${providerLocation[1]},${providerLocation[0]}?overview=full&geometries=geojson`,
      );
      const data = await response.json();
      if (data.routes?.[0]) {
        const coords = data.routes[0].geometry.coordinates.map(
          (coord: number[]) => [coord[1], coord[0]] as [number, number],
        );
        setRouteCoords(coords);
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Merci pour votre message ! Nous vous répondrons dans les 24 heures.",
    );
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const getMapCenter = (): [number, number] => {
    if (userLocation && providerLocation)
      return [
        (userLocation[0] + providerLocation[0]) / 2,
        (userLocation[1] + providerLocation[1]) / 2,
      ];
    if (userLocation) return userLocation;
    if (providerLocation) return providerLocation;
    return officeLocation;
  };

  const infoCards = [
    { icon: Phone, label: "Téléphone", value: "+221 77 123 45 67" },
    { icon: Mail, label: "Email", value: "support@kaayjob.com" },
    { icon: MapPin, label: "Adresse", value: "Point E, Dakar, Sénégal" },
    { icon: Clock, label: "Horaires", value: "Lun - Sam: 8h - 20h" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-[#000080] text-white py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Contactez-nous</h1>
        <p className="text-lg opacity-80">
          Une question ? Nous sommes là pour vous aider
        </p>
      </section>

      {/* Info Cards - overlapping hero */}
      <div className="max-w-5xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-0">
          {infoCards.map(({ icon: Icon, label, value }, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center border border-gray-100"
            >
              <div className="w-12 h-12 bg-[#000080] rounded-full flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-sm font-semibold text-blue-700">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="flex w-full border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "contact"
                ? "border-[#000080] text-[#000080]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Nous Contacter
          </button>
          <button
            onClick={() => setActiveTab("route")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "route"
                ? "border-[#000080] text-[#000080]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Navigation className="w-4 h-4" />
            Itinéraire
          </button>
        </div>

        {activeTab === "contact" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600 mb-1 block">
                      Nom Complet *
                    </Label>
                    <Input
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      className="rounded-lg border-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-1 block">
                      Email *
                    </Label>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="rounded-lg border-gray-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600 mb-1 block">
                      Téléphone
                    </Label>
                    <Input
                      type="tel"
                      placeholder="+221 77 XXX XX XX"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="rounded-lg border-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-1 block">
                      Sujet *
                    </Label>
                    <Input
                      placeholder="Sujet de votre message"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      required
                      className="rounded-lg border-gray-200"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">
                    Message *
                  </Label>
                  <Textarea
                    placeholder="Décrivez votre demande..."
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    required
                    className="rounded-lg border-gray-200 min-h-[140px]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#000080] hover:bg-[#001a99] text-white py-3 rounded-xl font-medium"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Envoyer le message
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Emergency Card */}
              <div className="bg-red-500 rounded-2xl p-6 text-white text-center">
                <Phone className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-1">Urgence 24/7</h3>
                <p className="text-sm opacity-90 mb-4">
                  Besoin d'aide immédiate ?
                </p>
                <button className="w-full bg-white text-red-500 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Appeler maintenant
                </button>
              </div>

              {/* Office Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#000080]" />
                  <h3 className="font-semibold text-gray-800">Notre bureau</h3>
                </div>
                <p className="font-medium text-gray-800 mb-1">KaayJob</p>
                <p className="text-sm text-gray-600">
                  Point E, Avenue Cheikh Anta Diop
                </p>
                <p className="text-sm text-gray-600">Dakar, Sénégal</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Lun - Sam: 8h - 20h</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Route Tab */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
            {/* Route Controls */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-800 mb-5">
                  Calculer l'itinéraire
                </h2>

                {/* From */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Depuis
                    </span>
                  </div>
                  <LocationSearch
                    onLocationSelect={(lat, lng, addr) =>
                      setUserLocation([lat, lng])
                    }
                    placeholder="Votre adresse"
                    label=""
                    initialValue={userAddress}
                  />
                  <button
                    onClick={getCurrentLocation}
                    className="mt-2 flex items-center gap-2 text-sm text-green-600 hover:text-green-800"
                  >
                    <User className="w-4 h-4" />
                    Ma position
                  </button>
                </div>

                {/* To */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Vers
                    </span>
                  </div>
                  <LocationSearch
                    onLocationSelect={(lat, lng, addr) =>
                      setProviderLocation([lat, lng])
                    }
                    placeholder="Adresse prestataire"
                    label=""
                  />
                </div>

                <Button
                  onClick={calculateRoute}
                  disabled={!userLocation || !providerLocation || isCalculating}
                  className="w-full bg-[#000080] hover:bg-[#001a99] text-white rounded-xl py-2"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {isCalculating ? "Calcul en cours..." : "Calculer"}
                </Button>

                {routeCoords.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Itinéraire calculé !
                    </p>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Légende</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Votre position</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600">Prestataire</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Notre bureau</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[500px]">
                <MapContainer
                  center={getMapCenter()}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <MapController center={getMapCenter()} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={officeLocation} icon={officeIcon}>
                    <Popup>
                      <div className="text-center">
                        <strong>KaayJob</strong>
                        <br />
                        Point E, Dakar
                      </div>
                    </Popup>
                  </Marker>
                  {userLocation && (
                    <Marker position={userLocation} icon={userIcon}>
                      <Popup>
                        <strong>Votre Position</strong>
                      </Popup>
                    </Marker>
                  )}
                  {providerLocation && (
                    <Marker position={providerLocation} icon={providerIcon}>
                      <Popup>
                        <strong>Prestataire</strong>
                      </Popup>
                    </Marker>
                  )}
                  {routeCoords.length > 0 && (
                    <Polyline
                      positions={routeCoords}
                      pathOptions={{
                        color: "#000080",
                        weight: 4,
                        opacity: 0.8,
                      }}
                    />
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

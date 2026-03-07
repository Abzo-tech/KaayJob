import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MapPin, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";

interface ServiceCategoriesPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  params?: Record<string, string>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  _count?: {
    services: number;
  };
}

export function ServiceCategoriesPage({
  onNavigate,
  params = {},
}: ServiceCategoriesPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Dakar, Sénégal");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/categories");
        if (response.success && response.data) {
          setCategories(response.data);
          setFilteredCategories(response.data);
        }
      } catch (err) {
        console.error("Erreur chargement catégories:", err);
        setError("Impossible de charger les catégories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query.toLowerCase()) ||
        (cat.description?.toLowerCase() || "").includes(query.toLowerCase()),
    );
    setFilteredCategories(filtered);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => console.log("Localisation refusée", error),
      );
    }
  };

  // Helper to get category image or default
  const getCategoryImage = (category: Category) => {
    if (category.image) {
      // If it's a local image (starts with /images/), prepend the API URL
      if (category.image.startsWith('/images/')) {
        return `http://localhost:3001${category.image}`;
      }
      return category.image;
    }
    // Default images based on category name (in French from API)
    const defaultImages: Record<string, string> = {
      "Plomberie": "https://i.pinimg.com/736x/4d/3d/a8/4d3da898a7f0383572935a16f1e6df3a.jpg",
      "Électricité": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80",
      "Peinture": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80",
      "Ménage": "https://i.pinimg.com/736x/f5/91/96/f5919604d5cec192bbd064132a2f6d4b.jpg",
      "Jardinage": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
      "Cuisine": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80",
      "Déménagement": "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&q=80",
      "Bricolage": "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80",
      "Maçon": "https://images.unsplash.com/photo-1518729571365-8a8642109cab?w=400&q=80",
      "Menuisier bois": "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=400&q=80",
      "Menuisier métallique": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80",
      "Éducation": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
      "Réparation": "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&q=80",
      "Mécanique": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80",
    };
    return defaultImages[category.name] || "https://i.pinimg.com/736x/cc/35/ba/cc35baaadabca6dd0d5fceca0260363d.jpg";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#000080] mx-auto mb-4" />
          <p className="text-gray-600">Chargement des catégories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header Section */}
      <section
        className="text-white py-16 animate-fade-in"
        style={{
          backgroundImage:
            "url(https://i.pinimg.com/736x/cc/35/ba/cc35baaadabca6dd0d5fceca0260363d.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 bg-black/40 rounded-2xl py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Catégories de Services
          </h1>
          <p className="text-xl opacity-90 text-center mb-8">
            Choisissez parmi notre large gamme de services professionnels
          </p>

          {/* Search and Location Bar */}
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Search */}
            <div className="bg-white rounded-xl shadow-lg p-3 flex items-center gap-3">
              <Search className="w-6 h-6 text-[#000080]" />
              <Input
                type="text"
                placeholder="Recherchez un service..."
                className="flex-1 border-0 focus:outline-none text-gray-800 text-base"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="bg-white/10 backdrop-blur rounded-xl border border-white/20 p-3 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-[#FFF4EA]" />
              <span className="text-[#FFF4EA]">{location}</span>
              <Button
                onClick={getLocation}
                variant="ghost"
                className="ml-auto text-[#FFF4EA] hover:bg-white/20"
              >
                Localiser
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                Aucun service ne correspond à votre recherche.
              </p>
              <Button
                onClick={() => handleSearch("")}
                variant="outline"
                className="mt-4"
              >
                Réinitialiser la recherche
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="group relative rounded-3xl overflow-hidden shadow-xl bg-white cursor-pointer animate-fade-in-up transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  style={{ animationDelay: `${index * 0.08}s` }}
                  onClick={() => onNavigate("service-providers", { categoryId: category.id, categoryName: category.name })}
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={getCategoryImage(category)}
                      alt={category.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute top-4 right-4 bg-white/80 rounded-full px-4 py-1 text-xs font-semibold text-[#000080] shadow">
                      {category._count?.services || 0} services
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-[#000080] mb-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-2 text-base leading-relaxed min-h-[56px]">
                      {category.description || `Services de ${category.name}`}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-gray-500">
                        <span>Catégorie</span>
                        <div className="font-semibold text-lg text-gray-900">
                          {category.name}
                        </div>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-[#000080] to-[#001a99] hover:from-[#001a99] hover:to-[#000080] text-white shadow-lg px-5 py-2 rounded-xl text-base font-semibold transition-all duration-300"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onNavigate("service-providers", { categoryId: category.id, categoryName: category.name });
                        }}
                      >
                        Voir les Prestataires
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Ajout d'une section d'information */}
          <div className="mt-16">
            <p className="text-xl text-gray-600 mb-8 text-center">
              Contactez-nous et nous vous aiderons à trouver le prestataire
              adapté à vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                onClick={() => onNavigate("contact")}
              >
                Contacter le Support
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
                onClick={() => onNavigate("login-provider")}
              >
                Devenir Prestataire
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

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

const fallbackCategories: Category[] = [
  {
    id: "plomberie",
    name: "Plomberie",
    slug: "plomberie",
    description: "Installation, fuite, entretien et depannage a domicile.",
    image: "/images/plomberie.png",
  },
  {
    id: "menuiserie",
    name: "Menuiserie",
    slug: "menuiserie",
    description: "Fabrication, reparation et ajustements sur mesure.",
    image: "/images/menuiserie.png",
  },
  {
    id: "cuisine",
    name: "Cuisine",
    slug: "cuisine",
    description: "Chefs et cuisiniers pour vos besoins du quotidien et evenements.",
    image: "/images/cuisine.png",
  },
  {
    id: "mecanique",
    name: "Mecanique",
    slug: "mecanique",
    description: "Diagnostic, entretien et reparation de vehicules.",
    image: "/images/mecanique.png",
  },
  {
    id: "education",
    name: "Education",
    slug: "education",
    description: "Cours particuliers et accompagnement scolaire de proximite.",
    image: "/images/education.png",
  },
  {
    id: "reparation",
    name: "Reparation",
    slug: "reparation",
    description: "Interventions rapides pour vos pannes et petits travaux.",
    image: "/images/Reparation.png",
  },
];

function normalizeCategoriesResponse(response: any): Category[] {
  const categoriesData = response?.data?.data || response?.data || [];

  if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
    return fallbackCategories;
  }

  return categoriesData.map((category: any, index: number) => ({
    id: category.id || category.slug || `category-${index}`,
    name: category.name || "Service",
    slug: category.slug || category.id || `category-${index}`,
    description:
      category.description ||
      fallbackCategories[index % fallbackCategories.length].description,
    icon: category.icon,
    image:
      category.image ||
      fallbackCategories[index % fallbackCategories.length].image,
    _count: category._count,
  }));
}

export function ServiceCategoriesPage({
  onNavigate,
  params = {},
}: ServiceCategoriesPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(params.search || "");
  const [location, setLocation] = useState("Dakar, Sénégal");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/categories", false); // no cache
        console.log('Categories API response:', response);
        const normalizedCategories = response?.success
          ? normalizeCategoriesResponse(response)
          : fallbackCategories;

        setCategories(normalizedCategories);
        setFilteredCategories(normalizedCategories);
      } catch (err) {
        console.error("Erreur chargement catégories:", err);
        setCategories(fallbackCategories);
        setFilteredCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Search when searchQuery changes (from URL params)
  useEffect(() => {
    if (params.search) {
      handleSearch(params.search);
    }
  }, [params.search]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredCategories(categories);
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    // Search services from API
    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const response = await api.get(
        `/services?search=${encodeURIComponent(query)}&limit=10`,
      );
      if (response.success && response.data) {
        setSearchResults(response.data);
      }
    } catch (err) {
      console.error("Erreur recherche services:", err);
    } finally {
      setIsSearching(false);
    }

    // Also filter categories locally
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
      // If it's a local image (starts with /images/), use relative URL
      if (category.image.startsWith("/images/")) {
        return category.image;
      }
      return category.image;
    }
    // Default images based on category name (in French from API)
    const defaultImages: Record<string, string> = {
      Plomberie:
        "https://i.pinimg.com/736x/4d/3d/a8/4d3da898a7f0383572935a16f1e6df3a.jpg",
      Électricité:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80",
      Peinture:
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80",
      Ménage:
        "https://i.pinimg.com/736x/f5/91/96/f5919604d5cec192bbd064132a2f6d4b.jpg",
      Jardinage:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
      Cuisine:
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80",
      Déménagement:
        "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&q=80",
      Bricolage:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80",
      Maçon:
        "https://images.unsplash.com/photo-1518729571365-8a8642109cab?w=400&q=80",
      "Menuisier bois":
        "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=400&q=80",
      "Menuisier métallique":
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80",
      Éducation:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
      Réparation:
        "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&q=80",
      Mécanique:
        "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80",
    };
    return (
      defaultImages[category.name] ||
      "https://i.pinimg.com/736x/cc/35/ba/cc35baaadabca6dd0d5fceca0260363d.jpg"
    );
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
              {isSearching && (
                <Loader2 className="w-5 h-5 animate-spin text-[#000080]" />
              )}
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

      {/* Search Results Section */}
      {showSearchResults && searchResults.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#000080] mb-6">
              Résultats de recherche pour "{searchQuery}"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((service: any) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    onNavigate("service-detail", { id: service.id })
                  }
                >
                  <h3 className="font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[#000080] font-bold">
                      {service.price} XOF
                    </span>
                    <span className="text-xs text-gray-500">
                      {service.category?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setShowSearchResults(false);
                setSearchResults([]);
                setSearchQuery("");
                setFilteredCategories(categories);
              }}
            >
              Voir toutes les catégories
            </Button>
          </div>
        </section>
      )}

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
                  onClick={() =>
                    onNavigate("service-providers", {
                      categoryId: category.slug || category.id,
                      categoryName: category.name,
                    })
                  }
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
                          onNavigate("service-providers", {
                            categoryId: category.slug || category.id,
                            categoryName: category.name,
                          });
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
                onClick={() => onNavigate("login")}
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

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { 
  HeroSection, 
  CategoryCard, 
  ProviderCard,
  Loading 
} from "../common";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "../ui/button";

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

// Type definitions
export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  slug: string;
}

export interface Provider {
  id: string;
  userId: string;
  specialty?: string;
  rating: number;
  totalReviews: number;
  hourlyRate?: number;
  location?: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

// How it works steps
const steps = [
  {
    step: "1",
    title: "Rechercher",
    description:
      "Trouvez le service dont vous avez besoin auprès de nos prestataires",
  },
  {
    step: "2",
    title: "Réserver",
    description: "Planifiez un rendez-vous à l'heure qui vous convient",
  },
  {
    step: "3",
    title: "Obtenir le Service",
    description:
      "Profitez d'un service de qualité par des professionnels vérifiés",
  },
];

// Trust section data
const trustFeatures = [
  { title: "Professionnel Vérifiés", icon: "✓" },
  { title: "Prix Transparents", icon: "💰" },
  { title: "Garantie de Qualité", icon: "🛡️" },
  { title: "Support 24/7", icon: "📞" },
];

// Footer data
const footerSections = [
  {
    title: "À Propos",
    links: ["Qui sommes-nous", "Notre Mission", "Nos Valeurs"],
  },
  {
    title: "Services",
    links: [
      "Tous les Services",
      "Trouver un Prestataire",
      "Devenir Partenaire",
    ],
  },
  {
    title: "Support",
    links: ["Aide", "Contact", "FAQ"],
  },
  {
    title: "Légal",
    links: [
      "Conditions",
      "Politique de Confidentialité",
      "Cookies",
    ],
  },
];

const socialLinks = ["Facebook", "Instagram", "Twitter", "LinkedIn"];

export function HomePage({ onNavigate }: HomePageProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProviders, setFeaturedProviders] = useState<Provider[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await api.get("/categories");
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch featured providers from API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoadingProviders(true);
        const response = await api.get("/providers?limit=5");
        if (response.success && response.data) {
          setFeaturedProviders(response.data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des prestataires:", err);
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchProviders();
  }, []);

  // Carousel auto-rotation
  useEffect(() => {
    if (featuredProviders.length === 0) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredProviders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProviders.length]);

  const getVisibleProviders = (): Provider[] => {
    if (featuredProviders.length === 0) return [];
    const providers: Provider[] = [];
    for (let i = 0; i < 3; i++) {
      providers.push(
        featuredProviders[(carouselIndex + i) % featuredProviders.length],
      );
    }
    return providers;
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => onNavigate("categories")}
      />

      {/* Services Section with Images */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#000080] mb-4">
              Nos Services
            </h2>
            <p className="text-lg text-gray-600">
              Une large gamme de services professionnels à votre portée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingCategories ? (
              // Loading skeletons
              [...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-2xl"></div>
                </div>
              ))
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  image={category.image}
                  description={category.description}
                  onClick={() => onNavigate(`service-providers?category=${category.id}`)}
                  index={index}
                />
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">Aucune catégorie disponible</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Providers - Carousel */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#000080] mb-4">
              Prestataires en Vedette
            </h2>
            <p className="text-lg text-gray-600">
              Les meilleurs professionnels avec les meilleures notes
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {getVisibleProviders().map((provider, index) => (
                <ProviderCard
                  key={provider.id}
                  id={provider.id}
                  firstName={provider.user?.firstName || provider.specialty || "Prestataire"}
                  lastName={provider.user?.lastName || ""}
                  specialty={provider.specialty}
                  rating={provider.rating || 0}
                  totalReviews={provider.totalReviews || 0}
                  hourlyRate={provider.hourlyRate}
                  avatar={provider.user?.avatar}
                  onClick={() => onNavigate(`service-detail?id=${provider.id}`)}
                  onBook={() => onNavigate(`booking?provider=${provider.id}`)}
                  index={index}
                />
              ))}
            </div>

            {/* Carousel Controls */}
            {featuredProviders.length > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                {featuredProviders.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    title={`Voir le prestataire ${index + 1}`}
                    className={`h-3 transition-all duration-300 rounded-full ${
                      index === carouselIndex % featuredProviders.length
                        ? "bg-[#000080] w-8"
                        : "bg-gray-300 w-3 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#000080] to-blue-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comment ça Fonctionne
            </h2>
            <p className="text-lg text-gray-200">
              Trois étapes simples pour trouver le service idéal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  animation: `slide-up 0.6s ease-out ${index * 0.2}s both`,
                }}
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-1 bg-gradient-to-r from-[#FFF4EA] to-transparent" />
                )}

                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-[#FFF4EA] hover:bg-white/20 transition-all duration-300 group-hover:shadow-2xl">
                  {/* Step number */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFF4EA] to-yellow-200 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-[#000080]">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-200">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Button
              onClick={() => onNavigate("categories")}
              className="bg-[#FFF4EA] hover:bg-white text-[#000080] font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              Commencer Maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#000080] mb-4">
              Pourquoi Nous Choisir
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#000080]">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative pt-20 pb-10 bg-[#000080] text-white overflow-hidden">
        {/* Background image with opacity */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000080]/90 via-[#000080]/85 to-[#000080]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg mb-4 text-[#FFF4EA]">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-[#FFF4EA] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="border-t border-white/20 pt-8 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-300 text-sm">
                © 2026 KaayJob. Tous droits réservés.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                {socialLinks.map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-300 hover:text-[#FFF4EA] transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

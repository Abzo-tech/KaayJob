import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Wrench, Lightbulb, Paintbrush, Brush, Hammer, Car, Home, Scissors, Settings, Shield, MapPin, Search } from "lucide-react";
import { useState } from "react";

interface ServiceCategoriesPageProps {
  onNavigate: (page: string) => void;
}

export function ServiceCategoriesPage({ onNavigate }: ServiceCategoriesPageProps) {
  // Images for each service
  const serviceImages = [
    "https://i.pinimg.com/736x/4d/3d/a8/4d3da898a7f0383572935a16f1e6df3a.jpg", // Plombier
    "https://i.pinimg.com/1200x/87/51/6c/87516c2648221145e8984eead29ca6ef.jpg", // Électricien
    "https://i.pinimg.com/736x/bf/e3/5b/bfe35bfafa3f17a186b7702650000a8d.jpg", // Peintre
    "https://i.pinimg.com/1200x/90/74/7e/90747e3cbe738c49873b37d8a827aa52.jpg", // Nettoyeur
    "https://i.pinimg.com/1200x/d4/b8/bc/d4b8bc110673bd134252464cf8cbb486.jpg", // Menuisier
    "https://i.pinimg.com/736x/db/74/d1/db74d1e975d9458bcafece423de52faa.jpg", // Mécanicien
  ];
  const categories = [
    {
      name: "Plombier",
      icon: Wrench,
      description: "Réparation de fuites, installation de canalisations, nettoyage de drains et réparation de chauffes-eau",
      providers: 45,
      avgPrice: "25-40€/h",
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Électricien", 
      icon: Lightbulb,
      description: "Réparations électriques, câblage, installation de prises et luminaires",
      providers: 38,
      avgPrice: "30-50€/h",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      name: "Peintre",
      icon: Paintbrush,
      description: "Peinture intérieure et extérieure, préparation des murs et conseil en couleurs",
      providers: 52,
      avgPrice: "20-35€/h",
      color: "bg-purple-100 text-purple-800"
    },
    {
      name: "Nettoyeur",
      icon: Brush,
      description: "Nettoyage de maison, nettoyage en profondeur, nettoyage de bureau et déménagement",
      providers: 67,
      avgPrice: "15-25€/h",
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Menuisier",
      icon: Hammer,
      description: "Réparation de meubles, menuiserie sur mesure, installation de portes et placards",
      providers: 29,
      avgPrice: "25-45€/h",
      color: "bg-orange-100 text-orange-800"
    },
    {
      name: "Mécanicien",
      icon: Car,
      description: "Réparations automobiles, entretien, diagnostics et services de mécanicien mobile",
      providers: 34,
      avgPrice: "35-60€/h",
      color: "bg-red-100 text-red-800"
    },
    {
      name: "Spécialiste CVC",
      icon: Settings,
      description: "Installation et réparation de chauffage, ventilation et climatisation",
      providers: 23,
      avgPrice: "40-70€/h",
      color: "bg-indigo-100 text-indigo-800"
    },
    {
      name: "Réparation Maison",
      icon: Home,
      description: "Services de bricoleur généraux, petites réparations et entretien de maison",
      providers: 41,
      avgPrice: "20-30€/h",
      color: "bg-teal-100 text-teal-800"
    },
    {
      name: "Serrurier",
      icon: Shield,
      description: "Installation de serrures, coupe de clés et services d'urgence ouverture de porte",
      providers: 18,
      avgPrice: "30-50€/h",
      color: "bg-gray-100 text-gray-800"
    },
    {
      name: "Coiffeur",
      icon: Scissors,
      description: "Coupes de cheveux, coiffure, coloration et soins esthétiques à domicile",
      providers: 31,
      avgPrice: "25-40€/h",
      color: "bg-pink-100 text-pink-800"
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Dakar, Sénégal");
  const [filteredCategories, setFilteredCategories] = useState(categories);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = categories.filter(cat => 
      cat.name.toLowerCase().includes(query.toLowerCase()) ||
      cat.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock location - en production, utiliser API de géocodage
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => console.log("Localisation refusée", error)
      );
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-[#000080] to-[#001a99] text-white py-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Catégories de Services</h1>
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
              <p className="text-xl text-gray-500">Aucun service ne correspond à votre recherche.</p>
              <Button 
                onClick={() => handleSearch("")}
                variant="outline"
                className="mt-4"
              >
                Réinitialiser la recherche
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((category, index) => {
                const IconComponent = category.icon;
                // Map image to service by index (for demo, first 6 services)
                const imageUrl = serviceImages[index] || serviceImages[0];
                return (
                  <Card 
                    key={category.name}
                    className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-[#000080]/10 shadow-lg bg-white hover:scale-105 hover:border-[#000080]/30 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => onNavigate('service-detail')}
                  >
                    <CardHeader className="pb-4 bg-gradient-to-r from-[#FFF4EA] to-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="p-3 bg-gradient-to-br from-[#000080] to-[#001a99] rounded-lg mr-4">
                            <IconComponent className="w-8 h-8 text-[#FFF4EA]" />
                          </div>
                          <CardTitle className="text-xl text-[#000080]">{category.name}</CardTitle>
                        </div>
                        <Badge className="bg-[#000080] text-[#FFF4EA] hover:bg-[#001a99]">
                          {category.providers} prestataires
                        </Badge>
                      </div>
                      {/* Service image */}
                      <div className="w-full h-48 rounded-xl overflow-hidden mb-2 shadow-md">
                        <img src={imageUrl} alt={category.name + ' image'} className="object-cover w-full h-full" loading="lazy" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 text-base leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span>À partir de</span>
                          <div className="font-semibold text-lg text-gray-900">
                            {category.avgPrice}
                          </div>
                        </div>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onNavigate('service-detail');
                          }}
                        >
                          Voir les Prestataires
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {/* Ajout d'une section d'information */}
          <div>
            <p className="text-xl text-gray-600 mb-8">
              Contactez-nous et nous vous aiderons à trouver le prestataire adapté à vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                onClick={() => onNavigate('contact')}
              >
                Contacter le Support
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
                onClick={() => onNavigate('login')}
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

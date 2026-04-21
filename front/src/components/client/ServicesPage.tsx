import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { CategoryCard, Loading } from "../common";
import { Briefcase, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface ServicesPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

interface Category {
  id: string;
  name: string;
  image: string;
  icon?: string;
  description: string;
  slug: string;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/categories");
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#000080] to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tous nos Services
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Découvrez l'ensemble des services professionnels disponibles sur KaayJob
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
              Services par Catégorie
            </h2>
            <p className="text-lg text-gray-600">
              Trouvez le service qu'il vous faut dans notre large sélection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  image={category.image}
                  icon={category.icon}
                  description={category.description}
                  onClick={() =>
                    onNavigate("service-providers", {
                      categoryId: category.slug || category.id,
                      categoryName: category.name,
                    })
                  }
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">Aucune catégorie disponible pour le moment</p>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-[#000080] mb-4">
                Vous êtes prestataire ?
              </h3>
              <p className="text-gray-600 mb-6">
                Rejoignez notre plateforme et proposez vos services à des milliers de clients
              </p>
              <Button
                onClick={() => onNavigate("partner")}
                className="bg-[#000080] hover:bg-blue-700 text-white px-8 py-3"
              >
                Devenir prestataire
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export function HeroSection({ searchQuery, onSearchChange, onSearch }: HeroSectionProps) {
  return (
    <section className="relative h-screen text-white overflow-hidden">
      {/* Senegalese Background Image - Service Provider & Client Communication */}
      <div className="absolute inset-0">
        {/* Senegalese professionals and client communication background image */}
        <div
          className="w-full h-full object-cover bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/1200x/4d/5d/e8/4d5de82c946cd58e5f9dc7f723326633.jpg')",
            backgroundAttachment: "fixed",
          }}
        />
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        {/* Animated text */}
        <div className="text-center space-y-6 max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Trouvez les Meilleurs
            <span className="text-[#FFF4EA] block mt-2">
              Prestataires Près de Vous
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
            Connectez-vous avec des professionnels de confiance pour tous vos
            besoins
          </p>
        </div>

        {/* Modern Search Bar */}
        <div
          className="mt-12 w-full max-w-2xl px-4 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2 group hover:shadow-3xl transition-all duration-300">
            <Search className="w-6 h-6 text-[#000080] ml-4 group-hover:text-blue-700 transition-colors" />
            <Input
              type="text"
              placeholder="Plombier, électricien, nettoyage... Que recherchez-vous?"
              className="flex-1 border-0 focus:outline-none text-gray-800 placeholder-gray-400 text-lg py-3"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Button
              onClick={onSearch}
              className="bg-[#000080] hover:bg-blue-900 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mr-1"
            >
              Chercher
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-white rounded-full animate-scroll-down" />
          </div>
        </div>
      </div>
    </section>
  );
}

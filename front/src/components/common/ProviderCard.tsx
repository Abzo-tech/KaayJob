import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ProviderCardProps {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  rating: number;
  totalReviews: number;
  hourlyRate?: number;
  avatar?: string;
  onClick: () => void;
  onBook: () => void;
  index?: number;
}

const PROVIDER_COVER_IMAGES: Record<string, string> = {
  plomberie: "/images/plomberie.png",
  plombier: "/images/plomberie.png",
  cuisine: "/images/cuisine.png",
  cuisinier: "/images/cuisine.png",
  menuiserie: "/images/menuiserie.png",
  menuisier: "/images/menuiserie.png",
  mecanique: "/images/mecanique.png",
  mecanicien: "/images/mecanique.png",
  education: "/images/education.png",
  professeur: "/images/education.png",
  reparateur: "/images/reparation.png",
  reparation: "/images/reparation.png",
  macon: "/images/reparation.png",
  maconnerie: "/images/reparation.png",
  demenagement: "/images/Demenagement.png",
  metallique: "/images/metalique.png",
  soudeur: "/images/metalique.png",
};

function normalizeValue(value?: string) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getProviderCoverImage(avatar?: string, specialty?: string) {
  if (avatar) {
    return avatar;
  }

  const normalizedSpecialty = normalizeValue(specialty);

  for (const [keyword, image] of Object.entries(PROVIDER_COVER_IMAGES)) {
    if (normalizedSpecialty.includes(keyword)) {
      return image;
    }
  }

  return "/images/cuisine.png";
}

export function ProviderCard({
  id,
  firstName,
  lastName,
  specialty,
  rating,
  totalReviews,
  hourlyRate,
  avatar,
  onClick,
  onBook,
  index = 0,
}: ProviderCardProps) {
  const fullName = `${firstName} ${lastName}`;
  const categoryName = specialty || "Service";
  const reviews = totalReviews || 0;
  const price = hourlyRate ? `${Number(hourlyRate).toLocaleString("fr-SN")} CFA/h` : "Sur devis";
  const image = getProviderCoverImage(avatar, specialty);

  return (
    <div
      className="group animate-fade-in bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
      onClick={onClick}
      style={{
        animation: `scale-in 0.4s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Provider Image */}
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={fullName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000080]/80 via-[#000080]/20 to-transparent" />
        <div className="absolute left-4 bottom-4">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#000080] shadow-lg">
            KaayJob Senegal
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-[#FFF4EA] px-3 py-1 rounded-full shadow-lg">
          <span className="font-bold text-[#000080]">
            {price}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#000080] mb-1">
          {fullName}
        </h3>
        <p className="text-gray-600 font-medium mb-4">
          {categoryName}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="font-bold text-[#000080]">
            {rating}
          </span>
          <span className="text-gray-600 text-sm">
            ({reviews})
          </span>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onBook();
          }}
          className="w-full bg-[#000080] hover:bg-blue-900 text-white font-bold py-2 rounded-lg transition-all duration-300 group-hover:translate-y-0"
        >
          Réserver
        </Button>
      </div>
    </div>
  );
}

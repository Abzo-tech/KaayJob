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
  const price = hourlyRate ? `${hourlyRate}€/h` : "Sur devis";
  const image = avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&crop=faces&fit=crop";

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

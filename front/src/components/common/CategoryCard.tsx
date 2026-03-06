import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  onClick: () => void;
  index?: number;
}

export function CategoryCard({
  id,
  name,
  image,
  description,
  onClick,
  index = 0,
}: CategoryCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
      style={{
        animation: `scale-in 0.6s ease-out ${index * 0.1}s both`,
      }}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className="text-sm text-gray-200 mb-4">{description}</p>
        <div className="flex items-center gap-2 text-[#FFF4EA] group-hover:translate-x-2 transition-transform">
          <span className="text-sm font-semibold">Découvrir</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-[#000080]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

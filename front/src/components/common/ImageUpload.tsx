import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, Image, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  rounded?: "full" | "lg" | "md" | "none";
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Photo de profil",
  size = "md",
  rounded = "full",
  placeholder
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  const roundedClasses = {
    full: "rounded-full",
    lg: "rounded-lg",
    md: "rounded-md",
    none: "rounded-none",
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result as string;
        onChange(base64);
        toast.success(`${label} mise à jour !`);
        setIsUploading(false);
      };

      reader.onerror = () => {
        toast.error("Erreur lors de l'upload");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload");
      setIsUploading(false);
    }

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        role="button"
        tabIndex={0}
        className={`relative cursor-pointer group ${sizeClasses[size]} ${roundedClasses[rounded]} overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors`}
      >
        {value ? (
          <>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <Image className="w-8 h-8 text-white" />
            </div>
            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 pointer-events-none">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs">{placeholder || "Ajouter"}</span>
              </>
            )}
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {label && (
        <p className="text-xs text-gray-500">
          {isUploading ? "Upload en cours..." : "Cliquez pour changer"}
        </p>
      )}
    </div>
  );
}

// Service Image Upload component
interface ServiceImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ServiceImageUpload({
  images,
  onChange,
  maxImages = 5,
}: ServiceImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if we can add more images
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images autorisées`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);

    setIsUploading(true);
    try {
      const newImages: string[] = [];

      for (const file of filesToUpload) {
        // Validate file type
        if (!file.type.startsWith("image/")) continue;
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          toast.error("L'image ne doit pas dépasser 2MB");
          continue;
        }

        const reader = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newImages.push(reader);
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
        toast.success(`${newImages.length} image(s) ajoutée(s) !`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }

    // Reset input so same files can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {/* Existing images */}
        {images.map((img, index) => (
          <div
            key={index}
            className="relative w-24 h-24 rounded-lg overflow-hidden group"
          >
            <img
              src={img}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover pointer-events-none"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Add more button */}
        {images.length < maxImages && (
          <div
            onClick={handleClick}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
            role="button"
            tabIndex={0}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">
                  {images.length}/{maxImages}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <p className="text-xs text-gray-500">
        Cliquez sur + pour ajouter des images (max {maxImages})
      </p>
    </div>
  );
}

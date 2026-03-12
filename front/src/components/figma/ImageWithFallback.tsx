import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// Default fallback images for categories without images
const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  'bricolage': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800',
  'cuisine': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
  'déménagement': 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800',
  'electricité': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
  'jardinage': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
  'ménage': 'https://images.unsplash.com/photo-1581578731548-c64695b64635?w=800',
  'peinture': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800',
  'plomberie': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
  'maçon': 'https://images.unsplash.com/photo-1518729571365-8a8642109cab?w=800',
  'menuisier bois': 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=800',
  'menuisier métallique': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
  'éducation': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
  'réparation': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800',
  'mécanique': 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800',
}

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  // If src is null, undefined, or empty, use a default image based on alt text
  // Use relative path for local images
  let effectiveSrc = !src ? getDefaultImage(alt) : src;
  // Local images starting with /images/ are served from the same origin

  function getDefaultImage(categoryName?: string): string {
    if (!categoryName) return ERROR_IMG_SRC
    
    // Try to find a matching default image based on category name
    const normalizedName = categoryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    
    for (const [key, url] of Object.entries(DEFAULT_CATEGORY_IMAGES)) {
      if (normalizedName.includes(key)) {
        return url
      }
    }
    
    return ERROR_IMG_SRC
  }

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={effectiveSrc} />
      </div>
    </div>
  ) : (
    <img src={effectiveSrc} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}

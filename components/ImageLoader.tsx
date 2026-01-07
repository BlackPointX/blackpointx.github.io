
import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
}

// Pixel Art Pikachu (16x16 grid scaled)
const PixelPikachu = () => (
  <svg width="48" height="48" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce-short">
    {/* Uszy */}
    <rect x="3" y="2" width="2" height="3" fill="#FFCB05" />
    <rect x="3" y="1" width="2" height="1" fill="black" />
    <rect x="11" y="2" width="2" height="3" fill="#FFCB05" />
    <rect x="11" y="1" width="2" height="1" fill="black" />
    
    {/* Głowa i Ciało */}
    <rect x="4" y="5" width="8" height="8" fill="#FFCB05" />
    <rect x="3" y="6" width="10" height="6" fill="#FFCB05" />
    
    {/* Policzki */}
    <rect x="4" y="8" width="2" height="1" fill="#F87171" />
    <rect x="10" y="8" width="2" height="1" fill="#F87171" />
    
    {/* Oczy */}
    <rect x="5" y="6" width="1" height="1" fill="black" />
    <rect x="10" y="6" width="1" height="1" fill="black" />
    
    {/* Usta */}
    <rect x="7" y="9" width="2" height="1" fill="black" opacity="0.3" />
    
    {/* Nóżki */}
    <rect x="5" y="12" width="2" height="2" fill="#FFCB05" />
    <rect x="9" y="12" width="2" height="2" fill="#FFCB05" />
    
    {/* Ogon (zygzak) */}
    <rect x="13" y="7" width="2" height="2" fill="#92400E" />
    <rect x="14" y="5" width="2" height="2" fill="#92400E" />
  </svg>
);

// Pixel Art PokeBall (12x12 grid scaled)
const PixelPokeBall = () => (
  <svg width="32" height="32" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin-slow">
    {/* Obrys */}
    <rect x="3" y="0" width="6" height="12" fill="black" rx="1" />
    <rect x="0" y="3" width="12" height="6" fill="black" rx="1" />
    <rect x="1" y="1" width="10" height="10" fill="black" rx="2" />
    
    {/* Góra (Czerwony) */}
    <rect x="2" y="2" width="8" height="4" fill="#EF4444" />
    <rect x="3" y="1" width="6" height="2" fill="#EF4444" />
    
    {/* Dół (Biały) */}
    <rect x="2" y="6" width="8" height="4" fill="white" />
    <rect x="3" y="9" width="6" height="2" fill="white" />
    
    {/* Środek (Linia i przycisk) */}
    <rect x="1" y="5" width="10" height="2" fill="black" />
    <rect x="4" y="4" width="4" height="4" fill="white" stroke="black" strokeWidth="1" />
    <rect x="5" y="5" width="2" height="2" fill="white" stroke="black" strokeWidth="0.5" />
  </svg>
);

export const ImageLoader: React.FC<ImageLoaderProps> = ({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${containerClassName}`}
      onClick={onClick}
    >
      {/* Custom Pixel Art Loading Animation */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-50/50 backdrop-blur-[2px]">
           <div className="flex items-end gap-1 mb-2">
              <PixelPikachu />
              <PixelPokeBall />
           </div>
           <span className="font-tech text-xs font-bold text-gray-400 tracking-widest animate-pulse">LOADING...</span>
        </div>
      )}

      {/* Error Placeholder */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center text-gray-400 p-4 text-center h-full w-full bg-gray-200">
          <ImageOff size={32} className="mb-2 opacity-50" />
          <span className="text-[10px] font-bold uppercase">Brak zdjęcia</span>
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true); // Stop spinner
          }}
        />
      )}
    </div>
  );
};

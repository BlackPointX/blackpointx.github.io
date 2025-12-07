import React, { useState } from 'react';
import { Product } from '../types';
import { getTypeColor } from '../services/mockData';
import { Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface CardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onClick: (product: Product) => void;
}

export const Card: React.FC<CardProps> = ({ product, onAdd, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdded) return;
    
    onAdd(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  return (
    <div 
      className="relative group bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-200 hover:border-poke-blue transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="aspect-[2/3] w-full relative bg-gray-100 overflow-hidden">
         <img 
          src={product.images[currentImageIndex]} 
          alt={`${product.name} view ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Type Badge */}
        <div className={`absolute top-1 left-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm shadow-sm opacity-90 ${getTypeColor(product.type)} text-white`}>
          {product.type}
        </div>

        {/* Image Navigation Arrows (only if more than 1 image) */}
        {product.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
            >
              <ChevronRight size={16} />
            </button>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {product.images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300 ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="p-2 flex justify-between items-center bg-gray-50 relative z-10 border-t border-gray-100">
        <div className="flex flex-col">
          <span className="font-tech font-bold text-gray-800 text-sm truncate w-24 sm:w-32 group-hover:text-poke-blue transition-colors duration-300">{product.name}</span>
          <span className="text-poke-red font-bold font-mono">{product.price.toFixed(2)} zł</span>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`
            p-1.5 rounded-full text-white shadow-sm z-10 transition-all duration-300 flex items-center justify-center
            ${isAdded 
              ? 'bg-poke-green scale-110 animate-bounce-short' 
              : 'bg-poke-blue hover:bg-blue-600 active:scale-95'
            }
          `}
          aria-label="Dodaj do koszyka"
        >
          {isAdded ? <Check size={16} strokeWidth={3} /> : <Plus size={16} />}
        </button>
      </div>
    </div>
  );
};
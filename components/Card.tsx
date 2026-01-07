
import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, ChevronLeft, ChevronRight, Check, Sparkles, Clock, Globe } from 'lucide-react';
import { ImageLoader } from './ImageLoader';

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
    // FIX: Teraz sprawdzamy stock dla wszystkich produktów, jeśli jest zdefiniowany
    if (isAdded || (product.stock !== undefined && product.stock <= 0)) return;
    
    onAdd(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  // FIX: Wyprzedane jeśli stan <= 0 (dla wszystkich, w tym AI)
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isPreorder = !!product.preorderDate;

  return (
    <div 
      className={`relative group bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl cursor-pointer ${isOutOfStock ? 'border-gray-200 opacity-80' : 'border-gray-200 hover:border-poke-blue'}`}
      onClick={() => onClick(product)}
    >
      <div className="aspect-[2/3] w-full relative">
         <ImageLoader 
            src={product.images[currentImageIndex]} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
            containerClassName="w-full h-full"
         />
        
        {/* Source Badge (Top Right) */}
        <div className="absolute top-1 right-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm shadow-sm bg-gray-800/90 text-white z-20 flex items-center gap-1 backdrop-blur-sm">
          <Globe size={10} />
          {product.source}
        </div>

        {/* AI Badge & Preorder (Top Left Stack) */}
        <div className="absolute top-1 left-1 flex flex-col gap-1 z-20 items-start">
             {product.isAi && (
               <div className="px-1.5 py-0.5 bg-purple-600/90 backdrop-blur-sm rounded-sm shadow-sm flex items-center gap-1">
                 <Sparkles size={10} className="text-white" />
                 <span className="text-[9px] font-bold text-white uppercase tracking-tighter">AI</span>
               </div>
            )}
            {isPreorder && !isOutOfStock && (
                <div className="px-2 py-0.5 bg-poke-yellow/90 backdrop-blur-sm rounded-sm shadow-sm flex items-center gap-1 text-poke-dark border border-yellow-500">
                   <Clock size={10} />
                   <span className="text-[9px] font-bold uppercase tracking-tighter">PREORDER</span>
                </div>
            )}
        </div>

        {/* Author Badge (Bottom Overlay) */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent z-20 pb-6">
            <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold mb-0.5">Autor</p>
            <p className="text-white font-bold text-xs truncate shadow-black drop-shadow-md">{product.author}</p>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20">
                 <div className="bg-red-600 text-white px-3 py-1 font-bold text-xs uppercase -rotate-12 border-2 border-white shadow-lg">
                    Wyprzedane
                 </div>
            </div>
        )}

        {/* Image Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-20"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-20"
            >
              <ChevronRight size={16} />
            </button>
            
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-30">
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
          
          {isPreorder ? (
              <span className="text-[10px] font-bold text-poke-yellow bg-gray-800 px-1.5 py-0.5 rounded inline-block mt-0.5">
                  Premiera: {product.preorderDate}
              </span>
          ) : (
            <span className={`font-mono font-bold ${isOutOfStock ? 'text-gray-400 line-through' : 'text-poke-red'}`}>
                {product.price.toFixed(2)} zł
            </span>
          )}
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={isAdded || isOutOfStock}
          className={`
            p-1.5 rounded-full text-white shadow-sm z-10 transition-all duration-300 flex items-center justify-center
            ${isOutOfStock 
                ? 'bg-gray-300 cursor-not-allowed'
                : (isAdded ? 'bg-poke-green scale-110 animate-bounce-short' : (isPreorder ? 'bg-poke-yellow text-poke-dark hover:bg-yellow-400' : 'bg-poke-blue hover:bg-blue-600 active:scale-95'))
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

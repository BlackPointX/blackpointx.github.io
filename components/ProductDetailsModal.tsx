import React, { useState } from 'react';
import { Product } from '../types';
import { getTypeColor } from '../services/mockData';
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, onAdd }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Gallery Section */}
        <div className="w-full md:w-1/2 bg-gray-100 relative flex flex-col">
          <div className="flex-grow relative overflow-hidden flex items-center justify-center bg-gray-900">
             <img 
               src={product.images[currentImageIndex]} 
               alt={product.name} 
               className="max-h-full max-w-full object-contain"
             />
             
             {product.images.length > 1 && (
               <>
                 <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md">
                   <ChevronLeft size={24} />
                 </button>
                 <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md">
                   <ChevronRight size={24} />
                 </button>
               </>
             )}
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="p-4 bg-gray-200 flex gap-2 overflow-x-auto no-scrollbar justify-center">
               {product.images.map((img, idx) => (
                 <button 
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-poke-blue opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                 >
                   <img src={img} alt="thumb" className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto bg-white">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded shadow-sm text-white ${getTypeColor(product.type)}`}>
              {product.type}
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border border-gray-300 px-2 py-0.5 rounded">
              {product.rarity}
            </span>
          </div>

          <h2 className="font-tech text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {product.name}
          </h2>

          <div className="text-4xl font-mono text-poke-red font-bold mb-6">
            {product.price.toFixed(2)} zł
          </div>

          <div className="prose text-gray-600 mb-8 flex-grow">
            <h3 className="font-bold text-sm uppercase text-gray-400 mb-2">Opis karty</h3>
            <p className="leading-relaxed">
              {product.description}
            </p>
          </div>

          <button 
            onClick={() => {
              onAdd(product);
              // Optional: Close modal after adding, or keep it open.
              // onClose(); 
            }}
            className="w-full bg-poke-dark text-white py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl"
          >
            <ShoppingCart size={20} />
            Dodaj do decku
          </button>
        </div>
      </div>
    </div>
  );
};
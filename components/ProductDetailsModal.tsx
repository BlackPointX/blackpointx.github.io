
import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingCart, ChevronLeft, ChevronRight, Share2, Check, Box, Clock, User, Globe } from 'lucide-react';
import { ImageLoader } from './ImageLoader';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, onAdd }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  if (!product) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    
    try {
      await navigator.clipboard.writeText(url.toString());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Zmiana: Jeśli stock <= 0, to jest wyprzedany, niezależnie czy to preorder.
  const isOutOfStock = !product.isAi && product.stock <= 0;
  const isPreorder = !!product.preorderDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-slide-up">
        
        {/* Buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
           <button 
            onClick={handleShare}
            className="bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white hover:text-poke-blue transition-colors shadow-md flex items-center justify-center"
            title="Kopiuj link do karty"
          >
            {isCopied ? <Check size={20} className="text-green-500" /> : <Share2 size={20} />}
          </button>
          <button 
            onClick={onClose}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors shadow-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Gallery Section */}
        <div className="w-full md:w-1/2 bg-gray-900 relative flex flex-col">
          <div className="flex-grow relative overflow-hidden flex items-center justify-center">
             <ImageLoader 
               src={product.images[currentImageIndex]} 
               alt={product.name} 
               className={`max-h-full max-w-full object-contain ${isOutOfStock ? 'grayscale opacity-70' : ''}`}
               containerClassName="w-full h-full bg-transparent"
             />
             
             {isOutOfStock && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-6 py-3 rounded-lg font-bold border-2 border-red-500 rotate-12 z-20 text-xl uppercase tracking-widest shadow-xl backdrop-blur-sm">
                   Wyprzedane
                </div>
             )}

             {isPreorder && !isOutOfStock && (
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-poke-yellow text-poke-dark px-4 py-2 rounded-full font-bold border-2 border-white shadow-lg z-20 flex items-center gap-2">
                     <Clock size={16} /> PREORDER
                 </div>
             )}

             {product.images.length > 1 && (
               <>
                 <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md z-10">
                   <ChevronLeft size={24} />
                 </button>
                 <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md z-10">
                   <ChevronRight size={24} />
                 </button>
               </>
             )}
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="p-4 bg-gray-800 flex gap-2 overflow-x-auto no-scrollbar justify-center">
               {product.images.map((img, idx) => (
                 <button 
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentImageIndex ? 'border-poke-blue opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                 >
                   <ImageLoader src={img} alt="thumb" className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto bg-white">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase rounded shadow-sm text-gray-800 bg-gray-200 flex items-center gap-1">
              <User size={12} /> {product.author}
            </span>
            <span className="px-3 py-1 text-xs font-bold uppercase rounded shadow-sm text-white bg-gray-800 flex items-center gap-1">
              <Globe size={12} /> {product.source}
            </span>
          </div>

          <h2 className="font-tech text-3xl md:text-4xl font-bold text-gray-800 mb-2 leading-tight">
            {product.name}
          </h2>

          <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
             <div className="text-4xl font-mono text-poke-red font-bold">
               {product.price.toFixed(2)} zł
             </div>
             
             {/* Stock / Preorder Info */}
             <div className="flex flex-col items-end">
                {isPreorder ? (
                   <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 font-bold text-sm text-poke-yellow bg-gray-800 px-2 py-1 rounded">
                          <Clock size={16} />
                          Premiera: {product.preorderDate}
                      </div>
                      {!product.isAi && (
                          <span className={`text-xs font-bold ${product.stock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                             {product.stock > 0 ? `Limit: ${product.stock} szt.` : 'Wyprzedane'}
                          </span>
                      )}
                   </div>
                ) : !product.isAi && (
                    <div className={`flex items-center gap-1 font-bold text-sm ${product.stock > 0 ? (product.stock < 3 ? 'text-orange-500' : 'text-green-600') : 'text-red-500'}`}>
                        <Box size={16} />
                        {product.stock > 0 ? `Dostępne sztuk: ${product.stock}` : 'Brak w magazynie'}
                    </div>
                )}
             </div>
          </div>

          <div className="prose text-gray-600 mb-8 flex-grow">
            <h3 className="font-bold text-sm uppercase text-gray-400 mb-2">Opis karty</h3>
            <p className="leading-relaxed">
              {product.description}
            </p>
          </div>

          <button 
            onClick={() => {
              if (!isOutOfStock) {
                 onAdd(product);
              }
            }}
            disabled={isOutOfStock}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xl ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (isPreorder ? 'bg-poke-yellow text-poke-dark hover:bg-yellow-400' : 'bg-poke-dark text-white hover:bg-gray-800')} active:scale-[0.98]`}
          >
            {isOutOfStock ? (
               'Wyprzedane'
            ) : isPreorder ? (
               <>
                 <Clock size={20} />
                 ZAMÓW (PREORDER)
               </>
            ) : (
               <>
                 <ShoppingCart size={20} />
                 Dodaj do decku
               </>
            )}
          </button>
          
          {isPreorder && !isOutOfStock && (
              <p className="text-center text-[10px] text-gray-500 mt-2 italic">
                  * Produkt w przedsprzedaży. Wysyłka nastąpi po dacie premiery.
              </p>
          )}
        </div>
      </div>
    </div>
  );
};

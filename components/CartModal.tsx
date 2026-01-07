
import React, { useMemo } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ArrowRight, Pencil, Sparkles, Truck, AlertCircle } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
  onEditCustom?: (item: CartItem) => void;
}

export const CartModal: React.FC<CartModalProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQty,
  onCheckout,
  onEditCustom
}) => {
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.price * item.quantity), 0), [items]);
  const shippingCost = 12.00;
  const total = subtotal + shippingCost;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="bg-poke-dark text-white p-4 flex justify-between items-center shadow-md">
          <h2 className="font-tech text-xl font-bold tracking-wider">TWÓJ DECK (KOSZYK)</h2>
          <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" alt="Empty" className="w-24 h-24 mb-4 grayscale" />
              <p className="font-tech text-lg">Twój koszyk jest pusty...</p>
            </div>
          ) : (
            items.map(item => {
               // FIX: Check stock for ALL items
               const isMaxStock = item.stock !== undefined && item.quantity >= item.stock;

               return (
                <div key={item.id} className={`flex gap-3 p-3 rounded-lg border relative ${item.customData ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                    {item.customData && (
                    <div className="absolute -top-2 -left-2 bg-poke-yellow text-poke-dark text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles size={10} /> CUSTOM
                    </div>
                    )}
                    
                    <img src={item.images[0]} alt={item.name} className="w-16 h-24 object-cover rounded bg-gray-200" />
                    
                    <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm text-gray-800 line-clamp-1 pr-6">{item.name}</h3>
                        <div className="flex gap-1">
                        {item.customData && onEditCustom && (
                            <button 
                            onClick={() => onEditCustom(item)} 
                            className="text-gray-400 hover:text-poke-blue transition-colors"
                            title="Edytuj projekt"
                            >
                            <Pencil size={16} />
                            </button>
                        )}
                        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                        </button>
                        </div>
                    </div>
                    
                    {item.customData && (
                        <p className="text-xs text-gray-500 italic truncate max-w-[150px]">
                        {item.customData.subject || 'Brak opisu'}
                        </p>
                    )}
                    
                    <div className="flex justify-between items-end mt-2">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 bg-white rounded border border-gray-300 px-2 py-0.5 shadow-sm">
                            <button 
                                onClick={() => onUpdateQty(item.id, -1)}
                                className="text-lg font-bold text-gray-500 hover:text-black w-4 flex justify-center"
                                disabled={item.quantity <= 1}
                            >-</button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                                onClick={() => onUpdateQty(item.id, 1)}
                                className={`text-lg font-bold w-4 flex justify-center ${isMaxStock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-black'}`}
                                disabled={isMaxStock}
                            >+</button>
                            </div>
                            {isMaxStock && (
                                <span className="text-[9px] text-orange-500 font-bold mt-1 flex items-center gap-1">
                                    <AlertCircle size={8} /> Max
                                </span>
                            )}
                        </div>
                        <span className="font-mono font-bold text-poke-red">
                        {(item.price * item.quantity).toFixed(2)} zł
                        </span>
                    </div>
                    </div>
                </div>
               );
            })
          )}
        </div>

        <div className="p-4 bg-gray-100 border-t border-gray-200 space-y-3">
          {items.length > 0 && (
            <>
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span>Wartość kart:</span>
                <span className="font-mono">{subtotal.toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 text-sm border-b border-gray-300 pb-2">
                <span className="flex items-center gap-1"><Truck size={14} /> Wysyłka (InPost):</span>
                <span className="font-mono">{shippingCost.toFixed(2)} zł</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between items-center mb-2">
            <span className="font-tech text-gray-700 font-bold text-lg">DO ZAPŁATY:</span>
            <span className="font-mono text-2xl font-bold text-poke-dark">
               {items.length > 0 ? total.toFixed(2) : '0.00'} zł
            </span>
          </div>
          
          <button 
            disabled={items.length === 0}
            onClick={() => {
              onClose();
              onCheckout();
            }}
            className="w-full bg-poke-green text-white py-4 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg active:translate-y-0.5"
          >
            Przejdź do zamówienia <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

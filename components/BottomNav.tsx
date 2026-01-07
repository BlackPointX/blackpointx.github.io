
import React, { useState } from 'react';
import { ShoppingBag, Image, Search, Menu, X, FileText, Lock, User, Home } from 'lucide-react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, cartCount, onOpenCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'shop', icon: Home, label: 'Sklep' },
    { id: 'gallery', icon: Image, label: 'Galeria' },
    { id: 'status', icon: Search, label: 'Status' },
  ];

  const menuItems = [
    { id: 'about', icon: User, label: 'O Mnie' },
    { id: 'terms', icon: FileText, label: 'Regulamin' },
    { id: 'privacy', icon: Lock, label: 'Prywatność' },
  ];

  return (
    <>
      {/* Menu Overlay (Więcej) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm animate-fade-in flex flex-col justify-end pb-24 md:hidden" onClick={() => setIsMenuOpen(false)}>
           <div className="bg-white m-4 rounded-xl overflow-hidden shadow-2xl animate-slide-up border-2 border-gray-200">
              <div className="bg-poke-dark text-white p-3 flex justify-between items-center border-b-4 border-poke-red">
                 <span className="font-bold font-tech text-lg tracking-wider">MENU</span>
                 <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-2 bg-gray-50">
                 {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={(e) => {
                         e.stopPropagation();
                         onNavigate(item.id as AppScreen);
                         setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white hover:shadow-sm rounded-lg transition-all font-bold text-gray-700 border border-transparent hover:border-gray-200 mb-1 last:mb-0"
                    >
                       <div className="bg-poke-blue/10 p-2 rounded-full text-poke-blue">
                         <item.icon size={20} />
                       </div>
                       {item.label}
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Bottom Bar Container */}
      <div className="fixed bottom-0 left-0 right-0 z-[50] bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] h-16 flex items-center justify-around md:hidden px-2 pb-safe">
         
         {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id as AppScreen);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${currentScreen === item.id ? 'text-poke-blue' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <item.icon size={22} strokeWidth={currentScreen === item.id ? 2.5 : 2} />
               <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
            </button>
         ))}

         {/* Floating Cart Button */}
         <div className="relative -top-6">
            <button 
              onClick={onOpenCart}
              className="bg-poke-red text-white w-14 h-14 rounded-full shadow-lg border-4 border-white flex items-center justify-center transform active:scale-95 transition-all hover:bg-poke-darkRed"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-poke-yellow text-poke-dark text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
         </div>

         {/* Menu Trigger */}
         <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isMenuOpen ? 'text-poke-dark' : 'text-gray-400 hover:text-gray-600'}`}
         >
             <Menu size={22} strokeWidth={isMenuOpen ? 2.5 : 2} />
             <span className="text-[10px] font-bold uppercase tracking-tight">Więcej</span>
         </button>

      </div>
    </>
  );
};

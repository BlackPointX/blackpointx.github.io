import React, { useState, useEffect } from 'react';
import { products } from './services/mockData';
import { Product, CartItem, AppScreen, UserData, CustomCardData } from './types';
import { Card } from './components/Card';
import { CartModal } from './components/CartModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CheckoutForm } from './components/CheckoutForm';
import { CustomOrderForm } from './components/CustomOrderForm';
import { AboutMe } from './components/AboutMe';
import { FilterBar } from './components/FilterBar';
import { ShoppingBag, Search, Circle, Battery, Sparkles } from 'lucide-react';

const App = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [screen, setScreen] = useState<AppScreen>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Custom Order Editing State
  const [editingCartItemId, setEditingCartItemId] = useState<string | null>(null);

  // Filters State
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');

  // Handle Scroll effect for Sticky Header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Visual feedback handled by cart count, not opening modal explicitly requested by user before
  };

  const handleSaveCustomOrder = (data: CustomCardData) => {
    if (editingCartItemId) {
      // Update existing cart item
      setCart(prev => prev.map(item => {
        if (item.id === editingCartItemId) {
          return {
            ...item,
            name: data.name || 'Custom Card',
            type: data.type || 'Normal',
            customData: data
          };
        }
        return item;
      }));
      setEditingCartItemId(null);
    } else {
      // Create new custom cart item
      const newCustomItem: CartItem = {
        id: `custom-${Date.now()}`,
        name: data.name || 'Twoja Customowa Karta',
        description: 'Personalizowana karta Pokemon według Twojego projektu.',
        price: 200.00, // Fixed price for custom cards
        images: ['https://picsum.photos/400/560?grayscale&blur=2'], // Placeholder for custom
        type: data.type || 'Custom',
        rarity: 'Legendary',
        quantity: 1,
        customData: data
      };
      setCart(prev => [...prev, newCustomItem]);
    }
    
    // Reset and go to cart
    setScreen('shop');
    setIsCartOpen(true);
  };

  const handleEditCartItem = (item: CartItem) => {
    if (item.customData) {
      setEditingCartItemId(item.id);
      setScreen('custom-order');
      setIsCartOpen(false);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleCheckoutSubmit = (data: UserData) => {
    console.log('Order Submitted:', { customer: data, items: cart });
    setCart([]);
    setScreen('success');
    window.scrollTo(0,0);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesRarity = selectedRarity === 'all' || p.rarity === selectedRarity;
    
    return matchesSearch && matchesType && matchesRarity;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get data for the form if editing
  const editingItem = editingCartItemId ? cart.find(i => i.id === editingCartItemId) : null;

  return (
    <div className="min-h-screen bg-poke-dark font-sans relative flex flex-col">
      
      {/* Pokedex Top Decoration */}
      <div className={`sticky top-0 z-40 bg-poke-red border-b-8 border-poke-darkRed shadow-xl transition-all duration-300 ${isScrolled ? 'py-2 shadow-2xl' : 'py-3'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
           {/* Pokedex Lights */}
           <div className="flex items-center gap-3 group">
             {/* Main Blue Lens */}
             <div className="relative cursor-pointer transition-transform duration-300 hover:scale-105" onClick={() => setScreen('shop')}>
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-poke-blue border-4 border-white shadow-[0_0_15px_rgba(40,170,253,0.6)] group-hover:shadow-[0_0_25px_rgba(40,170,253,0.9)] transition-shadow duration-500 relative overflow-hidden">
                   {/* Glass Reflection */}
                   <div className="absolute top-2 left-2 w-2 h-2 sm:w-4 sm:h-4 bg-white rounded-full opacity-60 blur-[1px]"></div>
                   {/* Internal Shimmer */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-150%] animate-[shimmer_3s_infinite]"></div>
                </div>
             </div>
             
             {/* Small Lights - Asynchronous Blinking */}
             <div className="hidden md:flex gap-1.5 ml-1">
               <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-600 border border-red-800 shadow-inner animate-blink-slow"></div>
               <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-poke-yellow border border-yellow-700 shadow-inner animate-blink-fast delay-700"></div>
               <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-poke-green border border-green-700 shadow-inner animate-blink-med delay-1500"></div>
             </div>
           </div>

           {/* Title */}
           <h1 
             className="hidden lg:block font-tech text-white text-3xl font-bold tracking-widest uppercase italic text-shadow cursor-pointer transition-transform duration-300 origin-left hover:scale-105 hover:text-gray-100" 
             onClick={() => setScreen('shop')}
           >
             Poke<span className="text-poke-dark">Custom</span>
           </h1>

           {/* Actions */}
           <div className="flex items-center gap-2 sm:gap-4">
             {/* Custom Card CTA - High Visibility */}
             <button 
               onClick={() => {
                 setEditingCartItemId(null);
                 setScreen('custom-order');
               }}
               className={`
                 relative overflow-hidden group flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm border-2 shadow-lg transition-all duration-300
                 ${screen === 'custom-order' 
                    ? 'bg-poke-dark text-white border-poke-yellow' 
                    : 'bg-gradient-to-r from-poke-yellow to-orange-400 text-poke-dark border-white hover:brightness-110 active:scale-95 hover:shadow-orange-400/50'}
               `}
             >
               <Sparkles size={16} className={`${screen !== 'custom-order' && 'animate-pulse'}`} />
               <span className="hidden sm:inline">Stwórz Własną Kartę</span>
               <span className="sm:hidden">Custom</span>
               {screen !== 'custom-order' && (
                  <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-shimmer" />
               )}
             </button>

             <button 
               onClick={() => setIsCartOpen(true)}
               className="group relative bg-poke-screen text-poke-dark p-2 sm:p-3 rounded-full hover:bg-white active:scale-95 transition-all shadow-lg border-2 border-gray-400 hover:border-poke-blue"
             >
               <div className="group-hover:animate-wiggle">
                 <ShoppingBag size={24} />
               </div>
               {cartCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-poke-red text-white text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce-short">
                   {cartCount}
                 </span>
               )}
             </button>
           </div>
        </div>
        
        {/* Search Bar (Only in Shop) */}
        {screen === 'shop' && (
          <div className="bg-poke-darkRed py-2 px-4 transition-all mt-2 sm:mt-0 shadow-inner">
             <div className="container mx-auto max-w-lg relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Szukaj karty..." 
                  className="w-full pl-10 pr-4 py-2 rounded bg-poke-screen text-gray-800 focus:outline-none focus:ring-2 focus:ring-poke-blue font-tech tracking-wide text-sm transition-shadow duration-200 focus:shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        )}
      </div>

      {/* Main Content Area - The "Screen" */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="bg-white rounded-[2rem] p-4 sm:p-8 min-h-[70vh] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] border-4 border-gray-300 relative overflow-hidden">
            {/* Screen Glare decoration - Subtle float */}
            <div className="absolute top-8 right-8 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl pointer-events-none animate-float"></div>

            {/* Content Logic */}
            {screen === 'shop' && (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-200 pb-2 gap-4">
                   <h2 className="text-2xl font-tech font-bold text-gray-700 flex items-center gap-2">
                     <Circle size={16} className="text-poke-green fill-current animate-pulse" />
                     DOSTĘPNE KARTY
                   </h2>
                   
                   <div className="flex items-center gap-2 text-gray-400 self-end sm:self-auto">
                     <Battery size={24} className="rotate-90" />
                     <span className="font-mono text-xs">100%</span>
                   </div>
                </div>
                
                {/* Filter Bar */}
                <FilterBar 
                  selectedType={selectedType}
                  selectedRarity={selectedRarity}
                  onTypeChange={setSelectedType}
                  onRarityChange={setSelectedRarity}
                />

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <p className="text-xl font-tech">Nie znaleziono kart pasujących do filtrów.</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedType('all');
                        setSelectedRarity('all');
                      }} 
                      className="mt-4 text-poke-blue underline hover:text-blue-700"
                    >
                      Wyczyść filtry
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 animate-fade-in">
                    {filteredProducts.map(product => (
                      <Card 
                        key={product.id} 
                        product={product} 
                        onAdd={addToCart}
                        onClick={setSelectedProduct}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {screen === 'custom-order' && (
              <CustomOrderForm 
                onBack={() => {
                  setEditingCartItemId(null);
                  setScreen('shop');
                }}
                onSubmit={handleSaveCustomOrder}
                initialData={editingItem?.customData}
              />
            )}

            {screen === 'about' && (
              <AboutMe onBack={() => setScreen('shop')} />
            )}

            {screen === 'checkout' && (
              <CheckoutForm 
                onBack={() => setScreen('shop')}
                onSubmit={handleCheckoutSubmit}
                cartTotal={cartTotal}
              />
            )}

            {screen === 'success' && (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-fade-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-poke-green rounded-full flex items-center justify-center text-white">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                </div>
                <h2 className="text-3xl font-tech font-bold text-gray-800 mb-2">ZAMÓWIENIE PRZYJĘTE!</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Dziękujemy za złożenie zamówienia. Na podany adres email wysłaliśmy potwierdzenie wraz z danymi do przelewu. 
                  Twoje karty są już bezpiecznie odłożone.
                </p>
                <button 
                  onClick={() => setScreen('shop')}
                  className="bg-poke-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-transform active:scale-95"
                >
                  WRÓĆ DO SKLEPU
                </button>
              </div>
            )}
        </div>
        
        {/* Bottom Pokedex Decoration */}
        <div className="mt-8 flex justify-center items-center gap-4 text-white/20">
             <div className="w-8 h-8 rounded-full border-2 border-current"></div>
             <div className="w-20 h-2 bg-current rounded-full"></div>
             <div className="grid grid-cols-2 gap-1">
               <div className="w-2 h-2 bg-current rounded-sm"></div>
               <div className="w-2 h-2 bg-current rounded-sm"></div>
               <div className="w-2 h-2 bg-current rounded-sm"></div>
               <div className="w-2 h-2 bg-current rounded-sm"></div>
             </div>
        </div>
      </main>

      <footer className="bg-black/20 text-gray-400 py-8 px-4 mt-8 border-t border-white/10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="max-w-md">
            <h3 className="font-tech text-xl font-bold text-gray-300 mb-2">Nota Prawna</h3>
            <p className="text-xs leading-relaxed opacity-70">
              PokeCustom Shop nie jest oficjalnym produktem Nintendo, The Pokémon Company ani Game Freak. 
              Wszystkie nazwy, obrazy i znaki towarowe są własnością ich odpowiednich właścicieli i zostały użyte 
              jedynie w celach informacyjnych, parodystycznych lub jako inspiracja dla artystycznych rękodzieł.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <button 
              onClick={() => setScreen('about')} 
              className="text-sm font-tech font-bold text-poke-blue hover:text-white transition-colors flex items-center gap-1 hover:underline decoration-2 underline-offset-4"
            >
              MCpixAI <span className="opacity-50 font-sans font-normal text-xs no-underline">| Design & Code</span>
            </button>
            <span className="text-[10px] opacity-40">© {new Date().getFullYear()} All Rights Reserved</span>
          </div>
        </div>
      </footer>

      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setScreen('checkout');
        }}
        onEditCustom={handleEditCartItem}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={addToCart}
      />
    </div>
  );
};

export default App;

import React, { useState, useEffect, useMemo } from 'react';
import { products as fallbackProducts } from './services/mockData';
import { Product, CartItem, AppScreen, UserData, CustomCardData } from './types';
import { Card } from './components/Card';
import { CartModal } from './components/CartModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CheckoutForm } from './components/CheckoutForm';
import { CustomOrderForm } from './components/CustomOrderForm';
import { FilterBar } from './components/FilterBar';
import { TermsScreen } from './components/TermsScreen';
import { PrivacyScreen } from './components/PrivacyScreen';
import { CookieBanner } from './components/CookieBanner';
import { OrderStatus } from './components/OrderStatus';
import { AboutMe } from './components/AboutMe';
import { RealizationsGallery } from './components/RealizationsGallery';
import { ScrollToTop } from './components/ScrollToTop';
import { ShoppingBag, Circle, Sparkles, Loader2, WifiOff, CheckCircle, Instagram, Facebook, Mail, Clock, X, Home, Search, Image, User, FileText, Lock, ChevronRight, Power } from 'lucide-react';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwFQPNUYwNkCtAuskHJhSkyGvEQ7R_J_spT08J_PMux4mUQIrU29JiQkfq09s2TaIawyA/exec";

const CART_STORAGE_KEY = 'pokecustom_cart_v1';
const SESSION_STORAGE_KEY = 'pokecustom_pending_session';

const LOADING_MESSAGES = [
  "Łapanie dzikich pikseli...",
  "Polerowanie kart holo...",
  "Budzenie Snorlaxa...",
  "Negocjacje z Team Rocket...",
  "Ładowanie Pokedexu...",
  "Szukanie Shiny wersji...",
  "Mieszanie talii...",
  "Ewolucja w toku..."
];

// Helper do tworzenia slugów (bezpiecznych ID) z nazw
const createSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') 
    .replace(/^-+|-+$/g, ''); 
};

const formatImageUrl = (url: string) => {
  if (!url) return '';
  let cleanUrl = String(url).trim();
  if (!cleanUrl) return '';

  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
    let id = '';
    const parts = cleanUrl.split('/');
    const dIndex = parts.indexOf('d');
    if (dIndex !== -1 && parts[dIndex + 1]) {
      id = parts[dIndex + 1].split('?')[0];
    } else {
      const match = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) id = match[1];
    }
    if (id) return `https://lh3.googleusercontent.com/d/${id}=w1000`; 
  }
  
  if (cleanUrl.startsWith('http') || cleanUrl.startsWith('https') || cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:image')) {
    return cleanUrl;
  }

  if (cleanUrl.startsWith('/')) {
    cleanUrl = cleanUrl.substring(1);
  }
  
  return cleanUrl.replace(/ /g, '%20');
};

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [fetchError, setFetchError] = useState(false);
  const [configError, setConfigError] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [screen, setScreen] = useState<AppScreen>('shop');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Stan dla menu mobilnego
  
  const [shopTab, setShopTab] = useState<'projects' | 'preorder'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  
  const [showAi, setShowAi] = useState(true);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Funkcja otwierająca produkt i aktualizująca URL
  const openProductModal = (product: Product | null) => {
      setSelectedProduct(product);
      const url = new URL(window.location.href);
      
      if (product) {
          url.searchParams.set('product', product.id);
      } else {
          url.searchParams.delete('product');
      }
      
      window.history.pushState({}, '', url);
  };

  useEffect(() => {
    try {
       localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
       console.warn("Koszyk zbyt duży dla LocalStorage.");
    }
  }, [cart]);

  useEffect(() => {
    if (isLoadingProducts) {
      const interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500); 
      return () => clearInterval(interval);
    }
  }, [isLoadingProducts]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      setFetchError(false);
      setConfigError(false);

      if (!GOOGLE_SCRIPT_URL) {
           setConfigError(true);
           setProducts(fallbackProducts);
           setIsLoadingProducts(false);
           return;
      }

      try {
        // ZMIANA: Pobieramy dane z lokalnego pliku JSON generowanego przez GitHub Actions
        // Dodajemy timestamp, aby uniknąć cache'owania przeglądarki przy nowych deploymentach
        const localDataUrl = `./data.json?t=${new Date().getTime()}`;
        
        // Próba pobrania pliku statycznego
        let response = await fetch(localDataUrl);
        
        // Fallback: Jeśli plik data.json nie istnieje (np. lokalnie), pobierz bezpośrednio z API
        if (!response.ok) {
           console.warn("Brak pliku data.json, pobieranie bezpośrednio z Google API...");
           response = await fetch(GOOGLE_SCRIPT_URL);
        }

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const formattedProducts = data.map((p: any) => {
            let rawImages: string[] = [];
            if (Array.isArray(p.images) && p.images.length > 0) {
                rawImages = p.images;
            } else {
                Object.keys(p).forEach(key => {
                    if (key.startsWith('img') && key !== 'images' && p[key]) {
                        rawImages.push(p[key]);
                    }
                });
            }

            const processedImages = rawImages
              .map(img => formatImageUrl(img))
              .filter(url => url.length > 5);

            if (processedImages.length === 0) processedImages.push('https://placehold.co/400x560/2B292C/FFF?text=No+Image');

            let parsedPrice = 0;
            if (p.price) {
                const priceStr = String(p.price).replace(',', '.').replace(/[^0-9.]/g, '');
                parsedPrice = parseFloat(priceStr) || 0;
            }

            const rawAiValue = p.AI || p.ai || p.Ai || p.isAi;
            const isAiProduct = rawAiValue 
                ? (String(rawAiValue).toLowerCase().includes('tak') || String(rawAiValue).toLowerCase().includes('yes') || rawAiValue === true)
                : false;
            
            const sheetId = p.id ? String(p.id) : '';
            
            const uniqueFrontendId = sheetId 
                ? `${sheetId}_${createSlug(p.name)}`
                : createSlug(p.name || `product-${Math.random()}`);

            // LOGIKA STANU MAGAZYNOWEGO
            let finalStock = 0;
            const parsedStock = parseInt(String(p.stan));
            
            if (!isNaN(parsedStock)) {
                // Jeśli stan jest podany w arkuszu (nawet 0), używamy go
                finalStock = parsedStock;
            } else if (isAiProduct) {
                // Jeśli to AI i nie ma stanu, zakładamy "bez limitu" (999)
                finalStock = 999;
            } else {
                // Fizyczny produkt bez stanu = 0
                finalStock = 0;
            }

            let preorderDate = undefined;
            const rawPreorder = p.preorder;

            if (rawPreorder) {
                const stringPreorder = String(rawPreorder).trim();
                if (stringPreorder.length > 0) {
                    const plDateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
                    if (plDateRegex.test(stringPreorder)) {
                        preorderDate = stringPreorder;
                    } else if (stringPreorder.includes('-') && !isNaN(Date.parse(stringPreorder))) {
                         try {
                            const d = new Date(stringPreorder);
                            const day = String(d.getDate()).padStart(2, '0');
                            const month = String(d.getMonth() + 1).padStart(2, '0');
                            const year = d.getFullYear();
                            preorderDate = `${day}.${month}.${year}`;
                         } catch(e) {
                            preorderDate = stringPreorder;
                         }
                    } else {
                        preorderDate = stringPreorder;
                    }
                }
            }

            const author = p.autor || p.author || p.type || 'Nieznany';
            const source = p.zrodlo || p.source || p.rarity || 'Inne';

            return {
              ...p,
              id: uniqueFrontendId, // Unikalne ID dla Reacta
              sheetId: sheetId,     // Oryginalne ID dla Backend'u
              price: parsedPrice,
              images: processedImages,
              author: author,
              source: source,
              isAi: isAiProduct,
              stock: finalStock,
              preorderDate: preorderDate
            };
          });
          setProducts(formattedProducts);
          
          // DEEP LINKING CHECK
          const params = new URLSearchParams(window.location.search);
          const productIdFromUrl = params.get('product');
          if (productIdFromUrl) {
              const productToOpen = formattedProducts.find((p: Product) => p.id === productIdFromUrl);
              if (productToOpen) {
                  setSelectedProduct(productToOpen);
              }
          }

        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Błąd pobierania produktów:", error);
        setFetchError(true);
        setProducts(fallbackProducts);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('status') === 'success') {
        const sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionId) {
            setIsVerifying(true);
            setStatusMessage('WERYFIKACJA PŁATNOŚCI...');
            try {
                // Tutaj nadal używamy GOOGLE_SCRIPT_URL, ponieważ zapis musi być dynamiczny
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'verify_payment', sessionId: sessionId })
                });
                const result = await response.json();
                if (result.status === 'PAID') {
                    setScreen('success');
                    setCart([]);
                    localStorage.removeItem(SESSION_STORAGE_KEY);
                    localStorage.removeItem(CART_STORAGE_KEY);
                } else {
                    alert("Nie udało się potwierdzić płatności.");
                    setScreen('shop');
                }
            } catch (e) {
                console.error("Payment verify error", e);
                setScreen('success'); 
                setCart([]);
                localStorage.removeItem(SESSION_STORAGE_KEY);
                localStorage.removeItem(CART_STORAGE_KEY);
            } finally {
                setIsVerifying(false);
                setStatusMessage('');
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } else {
            setScreen('success');
            setCart([]);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    verifyPayment();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const availableAuthors = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.author).filter(Boolean)))], [products]);
  const availableSources = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.source).filter(Boolean)))], [products]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const currentQty = existing ? existing.quantity : 0;
      
      // FIX: Check stock for EVERY product if stock is defined.
      if (product.stock !== undefined && currentQty >= product.stock) {
         alert("Osiągnięto maksymalną dostępną ilość tego produktu.");
         return prev;
      }

      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateQuantity = (id: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.id === id) {
              const newQty = item.quantity + delta;
              
              // FIX: Check stock for EVERY product
              if (delta > 0 && item.stock !== undefined && newQty > item.stock) {
                  alert("Brak większej ilości towaru w magazynie.");
                  return item;
              }
              
              return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
      }));
  };

  const handleSaveCustomOrder = (data: CustomCardData) => {
    const displayImage = (data.images && data.images.length > 0) 
        ? data.images[0] 
        : (data.imageUrl || 'https://picsum.photos/400/560?grayscale');

    const newCustomItem: CartItem = {
      id: `custom-${Date.now()}`,
      name: data.name || 'Custom Card',
      description: `Custom: ${data.subject}`,
      price: 200.00,
      images: [displayImage],
      author: 'Custom',
      source: 'User',
      isAi: true, 
      quantity: 1,
      customData: data,
      stock: 999 
    };
    setCart(prev => [...prev, newCustomItem]);
    setScreen('shop');
    setIsCartOpen(true);
  };

  const handleCheckoutSubmit = async (userData: UserData) => {
    setStatusMessage('GENEROWANIE PŁATNOŚCI...');
    
    const currentBaseUrl = window.location.origin + window.location.pathname;
    
    const productsTotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const shippingCost = 12.00;
    
    const discount = userData.discountValue || 0;
    const productsAfterDiscount = Math.max(0, productsTotal - discount);
    const totalToPay = productsAfterDiscount + shippingCost;

    try {
      const orderPayload = {
        action: 'create_payment',
        userData: userData,
        orderDate: new Date().toLocaleString('pl-PL'),
        total: totalToPay, 
        originalTotal: productsTotal + shippingCost,
        discountUsed: userData.discountCode,
        discountAmount: discount,
        successUrl: `${currentBaseUrl}?status=success`,
        cancelUrl: currentBaseUrl,
        items: cart.map(item => ({
          name: item.name + (item.preorderDate ? ` [PREORDER: ${item.preorderDate}]` : ''),
          productId: item.sheetId || item.id, 
          qty: item.quantity,
          price: item.price,
          isCustom: !!item.customData,
          customDetails: item.customData ? {
            name: item.customData.name,
            subject: item.customData.subject,
            set: item.customData.set,
            type: item.customData.type,
            subtype: item.customData.subtype,
            hp: item.customData.hp,
            moves: item.customData.moves, 
            flavorText: item.customData.flavorText,
            images: item.customData.images || (item.customData.imageUrl ? [item.customData.imageUrl] : []),
            imageData: item.customData.images 
          } : null
        }))
      };

      if (!GOOGLE_SCRIPT_URL) {
        alert("Błąd: Brak URL skryptu");
        setStatusMessage('');
        return;
      }

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (result.status === 'SUCCESS' && result.paymentUrl) {
        if (result.sessionId) localStorage.setItem(SESSION_STORAGE_KEY, result.sessionId);
        setStatusMessage('PRZEKIEROWYWANIE...');
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.message || "Błąd serwera");
      }
    } catch (error) {
      console.error(error);
      alert("Błąd zamówienia. Spróbuj ponownie.");
      setStatusMessage('');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAuthor = selectedAuthor === 'all' || p.author === selectedAuthor;
    const matchesSource = selectedSource === 'all' || p.source === selectedSource;
    const matchesAi = showAi ? true : !p.isAi;
    const matchesTab = shopTab === 'preorder' ? !!p.preorderDate : !p.preorderDate;

    return matchesSearch && matchesAuthor && matchesSource && matchesAi && matchesTab;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderScreen = () => {
    switch (screen) {
      case 'shop':
        return (
          <>
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4 flex-wrap gap-4">
               <h2 className="text-2xl font-tech font-bold text-gray-100 flex items-center gap-2">
                 {shopTab === 'preorder' ? (
                    <><Clock size={20} className="text-poke-yellow fill-current" /> STREFA PREORDER</>
                 ) : (
                    <><Circle size={16} className="text-poke-green fill-current" /> DOSTĘPNE PROJEKTY</>
                 )}
               </h2>
               <div className="flex items-center gap-2">
                  {isLoadingProducts && <Loader2 className="animate-spin text-poke-blue" size={20} />}
                  <input type="text" placeholder="Szukaj..." className="bg-gray-100 px-4 py-2 rounded-lg font-tech text-sm outline-none w-32 sm:w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
               </div>
            </div>

            <FilterBar 
              selectedAuthor={selectedAuthor} 
              selectedSource={selectedSource}
              onAuthorChange={setSelectedAuthor}
              onSourceChange={setSelectedSource}
              availableAuthors={availableAuthors}
              availableSources={availableSources}
              showAi={showAi}
              onShowAiChange={setShowAi}
              activeTab={shopTab}
              onTabChange={setShopTab}
            />

            {isLoadingProducts ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <div className="relative w-20 h-20 mb-8 animate-bounce">
                    <div className="w-full h-full bg-white rounded-full border-[6px] border-gray-800 overflow-hidden shadow-xl relative">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-poke-red border-b-[6px] border-gray-800"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-[6px] border-gray-800 z-10"></div>
                    </div>
                </div>
                <div className="w-16 h-2 bg-black/10 rounded-[100%] animate-pulse mb-6"></div>

                <p className="font-tech text-xl text-gray-400 font-bold animate-pulse text-center">
                  {LOADING_MESSAGES[loadingMsgIndex]}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 animate-fade-in">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 opacity-60">
                         <WifiOff size={48} className="mb-4" />
                         <p className="font-tech text-xl">Brak kart w tej kategorii.</p>
                         <button onClick={() => {
                             setSelectedAuthor('all');
                             setSelectedSource('all');
                             setSearchQuery('');
                         }} className="mt-4 text-poke-blue underline">Wyczyść filtry</button>
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <Card 
                            key={product.id} // Używamy unikalnego ID, więc React poprawnie renderuje duplikaty
                            product={product} 
                            onAdd={addToCart} 
                            onClick={() => openProductModal(product)} 
                        />
                    ))
                )}
              </div>
            )}
          </>
        );
      case 'custom-order':
        return <CustomOrderForm onBack={() => setScreen('shop')} onSubmit={handleSaveCustomOrder} />;
      case 'checkout':
        return <CheckoutForm 
          onBack={() => setScreen('shop')} 
          onSubmit={handleCheckoutSubmit} 
          cartTotal={cartTotal} 
          googleScriptUrl={GOOGLE_SCRIPT_URL}
          cartItems={cart}
        />;
      case 'terms':
        return <TermsScreen onBack={() => setScreen('shop')} />;
      case 'privacy':
        return <PrivacyScreen onBack={() => setScreen('shop')} />;
      case 'status':
        return <OrderStatus onBack={() => setScreen('shop')} googleScriptUrl={GOOGLE_SCRIPT_URL} />;
      case 'about':
        return <AboutMe onBack={() => setScreen('shop')} />;
      case 'gallery':
        return <RealizationsGallery onBack={() => setScreen('shop')} />;
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-slide-up bg-white rounded-xl">
            <CheckCircle size={64} className="text-poke-green mb-4" />
            <h2 className="text-3xl font-tech font-bold text-gray-800 mb-2">DZIĘKUJEMY!</h2>
            <p className="text-gray-500 mb-8">Twoje zamówienie zostało przyjęte.</p>
            <button onClick={() => setScreen('shop')} className="bg-poke-dark text-white px-8 py-3 rounded-full font-bold">Wróć do sklepu</button>
          </div>
        );
      default:
        return null;
    }
  };

  const navLinks = [
    { id: 'shop', icon: Home, label: 'Sklep' },
    { id: 'custom-order', icon: Sparkles, label: 'Kreator Kart' },
    { id: 'status', icon: Search, label: 'Status Zamówienia' },
    { id: 'gallery', icon: Image, label: 'Galeria Realizacji' },
    { id: 'about', icon: User, label: 'O Mnie' },
    { id: 'terms', icon: FileText, label: 'Regulamin' },
    { id: 'privacy', icon: Lock, label: 'Prywatność' },
  ];

  return (
    <div className="min-h-screen bg-poke-dark font-sans relative flex flex-col">
      <style>{`
        /* Dynamic Clip Path for Pokedex Header */
        .pokedex-header-bg {
          /* Mobile: Short cut */
          clip-path: polygon(0 0, 100% 0, 100% 56px, 160px 56px, 130px 80px, 0 80px);
        }
        .pokedex-header-border {
          clip-path: polygon(0 72px, 100% 48px, 100% 56px, 160px 56px, 130px 80px, 0 80px);
        }

        /* Desktop: Wide cut to include title */
        @media (min-width: 768px) {
           .pokedex-header-bg {
              clip-path: polygon(0 0, 100% 0, 100% 56px, 450px 56px, 410px 80px, 0 80px);
           }
           .pokedex-header-border {
              clip-path: polygon(0 72px, 100% 48px, 100% 56px, 450px 56px, 410px 80px, 0 80px);
           }
        }
      `}</style>

      <CookieBanner />
      <ScrollToTop />

      {/* POKEDEX MENU OVERLAY */}
      {isMenuOpen && (
         <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" 
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel (Pokedex Style) */}
            <div className="relative z-10 w-full max-w-[320px] bg-poke-red h-full shadow-2xl flex flex-col animate-slide-in border-r-8 border-poke-darkRed">
                {/* Header with lights */}
                <div className="p-6 pb-2 flex gap-4 border-b-4 border-poke-darkRed items-start">
                   {/* Blue Lens / Logo - Now Interactive */}
                   <div 
                      onClick={() => {
                          setScreen('shop');
                          setIsMenuOpen(false);
                      }}
                      className="w-16 h-16 bg-poke-blue rounded-full border-4 border-white shadow-lg relative overflow-hidden flex-shrink-0 cursor-pointer hover:brightness-110 transition-all active:scale-95"
                   >
                       <div className="absolute top-2 left-2 w-4 h-4 bg-sky-300 rounded-full animate-pulse"></div>
                   </div>
                   <div className="flex gap-2 pt-1">
                       <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-red-800"></div>
                       <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-600"></div>
                       <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-700"></div>
                   </div>
                   <button 
                      onClick={() => setIsMenuOpen(false)} 
                      className="ml-auto bg-poke-darkRed text-white p-2 rounded hover:bg-black transition-colors"
                   >
                      <X size={20} />
                   </button>
                </div>
                
                {/* Screen Area */}
                <div className="flex-grow p-6 flex flex-col">
                    <div className="bg-poke-dark rounded-xl p-4 border-4 border-gray-400 h-full flex flex-col shadow-inner relative overflow-hidden">
                       <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                       
                       {/* Menu Title - Updated to Logo + Small Alpha Tag */}
                       <div 
                         className="mb-6 text-center border-b border-gray-700 pb-2 cursor-pointer group"
                         onClick={() => {
                             setScreen('shop');
                             setIsMenuOpen(false);
                         }}
                       >
                            <h3 className="font-tech text-2xl font-bold tracking-widest uppercase italic flex justify-center items-center gap-2 group-hover:text-gray-300 transition-colors">
                                <span className="text-white">MCPix<span className="text-poke-blue">Custom</span></span>
                                <span className="text-[10px] text-poke-yellow border border-poke-yellow/50 bg-poke-yellow/10 px-1.5 rounded not-italic tracking-normal shadow-[0_0_5px_rgba(255,203,5,0.3)]">ALPHA</span>
                            </h3>
                       </div>
                       
                       <div className="flex-grow space-y-2 overflow-y-auto no-scrollbar">
                           {navLinks.map(link => (
                              <button 
                                key={link.id}
                                onClick={() => {
                                   setScreen(link.id as AppScreen);
                                   setIsMenuOpen(false);
                                   window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`w-full text-left p-3 rounded border-l-4 transition-all flex items-center justify-between group ${screen === link.id ? 'bg-poke-blue/20 border-poke-blue text-white' : 'bg-gray-800/50 border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white hover:border-poke-yellow'}`}
                              >
                                 <div className="flex items-center gap-3">
                                    <link.icon size={20} className={screen === link.id ? "text-poke-blue" : "text-gray-500 group-hover:text-poke-yellow"} />
                                    <span className="font-bold text-sm tracking-wide uppercase">{link.label}</span>
                                 </div>
                                 <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-poke-yellow" />
                              </button>
                           ))}
                       </div>
                       
                       {/* Bottom decoration */}
                       <div className="mt-4 flex justify-between items-center text-gray-600">
                          <div className="flex gap-2">
                             <div className="w-8 h-2 bg-red-900 rounded-full"></div>
                             <div className="w-8 h-2 bg-blue-900 rounded-full"></div>
                          </div>
                          <Power size={20} />
                       </div>
                    </div>
                </div>

                {/* Footer decoration */}
                <div className="h-8 bg-poke-darkRed flex justify-center items-center gap-1">
                   <div className="w-1 h-full bg-poke-red"></div>
                   <div className="w-1 h-full bg-poke-red"></div>
                </div>
            </div>
         </div>
      )}

      {/* STICKY HEADER - Pokedex Style Corrected */}
      <header className="sticky top-0 z-40 filter drop-shadow-lg">
          {/* Custom Shape Container using Responsive Clip-Path */}
          <div className="relative h-[80px]">
             {/* The Red Pokedex Shape Background */}
             <div className="absolute inset-0 bg-poke-red pokedex-header-bg"></div>
             
             {/* Bottom Border Line - darker for mechanical feel (also clipped) */}
             <div className="absolute inset-x-0 bottom-0 h-2 bg-poke-darkRed z-10 pointer-events-none pokedex-header-border"></div>
             
             <div className="container mx-auto px-4 h-full relative z-20">
                <div className="flex justify-between h-full">
                    {/* Left Section (Taller) */}
                    <div className="flex items-start pt-3 gap-4">
                        {/* LOGO (Lens) - Otwiera Menu */}
                        <div 
                            className="w-14 h-14 bg-white rounded-full border-4 border-white shadow-md cursor-pointer relative overflow-hidden transition-transform hover:scale-105 active:scale-95 flex-shrink-0" 
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <div className="w-full h-full bg-poke-blue rounded-full relative shadow-inner">
                                <div className="absolute top-1.5 left-2 w-3 h-3 bg-sky-300 rounded-full animate-pulse blur-[1px]"></div>
                                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
                            </div>
                        </div>
                        
                        {/* Lights */}
                        <div className="flex gap-2 pt-2">
                            <div className="w-3 h-3 rounded-full bg-red-600 border border-red-800 shadow-inner"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600 shadow-inner"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500 border border-green-700 shadow-inner"></div>
                        </div>
                        
                        {/* Desktop Title placed inside the 'thick' area */}
                        <h1 className="hidden md:flex items-center gap-2 font-tech text-white text-2xl font-bold tracking-widest uppercase italic cursor-pointer group drop-shadow-md ml-4 pt-1" onClick={() => setScreen('shop')}>
                            <span>MCPix<span className="text-poke-dark font-black">Custom</span></span>
                            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded border border-white/30 not-italic tracking-normal shadow-sm">ALPHA</span>
                        </h1>
                    </div>

                    {/* Right Section (Shorter) - Aligned to the top bar area */}
                    <div className="flex items-start pt-3 gap-2 sm:gap-4 h-[56px]">
                        <button onClick={() => setScreen('custom-order')} className="bg-poke-yellow text-poke-dark px-3 py-2 rounded-full font-bold uppercase text-[10px] sm:text-sm border-2 border-white shadow-lg hover:brightness-110 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap">
                            <Sparkles size={16} /> <span>STWÓRZ KARTĘ</span>
                        </button>
                        <button onClick={() => setIsCartOpen(true)} className="bg-poke-screen text-poke-dark p-2 sm:p-3 rounded-full relative shadow-lg border-2 border-gray-400 hover:bg-white transition-colors">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-poke-red text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
                        </button>
                    </div>
                </div>
             </div>
          </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow flex flex-col">
          <div className="relative flex-grow">
            {statusMessage && (
              <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
                <Loader2 className="text-poke-blue animate-spin mb-4" size={64} />
                <h3 className="font-tech text-2xl font-bold text-white uppercase px-4">{statusMessage}</h3>
              </div>
            )}

            {configError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
                 <p className="font-bold">Błąd konfiguracji GOOGLE_SCRIPT_URL w App.tsx</p>
              </div>
            )}
            
            {renderScreen()}
          </div>
      </main>

      <footer className="bg-poke-dark text-white py-8 mt-auto border-t-4 border-poke-red relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
               <h4 className="font-tech text-2xl font-bold italic tracking-widest cursor-pointer" onClick={() => setScreen('shop')}>
                 MCPix<span className="text-poke-blue">Custom</span>
               </h4>
               <p className="text-gray-400 text-sm mt-1">Twoje karty, Twoja historia.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-300 uppercase tracking-wide">
               <button onClick={() => setScreen('terms')} className="hover:text-poke-yellow transition-colors">Regulamin</button>
               <button onClick={() => setScreen('privacy')} className="hover:text-poke-yellow transition-colors">Polityka Prywatności</button>
               <button onClick={() => setScreen('status')} className="hover:text-poke-yellow transition-colors">Status Zamówienia</button>
               <button onClick={() => setScreen('gallery')} className="hover:text-poke-yellow transition-colors">Galeria</button>
               <button onClick={() => setScreen('about')} className="hover:text-poke-yellow transition-colors">O Mnie</button>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-2">
               <div className="flex gap-4">
                  <a href="#" className="hover:text-poke-blue transition-colors"><Instagram size={20} /></a>
                  <a href="#" className="hover:text-poke-blue transition-colors"><Facebook size={20} /></a>
                  <a href="mailto:kontakt@pokecustom.pl" className="hover:text-poke-blue transition-colors"><Mail size={20} /></a>
               </div>
               <div className="text-gray-500 text-xs text-center md:text-right">
                 <p>&copy; {new Date().getFullYear()} MCPix Custom Shop.</p>
                 <p>Not affiliated with Nintendo/Creatures Inc.</p>
               </div>
            </div>
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
        onEditCustom={(item) => {
           alert("Edycja w przygotowaniu. Usuń i dodaj ponownie, aby zmienić projekt.");
        }}
      />

      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => openProductModal(null)} 
          onAdd={(p) => {
            addToCart(p);
            openProductModal(null);
          }}
        />
      )}
    </div>
  );
};

export default App;

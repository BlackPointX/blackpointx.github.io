
import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('pokecustom_cookies_accepted');
    if (!accepted) {
      // Małe opóźnienie dla lepszego efektu wejścia
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('pokecustom_cookies_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-slide-up">
      <div className="bg-poke-dark text-white max-w-5xl mx-auto rounded-xl shadow-2xl border-t-4 border-poke-yellow flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
        
        <div className="flex items-start sm:items-center gap-4">
           <div className="bg-white/10 p-2 rounded-full hidden sm:block">
              <Cookie className="text-poke-yellow" size={24} />
           </div>
           <div>
              <p className="font-bold text-sm mb-1">🍪 Ciasteczka Techniczne</p>
              <p className="text-xs text-gray-300 leading-tight max-w-xl">
                 Ta strona używa wyłącznie niezbędnych plików cookies do działania koszyka i obsługi zamówień. 
                 Nie śledzimy Cię narzędziami analitycznymi ani reklamowymi. 
                 Korzystając ze strony, zgadzasz się na ich użycie.
              </p>
           </div>
        </div>

        <button 
          onClick={handleAccept}
          className="bg-poke-green text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-600 transition-colors shadow-lg whitespace-nowrap active:scale-95 w-full sm:w-auto"
        >
          ROZUMIEM
        </button>
      </div>
    </div>
  );
};


import React from 'react';
import { ArrowLeft, Star, Heart } from 'lucide-react';

interface RealizationsGalleryProps {
  onBack: () => void;
}

// Mock data for the gallery
const realizations = [
  {
    id: 1,
    title: "Karta dla Córki",
    description: "Prezent na 5 urodziny, stylizowany na Fairy type.",
    image: "https://picsum.photos/400/560?random=501"
  },
  {
    id: 2,
    title: "Ślubny Pikachu",
    description: "Specjalna edycja dla pary młodej.",
    image: "https://picsum.photos/400/560?random=502"
  },
  {
    id: 3,
    title: "Pies Burek VMAX",
    description: "Ukochany pupil w wersji Gigantamax.",
    image: "https://picsum.photos/400/560?random=503"
  },
  {
    id: 4,
    title: "Trener Marek",
    description: "Karta trenera dla najlepszego szefa.",
    image: "https://picsum.photos/400/560?random=504"
  },
  {
    id: 5,
    title: "Kot Luna GX",
    description: "Mroczny styl Dark Type dla czarnego kota.",
    image: "https://picsum.photos/400/560?random=505"
  },
  {
    id: 6,
    title: "Rocznica 10 lat",
    description: "Wspomnienie wspólnych wakacji na karcie Supporter.",
    image: "https://picsum.photos/400/560?random=506"
  }
];

export const RealizationsGallery: React.FC<RealizationsGalleryProps> = ({ onBack }) => {
  return (
    <div className="bg-white rounded-lg min-h-[60vh] animate-slide-in">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <button 
            onClick={onBack}
            className="mb-2 flex items-center gap-2 text-gray-600 hover:text-poke-red transition-colors font-bold"
          >
            <ArrowLeft size={20} /> Wróć do sklepu
          </button>
          <h2 className="font-tech text-3xl font-bold text-poke-dark">GALERIA REALIZACJI</h2>
          <p className="text-gray-500">Zobacz, co stworzyliśmy dla naszych klientów!</p>
        </div>
        
        <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-full border border-yellow-200 shadow-sm">
          <Star size={18} className="fill-yellow-500 text-yellow-500" />
          <span className="font-bold text-sm">Ponad 500 zadowolonych trenerów!</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {realizations.map((item) => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 bg-gray-100">
            <div className="aspect-[2/3] overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <h3 className="font-tech text-xl font-bold">{item.title}</h3>
                <p className="text-sm opacity-90">{item.description}</p>
                <div className="mt-2 flex justify-end">
                   <Heart className="text-poke-red fill-current" size={20} />
                </div>
              </div>
            </div>
            
            {/* Mobile View Label (Visible always on mobile, hidden on hover desktop via logic above if needed, but let's keep it simple) */}
            <div className="p-3 bg-white sm:hidden border-t border-gray-200">
               <h3 className="font-bold text-gray-800">{item.title}</h3>
               <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-8 text-center bg-gray-50 rounded-b-lg border-t border-gray-200">
        <h3 className="font-bold text-xl text-gray-700 mb-2">Masz własny pomysł?</h3>
        <p className="text-gray-500 mb-4">Zrealizujemy każdą wizję. Od klasycznych kart po szalone arty 3D.</p>
        <button 
          onClick={onBack} 
          className="bg-poke-blue text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors"
        >
          Przejdź do zamówienia
        </button>
      </div>
    </div>
  );
};

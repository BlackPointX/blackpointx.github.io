
import React from 'react';
import { ArrowLeft, Code, Palette, Terminal } from 'lucide-react';

interface AboutMeProps {
  onBack: () => void;
}

export const AboutMe: React.FC<AboutMeProps> = ({ onBack }) => {
  return (
    <div className="bg-white rounded-lg min-h-[60vh] animate-slide-in max-w-4xl mx-auto shadow-xl overflow-hidden border-4 border-gray-200">
      <div className="bg-poke-dark text-white p-6 flex justify-between items-center border-b-4 border-poke-red">
        <div>
           <button 
            onClick={onBack}
            className="mb-2 flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={16} /> Wróć do sklepu
          </button>
          <h2 className="font-tech text-4xl font-bold tracking-widest">O MNIE</h2>
        </div>
        <div className="w-12 h-12 bg-poke-blue rounded-full border-4 border-white shadow-lg animate-pulse-soft"></div>
      </div>

      <div className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          
          {/* Avatar / Visual */}
          <div className="relative">
             <div className="w-48 h-48 bg-gradient-to-br from-poke-yellow to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-8 border-white">
                <span className="font-tech text-5xl font-bold text-poke-dark">MC</span>
             </div>
             <div className="absolute -bottom-4 -right-4 bg-poke-blue text-white px-4 py-1 rounded-full font-bold shadow-lg border-2 border-white">
               LVL 99
             </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 font-tech">MCpixAI</h3>
              <p className="text-poke-red font-bold uppercase tracking-widest text-sm">Twórca / Programista / Artysta</p>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">
              Cześć! Jestem pasjonatem technologii i świata Pokemon. Ten sklep to połączenie mojej miłości do kodowania i kolekcjonowania kart. 
              Moim celem jest dostarczanie unikalnych, customowych projektów, które ożywiają wspomnienia i pozwalają fanom (takim jak ja) 
              stworzyć coś własnego i niepowtarzalnego.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:bg-gray-100 transition-colors">
                <Code className="text-poke-blue" size={24} />
                <span className="font-bold text-gray-700 text-sm">Development</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:bg-gray-100 transition-colors">
                <Palette className="text-poke-red" size={24} />
                <span className="font-bold text-gray-700 text-sm">Design</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:bg-gray-100 transition-colors">
                <Terminal className="text-poke-green" size={24} />
                <span className="font-bold text-gray-700 text-sm">AI Art</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm italic">
            "Every card tells a story. Let's write yours."
          </p>
        </div>
      </div>
    </div>
  );
};

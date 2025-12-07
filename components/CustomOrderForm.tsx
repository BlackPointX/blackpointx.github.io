
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Sparkles, Upload, ExternalLink, User, Zap, Save } from 'lucide-react';
import { CustomCardData } from '../types';

interface CustomOrderFormProps {
  onBack: () => void;
  onSubmit: (data: CustomCardData) => void;
  initialData?: CustomCardData;
}

export const CustomOrderForm: React.FC<CustomOrderFormProps> = ({ onBack, onSubmit, initialData }) => {
  const [cardType, setCardType] = useState<'pokemon' | 'trainer'>('pokemon');
  
  // Form States
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('Fire');
  const [hp, setHp] = useState('');
  const [trainerSubtype, setTrainerSubtype] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [attacks, setAttacks] = useState('');
  const [flavorText, setFlavorText] = useState('');
  const [email, setEmail] = useState('');

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setCardType(initialData.cardType);
      setName(initialData.name);
      setSubject(initialData.subject);
      setType(initialData.type);
      setHp(initialData.hp || '');
      setTrainerSubtype(initialData.trainerSubtype || '');
      setReferenceLink(initialData.referenceLink || '');
      setCardNumber(initialData.cardNumber || '');
      setAttacks(initialData.attacks || '');
      setFlavorText(initialData.flavorText || '');
      setEmail(initialData.email || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: CustomCardData = {
      cardType,
      name,
      subject,
      type,
      hp,
      trainerSubtype,
      referenceLink,
      cardNumber,
      attacks,
      flavorText,
      email
    };

    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow-sm animate-slide-in">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-poke-red transition-colors font-bold"
      >
        <ArrowLeft size={20} /> Wróć
      </button>

      <div className="bg-gradient-to-r from-poke-yellow to-yellow-500 p-6 rounded-xl shadow-lg mb-8 text-poke-dark relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-tech text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="fill-white text-transparent" />
            {initialData ? 'EDYCJA KARTY CUSTOM' : 'STWÓRZ WŁASNĄ LEGENDĘ'}
          </h2>
          <p className="font-medium opacity-90">
            {initialData ? 'Edytuj szczegóły swojej karty.' : 'Wypełnij szczegóły. Pola nie są obowiązkowe - ustalimy je później!'}
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
            <Sparkles size={150} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: TYPE */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex shadow-inner">
            <button
              type="button"
              onClick={() => setCardType('pokemon')}
              className={`px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${cardType === 'pokemon' ? 'bg-white shadow text-poke-blue' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Zap size={16} /> POKEMON
            </button>
            <button
              type="button"
              onClick={() => setCardType('trainer')}
              className={`px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${cardType === 'trainer' ? 'bg-white shadow text-poke-red' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User size={16} /> TRENER
            </button>
          </div>
        </div>

        {/* SECTION 2: CORE INFO */}
        <div className="space-y-4">
            <h3 className="font-tech text-xl text-gray-800 border-b pb-2">1. Informacje Podstawowe (Opcjonalne)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nazwa Karty / Imię Postaci</label>
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-poke-blue transition-colors font-bold text-lg"
                  placeholder={cardType === 'pokemon' ? "np. Cyber Pikachu" : "np. Trener Ash"}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Kogo przedstawia karta?</label>
                <input 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-poke-blue transition-colors"
                  placeholder="np. Moja córka Leia, lat 3, w stroju smoka"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Typ (Żywioł)</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-poke-blue transition-colors"
                  >
                    {cardType === 'trainer' ? (
                      <option>Trainer (Supporter)</option>
                    ) : (
                      <>
                        <option>Fire</option>
                        <option>Water</option>
                        <option>Grass</option>
                        <option>Electric</option>
                        <option>Psychic</option>
                        <option>Dark</option>
                        <option>Dragon</option>
                        <option>Fairy</option>
                        <option>Normal</option>
                      </>
                    )}
                    <option>Custom (Inny)</option>
                  </select>
               </div>
               
               {cardType === 'pokemon' && (
                 <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">HP (Punkty Życia)</label>
                      <input 
                          type="number"
                          value={hp}
                          onChange={(e) => setHp(e.target.value)}
                          className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-poke-blue transition-colors font-mono"
                          placeholder="np. 200"
                      />
                 </div>
               )}
               {cardType === 'trainer' && (
                 <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Podtyp Trenera</label>
                    <input 
                      value={trainerSubtype}
                      onChange={(e) => setTrainerSubtype(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-poke-blue transition-colors"
                      placeholder="np. Supporter / Item / Stadium"
                    />
                 </div>
               )}
            </div>
        </div>

        {/* SECTION 3: VISUAL REFERENCE */}
        <div className="space-y-4">
             <h3 className="font-tech text-xl text-gray-800 border-b pb-2">2. Styl i Numeracja (Opcjonalne)</h3>
             
             <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Link do wzoru karty (Layout/Styl)</label>
                <div className="flex gap-2">
                  <input 
                    value={referenceLink}
                    onChange={(e) => setReferenceLink(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-poke-blue transition-colors text-sm"
                    placeholder="Wklej link do karty, na której mamy się wzorować"
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                   Najłatwiej znaleźć wzór tutaj: 
                   <a href="https://pkmncards.com/sets/" target="_blank" rel="noreferrer" className="text-poke-blue hover:underline font-bold flex items-center gap-0.5">
                     pkmncards.com/sets <ExternalLink size={10} />
                   </a>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Numer Karty i Edycja</label>
                  <input 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-poke-blue transition-colors font-mono"
                    placeholder="np. 199/165"
                  />
               </div>
               <div>
                 {/* Empty slot for alignment */}
               </div>
             </div>
        </div>

        {/* SECTION 4: CONTENT */}
        <div className="space-y-4">
            <h3 className="font-tech text-xl text-gray-800 border-b pb-2">3. Treść Karty (Opcjonalne)</h3>
            
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                {cardType === 'pokemon' ? 'Ataki i Umiejętności (Abilities)' : 'Główny Efekt Karty'}
              </label>
              <textarea 
                value={attacks}
                onChange={(e) => setAttacks(e.target.value)}
                rows={4}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-poke-blue transition-colors resize-none font-mono text-sm"
                placeholder={cardType === 'pokemon' 
                  ? "Nazwa ataku - Obrażenia - Opis działania..." 
                  : "Opisz co robi ta karta trenera..."}
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                {cardType === 'pokemon' ? 'Flavor Text (Opis na dole)' : 'Tekst Poboczny / Dedykacja'}
              </label>
              <textarea 
                value={flavorText}
                onChange={(e) => setFlavorText(e.target.value)}
                rows={2}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-poke-blue transition-colors resize-none text-sm italic"
                placeholder={cardType === 'trainer' 
                  ? "Dedykacja, żart lub oryginalny tekst..." 
                  : "Krótki opis z 'Pokedexa' lub dedykacja."}
              ></textarea>
            </div>
        </div>

        {/* SECTION 5: CONTACT */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
             <h3 className="font-tech text-xl text-gray-800 flex items-center gap-2">
                4. Twoje Dane i Pliki
             </h3>
             <div>
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Twój Email (do kontaktu)</label>
                 <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-poke-blue transition-colors"
                    placeholder="twoj@email.com"
                />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:border-poke-blue transition-all cursor-pointer group bg-white">
                <Upload className="mb-2 group-hover:text-poke-blue transition-colors" size={32} />
                <span className="text-sm font-bold text-center">Masz własne zdjęcie? (Opcjonalnie)</span>
            </div>
        </div>

        <div className="pt-4 border-t border-gray-100 pb-12">
            <button 
                type="submit"
                className="w-full bg-poke-blue text-white py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-[0.99]"
            >
                {initialData ? <Save size={20} /> : <ShoppingCart size={20} />} 
                {initialData ? 'Zapisz zmiany w koszyku' : 'Dodaj Custom do Koszyka'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              Cena customowej karty to 200 PLN. Możesz edytować te dane później w koszyku.
            </p>
        </div>
      </form>
    </div>
  );
};

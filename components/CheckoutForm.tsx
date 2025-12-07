import React, { useState } from 'react';
import { UserData, CartItem } from '../types';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface CheckoutFormProps {
  onBack: () => void;
  onSubmit: (data: UserData) => void;
  cartTotal: number;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onBack, onSubmit, cartTotal }) => {
  const [formData, setFormData] = useState<UserData>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-poke-screen rounded-lg p-6 max-w-2xl mx-auto shadow-inner border-2 border-gray-400 h-full overflow-y-auto custom-scrollbar">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-poke-red transition-colors font-bold"
      >
        <ArrowLeft size={20} /> Wróć do sklepu
      </button>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-4 border-poke-red">
        <h2 className="font-tech text-2xl font-bold mb-2">DANE WYSYŁKOWE</h2>
        <p className="text-gray-500 text-sm">Wypełnij formularz, aby sfinalizować rezerwację kart. Płatność nastąpi po potwierdzeniu mailowym.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Imię i Nazwisko</label>
          <input 
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full bg-white border-2 border-gray-200 rounded p-3 focus:outline-none focus:border-poke-blue transition-colors"
            placeholder="Ash Ketchum"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
            <input 
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white border-2 border-gray-200 rounded p-3 focus:outline-none focus:border-poke-blue transition-colors"
              placeholder="ash@pallet.town"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Telefon</label>
            <input 
              required
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-white border-2 border-gray-200 rounded p-3 focus:outline-none focus:border-poke-blue transition-colors"
              placeholder="+48 123 456 789"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Adres</label>
          <input 
            required
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-white border-2 border-gray-200 rounded p-3 focus:outline-none focus:border-poke-blue transition-colors"
            placeholder="ul. Pokemona 12/3"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
           <div className="col-span-1">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Kod Pocztowy</label>
            <input 
              required
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full bg-white border-2 border-gray-200 rounded p-3 focus:outline-none focus:border-poke-blue transition-colors"
              placeholder="00-000"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Miasto</label>
            <input 
              required
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-white border-2 border-gray-200 rounded p-3 focus:outline-none focus:border-poke-blue transition-colors"
              placeholder="Warszawa"
            />
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300">
           <div className="flex justify-between items-center mb-6">
             <span className="font-bold text-gray-600">Do zapłaty (przy odbiorze/przelewem):</span>
             <span className="font-mono text-2xl font-bold text-poke-red">{cartTotal.toFixed(2)} zł</span>
           </div>

           <button 
             type="submit"
             className="w-full bg-poke-yellow text-poke-dark py-4 rounded-lg font-bold uppercase tracking-wider text-lg hover:brightness-110 shadow-lg active:translate-y-0.5 transition-all flex justify-center items-center gap-2"
           >
             <CheckCircle size={24} /> Potwierdź zamówienie
           </button>
        </div>
      </form>
    </div>
  );
};
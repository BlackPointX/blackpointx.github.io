
import React from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  selectedType: string;
  selectedRarity: string;
  onTypeChange: (type: string) => void;
  onRarityChange: (rarity: string) => void;
}

const TYPES = ['All', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Dark', 'Dragon', 'Fairy', 'Normal'];
const RARITIES = ['All', 'Common', 'Rare', 'Legendary'];

export const FilterBar: React.FC<FilterBarProps> = ({ 
  selectedType, 
  selectedRarity, 
  onTypeChange, 
  onRarityChange 
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-xl mb-6 shadow-inner border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-2 text-gray-600 font-bold uppercase text-sm w-full md:w-auto">
        <Filter size={18} />
        <span>Filtrowanie:</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        {/* Type Select */}
        <div className="relative group w-full sm:w-48">
          <label className="absolute -top-2 left-2 bg-gray-100 px-1 text-[10px] font-bold text-gray-500 uppercase">Typ</label>
          <select 
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full bg-white border-2 border-gray-300 rounded-lg py-2 px-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-poke-blue cursor-pointer hover:border-gray-400 transition-colors appearance-none"
          >
            {TYPES.map(type => (
              <option key={type} value={type === 'All' ? 'all' : type}>{type}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
        </div>

        {/* Rarity Select */}
        <div className="relative group w-full sm:w-48">
          <label className="absolute -top-2 left-2 bg-gray-100 px-1 text-[10px] font-bold text-gray-500 uppercase">Rzadkość</label>
           <select 
            value={selectedRarity}
            onChange={(e) => onRarityChange(e.target.value)}
            className="w-full bg-white border-2 border-gray-300 rounded-lg py-2 px-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-poke-blue cursor-pointer hover:border-gray-400 transition-colors appearance-none"
          >
            {RARITIES.map(rarity => (
              <option key={rarity} value={rarity === 'All' ? 'all' : rarity}>{rarity}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
        </div>
      </div>
    </div>
  );
};

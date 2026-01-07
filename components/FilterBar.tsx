
import React, { useState } from 'react';
import { Filter, Sparkles, Layers, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterBarProps {
  selectedAuthor: string;
  selectedSource: string;
  onAuthorChange: (author: string) => void;
  onSourceChange: (source: string) => void;
  availableAuthors: string[];
  availableSources: string[];
  showAi: boolean;
  onShowAiChange: (show: boolean) => void;
  activeTab: 'projects' | 'preorder';
  onTabChange: (tab: 'projects' | 'preorder') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  selectedAuthor, 
  selectedSource, 
  onAuthorChange, 
  onSourceChange,
  availableAuthors,
  availableSources,
  showAi,
  onShowAiChange,
  activeTab,
  onTabChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4 mb-6">
       
       {/* Główne Zakładki - Zawsze widoczne */}
       <div className="flex justify-between items-center flex-wrap gap-4">
         <div className="bg-gray-200 p-1.5 rounded-xl inline-flex border border-gray-300 shadow-inner">
            <button 
               onClick={() => onTabChange('projects')}
               className={`px-4 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm uppercase transition-all flex items-center gap-2 ${activeTab === 'projects' ? 'bg-white text-poke-dark shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
               <Layers size={16} /> Projekty
            </button>
            <button 
               onClick={() => onTabChange('preorder')}
               className={`px-4 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm uppercase transition-all flex items-center gap-2 ${activeTab === 'preorder' ? 'bg-white text-poke-dark shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
               <Clock size={16} className={activeTab === 'preorder' ? "text-poke-yellow" : ""} /> Preorder
            </button>
         </div>

         {/* Przycisk rozwijania filtrów */}
         <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm uppercase transition-all border-2 ${isExpanded ? 'bg-poke-blue text-white border-poke-blue' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-white'}`}
         >
            <Filter size={18} />
            Filtrowanie
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
         </button>
       </div>

      {/* Rozwijana sekcja filtrów */}
      {isExpanded && (
        <div className="bg-gray-100 p-4 rounded-xl shadow-inner border border-gray-200 flex flex-col lg:flex-row gap-4 items-center justify-between animate-slide-down">
          
          <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
            {/* AI Toggle Switch */}
            <div 
              onClick={() => onShowAiChange(!showAi)}
              className="cursor-pointer flex items-center gap-3 bg-white px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors w-full sm:w-auto justify-between sm:justify-start"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} className={showAi ? "text-poke-blue" : "text-gray-400"} />
                <span className="text-sm font-bold text-gray-700 uppercase">Pokaż AI</span>
              </div>
              
              <div className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${showAi ? 'bg-poke-green' : 'bg-gray-300'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${showAi ? 'translate-x-4' : ''}`}></div>
              </div>
            </div>

            {/* Author Select */}
            <div className="relative group w-full sm:w-40">
              <label className="absolute -top-2 left-2 bg-gray-100 px-1 text-[10px] font-bold text-gray-500 uppercase z-10">Autor</label>
              <select 
                value={selectedAuthor}
                onChange={(e) => onAuthorChange(e.target.value)}
                className="w-full bg-white border-2 border-gray-300 rounded-lg py-2 px-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-poke-blue cursor-pointer hover:border-gray-400 transition-colors appearance-none"
              >
                {availableAuthors.map(author => (
                  <option key={author} value={author}>
                    {author === 'all' ? 'Wszyscy' : author}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
            </div>

            {/* Source Select */}
            <div className="relative group w-full sm:w-40">
              <label className="absolute -top-2 left-2 bg-gray-100 px-1 text-[10px] font-bold text-gray-500 uppercase z-10">Źródło</label>
               <select 
                value={selectedSource}
                onChange={(e) => onSourceChange(e.target.value)}
                className="w-full bg-white border-2 border-gray-300 rounded-lg py-2 px-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-poke-blue cursor-pointer hover:border-gray-400 transition-colors appearance-none"
              >
                 {availableSources.map(source => (
                  <option key={source} value={source}>
                    {source === 'all' ? 'Wszystkie' : source}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

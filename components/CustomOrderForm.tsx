
import React, { useState, useRef } from 'react';
import { ArrowLeft, ShoppingCart, Sparkles, Upload, User, Zap, X, Loader2, Image as ImageIcon, Plus, Trash2, Shield, Flame, Droplets, Leaf, CloudLightning, Eye, Disc, Moon, Mountain, Hexagon, Wand2, Swords } from 'lucide-react';
import { CustomCardData, Move } from '../types';

interface CustomOrderFormProps {
  onBack: () => void;
  onSubmit: (data: CustomCardData) => void;
  initialData?: CustomCardData;
}

const CLOUD_NAME = 'dkghycylz';
const UPLOAD_PRESET = 'MCpixAI';

const SETS = [
  { id: 'SVI', name: 'Scarlet & Violet', sub: 'ex, ex Tera' },
  { id: 'SWSH', name: 'Sword & Shield', sub: 'V, VMAX, VSTAR' },
  { id: 'SM', name: 'Sun & Moon', sub: 'GX, Tag Team, Prism' },
  { id: 'XY', name: 'X & Y / Black & White', sub: 'EX, Mega, Dual Types' }
];

const TYPES = [
  { id: 'Grass', color: 'bg-green-600', icon: Leaf },
  { id: 'Fire', color: 'bg-red-600', icon: Flame },
  { id: 'Water', color: 'bg-blue-500', icon: Droplets },
  { id: 'Lightning', color: 'bg-yellow-400', icon: CloudLightning },
  { id: 'Psychic', color: 'bg-purple-600', icon: Eye },
  { id: 'Fighting', color: 'bg-orange-700', icon: Hexagon },
  { id: 'Dark', color: 'bg-gray-800', icon: Moon },
  { id: 'Metal', color: 'bg-gray-400', icon: Shield },
  { id: 'Dragon', color: 'bg-yellow-600', icon: Mountain },
  { id: 'Colorless', color: 'bg-slate-200', icon: Disc },
];

const SUBTYPES = [
  'Basic', 'Stage 1', 'Stage 2', 
  'ex (Basic)', 'ex (Stage 1)', 'ex (Stage 2)', 
  'V', 'VMAX', 'VSTAR', 
  'GX (Basic)', 'GX (Stage 1)', 'GX (Stage 2)', 
  'Mega ex'
];

const INPUT_CLASS = "w-full bg-white border-2 border-gray-300 rounded-lg p-2.5 text-gray-800 font-medium focus:border-poke-blue outline-none transition-colors text-sm";
const LABEL_CLASS = "block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider";

export const CustomOrderForm: React.FC<CustomOrderFormProps> = ({ onBack, onSubmit, initialData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Główne stany
  const [cardType, setCardType] = useState<'pokemon' | 'trainer'>('pokemon');
  const [name, setName] = useState(initialData?.name || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [hp, setHp] = useState(initialData?.hp || '');
  const [selectedSet, setSelectedSet] = useState(initialData?.set || SETS[0].name);
  const [selectedType, setSelectedType] = useState(initialData?.type || 'Grass');
  const [selectedSubtype, setSelectedSubtype] = useState(initialData?.subtype || 'Basic');
  const [flavorText, setFlavorText] = useState(initialData?.flavorText || '');
  
  const [moves, setMoves] = useState<Move[]>(initialData?.moves || []);
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || []);
  
  // Stany uploadu
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Stany Modala Ataków
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [newMove, setNewMove] = useState<Move>({
    id: '',
    type: 'attack',
    name: '',
    description: '',
    damage: '',
    cost: []
  });

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (file.size > 10 * 1024 * 1024) throw new Error("Plik jest za duży (>10MB).");
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Błąd Cloudinary");
      return data.secure_url;
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (uploadedImages.length + files.length > 3) {
        setUploadError("Maksymalnie 3 zdjęcia.");
        return;
    }

    setIsUploading(true);
    setUploadError(null);
    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadToCloudinary(files[i]);
        newImages.push(url);
      } catch (error: any) {
        setUploadError(error.message);
      }
    }
    
    if (newImages.length > 0) setUploadedImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Obsługa ruchów (Moves)
  const openMoveModal = () => {
    setNewMove({ id: Date.now().toString(), type: 'attack', name: '', description: '', damage: '', cost: [] });
    setIsMoveModalOpen(true);
  };

  const addEnergyToMove = (typeId: string) => {
    setNewMove(prev => ({ ...prev, cost: [...prev.cost, typeId] }));
  };
  
  const removeEnergyFromMove = (index: number) => {
    setNewMove(prev => ({ ...prev, cost: prev.cost.filter((_, i) => i !== index) }));
  };

  const saveMove = () => {
    if (!newMove.name) return alert("Nazwa ataku jest wymagana");
    setMoves(prev => [...prev, newMove]);
    setIsMoveModalOpen(false);
  };

  const removeMove = (id: string) => {
    setMoves(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
        alert("Wymagane jest dodanie przynajmniej jednego zdjęcia.");
        return;
    }

    const formData: CustomCardData = {
      cardType,
      name,
      subject,
      set: selectedSet,
      subtype: selectedSubtype,
      type: selectedType,
      hp,
      moves,
      flavorText,
      images: uploadedImages,
      imageUrl: uploadedImages[0], 
      referenceLink: uploadedImages.join(', ')
    };

    onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-10">
        <button onClick={onBack} type="button" className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold">
          <ArrowLeft size={20} /> Wróć
        </button>

        {/* Rounded Container simulating screen */}
        <div className="bg-gray-50 p-8 rounded-[2.5rem] shadow-2xl border-4 border-gray-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-gray-200">
               <div>
                 <h2 className="font-tech text-3xl font-bold text-poke-dark flex items-center gap-2">
                   <Sparkles className="text-poke-blue" /> KREATOR KARTY
                 </h2>
                 <p className="text-gray-500 text-sm">Wypełnij dane, aby stworzyć unikalną kartę.</p>
               </div>
               
               {/* Type Switcher */}
               <div className="bg-gray-200 p-1 rounded-lg flex border border-gray-300">
                  <button 
                    type="button" 
                    onClick={() => setCardType('pokemon')} 
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${cardType === 'pokemon' ? 'bg-white text-poke-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                     <Zap size={16} /> Pokemon
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setCardType('trainer')} 
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${cardType === 'trainer' ? 'bg-white text-poke-red shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                     <User size={16} /> Trener
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Column - Stats */}
               <div className="lg:col-span-2 space-y-8">
                  
                  {/* Basic Info */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs border-b border-gray-200 pb-1">
                        <Shield size={14} /> Informacje Podstawowe
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className={LABEL_CLASS}>Nazwa Karty</label>
                           <input value={name} onChange={e => setName(e.target.value)} className={INPUT_CLASS} placeholder="np. Charizard" />
                        </div>
                        <div>
                           <label className={LABEL_CLASS}>Kogo/Co przedstawia (Subject)</label>
                           <input value={subject} onChange={e => setSubject(e.target.value)} className={INPUT_CLASS} placeholder="np. Mój Kot Filemon" />
                        </div>
                     </div>

                     <div>
                        <label className={LABEL_CLASS}>Seria (Set)</label>
                        <select value={selectedSet} onChange={e => setSelectedSet(e.target.value)} className={INPUT_CLASS}>
                           {SETS.map(s => (
                             <option key={s.id} value={s.name}>{s.name} ({s.sub})</option>
                           ))}
                        </select>
                     </div>
                  </div>

                  {/* Type & Stats */}
                  {cardType === 'pokemon' && (
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs border-b border-gray-200 pb-1">
                          <Flame size={14} /> Typ i Statystyki
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                             <label className={LABEL_CLASS}>Typ Energii</label>
                             <div className="relative">
                               <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className={`${INPUT_CLASS} pl-8 appearance-none`}>
                                 {TYPES.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
                               </select>
                               <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${TYPES.find(t => t.id === selectedType)?.color}`}></div>
                             </div>
                          </div>

                          <div>
                             <label className={LABEL_CLASS}>Podtyp (Stage)</label>
                             <select value={selectedSubtype} onChange={e => setSelectedSubtype(e.target.value)} className={INPUT_CLASS}>
                                {SUBTYPES.map(st => <option key={st} value={st}>{st}</option>)}
                             </select>
                          </div>

                          <div>
                             <label className={LABEL_CLASS}>HP</label>
                             <input type="number" value={hp} onChange={e => setHp(e.target.value)} className={`${INPUT_CLASS} font-mono`} placeholder="np. 200" />
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Moves Section */}
                  {cardType === 'pokemon' && (
                    <div className="space-y-4">
                       <div className="flex justify-between items-center border-b border-gray-200 pb-1">
                          <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs">
                             <Swords size={14} /> Ataki i Umiejętności
                          </div>
                          <button type="button" onClick={openMoveModal} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 font-bold border border-gray-300">
                             <Plus size={14} /> DODAJ
                          </button>
                       </div>

                       <div className="bg-white border-2 border-gray-200 border-dashed rounded-xl p-4 min-h-[100px] flex flex-col justify-center">
                          {moves.length === 0 ? (
                             <div className="text-center text-gray-400 text-sm">
                                <p>Brak ataków.</p>
                                <p className="text-xs">Kliknij "DODAJ" aby skonfigurować.</p>
                             </div>
                          ) : (
                             <div className="space-y-3">
                                {moves.map((move, idx) => (
                                   <div key={idx} className="bg-white rounded-lg p-3 relative group border border-gray-200 shadow-sm hover:border-poke-blue transition-colors">
                                      <div className="flex justify-between items-start mb-1">
                                         <div className="flex items-center gap-2">
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white tracking-wide uppercase ${move.type === 'ability' ? 'bg-red-600' : 'bg-poke-blue'}`}>
                                               {move.type === 'ability' ? 'Ability' : 'Attack'}
                                            </span>
                                            <span className="font-bold text-gray-800 text-sm">{move.name}</span>
                                         </div>
                                         <div className="flex items-center gap-3">
                                            {move.damage && <span className="font-mono font-bold text-lg text-gray-800">{move.damage}</span>}
                                            <button type="button" onClick={() => removeMove(move.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                         </div>
                                      </div>
                                      <div className="flex gap-1 mb-2">
                                         {move.cost.map((c, i) => {
                                            const typeDef = TYPES.find(t => t.id === c);
                                            return (
                                               <div key={i} className={`w-3 h-3 rounded-full shadow-sm ${typeDef?.color || 'bg-gray-400'}`} title={c}></div>
                                            );
                                         })}
                                      </div>
                                      <p className="text-xs text-gray-500 leading-snug">{move.description}</p>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    </div>
                  )}
                  
                  {/* Flavor Text */}
                  <div>
                     <label className={LABEL_CLASS}>Flavor Text (Opis)</label>
                     <textarea value={flavorText} onChange={e => setFlavorText(e.target.value)} className={`${INPUT_CLASS} text-xs italic`} rows={2} placeholder="Krótki opis lore pokemona..."></textarea>
                  </div>
               </div>

               {/* Right Column - Images & Submit */}
               <div className="space-y-6">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm sticky top-24">
                     <h3 className="font-bold text-gray-700 text-lg mb-4 flex items-center gap-2">
                        <ImageIcon className="text-poke-blue" /> Twoje Zdjęcia ({uploadedImages.length}/3)
                     </h3>
                     
                     <div 
                       onClick={() => !isUploading && uploadedImages.length < 3 && fileInputRef.current?.click()} 
                       className={`border-2 border-dashed rounded-lg aspect-[2/1] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden bg-gray-50 hover:bg-gray-100 ${isUploading ? 'border-gray-300' : 'border-poke-blue'} ${uploadedImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                     >
                        {isUploading ? <Loader2 className="animate-spin text-poke-blue mb-2" /> : <Upload className="text-poke-blue mb-2" size={32} />}
                        <span className="font-bold text-sm text-gray-500">{isUploading ? 'WYSYŁANIE...' : 'DODAJ ZDJĘCIA'}</span>
                     </div>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" disabled={isUploading || uploadedImages.length >= 3} />
                     {uploadError && <p className="mt-2 text-xs text-red-500 font-bold">{uploadError}</p>}

                     {/* Uploaded Thumbnails */}
                     <div className="mt-4 space-y-2">
                        {uploadedImages.map((img, idx) => (
                           <div key={idx} className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg border border-gray-200">
                               <img src={img} alt={`Uploaded ${idx}`} className="w-10 h-10 object-cover rounded bg-white" />
                               <span className="text-xs font-mono text-gray-500 truncate flex-grow">Zdjęcie {idx + 1}</span>
                               <button type="button" onClick={() => removeImage(idx)} className="text-gray-400 hover:text-red-500">
                                  <Trash2 size={16} />
                               </button>
                           </div>
                        ))}
                     </div>

                     <button 
                       type="submit" 
                       disabled={isUploading || uploadedImages.length === 0}
                       className="w-full mt-6 bg-poke-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black shadow-lg disabled:bg-gray-300 disabled:text-gray-500 active:scale-[0.98] transition-all"
                     >
                         <ShoppingCart size={20} /> DODAJ DO DECKU
                     </button>
                  </div>
               </div>
            </div>
          </form>
        </div>

      {/* MOVE EDITOR MODAL */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-slide-up border-4 border-gray-200">
              <button onClick={() => setIsMoveModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"><X /></button>
              
              <h3 className="font-tech text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <Wand2 className="text-poke-blue" /> Edytor Ataku
              </h3>
              
              {/* Type Switcher */}
              <div className="flex p-1 bg-gray-100 rounded-lg mb-6 border border-gray-200">
                 <button onClick={() => setNewMove(prev => ({...prev, type: 'attack'}))} className={`flex-1 py-2 text-xs font-bold rounded uppercase transition-all ${newMove.type === 'attack' ? 'bg-white text-poke-blue shadow-sm' : 'text-gray-500'}`}>Attack</button>
                 <button onClick={() => setNewMove(prev => ({...prev, type: 'ability'}))} className={`flex-1 py-2 text-xs font-bold rounded uppercase transition-all ${newMove.type === 'ability' ? 'bg-white text-poke-red shadow-sm' : 'text-gray-500'}`}>Ability</button>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className={LABEL_CLASS}>Nazwa</label>
                    <input value={newMove.name} onChange={e => setNewMove(prev => ({...prev, name: e.target.value}))} className={INPUT_CLASS} placeholder={newMove.type === 'attack' ? "np. Flamethrower" : "np. Solar Power"} autoFocus />
                 </div>
                 
                 {newMove.type === 'attack' && (
                    <div>
                       <label className={LABEL_CLASS}>Obrażenia (Damage)</label>
                       <div className="flex gap-2">
                          <input value={newMove.damage} onChange={e => setNewMove(prev => ({...prev, damage: e.target.value}))} className={`${INPUT_CLASS} flex-grow font-mono`} placeholder="np. 120" />
                          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                             <button onClick={() => setNewMove(prev => ({...prev, damage: prev.damage + '+'}))} className="px-3 rounded bg-white text-gray-600 font-bold hover:text-poke-blue shadow-sm border border-gray-200 transition-colors">+</button>
                             <button onClick={() => setNewMove(prev => ({...prev, damage: prev.damage + 'x'}))} className="px-3 rounded bg-white text-gray-600 font-bold hover:text-poke-blue shadow-sm border border-gray-200 transition-colors">x</button>
                          </div>
                       </div>
                    </div>
                 )}

                 {newMove.type === 'attack' && (
                    <div>
                       <label className={LABEL_CLASS}>Koszt Energii</label>
                       <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
                           <div className="flex flex-wrap gap-2 mb-3 justify-center">
                              {TYPES.map(t => (
                                 <button 
                                    key={t.id} 
                                    onClick={() => addEnergyToMove(t.id)} 
                                    className={`w-7 h-7 rounded-full shadow-sm hover:scale-110 transition-transform ${t.color} border-2 border-white ring-1 ring-gray-200`} 
                                    title={t.id}
                                 ></button>
                              ))}
                           </div>
                           
                           <div className="h-10 bg-white rounded border border-gray-200 flex items-center px-2 gap-1 overflow-x-auto shadow-inner">
                              {newMove.cost.length === 0 && <span className="text-xs text-gray-400 w-full text-center italic">Kliknij kulki powyżej...</span>}
                              {newMove.cost.map((c, i) => {
                                 const typeDef = TYPES.find(t => t.id === c);
                                 return (
                                    <button key={i} onClick={() => removeEnergyFromMove(i)} className={`w-6 h-6 rounded-full shrink-0 ${typeDef?.color || 'bg-gray-500'} hover:opacity-50 transition-opacity`} title="Usuń"></button>
                                 );
                              })}
                           </div>
                       </div>
                    </div>
                 )}

                 <div>
                    <label className={LABEL_CLASS}>Opis Działania</label>
                    <textarea value={newMove.description} onChange={e => setNewMove(prev => ({...prev, description: e.target.value}))} className={`${INPUT_CLASS} text-xs`} rows={3} placeholder="Opisz efekt ataku..."></textarea>
                 </div>
              </div>

              <button onClick={saveMove} className="w-full mt-8 bg-poke-green text-white py-3 rounded-xl font-bold uppercase hover:bg-green-600 transition-colors shadow-md active:translate-y-0.5">
                 Zatwierdź
              </button>
           </div>
        </div>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { ArrowLeft, Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface OrderStatusProps {
  onBack: () => void;
  googleScriptUrl: string;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ onBack, googleScriptUrl }) => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setIsLoading(true);
    setErrorMsg('');
    setStatus(null);

    try {
      // Dodajemy parametr _t=${Date.now()}, aby wymusić na przeglądarce pobranie świeżych danych
      const response = await fetch(`${googleScriptUrl}?action=check_status&orderId=${orderId.trim()}&_t=${Date.now()}`);
      const data = await response.json();

      if (Array.isArray(data)) {
          setErrorMsg("Błąd komunikacji z bazą. Spróbuj ponownie lub skontaktuj się z administratorem.");
          return;
      }

      if (!data.found) {
          setErrorMsg("Nie znaleziono zamówienia o tym numerze. Sprawdź czy ID jest poprawne.");
          return;
      }

      setStatus(data);

    } catch (e) {
      console.error(e);
      setErrorMsg("Wystąpił problem z połączeniem. Spróbuj ponownie później.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndex = (state: string) => {
      const s = state?.toUpperCase() || '';
      
      // Etap 1: Przyjęto
      if (s.includes('OTRZYMANO') || s.includes('WERYFIKACJA') || s.includes('OPŁACONE') || s.includes('NOWE') || s.includes('PRZYJĘTO')) return 0;
      
      // Etap 2: Produkcja
      if (s.includes('DRUK') || s.includes('PRODUKCJA') || s.includes('REALIZACJA') || s.includes('TWORZENIE')) return 1;
      
      // Etap 3: Wysłano
      if (s.includes('WYSŁANO') || s.includes('NADANO') || s.includes('KURIER') || s.includes('PACZKOMAT') || s.includes('DRODZE')) return 2;
      
      // Etap 4: Gotowe
      if (s.includes('DOSTARCZONO') || s.includes('ODEBRANO') || s.includes('ZAKOŃCZONO') || s.includes('GOTOWE')) return 3;
      
      return 0; // Domyślnie pierwszy krok
  };

  const currentStep = status ? getStepIndex(status.state) : 0;

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto shadow-inner border-2 border-gray-400 min-h-[500px]">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-poke-red font-bold transition-colors">
        <ArrowLeft size={20} /> Wróć
      </button>

      <div className="text-center mb-8 animate-fade-in">
        <h2 className="font-tech text-3xl font-bold text-poke-dark mb-2 uppercase">Sprawdź Status Zamówienia</h2>
        <p className="text-gray-500">Wpisz swój unikalny numer zamówienia (np. POKE-1R1R-HXD3)</p>
      </div>

      <form onSubmit={handleCheckStatus} className="mb-8">
        <div className="flex gap-2">
          <input 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="POKE-XXXX-XXXX"
            className="flex-grow bg-gray-50 border-2 border-gray-200 rounded-lg p-4 font-mono font-bold uppercase focus:border-poke-blue outline-none transition-all placeholder:text-gray-300"
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-poke-blue text-white px-6 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center gap-2 min-w-[80px] justify-center shadow-md active:translate-y-0.5"
          >
            {isLoading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : <Search size={24} />}
          </button>
        </div>

        {errorMsg && (
            <div className="flex items-center gap-2 text-red-500 mt-4 text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-100 animate-slide-in">
                <AlertCircle size={20} /> {errorMsg}
            </div>
        )}
      </form>

      {status && (
        <div className="bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden animate-slide-up shadow-lg">
          <div className="bg-poke-dark text-white p-4 flex justify-between items-center flex-wrap gap-2 border-b-4 border-poke-red">
            <span className="font-mono font-bold text-lg tracking-wider">{status.id}</span>
            <span className="text-xs opacity-70 bg-white/10 px-2 py-1 rounded">Aktualizacja: {status.updateTime}</span>
          </div>
          
          <div className="p-6">
             <div className="relative flex justify-between mb-10 mt-2 px-2">
                {/* Progress Bar Background */}
                <div className="absolute top-[18px] left-0 w-full h-1.5 bg-gray-200 rounded-full z-0"></div>
                
                {/* Active Progress Bar */}
                <div 
                   className="absolute top-[18px] left-0 h-1.5 bg-poke-green rounded-full z-0 transition-all duration-1000 ease-out"
                   style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
                
                {[
                  { icon: Clock, label: 'Przyjęto' },
                  { icon: Package, label: 'Produkcja' },
                  { icon: Truck, label: 'Wysłano' },
                  { icon: CheckCircle2, label: 'Gotowe' }
                ].map((step, idx) => {
                  const isActive = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center gap-2 group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive ? 'bg-white border-poke-green text-poke-green shadow-md scale-110' : 'bg-gray-100 border-gray-300 text-gray-300'} ${isCurrent ? 'animate-pulse' : ''}`}>
                        <step.icon size={18} strokeWidth={3} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${isActive ? 'text-poke-dark' : 'text-gray-400'}`}>{step.label}</span>
                    </div>
                  );
                })}
             </div>

             <div className="bg-white p-4 rounded-lg border border-gray-200 text-center shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">Aktualny Status</p>
                <p className="font-tech font-bold text-poke-blue text-3xl uppercase tracking-wider mb-3">{status.state}</p>
                {status.items && (
                   <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 inline-block w-full text-left">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Szczegóły od admina:</p>
                      {status.items}
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { UserData, CartItem } from '../types';
import { ArrowLeft, Loader2, CreditCard, ShieldCheck, MapPin, Box, CheckCircle, RefreshCw, Tag, Check, X, AlertTriangle } from 'lucide-react';

interface CheckoutFormProps {
  onBack: () => void;
  onSubmit: (data: UserData) => Promise<void>;
  cartTotal: number;
  googleScriptUrl: string;
  cartItems: CartItem[];
}

// TOKEN DLA DOMENY MCPIXAI.PL
const INPOST_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwODMwMDY4NTcsImlhdCI6MTc2NzY0Njg1NywianRpIjoiMjdjMTBhMDItYjMyYS00YjFhLThhYTUtYTVmMGQwNjQwZjgyIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpMRi1qaFA2d0RobXc5S29oemZITlJoOU1GcTJEbUhGRF9kX3N0Rl9uOFFFIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYWMwNTdhYzAtODljMy00ZTQzLTljYjMtOGI5OWY4YWY4YzgwIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImFjMDU3YWMwLTg5YzMtNGU0My05Y2IzLThiOTlmOGFmOGM4MCIsImFsbG93ZWRfcmVmZXJyZXJzIjoibWNwaXhhaS5wbCIsInV1aWQiOiJjOTc0MmEyOS1kOTE2LTQxNzItODgzOS1jNGYwMjgzMGI2YzYifQ.FwSLhevlFGj5zuGLv3EENtXfg_N8wu-5duqgmb-yhrS0eSljukTqTe7wILPXdBlL5Sn3501LS5ajecYGHo4UY7OWMS7s7BrAzr17xeAjUDYHlKHpsDSxzsp1B1C-FRpZlXwL2rLXi6Kyu-e-zQg5p6G3VAty86UrIqeueI2t6ewq0q57GnBtS0T9uQJ6roJp3Ym8rK1tKzEWGh-qvctKzyYS4SlAdvw9FGvGScMnZDVWH18nyq4eRkti3IMycGeqVm1_zafi6rNNOmeH2XLvTntBkVH9j0oY9RKrQ0PjQ2d3TAYRCuAQqNNbDbDt_f6yrOQW22mdyKiAN9TfSkDxQQ";

const BASE_INPUT_CLASS = "w-full bg-white text-gray-900 border-2 rounded-lg p-3 outline-none transition-all font-medium";
const ERROR_INPUT_CLASS = "border-red-500 focus:border-red-600 bg-red-50";
const NORMAL_INPUT_CLASS = "border-gray-200 focus:border-poke-blue";

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  onBack, 
  onSubmit, 
  cartTotal, 
  googleScriptUrl,
  cartItems 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    paczkomatCode: '',
    paczkomatAddress: ''
  });

  const [isMapOpen, setIsMapOpen] = useState(false);

  // Rabat States
  const [discountInput, setDiscountInput] = useState('');
  const [isVerifyingDiscount, setIsVerifyingDiscount] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    type: 'percent' | 'amount';
    value: number;
    amountToDeduct: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');

  const [agreements, setAgreements] = useState({
    terms: false,
    proxy: false,
    resignation: false
  });

  const [errors, setErrors] = useState<Partial<UserData>>({});
  
  const shippingCost = 12.00;
  const totalAfterDiscount = Math.max(0, cartTotal - (appliedDiscount ? appliedDiscount.amountToDeduct : 0));
  const totalWithShipping = totalAfterDiscount + shippingCost;
  const allAgreementsChecked = agreements.terms && agreements.proxy && agreements.resignation;
  
  // Sprawdzenie domeny
  const isProduction = typeof window !== 'undefined' && (window.location.hostname === 'mcpixai.pl' || window.location.hostname === 'www.mcpixai.pl');

  useEffect(() => {
    // Rejestrujemy funkcję globalną, tak jak w przykładzie HTML <script>function afterPointSelected...</script>
    (window as any).onInPostPointSelected = (point: any) => {
        // console.log("Global InPost Callback Fired:", point);
        if (point && point.name) {
            setFormData(prev => ({
                ...prev,
                paczkomatCode: point.name,
                paczkomatAddress: `${point.address.line1}, ${point.address.line2}`
            }));
            setErrors(prev => ({ ...prev, paczkomatCode: undefined }));
            setIsMapOpen(false); // Zamykamy mapę po wyborze
        }
    };

    return () => {
        // Sprzątanie po odmontowaniu
        delete (window as any).onInPostPointSelected;
    };
  }, []);


  const handleVerifyDiscount = async () => {
      if (!discountInput.trim()) return;
      
      setIsVerifyingDiscount(true);
      setDiscountError('');
      setDiscountSuccess('');
      setAppliedDiscount(null);

      try {
          const response = await fetch(`${googleScriptUrl}?action=get_discounts`);
          if (!response.ok) throw new Error("Błąd sieci");
          
          const discounts = await response.json();
          const normalizedInput = discountInput.trim().toUpperCase();
          const found = discounts.find((d: any) => 
              String(d["Kod rabatowy"]).trim().toUpperCase() === normalizedInput
          );

          if (found) {
              const form = String(found["Forma"]).toLowerCase(); 
              const val = parseFloat(found["Liczba"]);
              let deduction = 0;
              let type: 'percent' | 'amount' = 'amount';

              if (form.includes('procent') || form === '%') {
                  type = 'percent';
                  deduction = cartTotal * (val / 100);
              } else {
                  type = 'amount';
                  deduction = val;
              }

              if (deduction > cartTotal) deduction = cartTotal;

              setAppliedDiscount({
                  code: normalizedInput,
                  type: type,
                  value: val,
                  amountToDeduct: deduction
              });
              setDiscountSuccess(`Kod ${normalizedInput} aktywny!`);
          } else {
              setDiscountError("Kod nieprawidłowy lub nieaktywny.");
          }

      } catch (err) {
          setDiscountError("Nie udało się sprawdzić kodu.");
      } finally {
          setIsVerifyingDiscount(false);
      }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {};
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Wprowadź poprawny email";
      isValid = false;
    }

    if (formData.phone.replace(/[\s-]/g, '').length < 9) {
      newErrors.phone = "Minimum 9 cyfr";
      isValid = false;
    }

    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Wymagane imię i nazwisko";
      isValid = false;
    }

    if (!formData.paczkomatCode) {
        newErrors.paczkomatCode = "Wybierz paczkomat na mapie";
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAgreementChange = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!allAgreementsChecked) {
      alert("Proszę zaakceptować wszystkie wymagane zgody.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
          ...formData,
          discountCode: appliedDiscount?.code,
          discountValue: appliedDiscount?.amountToDeduct
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-poke-screen rounded-lg p-4 sm:p-6 max-w-2xl mx-auto shadow-inner border-2 border-gray-400 h-full overflow-y-auto no-scrollbar relative">
      <button 
        onClick={onBack}
        disabled={isSubmitting}
        type="button"
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-poke-red transition-colors font-bold disabled:opacity-50"
      >
        <ArrowLeft size={20} /> Wróć do sklepu
      </button>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-4 border-poke-blue">
        <h2 className="font-tech text-2xl font-bold mb-2 flex items-center gap-2">
          <ShieldCheck className="text-poke-blue" /> BEZPIECZNA KASA
        </h2>
        <p className="text-gray-500 text-sm italic">
          Wypełnij dane kontaktowe, użyj kodu rabatowego i wybierz Paczkomat.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        
        {/* Dane Kontaktowe */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
            <h3 className="font-tech text-lg font-bold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-poke-red rounded-full"></div> DANE ODBIORCY
            </h3>
            
            <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-widest">
                Imię i Nazwisko
            </label>
            <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                className={`${BASE_INPUT_CLASS} ${errors.fullName ? ERROR_INPUT_CLASS : NORMAL_INPUT_CLASS}`}
                placeholder="Jan Kowalski" 
                disabled={isSubmitting}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-widest">
                Email
                </label>
                <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className={`${BASE_INPUT_CLASS} ${errors.email ? ERROR_INPUT_CLASS : NORMAL_INPUT_CLASS}`}
                placeholder="email@domena.pl" 
                disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-widest">
                Telefon
                </label>
                <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className={`${BASE_INPUT_CLASS} ${errors.phone ? ERROR_INPUT_CLASS : NORMAL_INPUT_CLASS}`}
                placeholder="500 123 456" 
                disabled={isSubmitting}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.phone}</p>}
            </div>
            </div>
        </div>

        {/* Sekcja Rabatowa */}
        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
           <div className="mb-2">
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-widest flex items-center gap-1">
                 <Tag size={12} /> Kod Rabatowy (Opcjonalnie)
              </label>
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={discountInput}
                   onChange={(e) => setDiscountInput(e.target.value)}
                   disabled={!!appliedDiscount || isVerifyingDiscount}
                   className={`${BASE_INPUT_CLASS} ${NORMAL_INPUT_CLASS} uppercase tracking-wider`}
                   placeholder="WPISZ KOD" 
                 />
                 <button 
                   type="button" 
                   onClick={handleVerifyDiscount}
                   disabled={!!appliedDiscount || isVerifyingDiscount || !discountInput}
                   className="bg-gray-800 text-white px-4 rounded-lg font-bold text-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[100px]"
                 >
                   {isVerifyingDiscount ? <Loader2 className="animate-spin mx-auto" /> : (appliedDiscount ? <Check className="mx-auto" /> : 'ZATWIERDŹ')}
                 </button>
              </div>
              {discountError && <p className="text-red-500 text-xs mt-1 font-bold">{discountError}</p>}
              {discountSuccess && <p className="text-poke-green text-xs mt-1 font-bold">{discountSuccess}</p>}
           </div>
        </div>

        {/* Sekcja InPost */}
        <div className={`bg-white p-4 rounded-xl border-2 transition-colors ${errors.paczkomatCode ? 'border-red-300 bg-red-50' : 'border-poke-yellow'}`}>
            <h3 className="font-tech text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Box className="text-poke-yellow fill-current text-opacity-100" /> DOSTAWA: InPost
            </h3>

            {!formData.paczkomatCode ? (
                <div className="flex flex-col items-center py-4">
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      Wybierz punkt odbioru na mapie, aby kontynuować.
                    </p>
                    <button 
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className="px-6 py-3 rounded-full font-bold shadow-md transition-all flex items-center gap-2 bg-poke-yellow text-poke-dark hover:brightness-105 active:scale-95"
                    >
                        <MapPin size={20} /> WYBIERZ PACZKOMAT
                    </button>
                    {errors.paczkomatCode && <p className="text-red-500 text-xs mt-2 font-bold uppercase">{errors.paczkomatCode}</p>}
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                    <div className="flex items-start gap-3">
                         <div className="bg-poke-green text-white p-2 rounded-full">
                             <CheckCircle size={20} />
                         </div>
                         <div>
                             <p className="text-[10px] font-bold uppercase text-gray-400">Wybrany punkt:</p>
                             <p className="font-bold text-xl text-gray-800">{formData.paczkomatCode}</p>
                             <p className="text-sm text-gray-600 leading-tight mt-1">
                               {formData.paczkomatAddress}
                             </p>
                         </div>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className="absolute top-2 right-2 flex items-center gap-1 text-xs font-bold text-poke-blue underline hover:text-poke-dark"
                    >
                        <RefreshCw size={12} /> ZMIEŃ
                    </button>
                </div>
            )}
        </div>

        {/* Zgody prawne */}
        <div className="mt-8 space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreements.terms}
              onChange={() => handleAgreementChange('terms')}
              className="mt-1 w-5 h-5 accent-poke-blue cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-gray-600 leading-snug cursor-pointer">
              Akceptuję <a href="regulamin.pdf" target="_blank" className="text-poke-blue underline font-bold hover:text-poke-dark">Regulamin</a> oraz <a href="polityka_prywatnosci.pdf" target="_blank" className="text-poke-blue underline font-bold hover:text-poke-dark">Politykę Prywatności</a> serwisu mcpixai.pl i zobowiązuję się do ich przestrzegania.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="proxy" 
              checked={agreements.proxy}
              onChange={() => handleAgreementChange('proxy')}
              className="mt-1 w-5 h-5 accent-poke-blue cursor-pointer"
            />
            <label htmlFor="proxy" className="text-xs text-gray-600 leading-snug cursor-pointer">
              Niniejszym udzielam MCpixAi pełnomocnictwa do zakupu w moim imieniu i na moją rzecz fizycznej bazy karty niezbędnej do wykonania zamówionej usługi artystycznej. Przyjmuję do wiadomości, że koszt bazy jest częścią składową ceny końcowej usługi.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="resignation" 
              checked={agreements.resignation}
              onChange={() => handleAgreementChange('resignation')}
              className="mt-1 w-5 h-5 accent-poke-blue cursor-pointer"
            />
            <label htmlFor="resignation" className="text-xs text-gray-600 leading-snug cursor-pointer">
              Wyrażam zgodę na rozpoczęcie świadczenia usługi customizacji przed upływem 14-dniowego terminu do odstąpienia od umowy. Przyjmuję do wiadomości, że ze względu na zindywidualizowany charakter zamówienia (wykonanie według specyfikacji konsumenta), tracę prawo do odstąpienia od umowy z chwilą pełnego wykonania usługi przez Sprzedawcę.
            </label>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300">
           
           {/* LISTA PRODUKTÓW W KOSZYKU */}
           <div className="mb-6 space-y-3">
               <h3 className="font-tech text-gray-600 font-bold text-sm uppercase tracking-widest mb-3">Twoje Produkty:</h3>
               {cartItems.map((item) => (
                   <div key={item.id} className="flex items-center justify-between text-sm">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                               <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                           <div>
                               <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                               <p className="text-xs text-gray-500">{item.quantity} x {item.price.toFixed(2)} zł</p>
                           </div>
                       </div>
                       <span className="font-mono font-bold text-gray-700">{(item.price * item.quantity).toFixed(2)} zł</span>
                   </div>
               ))}
           </div>

           <div className="flex flex-col gap-2 mb-6 text-sm pt-4 border-t border-gray-200">
             <div className="flex justify-between items-center text-gray-500">
                <span>Produkty:</span>
                <span>{cartTotal.toFixed(2)} zł</span>
             </div>
             
             {appliedDiscount && (
               <div className="flex justify-between items-center text-poke-green font-bold">
                  <span>Rabat ({appliedDiscount.type === 'percent' ? `${appliedDiscount.value}%` : `${appliedDiscount.value} zł`}):</span>
                  <span>-{appliedDiscount.amountToDeduct.toFixed(2)} zł</span>
               </div>
             )}

             <div className="flex justify-between items-center text-gray-500">
                <span>Dostawa:</span>
                <span>{shippingCost.toFixed(2)} zł</span>
             </div>
           </div>

           <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
             <span className="font-tech text-gray-600 font-bold text-lg uppercase tracking-widest">Suma:</span>
             <span className="font-mono text-3xl font-bold text-poke-red">{totalWithShipping.toFixed(2)} zł</span>
           </div>

           <button 
             type="submit"
             disabled={isSubmitting || !allAgreementsChecked || !formData.paczkomatCode}
             className="w-full bg-poke-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest text-lg hover:bg-black shadow-xl active:translate-y-0.5 transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500"
           >
             {isSubmitting ? (
               <><Loader2 className="animate-spin" /> PRZETWARZANIE...</>
             ) : (
               <><CreditCard size={24} className={allAgreementsChecked ? "text-poke-blue" : "text-gray-400"} /> Kupuję i płacę</>
             )}
           </button>
           {!allAgreementsChecked && (
              <p className="text-center text-[10px] text-red-500 font-bold mt-2 uppercase tracking-wide">
                * Zaznacz wszystkie zgody powyżej, aby przejść dalej
              </p>
           )}
        </div>
      </form>

      {/* MODAL Z MAPĄ */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full h-[85vh] max-w-5xl rounded-2xl overflow-hidden flex flex-col relative shadow-2xl">
               <div className="bg-poke-yellow p-4 flex justify-between items-center shadow-md z-20">
                  <h3 className="font-bold text-poke-dark text-lg flex items-center gap-2">
                     <MapPin className="text-poke-red" /> Wybierz Paczkomat
                  </h3>
                  <button 
                    onClick={() => setIsMapOpen(false)}
                    className="bg-white/50 p-2 rounded-full hover:bg-white text-poke-dark transition-all"
                  >
                     <X size={24} />
                  </button>
               </div>
               
               <div className="flex-grow w-full h-full relative bg-gray-100">
                  {!isProduction && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-200/90 text-gray-800 p-8 text-center backdrop-blur-sm">
                        <AlertTriangle size={64} className="text-orange-500 mb-4 animate-bounce" />
                        <h3 className="font-bold text-2xl mb-2">TRYB LOKALNY / TESTOWY</h3>
                        <p className="max-w-md text-lg">
                          Mapa InPost nie załaduje się poprawnie na domenie <b>{window.location.hostname}</b>.
                        </p>
                        <p className="max-w-md mt-2 text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
                           Token bezpieczeństwa jest przypisany wyłącznie do domeny <b>mcpixai.pl</b>. 
                           To normalne zachowanie - po wrzuceniu na serwer mapa zadziała poprawnie.
                        </p>
                        <button 
                           onClick={() => setIsMapOpen(false)}
                           className="mt-8 bg-poke-dark text-white px-6 py-2 rounded-full font-bold hover:bg-black transition-colors"
                        >
                           Rozumiem, zamknij
                        </button>
                    </div>
                  )}

                  {/* @ts-ignore */}
                  <inpost-geowidget 
                      token={INPOST_TOKEN}
                      onpoint="onInPostPointSelected"
                      language="pl" 
                      config="parcelCollect"
                      style={{ width: '100%', height: '100%' }}
                  />
               </div>
           </div>
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';

interface PrivacyScreenProps {
  onBack: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack }) => {
  return (
    <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow-inner border-2 border-gray-400 min-h-[70vh] flex flex-col animate-slide-in">
      <div className="flex justify-between items-start mb-6 border-b pb-4">
        <div>
           <button 
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-poke-red transition-colors font-bold"
          >
            <ArrowLeft size={20} /> Wróć do sklepu
          </button>
          <h2 className="font-tech text-3xl font-bold text-poke-dark flex items-center gap-2">
            <Lock className="text-poke-blue" /> POLITYKA PRYWATNOŚCI
          </h2>
          <p className="text-gray-500 text-sm font-bold">Obowiązuje od dnia: 06.01.2026 r.</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 text-gray-800 space-y-8 leading-relaxed text-sm sm:text-base font-sans">
        
        <p className="italic text-gray-500 mb-4">
          Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem ze sklepu internetowego MCpixAi dostępnego pod adresem mcpixai.pl.
        </p>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§1. Administrator Danych Osobowych</h3>
          <p>
            Administratorem danych osobowych zawartych w serwisie jest <strong>Mateusz Czarnecki</strong>, prowadzący działalność nierejestrowaną, z siedzibą: Konstytucji 3 Maja 67, 58-540 Karpacz, Polska. Kontakt z Administratorem możliwy jest pod adresem e-mail: <strong>mcpixai.studio@gmail.com</strong>.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§2. Cele i podstawy przetwarzania</h3>
          <p className="mb-2">Dane osobowe przetwarzane są w celu:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>zawarcia i wykonania umowy sprzedaży (realizacji zamówienia),</li>
            <li>obsługi procesu reklamacyjnego,</li>
            <li>kontaktu z Klientem w sprawach związanych z zamówieniem.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§3. Odbiorcy danych</h3>
          <p className="mb-2">
            Dla prawidłowej realizacji usług Administrator korzysta z usług podmiotów zewnętrznych. Dane osobowe mogą być przekazywane następującym odbiorcom:
          </p>
          <ul className="list-disc pl-5 space-y-1">
             <li><strong>InPost Sp. z o.o.</strong> / Poczta Polska – w celu dostarczenia przesyłki,</li>
             <li><strong>Stripe Payments Europe, Ltd.</strong> – w celu obsługi płatności online,</li>
             <li><strong>Google Ireland Limited</strong> – w zakresie usług hostingowych i arkuszy kalkulacyjnych (baza zamówień).</li>
          </ul>
        </section>
        
        <section>
           <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§4. Prawa osoby, której dane dotyczą</h3>
           <p>
             Użytkownik ma prawo do: dostępu do swoich danych, ich sprostowania, usunięcia ("prawo do bycia zapomnianym"), ograniczenia przetwarzania oraz przenoszenia danych.
           </p>
        </section>

        <section>
           <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§5. Okres przechowywania danych</h3>
           <p>
             Dane osobowe będą przechowywane przez okres niezbędny do realizacji zamówienia, a po tym czasie przez okres wymagany przepisami prawa (np. księgowego) lub do czasu przedawnienia ewentualnych roszczeń (maksymalnie 5 lat).
           </p>
        </section>

        <section>
           <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§6. Profilowanie</h3>
           <p>
             Dane osobowe Klienta nie będą poddawane zautomatyzowanemu podejmowaniu decyzji, w tym profilowaniu.
           </p>
        </section>

        <section>
           <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§7. Dobrowolność podania danych</h3>
           <p>
             Podanie danych osobowych jest dobrowolne, jednakże niezbędne do zawarcia i realizacji Umowy Sprzedaży.
           </p>
        </section>

        <section>
            <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§8. Bezpieczeństwo danych</h3>
            <p className="mb-2">
                Administrator stosuje odpowiednie środki techniczne i organizacyjne mające na celu ochronę danych osobowych przed ich utratą, nieuprawnionym dostępem lub niewłaściwym wykorzystaniem.
            </p>
            <p>
                Dostęp do danych osobowych posiada wyłącznie Administrator.
            </p>
        </section>

        <section>
            <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§9. Pliki cookies</h3>
            <p className="mb-2">
                Strona sklepu MCpixAi korzysta wyłącznie z cookies technicznych, niezbędnych do prawidłowego funkcjonowania Sklepu (np. utrzymanie sesji koszyka).
            </p>
            <p className="mb-2">
                Administrator nie korzysta z zewnętrznych narzędzi analitycznych ani reklamowych wymagających dodatkowej zgody.
            </p>
            <p>
                Klient może w każdej chwili wyłączyć obsługę cookies w ustawieniach swojej przeglądarki, co jednak może wpłynąć na niektóre funkcje strony.
            </p>
        </section>

        <section>
            <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§10. Postanowienia końcowe</h3>
            <p className="mb-2">
                Administrator nie przekazuje danych osobowych poza Europejski Obszar Gospodarczy.
            </p>
            <p className="mb-2">
                W sprawach nieuregulowanych niniejszą Polityką zastosowanie mają powszechnie obowiązujące przepisy prawa.
            </p>
            <p>
                Administrator zastrzega sobie prawo do zmiany Polityki Prywatności, przy czym do zamówień złożonych przed zmianą stosuje się wersję obowiązującą w chwili ich złożenia.
            </p>
        </section>

      </div>
    </div>
  );
};

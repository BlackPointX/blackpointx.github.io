
import React from 'react';
import { ArrowLeft, Download, Shield } from 'lucide-react';

interface TermsScreenProps {
  onBack: () => void;
}

export const TermsScreen: React.FC<TermsScreenProps> = ({ onBack }) => {
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
            <Shield className="text-poke-blue" /> REGULAMIN SKLEPU
          </h2>
          <p className="text-gray-500 text-sm font-bold">Obowiązuje od dnia: 06.01.2026 r.</p>
        </div>
        
        <a 
          href="regulamin.pdf" 
          target="_blank"
          download="Regulamin_PokeCustom.pdf"
          className="hidden sm:flex bg-gray-100 hover:bg-poke-blue hover:text-white text-poke-dark px-4 py-2 rounded-lg font-bold text-sm transition-colors items-center gap-2 border border-gray-300"
        >
          <Download size={16} /> Pobierz PDF
        </a>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 text-gray-800 space-y-8 leading-relaxed text-sm sm:text-base font-sans">
        
        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§1. Postanowienia ogólne</h3>
          <p className="mb-2">1. Sklep internetowy działający pod adresem mcpixai.pl prowadzony jest przez Mateusza Czarneckiego, zamieszkałego w Polsce, prowadzącego działalność nierejestrowaną zgodnie z art. 5 ust. 1 ustawy Prawo przedsiębiorców. Sprzedawca nie posiada numeru NIP ani REGON z racji prowadzenia działalności nierejestrowanej.</p>
          <p className="mb-2">2. Dane kontaktowe Sprzedawcy:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>adres e-mail: mcpixai.studio@gmail.com</li>
            <li>numer telefonu: 576940785</li>
            <li>adres do korespondencji: Konstytucji 3 Maja 67, 58-540 Karpacz, Polska</li>
          </ul>
          <p className="mb-2">3. Niniejszy Regulamin określa zasady świadczenia usług artystycznych oraz sprzedaży produktów kolekcjonerskich personalizowanych, wykonywanych na indywidualne zamówienie Klienta.</p>
          <p>4. Klient przed złożeniem zamówienia ma obowiązek zapoznać się z niniejszym Regulaminem. Złożenie zamówienia oznacza pełną akceptację jego treści.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§2. Charakterystyka produktów i usług</h3>
          <p className="mb-2">1. Przedmiotem umowy zawieranej za pośrednictwem Sklepu jest wyłącznie wykonanie autorskiej usługi artystycznej polegającej na personalizacji oraz redesignie fizycznych kart kolekcjonerskich.</p>
          <p className="mb-2">2. Sprzedawca oświadcza, że wszystkie fizyczne karty kolekcjonerskie wykorzystywane jako baza do wykonania usługi są kartami oryginalnymi, pochodzącymi z legalnych źródeł.</p>
          <p className="mb-2">3. Sklep nie prowadzi sprzedaży kart podrobionych ani jakichkolwiek towarów z podrobionymi znakami towarowymi.</p>
          <p className="mb-2">4. Oświadczenie dotyczące własności intelektualnej (IP):<br/>Oferowane produkty są nieoficjalnymi, autorskimi opracowaniami graficznymi typu Fanart / Altered Art. Nie są to oficjalne produkty firm The Pokémon Company, Nintendo ani Creatures Inc.</p>
          <p className="mb-2">5. Wszystkie karty po wykonaniu usługi mają charakter wyłącznie kolekcjonerski oraz ekspozycyjny. Nie są przeznaczone do użytku w oficjalnych turniejach Pokémon TCG ani do zastosowań komercyjnych wymagających licencji.</p>
          <p className="mb-2">6. Klient przyjmuje do wiadomości i akceptuje, że naniesienie nadruku lub innych modyfikacji artystycznych na karcie bazowej powoduje, iż:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>karta traci swój pierwotny, oficjalny charakter jako karta do gry Pokémon TCG,</li>
            <li>nie może być używana w oficjalnych turniejach,</li>
            <li>nie powinna być przedmiotem oficjalnego gradingu,</li>
            <li>jej wartość rynkowa jako oficjalnego produktu może ulec zmianie lub obniżeniu.</li>
          </ul>
          <p className="mb-2">7. Cena produktu widoczna w Sklepie stanowi wynagrodzenie za usługę artystyczną wykonaną na karcie Klienta, a nie cenę samej karty.</p>
          <p className="mb-2">8. Personalizacja może obejmować w szczególności:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>autorski projekt graficzny naniesiony na karcie,</li>
            <li>ręczne wykończenia artystyczne,</li>
            <li>zastosowanie efektów holograficznych i ekspozycyjnych,</li>
            <li>przygotowanie karty według specyfikacji podanej przez Klienta.</li>
          </ul>
          <p className="mb-2">9. Klient składając zamówienie potwierdza, że:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>jest właścicielem karty przekazywanej do personalizacji<br/>LUB</li>
            <li>upoważnia Sprzedawcę do zakupu w jego imieniu karty wyłącznie w celu wykonania na niej zamówionej usługi artystycznej.</li>
          </ul>
          <p className="mb-2">10. W przypadku, gdy karta-baza jest nabywana przez Sprzedawcę na zlecenie Klienta, Sprzedawca nabywa ją we własnym imieniu, a następnie przenosi jej własność na Klienta w ramach zawartej umowy – jeszcze przed wykonaniem na niej usługi.</p>
          <p className="mb-2">11. Ilustracje wykorzystywane w procesie personalizacji mogą być przygotowywane przy użyciu narzędzi AI oraz poddawane autorskiej obróbce graficznej. Klient akceptuje taką formę procesu twórczego. Użycie AI stanowi element procesu twórczego Sprzedawcy i nie wpływa na prawa Klienta do złożonego zamówienia.</p>
          <p className="mb-2">12. Komunikacja z Klientem odbywa się:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>drogą mailową<br/>LUB</li>
            <li>poprzez komunikator WhatsApp.</li>
          </ul>
          <p className="mb-2">Sprzedawca dopuszcza kontakt za pośrednictwem WhatsApp jako podstawowy kanał roboczy przy realizacji zamówienia.</p>
          <p className="mb-2">13. Warunkiem realizacji zamówienia indywidualnego jest przekazanie przez Klienta minimalnych danych niezbędnych do wykonania usługi, w szczególności: wskazania karty podlegającej personalizacji, treści personalizacji oraz podstawowych preferencji dotyczących projektu. Zakres oraz wygląd karty określany jest wyłącznie przez wytyczne przekazane i zaakceptowane przez Klienta.</p>
          <p className="mb-2">14. Sprzedawca oświadcza, że jest autorem projektów graficznych tworzonych osobiście lub posiada odpowiednie prawa do ich wykorzystania w ramach świadczonej usługi.</p>
          <p className="mb-2">15. W przypadku wykorzystania ilustracji stworzonych przez osoby trzecie, Sprzedawca zobowiązuje się korzystać wyłącznie z grafik, do których:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>posiada majątkowe prawa autorskie,</li>
            <li>uzyskał zgodę twórcy,</li>
            <li>lub które są udostępnione na licencjach pozwalających na ich użycie w fanarcie.</li>
          </ul>
          <p>Ewentualna odpowiedzialność za naruszenie praw autorskich wobec autorów grafik spoczywa wyłącznie na Sprzedawcy.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§3. Zasady realizacji zamówień</h3>
          <p className="mb-2">1. Projekty i produkty dostępne w zakładce „Dostępne projekty” są wysyłane w terminie 48 godzin od daty złożenia zamówienia, licząc wyłącznie dni robocze.</p>
          <p className="mb-2">2. Projekty z zakładki „Preorder” zostaną wysłane maksymalnie w ciągu 48 godzin od daty premiery danego produktu, także licząc tylko dni robocze.</p>
          <p className="mb-2">3. Projekty przygotowywane indywidualnie poprzez opcję „Stwórz kartę” zostaną wysłane w terminie do 10 dni roboczych od daty zaakceptowania finalnego projektu przez Klienta.</p>
          <p className="mb-2">4. Jeśli Klient jasno sprecyzuje swoje oczekiwania, wstępny projekt cyfrowy karty zostanie przesłany do akceptacji w terminie do 5 dni roboczych od daty złożenia zamówienia.</p>
          <p className="mb-2">5. Każdy projekt przed wykonaniem na karcie fizycznej wymaga wyraźnej akceptacji Klienta.</p>
          <p>6. Nie ma ograniczeń co do liczby poprawek projektu, jednak każda zgłoszona przez Klienta poprawka może wydłużyć termin realizacji o czas niezbędny do jej wprowadzenia.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§4. Zamówienia i płatności</h3>
          <p className="mb-2">1. Klient składa zamówienie poprzez formularz dostępny na stronie internetowej Sklepu.</p>
          <p className="mb-2">2. Umowa o wykonanie usługi artystycznej zostaje zawarta z chwilą potwierdzenia przyjęcia zamówienia przez Sprzedawcę. Sprzedawca rozpoczyna realizację usługi dopiero po dokonaniu przez Klienta pełnej płatności.</p>
          <p className="mb-2">3. Po złożeniu zamówienia Klient otrzymuje jego potwierdzenie drogą mailową wraz z niniejszym Regulaminem w formacie PDF.</p>
          <p>4. Płatność odbywa się za pośrednictwem metod wskazanych w procesie zamówienia.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§5. Wysyłka i dostawa</h3>
          <p className="mb-2">1. Forma i koszt wysyłki wskazane są każdorazowo w procesie zamówienia.</p>
          <p className="mb-2">2. Sprzedawca zobowiązuje się do odpowiedniego zabezpieczenia przesyłki, w szczególności poprzez:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>koszulkę ochronną (sleeve),</li>
            <li>sztywne usztywnienie,</li>
            <li>kopertę bąbelkową lub inne bezpieczne opakowanie.</li>
          </ul>
          <p>3. Dostawa realizowana jest przez podmioty trzecie, takie jak InPost lub Poczta Polska. Sprzedawca nie ponosi odpowiedzialności za opóźnienia wynikające z działania firm kurierskich.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§6. Brak prawa do odstąpienia od umowy i zwroty</h3>
          <p className="mb-2">1. Zgodnie z art. 38 pkt 3 ustawy o prawach konsumenta, prawo do odstąpienia od umowy nie przysługuje w odniesieniu do towarów nieprefabrykowanych i wykonywanych według specyfikacji Klienta.</p>
          <p className="mb-2">2. Produkty wykonane na indywidualne zamówienie Klienta nie podlegają zwrotowi.</p>
          <p>3. Powyższe nie wyłącza prawa Klienta do złożenia reklamacji w przypadku niezgodności usługi z umową.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§7. Reklamacje</h3>
          <p className="mb-2">1. Sprzedawca odpowiada za zgodność wykonania usługi artystycznej z opisem przedstawionym w Sklepie oraz z wytycznymi zaakceptowanymi przez Klienta.</p>
          <p className="mb-2">2. Reklamacje należy zgłaszać na adres e-mail Sprzedawcy.</p>
          <p className="mb-2">3. Sprzedawca rozpatrzy reklamację w terminie 14 dni od jej otrzymania.</p>
          <p className="mb-2">4. Podstawą do reklamacji nie są:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>cechy wynikające z ręcznego charakteru wykonania dzieła,</li>
            <li>drobne różnice kolorystyczne,</li>
            <li>właściwości wizualne efektów holograficznych,</li>
            <li>subiektywna ocena Klienta dotycząca walorów artystycznych.</li>
          </ul>
          <p className="mb-2">5. W przypadku, gdy karta-baza została dostarczona przez Klienta, Sprzedawca nie ponosi odpowiedzialności za jej stan techniczny ani wizualny.</p>
          <p className="mb-2">6. Jeżeli karta-baza została zapewniona przez Sprzedawcę na zlecenie Klienta, Sprzedawca odpowiada za to, że jej stan był zgodny z ustaleniami oraz informacjami przekazanymi Klientowi przed rozpoczęciem realizacji usługi.</p>
          <p className="mb-2">7. Odpowiedzialność Sprzedawcy w ramach reklamacji dotyczy wyłącznie niezgodności lub nieprawidłowego wykonania usługi personalizacji w stosunku do zawartej umowy i zaakceptowanego projektu.</p>
          <p>8. Bonusy dołączane do zamówienia mają charakter gratisowy i nie stanowią przedmiotu sprzedaży ani reklamacji.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§8. Odpowiedzialność Sprzedawcy</h3>
          <p className="mb-2">1. Sprzedawca nie ponosi odpowiedzialności za:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>wykorzystanie karty przez Klienta w sposób niezgodny z jej kolekcjonerskim charakterem,</li>
            <li>dalszą odsprzedaż produktu przez Klienta,</li>
            <li>użycie produktu w celach komercyjnych lub turniejowych,</li>
            <li>decyzje i działania osób trzecich na zewnętrznych platformach.</li>
          </ul>
          <p>2. Sprzedawca ponosi odpowiedzialność wyłącznie za prawidłowe wykonanie usługi artystycznej zgodnie z umową.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§9. Ochrona prywatności</h3>
          <p className="mb-2">1. Administratorem danych osobowych Klientów jest Sprzedawca.</p>
          <p className="mb-2">2. Dane osobowe przetwarzane są wyłącznie w celu realizacji zamówień oraz kontaktu z Klientem.</p>
          <p className="mb-2">3. Dane przechowywane są maksymalnie przez 5 lat, w zakresie niezbędnym do celów księgowych i dowodowych.</p>
          <p>4. Szczegółowe zasady przetwarzania danych zawarte są w Polityce Prywatności dostępnej na stronie Sklepu.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§10. Pozasądowe sposoby rozstrzygania sporów</h3>
          <p className="mb-2">1. Konsument ma prawo skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń.</p>
          <p>2. Sprzedawca deklaruje wolę polubownego rozwiązywania ewentualnych sporów z Klientami.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-poke-dark mb-3 border-b border-gray-200 pb-1">§11. Zmiany regulaminu</h3>
          <p className="mb-2">1. Sprzedawca zastrzega sobie prawo do zmiany Regulaminu z ważnych przyczyn.</p>
          <p>2. Do umów zawartych przed zmianą Regulaminu stosuje się wersję obowiązującą w chwili złożenia zamówienia.</p>
        </section>

      </div>
    </div>
  );
};

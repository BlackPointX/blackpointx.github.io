
import { Product } from '../types';

// Zmieniamy mockData na pustą listę lub pojedynczą kartę informacyjną.
// Dzięki temu nie będziesz widział losowych Pokemonów, jeśli połączenie z Arkuszem zawiedzie.

export const products: Product[] = [
  {
    id: 'error-placeholder',
    name: 'Błąd Połączenia',
    description: 'Nie udało się pobrać produktów z Google Sheets. Sprawdź czy wkleiłeś poprawny adres URL skryptu w pliku App.tsx oraz czy Twój Arkusz ma zakładkę "Produkty".',
    price: 0,
    images: ['https://placehold.co/400x560/2B292C/FFF?text=BRAK+POŁĄCZENIA'],
    author: 'System',
    source: 'System',
    isAi: false,
    stock: 0
  }
];

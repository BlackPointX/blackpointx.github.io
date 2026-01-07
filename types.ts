
export interface Product {
  id: string; // Unikalne ID w aplikacji (np. "5_mewtwo-ex")
  sheetId?: string; // Oryginalne ID z arkusza (np. "5")
  name: string;
  description: string;
  price: number;
  images: string[];
  author: string; 
  source: string; 
  isAi: boolean;
  stock: number; 
  preorderDate?: string; 
}

export interface Move {
  id: string;
  type: 'attack' | 'ability';
  name: string;
  description: string;
  damage: string;
  cost: string[]; // Tablica typów energii np. ['Fire', 'Colorless']
}

export interface CustomCardData {
  cardType: 'pokemon' | 'trainer';
  name: string;
  subject: string; 
  
  // Nowe pola z gry
  set: string;     
  subtype: string; 
  type: string;    
  hp: string;
  
  moves: Move[];   
  
  // Pola opcjonalne/dodatkowe
  trainerSubtype?: string;
  flavorText?: string;
  illustrator?: string;
  
  // Dane kontaktowe i pliki
  email?: string;
  images?: string[]; 
  imageUrl?: string;
  referenceLink?: string;
}

export interface CartItem extends Product {
  quantity: number;
  customData?: CustomCardData;
}

export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  paczkomatCode: string;
  paczkomatAddress: string;
  discountCode?: string;
  discountValue?: number;
}

export type AppScreen = 'shop' | 'checkout' | 'success' | 'custom-order' | 'about' | 'status' | 'gallery' | 'terms' | 'privacy';

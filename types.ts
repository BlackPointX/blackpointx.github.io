
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  type: 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Psychic' | 'Dark' | 'Dragon' | 'Fairy' | 'Normal' | 'Custom' | string;
  rarity: 'Common' | 'Rare' | 'Legendary';
}

export interface CustomCardData {
  cardType: 'pokemon' | 'trainer';
  name: string;
  subject: string;
  type: string;
  hp?: string;
  trainerSubtype?: string;
  referenceLink?: string;
  cardNumber?: string;
  attacks?: string;
  flavorText?: string;
  email?: string;
  userImage?: boolean; // simple flag if they clicked upload
}

export interface CartItem extends Product {
  quantity: number;
  customData?: CustomCardData;
}

export interface UserData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

export type AppScreen = 'shop' | 'checkout' | 'success' | 'custom-order' | 'about';

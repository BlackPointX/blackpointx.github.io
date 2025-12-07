import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Charizard X Custom',
    description: 'Ręcznie malowana karta z efektem holograficznym. Płomienie świecą w ciemności. Wykonana techniką 3D z użyciem żywicy epoksydowej dla podkreślenia głębi ognia.',
    price: 150.00,
    images: [
      'https://picsum.photos/400/560?random=1',
      'https://picsum.photos/400/560?random=101',
      'https://picsum.photos/400/560?random=201'
    ],
    type: 'Fire',
    rarity: 'Legendary'
  },
  {
    id: '2',
    name: 'Mecha Blastoise',
    description: 'Futurystyczna wersja wodnego startera. Metaliczne wykończenie z elementami folii chromowanej. Idealna do kolekcji Sci-Fi.',
    price: 120.00,
    images: [
      'https://picsum.photos/400/560?random=2',
      'https://picsum.photos/400/560?random=102'
    ],
    type: 'Water',
    rarity: 'Rare'
  },
  {
    id: '3',
    name: 'Forest Guardian Venusaur',
    description: 'Karta teksturowana, wykonana z papieru czerpanego z zatopionymi płatkami kwiatów. Ekologiczny design.',
    price: 110.00,
    images: [
      'https://picsum.photos/400/560?random=3',
      'https://picsum.photos/400/560?random=103'
    ],
    type: 'Grass',
    rarity: 'Rare'
  },
  {
    id: '4',
    name: 'Shadow Mewtwo',
    description: 'Mroczna energia emanuje z tej karty. Edycja limitowana z efektem "negative space".',
    price: 250.00,
    images: [
      'https://picsum.photos/400/560?random=4',
      'https://picsum.photos/400/560?random=104',
      'https://picsum.photos/400/560?random=204'
    ],
    type: 'Psychic',
    rarity: 'Legendary'
  },
  {
    id: '5',
    name: 'Pixel Pikachu',
    description: 'Stylizowana na retro gry 8-bit. Wykończenie matowe z błyszczącymi pikselami.',
    price: 45.00,
    images: [
      'https://picsum.photos/400/560?random=5',
      'https://picsum.photos/400/560?random=105'
    ],
    type: 'Electric',
    rarity: 'Common'
  },
  {
    id: '6',
    name: 'Ancient Dragonite',
    description: 'Stylizowana na starożytne malowidła jaskiniowe. Gruby karton przypominający kamień.',
    price: 180.00,
    images: [
      'https://picsum.photos/400/560?random=6',
      'https://picsum.photos/400/560?random=106'
    ],
    type: 'Dragon',
    rarity: 'Rare'
  },
  {
    id: '7',
    name: 'Nebula Gengar',
    description: 'Karta z głębokim efektem kosmosu. Użyto farb fluorescencyjnych.',
    price: 135.00,
    images: [
      'https://picsum.photos/400/560?random=7',
      'https://picsum.photos/400/560?random=107'
    ],
    type: 'Dark',
    rarity: 'Rare'
  },
  {
    id: '8',
    name: 'Cyber Eevee',
    description: 'Eevee w cybernetycznym pancerzu. Wypukłe elementy obwodów scalonych.',
    price: 50.00,
    images: [
      'https://picsum.photos/400/560?random=8',
      'https://picsum.photos/400/560?random=108'
    ],
    type: 'Normal',
    rarity: 'Common'
  },
];

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'Fire': return 'bg-red-500';
    case 'Water': return 'bg-blue-500';
    case 'Grass': return 'bg-green-500';
    case 'Electric': return 'bg-yellow-400';
    case 'Psychic': return 'bg-purple-500';
    case 'Dark': return 'bg-gray-800 text-white';
    case 'Dragon': return 'bg-indigo-600 text-white';
    case 'Fairy': return 'bg-pink-400';
    case 'Normal': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};
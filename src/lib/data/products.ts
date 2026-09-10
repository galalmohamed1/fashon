import { Review } from '../../types';

export const REVIEWS_DATA: Record<string, Review[]> = {
  default: [
    {
      id: 'rev-1',
      author: 'Marcus Vance',
      rating: 5,
      date: 'August 14, 2026',
      verified: true,
      title: 'Best heavyweight tee on the market by far',
      comment: 'The collar does not bacon at all. The 280 GSM weight creates the most architectural silhouette I have seen from any luxury streetwear house. Drapes effortlessly.',
      sizePurchased: 'L',
      colorPurchased: 'Obsidian Black'
    },
    {
      id: 'rev-2',
      author: 'Elena Rostova',
      rating: 5,
      date: 'August 22, 2026',
      verified: true,
      title: 'Insane build quality and packaging',
      comment: 'The unboxing felt like purchasing a futuristic luxury tech device. Heavy cotton, clean seams, and fits true to oversized aesthetic.',
      sizePurchased: 'M',
      colorPurchased: 'Pure White'
    },
    {
      id: 'rev-3',
      author: 'Kai Tanaka',
      rating: 5,
      date: 'July 29, 2026',
      verified: true,
      title: 'Worth every single penny',
      comment: 'Washed it 6 times already and zero shrinkage or color fade. The tactile feel is premium. Getting another 2 colors immediately.',
      sizePurchased: 'XL',
      colorPurchased: 'Mineral Gray'
    }
  ]
};

export const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop',
    tag: '@THREADX_STUDIO',
    likes: '14.2K',
    comments: '342'
  },
  {
    id: 'ig-2',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    tag: '#THREADXIDENTITY',
    likes: '9.8K',
    comments: '188'
  },
  {
    id: 'ig-3',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    tag: '#CYBERESSENTIALS',
    likes: '22.1K',
    comments: '604'
  },
  {
    id: 'ig-4',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    tag: '@TOKYO_DROP',
    likes: '11.5K',
    comments: '219'
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    tag: '#TACTICALMONO',
    likes: '18.7K',
    comments: '412'
  },
  {
    id: 'ig-6',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    tag: '@THREADX_RUNWAY',
    likes: '15.9K',
    comments: '298'
  }
];

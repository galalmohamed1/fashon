export type Category = 'all' | 't-shirts' | 'hoodies' | 'jackets' | 'pants' | 'accessories';

export type CollectionName = 'CORE 2026' | 'CYBER ESSENTIALS' | 'TACTICAL MONOCHROME' | 'LIMITED DROP' | 'TOKYO ATELIER';

export interface ProductColor {
  name: string;
  hex: string;
  border?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  sizePurchased: string;
  colorPurchased: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  collection: CollectionName;
  image: string;
  hoverImage: string;
  gallery: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  materials: string[];
  features: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
  stockCount?: number;
  tag?: string;
  reviews?: Review[];
}

export interface ProductFilterParams {
  category?: Category;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStockOnly?: boolean;
  searchQuery?: string;
}

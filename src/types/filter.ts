import { Category } from './category';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

export interface FilterState {
  category: Category;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  collection: string;
  sortBy: SortOption;
  searchQuery: string;
  onlyInStock: boolean;
}

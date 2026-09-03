import { Category } from './product';

export type PageView =
  | 'home'
  | 'shop'
  | 'collections'
  | 'product'
  | 'product-detail'
  | 'about'
  | 'cart'
  | 'checkout'
  | 'wishlist';

export interface NavItem {
  label: string;
  page: PageView;
  category?: Category;
  badge?: string;
}

export interface BreadcrumbItem {
  label: string;
  page?: PageView;
  active?: boolean;
}

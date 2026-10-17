export interface ProductImage {
  public_id: string;
  secure_url: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category?: string | { _id: string; name: string; slug: string } | null;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number;
  images: ProductImage[];
  category: { _id: string; name: string; slug: string } | null;
  subCategory: SubCategory;
  averageRating: number;
  numReviews: number;
  sizes: string[];
  colors: string[];
  isFeatured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  stock: number;
  __v: number;
}

export interface ProductColor {
  name: string;
  hex?: string;
  border?: boolean;
}

export interface ProductSize {
  name: string;
}

export interface ProductsResponse {
  data: Product[];
}

export interface ApiListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}
 
export interface ApiSingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
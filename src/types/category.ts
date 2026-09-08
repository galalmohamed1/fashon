export interface Category {
  _id: string;
  name: string;
  slug: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubCategory {
  _id: string;
  name: string;
  category: string | Category | null;
  slug: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
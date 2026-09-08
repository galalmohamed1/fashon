import { ApiListResponse, ApiSingleResponse, SubCategory } from "@/types/product";

// GET /api/sub-categories
export async function getSubCategories(): Promise<SubCategory[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sub-categories`);
    const data: ApiListResponse<SubCategory> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch sub-categories');
  }
}
 
// GET /api/sub-categories/:id
export async function getSingleSubCategory(id: string): Promise<SubCategory> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sub-categories/${id}`);
    const data: ApiSingleResponse<SubCategory> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch sub-category');
  }
}
 
// GET /api/sub-categories/category/:categoryId
export async function getSubCategoriesByCategory(categoryId: string): Promise<SubCategory[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sub-categories/category/${categoryId}`);
    const data: ApiListResponse<SubCategory> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch sub-categories for this category');
  }
}
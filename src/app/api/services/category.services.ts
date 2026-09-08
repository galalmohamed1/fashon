import { Category } from "@/types/category";
import { ApiListResponse, ApiSingleResponse } from "@/types/product";

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
    const data: ApiListResponse<Category> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch categories');
  }
}
 
// GET /api/categories/:id
export async function getSingleCategory(id: string): Promise<Category> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${id}`);
    const data: ApiSingleResponse<Category> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch category');
  }
}
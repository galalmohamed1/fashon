import { Category } from "@/types/category";
import { ApiListResponse, ApiSingleResponse } from "@/types/product";

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`https://backend-lamsa.vercel.app/api/categories`);
    const data: ApiListResponse<Category> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch categories');
  }
}
 
// GET /api/categories/:id
export async function getSingleCategory(id: string): Promise<Category> {
  try {
    const res = await fetch(
      `https://backend-lamsa.vercel.app/api/categories/${id}`,
    );
    const data: ApiSingleResponse<Category> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch category');
  }
}
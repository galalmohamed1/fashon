import { Product, ProductsResponse } from "@/types/product";

export async function getAllProdects(): Promise<Product[] | undefined> {
    try {
        const res = await fetch(
          `https://backend-lamsa.vercel.app/api/products`,
          
        );
        const data: ProductsResponse = await res.json();
        return data.data;
    } catch {
        return undefined
    }
}

export async function getSingelProdect(id: string): Promise<Product>{
    try {
        const res = await fetch(
          `https://backend-lamsa.vercel.app/api/products/${id}`,
        );
        const data = await res.json();
        return data.data;
    } catch (error) {
    throw new Error('Failed to fetch product');
    }
}


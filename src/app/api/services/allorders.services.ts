// import { authOptions } from "@/app/next-auth/authOptions";
// import { ProductsResponse } from "@/types/product";
// import { getServerSession } from "next-auth";

// export async function getAllOrders(): Promise<ProductsResponse> {
//     const session = await getServerSession(authOptions);
//     const userId = session?.id;
//     const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`);
//     const data = await res.json();
//     return data;

// } 
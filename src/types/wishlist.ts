import { Product } from "./product";

export interface WishlistItem {
  _id: string;
  user: string;
  product: string | Product;
  createdAt: string;
  updatedAt: string;
}
 
// Body you send when adding an item to the wishlist (POST /api/wishlist/)
export interface AddToWishlistPayload {
  productId: string;
}
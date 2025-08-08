import type { Product } from "./productTypes";
import type { Customer } from "./customerTypes";

export interface Wishlist {
  id: number;
  customer: Customer;
  products: Product[];
}

export interface WishlistState {
  wishlist: Wishlist | null;
  loading: boolean;
  error: string | null;
}

// Payload interfaces for async thunks
export interface AddProductToWishlistPayload {
  wishlistId: number;
  productId: number;
}

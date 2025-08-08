import type { Product } from "./productTypes";
import type { Customer } from "./customerTypes";

export interface Review {
  id: number;
  reviewText: string;
  rating: number;
  customer: Customer;
  product: Product;
  productImages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  reviewText: string;
  reviewRating: number;
}

export interface ApiResponse {
  message: string;
  status: boolean;
}

export interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  reviewCreated: boolean;
  reviewUpdated: boolean;
  reviewDeleted: boolean;
}

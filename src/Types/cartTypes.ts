import type { Product } from './productTypes';
import { Customer } from './customerTypes';

export interface CartItem{
    id: number;
    cart?: Cart;
    product: Product;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number;
    customerId: number;
}


export interface Cart {
    id: number;
    customer: Customer;
    cartItems: CartItem[];
    totalSellingPrice: number;
    totalMrpPrice: number;
    discount: number;
    couponCode: string | null;

}
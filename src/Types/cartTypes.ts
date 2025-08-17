
import type { Product } from "./productTypes";
import type { Customer } from "./customerTypes";

export interface CartItem {
    id: number;
    cart?: Cart;
    product: Product;
    size: string;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number;
    customerId: number;
}


export interface Cart {
    id: number;
    customser: Customer;
    cartItems: CartItem[];
    totalSellingPrice: number;
    totalItem: number;
    totalMrpPrice: number;
    discount: number;

    couponCode: string | null;
    couponPrice: number | null;
}

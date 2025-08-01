import { Customer } from "./customerTypes";
import { Address } from "./addressTypes";
import { Product } from "./productTypes";

export interface OrderState {
    orders: Order[];
    orderItem: OrderItem | null;
    currentOrder: Order | null;
    paymentOrder: any | null;
    loading: boolean;
    error: string | null;
    orderCancelled: boolean;
}

export interface Order {
    id: number;
    orderId: string;
    customer: Customer;
    orderItems: OrderItem[];
    orderDate: string;
    shippingAddress: Address;
    paymentDetails: any;
    totalMrpPrice: number;
    totalSellingPrice?: number; // Optional, as it may not be present in all orders
    discount?: number; // Optional, as it may not be present in all orders
    orderStatus: OrderStatus;
    totalItem: number;
    deliverDate: string;
}

export enum OrderStatus {
    PENDING = "PENDING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

export interface OrderItem {
    id: number;
    order: Order;
    product: Product;
    size: string;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number;
    customerId: number;
}
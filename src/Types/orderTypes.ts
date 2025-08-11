import type { Product } from './productTypes';
import type { Address, Customer } from './customerTypes';

export interface OrderState {
    orders: Order[];
    orderItem: OrderItem | null;
    currentOrder: Order | null;
    paymentOrder: any | null;
    loading: boolean;
    error: string | null;
    orderCanceled: boolean
}

export interface Order {
    id: number;
    orderId: string;
    customer: Customer;
    sellerId: number;
    orderItems: OrderItem[];
    orderDate: string;
    shippingAddress: Address;
    paymentDetails: any;
    totalMrpPrice: number;
    totalSellingPrice?: number; // Optional field
    discount?: number; // Optional field
    orderStatus: OrderStatus;
    totalItem: number;
    deliverDate: string;
    packedDate?: string;
}
//@ts-ignore
export enum OrderStatus {
    PENDING = 'PENDING',
    PLACE = 'PLACED',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
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

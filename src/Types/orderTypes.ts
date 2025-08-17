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
    paymentDetails: PaymentDetails;
    paymentStatus: PaymentStatus;
    totalMrpPrice: number;
    totalSellingPrice?: number; // Optional field
    discount?: number; // Optional field
    orderStatus: OrderStatus;
    totalItem: number;
    packedDate?: string | null;  // có thể null tới khi PACKED
    deliverDate?: string | null; // có thể null tới khi DELIVERED
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
// embed giống @Embeddable PaymentDetails của BE
export interface PaymentDetails {
    paymentMethod: PaymentMethod;
}
//@ts-ignore
export enum PaymentMethod {
    COD = 'COD',
    STRIPE = 'STRIPE',
    PAYPAL = 'PAYPAL',
}
//@ts-ignore
export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
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

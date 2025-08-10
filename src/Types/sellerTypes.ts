// src/types/seller.ts

export interface PickupAddress {
    name: string;
    mobile: string;
    postalCode: string;
    street: string;
    locality: string;
    city: string;
    state: string;
}

export interface BankDetails {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
}

export interface BusinessDetails {
    businessName: string;
    businessLicenseUrl: string;
}

export interface Account {
    id?: number;
    email: string;
    username: string;
    password: string;
    otp: string;
}

export interface Seller {
    id?: number;
    mobile: string;
    taxCode: string;
    pickupAddress: PickupAddress;
    bankDetails: BankDetails;
    sellerName: string;
    businessDetails: BusinessDetails;
    email?: string;
    accountStatus?: string;
}


export interface SellerReport {
    id: number;
    seller: Seller;
    totalEarnings: number;
    totalSales: number;
    totalRefunds: number;
    totalTax: number;
    netEarnings: number;
    totalOrders: number;
    canceledOrders: number;
    totalTransactions: number;
}
// src/types/seller.ts
export type Page<T> = {
    content: T[];
    number: number;       // 0-based
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};


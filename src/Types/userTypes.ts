// src/types/addressTypes.ts
export interface Address {
    id?: number;
    name: string;
    mobile: string;
    pinCode: string;
    address: string;
    locality: string;
    city: string;
    state: string;
}
//@ts-expect-error
export enum UserRole {
    ROLE_CUSTOMER = 'ROLE_CUSTOMER',
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_SELLER = 'ROLE_SELLER',
}
export interface Account {
    id?: number;
    email: string;
    username: string;
    password: string;
}
//customer
export interface User {
    id?: number;
    fullName: string;
    mobile?: string;
    role: UserRole;
    accountID: Account;
    addresses?: Address[];
}

export interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    profileUpdated: boolean;
}
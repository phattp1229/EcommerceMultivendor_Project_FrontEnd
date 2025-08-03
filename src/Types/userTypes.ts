// src/types/addressTypes.ts
export interface Address {
    id?: number;
    name: string;
    mobile: string;
    postalCode: string;
    street: string;
    locality: string;
    city: string;
    state: string;
}
//@ts-expect-error
export enum UserRole {
    ROLE_CUSTOMER = 'ROLE_CUSTOMER',
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_SELLER = 'ROLE_SELLER',
    ROLE_KOC = 'ROLE_KOC'
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
    account: Account;
    addresses?: Address[];
    koc?: boolean;
    email: string;
    gender?: "MALE" | "FEMALE" | "OTHER" | null; // hoặc string nếu backend để dạng chuỗi
    dob?: string | null; // backend trả kiểu LocalDate → JS nhận là string
}

export interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    profileUpdated: boolean;
}
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
    ownerType?: string; // hoặc AddressOwnerType enum
    ownerId?: number;
}

export interface UserRole {
    id?: number;
    name: string;

}
export interface Account {
    id?: number;
    email: string;
    username: string;
    password: string;
    role: UserRole;
}
//manager or shipper
export interface User {
    id?: number;
    fullName: string;
    mobile?: string;
    account: Account;
    cccd?: string;
    addresses?: Address[];
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
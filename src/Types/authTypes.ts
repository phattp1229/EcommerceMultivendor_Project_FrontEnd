// src/types/authTypes.ts
export interface AuthResponse {
    jwt: string;
    message: string;
    role: string;
}

export interface ApiResponse {
    message: string;
    status: boolean;
}

export interface LoginRequest {
    username: string;
    password: string;
    navigate: (path: string) => void; // rõ ràng hơn so với `any`
}

export interface SignupRequest {
    email: string;
    fullName: string;
    otp: string;
    navigate: (path: string) => void;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface AuthState {
    jwt: string | null;
    role: string | null;
    loading: boolean;
    error: string | null;
    otpSent: boolean
    isLoggedIn: boolean;
}

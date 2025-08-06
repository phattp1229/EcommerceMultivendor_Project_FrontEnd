// src/slices/sellerAuthSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../Config/Api';

import type {
    AuthResponse,
    LoginRequest,
    AuthState,
} from '../../types/authTypes';
import type { RootState } from '../Store';

import { resetUserState } from '../Customer/UserSlice'; // Nếu seller cũng xài chung userSlice

// Lấy token từ localStorage
// const savedJwt = localStorage.getItem("jwt");

const initialState: AuthState = {
    jwt: null,
    role: null,
    loading: false,
    error: null,
    otpSent: false,
    isLoggedIn: false
};



const API_URL = '/auth';

export const sellerLogin = createAsyncThunk<AuthResponse, LoginRequest>(
    'sellerAuth/login',
    async (data: { username: string; password: string, navigate: any }, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>(`${API_URL}/sellers/login`, data);
            console.log("Seller login successful", response.data);

            // Lưu JWT vào localStorage đúng key
            localStorage.setItem("jwt", response.data.jwt);

            // Chuyển trang sau khi login
            data.navigate("/seller");

            return response.data;
        } catch (error: any) {
            console.log("Seller login error:", error.response?.data);
            const backendError = error.response?.data?.error || "Seller login failed";
            return rejectWithValue(backendError);
        }
    }
);


const sellerAuthSlice = createSlice({
    name: 'sellerAuth',
    initialState,
    reducers: {
        sellerLogout: (state) => {
            // localStorage.removeItem('jwt');
            state.jwt = null;
            state.role = null;
            state.isLoggedIn = false;
            localStorage.clear()
            console.log("Seller logout successful!");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sellerLogin.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(sellerLogin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.jwt = action.payload.jwt;
                state.role = action.payload.role;
                state.loading = false;
                state.isLoggedIn = true;

            })
            .addCase(sellerLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { sellerLogout } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;


export const performSellerLogout = () => async (dispatch: any) => {
    dispatch(sellerLogout());
    dispatch(resetUserState());
    // dispatch(resetCartState()); // nếu có
};

export const selectSellerAuth = (state: RootState) => state.sellerAuth;
export const selectSellerAuthLoading = (state: RootState) => state.sellerAuth.loading;
export const selectSellerAuthError = (state: RootState) => state.sellerAuth.error;

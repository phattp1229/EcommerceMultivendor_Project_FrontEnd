
import { createSlice, createAsyncThunk, type PayloadAction, isRejectedWithValue } from '@reduxjs/toolkit';
import { api } from '../../Config/Api';
import type {
    AuthResponse,
    LoginRequest,
    CustomerSignUpRequest,
    ResetPasswordRequest,
    ApiResponse,
    AuthState,
} from '../../types/authTypes';
import type { RootState } from '../Store';
import { boolean } from 'yup';
import { resetUserState } from './UserSlice';
// import { resetCartState } from './CartSlice';


const initialState: AuthState = {
    jwt: null,
    role: null,
    loading: false,
    error: null,
    otpSent: false,
    isLoggedIn: false

};

// Define the base URL for the API
const API_URL = '/auth';

export const sendLoginSignupOtp = createAsyncThunk<ApiResponse, { email: string }>(
    'auth/sendLoginSignupOtp',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/sent/login-signup-otp`, { email });
            console.log("otp sent successfully", response.data);
            return response.data;
        }


        catch (error: any) {
            console.log("error", error.response)
            return rejectWithValue(error.response.data.error || 'Failed to send OTP');
        }
    }
);
//create customer
export const signup = createAsyncThunk<AuthResponse, CustomerSignUpRequest>(
    'auth/signup',
    async (CustomerSignUpRequest, { rejectWithValue }) => {
        console.log("signup ", CustomerSignUpRequest)
        try {

            const response = await api.post<AuthResponse>(`${API_URL}/signup`, CustomerSignUpRequest);
            CustomerSignUpRequest.navigate("/")
            localStorage.setItem("jwt", response.data.jwt)
            return response.data;
        }


        catch (error: any) {
            const errorMsg = error.response?.data?.error || "Signup failed";
            return rejectWithValue(errorMsg); // trả lỗi custom
        }
    }
);
//login
export const signin = createAsyncThunk<AuthResponse, LoginRequest>(
    'auth/signin',
    async (loginRequest, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>(`${API_URL}/signin`, loginRequest);
            console.log("login successful", response.data)
            localStorage.setItem("jwt", response.data.jwt)
            loginRequest.navigate("/");
            return response.data;
        }

        catch (error: any) {
            console.log("Error from backend:", error.response?.data);
            const backendError = error.response?.data?.error || "Signin failed";
            return rejectWithValue(backendError); // trả error từ backend
        }
    }
);

export const resetPassword = createAsyncThunk<ApiResponse, ResetPasswordRequest>(
    'auth/resetPassword',
    async (resetPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse>(`${API_URL}/reset-password`, resetPasswordRequest);
            return response.data;
        }


        catch (error: any) {
            return rejectWithValue('Reset password failed');
        }
    }
);

export const resetPasswordRequest = createAsyncThunk<ApiResponse, { email: string }>(
    'auth/resetPasswordRequest',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse>(`${API_URL}/reset-password-request`, { email });
            return response.data;
        }


        catch (error: any) {
            return rejectWithValue('Reset password request failed');
        }
    }
);
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.jwt = null;
            state.role = null;
            state.isLoggedIn = false;
            localStorage.clear()
            console.log("logout successful !!")
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(sendLoginSignupOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendLoginSignupOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(sendLoginSignupOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.jwt = action.payload.jwt;
                state.role = action.payload.role;
                state.loading = false;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.jwt = action.payload.jwt;
                state.role = action.payload.role;
                state.loading = false;
                state.isLoggedIn = true;
            })
            .addCase(signin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(resetPasswordRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPasswordRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPasswordRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;


export default authSlice.reducer;



export const performLogout = () => async (dispatch: any) => {
    dispatch(logout());
    dispatch(resetUserState());
    // dispatch(resetCartState());
};

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../Config/Api"; // <-- dùng instance đã cấu hình
interface DashboardData {
    totalConfirmed: number;
    totalPending: number;
    totalCancelled: number;
    totalPaid: number;
}

interface CommissionState {
    dashboard: DashboardData | null;
    history: any[];
    loading: boolean;
    error: string | null;
}

const initialState: CommissionState = {
    dashboard: null,
    history: [],
    loading: false,
    error: null,
};

export const fetchKocDashboard = createAsyncThunk(
    "kocCommission/fetchDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwt");
            const res = await api.get("/api/koc/commission/dashboard", {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || "Error loading dashboard");
        }
    }
);

export const fetchKocHistory = createAsyncThunk(
    "kocCommission/fetchHistory",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwt");
            const res = await api.get("/api/koc/commission/history", {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || "Error loading history");
        }
    }
);

const kocCommissionSlice = createSlice({
    name: "kocCommission",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchKocDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchKocDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboard = action.payload;
            })
            .addCase(fetchKocDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchKocHistory.fulfilled, (state, action) => {
                state.history = action.payload;
            });
    },
});

export default kocCommissionSlice.reducer;

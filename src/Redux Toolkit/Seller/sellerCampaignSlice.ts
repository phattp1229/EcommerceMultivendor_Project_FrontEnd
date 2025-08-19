// src/Redux Toolkit/Seller/sellerCampaignSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { AffiliateCampaign, CreateAffiliateCampaignRequest } from "../../types/affiliateCampaignTypes";

interface State {
    list: AffiliateCampaign[];
    loading: boolean;
    error: string | null;
}

const initialState: State = { list: [], loading: false, error: null };

export const fetchSellerCampaigns = createAsyncThunk<AffiliateCampaign[], string | void>(
    "sellerCampaign/fetch",
    async (jwtMaybe, { rejectWithValue }) => {
        try {
            const jwt = jwtMaybe ?? (localStorage.getItem("jwt") || "");
            const res = await api.get<AffiliateCampaign[]>("/sellers/campaigns", {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            return res.data;
        } catch (e: any) {
            return rejectWithValue(e?.response?.data || "Fetch campaigns failed");
        }
    }
);

export const createSellerCampaign = createAsyncThunk<
    AffiliateCampaign,
    { data: CreateAffiliateCampaignRequest; jwt?: string }
>(
    "sellerCampaign/create",
    async ({ data, jwt }, { rejectWithValue }) => {
        try {
            const token = jwt ?? (localStorage.getItem("jwt") || "");
            const res = await api.post<AffiliateCampaign>("/sellers/campaigns", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (e: any) {
            return rejectWithValue(e?.response?.data || "Create campaign failed");
        }
    }
);

export const updateSellerCampaign = createAsyncThunk<
    AffiliateCampaign,
    { id: number; updates: Partial<AffiliateCampaign>; jwt?: string }
>(
    "sellerCampaign/update",
    async ({ id, updates, jwt }, { rejectWithValue }) => {
        try {
            const token = jwt ?? (localStorage.getItem("jwt") || "");
            const res = await api.patch<AffiliateCampaign>(`/sellers/campaigns/${id}`, updates, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (e: any) {
            return rejectWithValue(e?.response?.data || "Update campaign failed");
        }
    }
);

export const deleteSellerCampaign = createAsyncThunk<
    number,
    { id: number; jwt?: string }
>(
    "sellerCampaign/delete",
    async ({ id, jwt }, { rejectWithValue }) => {
        try {
            const token = jwt ?? (localStorage.getItem("jwt") || "");
            await api.delete(`/sellers/campaigns/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id;
        } catch (e: any) {
            return rejectWithValue(e?.response?.data || "Delete campaign failed");
        }
    }
);

const slice = createSlice({
    name: "sellerCampaign",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchSellerCampaigns.pending, (s) => { s.loading = true; s.error = null; });
        b.addCase(fetchSellerCampaigns.fulfilled, (s, a: PayloadAction<AffiliateCampaign[]>) => {
            s.loading = false; s.list = a.payload;
        });
        b.addCase(fetchSellerCampaigns.rejected, (s, a) => { s.loading = false; s.error = String(a.payload || a.error.message); });

        b.addCase(createSellerCampaign.fulfilled, (s, a: PayloadAction<AffiliateCampaign>) => {
            s.list.unshift(a.payload);
        });

        b.addCase(updateSellerCampaign.fulfilled, (s, a: PayloadAction<AffiliateCampaign>) => {
            const idx = s.list.findIndex(c => c.id === a.payload.id);
            if (idx !== -1) s.list[idx] = a.payload;
        });

        b.addCase(deleteSellerCampaign.fulfilled, (s, a: PayloadAction<number>) => {
            s.list = s.list.filter(c => c.id !== a.payload);
            s.error = null;
        });

        b.addCase(deleteSellerCampaign.rejected, (s, a) => {
            s.error = String(a.payload || a.error?.message || "Delete failed");
        });
    }
});

export default slice.reducer;

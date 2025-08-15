import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../../Config/Api";
import type { RootState } from "../../Store";
import type { CreateKocRequest, Koc } from "../../../types/kocTypes";

/** ---------------- Customer side ---------------- **/

interface KocStateCustomer {
    creating: boolean;
    error: string | null;
    success: boolean;
    koc?: Koc | null;
}

/** ---------------- Admin side ---------------- **/

export type AccountStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";

export interface KocItem extends Koc {
    // mở rộng nếu BE trả thêm
    joinedAt?: string;
    customer?: {
        id: number;
        fullName?: string;
        mobile?: string;
        account?: { email?: string };
    };
}

interface PageResp<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number; // current page
    size: number;
}

interface KocStateAdmin {
    list: KocItem[];
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    size: number;
    selected?: KocItem | null;
}

/** ---------------- Root slice state ---------------- **/

interface KocState {
    customer: KocStateCustomer;
    admin: KocStateAdmin;
}

const initialState: KocState = {
    customer: {
        creating: false,
        error: null,
        success: false,
        koc: null,
    },
    admin: {
        list: [],
        loading: false,
        error: null,
        total: 0,
        page: 0,
        size: 10,
        selected: null,
    },
};

/** ================= KOC Affiliate Registration Thunks ================== **/
import type { AffiliateRegistrationResponse } from '../../../types/affiliateCampaignTypes';
import axios from 'axios';

// Lấy danh sách đăng ký của KOC
export const fetchKocRegistrations = createAsyncThunk<
    AffiliateRegistrationResponse[],
    void,
    { state: RootState }
>("koc/fetchRegistrations", async (_, { getState, rejectWithValue }) => {
    try {
        const jwt = getState().auth.jwt;
        const res = await axios.get("/api/affiliate-registration/my-registrations", {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        return res.data;
    } catch (e: any) {
        return rejectWithValue(e?.response?.data || e?.message || "Failed to fetch registrations");
    }
});

// Đăng ký chiến dịch
export const registerKocCampaign = createAsyncThunk<
    any,
    number,
    { state: RootState }
>("koc/registerCampaign", async (campaignId, { getState, rejectWithValue }) => {
    try {
        const jwt = getState().auth.jwt;
        const res = await axios.post(`/api/affiliate-registration/register-campaign/${campaignId}`, {}, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        return res.data;
    } catch (e: any) {
        return rejectWithValue(e?.response?.data || e?.message || "Failed to register campaign");
    }
});

/** ================= Thunks ================== **/

// Customer: sign up KOC
export const createKoc = createAsyncThunk<
    Koc,
    { jwt: string; data: CreateKocRequest },
    { rejectValue: string }
>("koc/create", async ({ jwt, data }, { rejectWithValue }) => {
    try {
        const res = await api.post("/api/koc/create", data, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        return res.data as Koc;
    } catch (e: any) {
        return rejectWithValue(
            e?.response?.data || e?.message || "Failed to sign up KOC"
        );
    }
});

// Admin: fetch list
export const adminFetchKoc = createAsyncThunk<
    PageResp<KocItem>,
    { jwt: string; status?: AccountStatus; page?: number; size?: number },
    { rejectValue: string }
>("koc/adminFetchAll", async ({ jwt, status, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
        const params: any = { page, size };
        if (status) params.status = status;
        const res = await api.get("/admin/koc", {
            params,
            headers: { Authorization: `Bearer ${jwt}` },
        });
        return res.data as PageResp<KocItem>;
    } catch (e: any) {
        return rejectWithValue(e?.response?.data || "Failed to load KOC");
    }
});

// Admin: update status
export const adminUpdateKocStatus = createAsyncThunk<
    KocItem,
    { jwt: string; id: number; status: AccountStatus },
    { rejectValue: string }
>("koc/adminUpdateStatus", async ({ jwt, id, status }, { rejectWithValue }) => {
    try {
        const res = await api.patch(`/admin/koc/${id}/status/${status}`, null, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        return res.data as KocItem;
    } catch (e: any) {
        return rejectWithValue(e?.response?.data || "Failed to update status");
    }
});

/** ================= Slice ================== **/

const kocSlice = createSlice({
    name: "koc",
    initialState,
    reducers: {
        resetKocState: (s) => {
            s.customer.creating = false;
            s.customer.error = null;
            s.customer.success = false;
            // không đụng admin state
        },
        adminResetKocError: (s) => {
            s.admin.error = null;
        },
    },
    extraReducers: (b) => {
        /** Customer create **/
        b.addCase(createKoc.pending, (s) => {
            s.customer.creating = true;
            s.customer.error = null;
            s.customer.success = false;
        });
        b.addCase(createKoc.fulfilled, (s, a: PayloadAction<Koc>) => {
            s.customer.creating = false;
            s.customer.success = true;
            s.customer.koc = a.payload;
        });
        b.addCase(createKoc.rejected, (s, a) => {
            s.customer.creating = false;
            s.customer.error = (a.payload as string) || "Failed";
        });

        /** Admin list **/
        b.addCase(adminFetchKoc.pending, (s) => {
            s.admin.loading = true;
            s.admin.error = null;
        });
        b.addCase(adminFetchKoc.fulfilled, (s, a: PayloadAction<PageResp<KocItem>>) => {
            s.admin.loading = false;
            s.admin.list = a.payload.content;
            s.admin.total = a.payload.totalElements;
            s.admin.page = a.payload.number;
            s.admin.size = a.payload.size;
        });
        b.addCase(adminFetchKoc.rejected, (s, a) => {
            s.admin.loading = false;
            s.admin.error = (a.payload as string) || "Failed";
        });

        /** Admin update status **/
        b.addCase(adminUpdateKocStatus.fulfilled, (s, a: PayloadAction<KocItem>) => {
            const i = s.admin.list.findIndex((x) => x.id === a.payload.id);
            if (i >= 0) s.admin.list[i] = a.payload;
            if (s.admin.selected?.id === a.payload.id) {
                s.admin.selected = a.payload;
            }
        });
    },
});

export const { resetKocState, adminResetKocError } = kocSlice.actions;
export default kocSlice.reducer;

/** ================= Selectors ================== **/

// customer
export const selectKocCreating = (s: RootState) => s.koc.customer.creating;
export const selectKocError = (s: RootState) => s.koc.customer.error;
export const selectKocSuccess = (s: RootState) => s.koc.customer.success;

// admin
export const selectKocAdminList = (s: RootState) => s.koc.admin.list;
export const selectKocAdminLoading = (s: RootState) => s.koc.admin.loading;
export const selectKocAdminError = (s: RootState) => s.koc.admin.error;
export const selectKocAdminPage = (s: RootState) => s.koc.admin.page;
export const selectKocAdminSize = (s: RootState) => s.koc.admin.size;
export const selectKocAdminTotal = (s: RootState) => s.koc.admin.total;

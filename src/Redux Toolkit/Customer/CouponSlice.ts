import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart } from "../../types/cartTypes";
import { api } from "../../Config/Api";
import type { Coupon, CouponState } from "../../types/couponTypes";

const initialState: CouponState = {
  coupons: [],
  cart: null,
  loading: false,
  error: null,
  couponCreated: false,
  couponApplied: false,
};

const API_URL = "api/coupons";

// ✅ Fetch tất cả coupons
export const fetchAllCoupons = createAsyncThunk<
  Coupon[],
  string,
  { rejectValue: string }
>("coupon/fetchAllCoupons", async (jwt, { rejectWithValue }) => {
  try {
    const response = await api.get(`${API_URL}/admin/all`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("Fetched coupons: ", response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch coupons");
  }
});

// ✅ Apply coupon
export const applyCoupon = createAsyncThunk<
  Cart,
  {
    apply: string;
    code: string;
    orderValue: number;
    jwt: string;
  },
  { rejectValue: string }
>(
  "coupon/applyCoupon",
  async ({ apply, code, orderValue, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/apply`, null, {
        params: { apply, code, orderValue },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("Coupon applied successfully", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error applying coupon:", error.response);
      return rejectWithValue(
        error.response?.data?.error || "Failed to apply coupon"
      );
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAllCoupons
      .addCase(fetchAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(
        fetchAllCoupons.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch coupons";
        }
      )

      // applyCoupon
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.couponApplied = false;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        if (action.meta.arg.apply == "true") {
          state.couponApplied = true;
        }
      })
      .addCase(
        applyCoupon.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to apply coupon";
          state.couponApplied = false;
        }
      );
  },
});

export default couponSlice.reducer;

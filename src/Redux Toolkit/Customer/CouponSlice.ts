import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart } from "../../types/cartTypes";
import { api } from "../../Config/Api";
import type { CouponState } from "../../types/couponTypes";

// Initial state
const initialState: CouponState = {
  coupons: [],
  cart: null,
  loading: false,
  error: null,
  couponCreated: false,
  couponApplied: false,

};

const API_URL = "api/coupons";

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
      return rejectWithValue(error.response?.data?.error || 'Failed to apply coupon');
    }
  }
);


// Slice
const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.couponApplied = false;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;

        if (action.meta.arg.apply == "true") {
          state.couponApplied = true
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

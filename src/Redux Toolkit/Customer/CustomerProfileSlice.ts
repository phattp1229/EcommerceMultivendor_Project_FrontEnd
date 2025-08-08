// src/slices/CustomerSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { Customer, CustomerState } from "../../types/customerTypes";
import type { RootState } from "../Store";

const initialState: CustomerState = {
  customer: null,
  loading: false,
  error: null,
  profileUpdated: false,
};

// Define the base URL for the API
const API_URL = "/api/customer";

export const fetchCustomerProfile = createAsyncThunk<
  Customer,
  { jwt: string; navigate: any }
>(
  "customer/fetchCustomerProfile",
  async (
    { jwt, navigate }: { jwt: string; navigate: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log(" customer profile ", response.data);
      if (response.data.role === "ROLE_MANAGER") {
        navigate("/admin");
      }
      return response.data;
    } catch (error: any) {
      console.log("error ", error.response);
      return rejectWithValue("Failed to fetch customer profile");
    }
  }
);
export const updateCustomerProfile = createAsyncThunk<
  Customer,
  { jwt: string; data: any },
  { rejectValue: string }
>(
  "customer/updateCustomerProfile",
  async ({ jwt, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/profile`, data, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data; // dữ liệu đã cập nhật
    } catch (error: any) {
      console.log("Update error", error.response);
      console.log("Payload send backend:", data);
      console.log("JWT send:", jwt);
      return rejectWithValue("Failed to update customer profile");
    }
  }
);

const customerProfileSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    resetCustomerState: (state) => {
      state.customer = null;
      state.loading = false;
      state.error = null;
      state.profileUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCustomerProfile.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.customer = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCustomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.profileUpdated = false;
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.customer = action.payload;
        state.loading = false;
        state.profileUpdated = true;
      })
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profileUpdated = false;

      });
  },
});

export const { resetCustomerState } = customerProfileSlice.actions;

export default customerProfileSlice.reducer;

export const selectCustomer = (state: RootState) => state.customer.customer;
export const selectCustomerLoading = (state: RootState) => state.customer.loading;
export const selectCustomerError = (state: RootState) => state.customer.error;

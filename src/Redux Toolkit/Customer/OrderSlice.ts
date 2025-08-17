import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order, OrderItem, OrderState } from "../../types/orderTypes";
import { api } from "../../Config/Api";
import type { Address } from "../../types/customerTypes";
import type { ApiResponse } from "../../types/authTypes";
import axios from "axios";
import type { RootState } from "../Store";


const initialState: OrderState = {
  orders: [],
  orderItem: null,
  currentOrder: null,
  paymentOrder: null,
  loading: false,
  error: null,
  orderCanceled: false,
};

const API_URL = "/api/orders";

// Fetch customer order history
export const fetchCustomerOrderHistory = createAsyncThunk<Order[], string>(
  "orders/fetchCustomerOrderHistory",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get<Order[]>(`${API_URL}/customer`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Customer order history fetched successfully", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching customer order history:", error.response);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch customer order history');
    }
  }
)

// Fetch order by ID
export const fetchOrderById = createAsyncThunk<Order, { jwt: string; orderId: number }>(
  "orders/fetchOrderById",
  async ({ jwt, orderId }, { rejectWithValue }) => {
    try {
      const response = await api.get<Order>(`${API_URL}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Order fetched successfully", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching order by ID:", error.response);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch order by ID');
    }
  }
);

// Create a new order
export const createOrder = createAsyncThunk<
  any,
  { address: Address; jwt: string, paymentGateway: string }>(
    "orders/createOrder",
    async ({ address, jwt, paymentGateway }, { rejectWithValue }) => {
      try {
        const response = await api.post<any>(`${API_URL}`, address,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            params: {
              paymentMethod: paymentGateway,
            }
          }
        );
        console.log("Order created successfully", response.data);
        // 🚀 Nếu là Online (Stripe/PayPal) → redirect sang payment link
        if (response.data.payment_link_url) {
          window.location.href = response.data.payment_link_url;
        }
        // 🚀 Nếu là COD → không có payment_link_url → FE sẽ tự xử lý
        return response.data;
      } catch (error: any) {
        console.error("Error creating order:", error.response);
        return rejectWithValue(error.response?.data?.error || 'Failed to create order');
      }
    }
  );


export const fetchOrderItemById = createAsyncThunk<
  OrderItem,
  { orderItemId: number; jwt: string }>(
    "orders/fetchOrderItemById",
    async ({ orderItemId, jwt }, { rejectWithValue }) => {
      try {
        const response = await api.get<OrderItem>(`${API_URL}/item/${orderItemId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log("Order item fetched successfully", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Error fetching order item by ID:", error.response);
        return rejectWithValue(error.response?.data?.error || 'Failed to fetch order item by ID');
      }
    }
  );


export const paymentSuccessStripe = createAsyncThunk<ApiResponse,
  { paymentId: string; jwt: string; paymentLinkId: string },
  { rejectValue: string }
>('orders/paymentSuccess', async ({ paymentId, jwt }, { rejectWithValue }) => {
  try {
    const isStripe = paymentId.startsWith("cs_"); // kiểm tra stripe
    if (isStripe) {
      const response = await api.post(
        `api/payment/stripe/verify`,
        { sessionId: paymentId },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("Stripe payment verified:", response.data);
      return { message: response.data, status: true }; // chỉnh lại nếu backend trả object khác
    }
    else {
      return rejectWithValue("Invalid payment method");
    }
  } catch (error: any) {
    console.error("Error completing Stripe payment:", error.response);
    return rejectWithValue(error.response?.data?.error || 'Failed to complete Stripe payment');
  }
}
);
//complete COD payment
export const confirmCodPayment = createAsyncThunk<Order, { orderId: number; jwt: string }>(
  "orders/confirmCodPayment",
  async ({ orderId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.patch<Order>(
        `/seller/orders/${orderId}/cod/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      console.log("COD payment confirmed", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to confirm COD payment");
    }
  }
);


export const cancelOrder = createAsyncThunk<Order, any>(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("cancel order ", response.data)
      return response.data;
    } catch (error: any) {
      console.log("error ", error.response)
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while cancelling the order.');
    }
  }
);

interface PaypalCompleteRequest {
  paymentId: string;
  payerId: string;
  paymentOrderId: number;
  jwt: string;
}

export const completePaypalPayment = createAsyncThunk<ApiResponse, PaypalCompleteRequest>(
  "orders/completePaypalPayment",
  async (requestData, { rejectWithValue }) => {
    try {
      const { jwt, ...body } = requestData;
      const response = await api.post(`${API_URL}/paypal/complete`, body, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("PayPal payment completed successfully", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error completing PayPal payment:", error.response);
      return rejectWithValue(error.response?.data?.error || 'Failed to complete PayPal payment');
    }
  }
);



const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user order history
      .addCase(fetchCustomerOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderCanceled = false;
      })
      .addCase(
        fetchCustomerOrderHistory.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.orders = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCustomerOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.currentOrder = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create a new order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.paymentOrder = action.payload;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Order Item by ID
      .addCase(fetchOrderItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderItem = action.payload;
      })
      .addCase(fetchOrderItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // payment success handler
      // --- ADDED: Case reducer cho việc hoàn tất PayPal ---
      .addCase(completePaypalPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completePaypalPayment.fulfilled, (state, action) => {
        state.loading = false;
        console.log('PayPal payment fulfilled:', action.payload);
      })
      .addCase(completePaypalPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // payment success handler for Stripe
      .addCase(paymentSuccessStripe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paymentSuccessStripe.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Payment successful:', action.payload);
      })
      .addCase(paymentSuccessStripe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // ✅ Confirm COD Payment
      .addCase(confirmCodPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmCodPayment.fulfilled, (state, action) => {
        state.loading = false;
        // update currentOrder
        state.currentOrder = action.payload;
        // đồng thời update luôn trong list orders nếu có
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
        console.log("COD payment confirmed:", action.payload);
      })
      .addCase(confirmCodPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderCanceled = false;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
        state.orderCanceled = true;
        state.currentOrder = action.payload
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) => state.orders.currentOrder;
export const selectPaymentOrder = (state: RootState) => state.orders.paymentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
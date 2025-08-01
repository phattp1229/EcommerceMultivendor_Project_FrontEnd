import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { Cart, CartItem } from "../../Types/cartTypes";
import { sumCartItemSellingPrice, sumCartItemsMrpPrice } from "../../customer/util/sumCartItemsMrpPrice";
import { applyCoupon } from "./CouponSlice";


interface CartState{
    cart: Cart | null;
    loading: boolean;
    error: string | null;
}

// Initial state for the cart slice
const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
};

//Base URL for API requests
const API_URL = "/api/cart";

export const fetchCustomerCart = createAsyncThunk<Cart, string>(
    "cart/fetchCustomerCart",
    async (jwt: string, {rejectWithValue}) => {
        try {
            const response = await api.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Customer cart fetched successfully", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching customer cart:", error.response);
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch customer cart');
        }
    }
);


interface AddItemRequest {
    productId: number | undefined;
    size: string;
    quantity: number;
}


export const addItemToCart = createAsyncThunk<CartItem,{ jwt: string | null; request: AddItemRequest}>(
    "cart/addItemToCart", 
    async ({ jwt, request }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_URL}/add`, request, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            console.log("Item added to cart successfully", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error adding item to cart:", error.response);
            return rejectWithValue(error.response?.data?.error || 'Failed to add item to cart');
        }  
});


export const deleteCartItem = createAsyncThunk<any, { jwt: string; cartItemId: number}>(
    "cart/deleteCartItem",
    async ({ jwt, cartItemId }, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${API_URL}/item/${cartItemId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            console.log("Cart item deleted successfully", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error deleting cart item:", error.response);
            return rejectWithValue(error.response?.data?.error || 'Failed to delete cart item');
        }
    }
);


export const updateCartItem = createAsyncThunk<any, { jwt: string | null; cartItemId: number; cartItem: any}>(
    "cart/updateCartItem",
    async ({ jwt, cartItemId, cartItem }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_URL}/item/${cartItemId}`, cartItem, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            console.log("Cart item updated successfully", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error updating cart item:", error.response);
            return rejectWithValue(error.response?.data?.error || 'Failed to update cart item');
        }
    }
);


const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCartState: (state) => {
            state.cart = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomerCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerCart.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCustomerCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //Cart Item
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
                if (state.cart) {
                    state.cart.cartItems.push(action.payload);
                }
                state.loading = false;
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //Delete Cart Item
            .addCase(deleteCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                if(state.cart){
                    state.cart.cartItems = state.cart.cartItems.filter(
                        (item:CartItem) => item.id !== action.meta.arg.cartItemId);
                    
                    const mrpPrice = sumCartItemsMrpPrice(state.cart?.cartItems || [])
                    const sellingPrice = sumCartItemSellingPrice(state.cart?.cartItems || [])
                    state.cart.totalSellingPrice = sellingPrice;
                    state.cart.totalMrpPrice = mrpPrice;
                }

                state.loading = false;
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //Update Cart Item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                if (state.cart) {
                    const index = state.cart.cartItems.findIndex(
                        (item: CartItem) => item.id === action.meta.arg.cartItemId);

                    if (index !== -1) {
                        state.cart.cartItems[index] = {
                            ...state.cart.cartItems[index],
                            ...action.payload,
                        };
                    }
                    
                    const mrpPrice = sumCartItemsMrpPrice(state.cart?.cartItems || []);
                    const sellingPrice = sumCartItemSellingPrice(state.cart?.cartItems || []);  
                    state.cart.totalSellingPrice = sellingPrice;
                    state.cart.totalMrpPrice = mrpPrice;
                }
                state.loading = false;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
            // Apply Coupon
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            });
    },
});

export default CartSlice.reducer;
export const { resetCartState } = CartSlice.actions;

export const selectCart = (state: { cart: CartState }) => state.cart.cart;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

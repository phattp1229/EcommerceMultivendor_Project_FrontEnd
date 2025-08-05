import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import sellerSlice from "./Seller/sellerSlice";
import sellerAuthenticationSlice from "./Seller/sellerAuthenticationSlice";
import AuthSlice from "./Customer/AuthSlice";
import CustomerSlice from "./Customer/Customer/CustomerSlice";
import UserSlice from "./Customer/UserSlice";
import sellerProductSlice from "./Seller/sellerProductSlice";
import ProductSlice from "./Customer/ProductSlice";
import CartSlice from "./Customer/CartSlice";
import CouponSlice from "./Customer/CouponSlice";
import OrderSlice from "./Customer/OrderSlice";
import DealSlice from "./Admin/DealSlice";
import AdminSlice from "./Admin/AdminSlice";
import AdminCouponSlice from "./Admin/AdminCouponSlice";
import sellerOrderSlice from "./Seller/sellerOrderSlice";
import revenueChartSlice from "./Seller/revenueChartSlice";
import transactionSlice from "./Seller/transactionSlice";
import WishlistSlice from "./Customer/WishlistSlice";
import ReviewSlice from "./Customer/ReviewSlice";
const rootReducer = combineReducers({
    // customer
    auth: AuthSlice,
    user: UserSlice,
    homePage: CustomerSlice,
    products: ProductSlice,
    cart: CartSlice,
    orders: OrderSlice,
    coupon: CouponSlice,
    wishlist: WishlistSlice,
    review: ReviewSlice,
    //seller
    sellers: sellerSlice,
    sellerAuth: sellerAuthenticationSlice,
    sellerProduct: sellerProductSlice,
    sellerOrder: sellerOrderSlice,
    transaction: transactionSlice,
    revenueChart: revenueChartSlice,
    // admin
    adminCoupon: AdminCouponSlice,
    adminDeals: DealSlice,
    admin: AdminSlice,
});

const store = configureStore({
    reducer: rootReducer,

    // No need to define middleware unless you're adding custom ones
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

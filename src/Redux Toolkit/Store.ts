import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import sellerSlice from "./Seller/sellerSlice";
import sellerAuthenticationSlice from "./Seller/sellerAuthenticationSlice";
import AuthSlice from "./Customer/AuthSlice";
import CustomerSlice from "./Customer/Customer/CustomerSlice";
import UserSlice from "./Customer/UserSlice";
import sellerProductSlice from "./Seller/sellerProductSlice";
import ProductSlice from "./Customer/ProductSlice";

const rootReducer = combineReducers({
    // customer
    auth: AuthSlice,
    user: UserSlice,
    homePage: CustomerSlice,
    products: ProductSlice,
    //seller
    sellers: sellerSlice,
    sellerAuth: sellerAuthenticationSlice,
    sellerProduct: sellerProductSlice
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

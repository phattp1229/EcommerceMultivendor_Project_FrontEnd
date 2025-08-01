import type { CartItem } from "../../Types/cartTypes";


export const sumCartItemsMrpPrice = (cartItem: CartItem[]) =>{

    return cartItem.reduce((total, item) => total + item.mrpPrice * item.quantity, 0);
}


export const sumCartItemSellingPrice = (cartItem: CartItem[]) =>{
    
    return cartItem.reduce((total, item) => total + item.sellingPrice * item.quantity, 0);
}


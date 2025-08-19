import { Button, Divider, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../util/cartCalculator";
import { useAppSelector } from "../../../Redux Toolkit/Store";

//@ts-ignore
const PricingCard = ({ showBuyButton, SubmitButton }: any) => {
  const navigate = useNavigate();
  const { cart, auth } = useAppSelector((store) => store);
  return (
    <div>
      <div className="space-y-3 p-5">
        <div className="flex justify-between items-center">
          <span className="text-red-700"><strong>Subtotal</strong></span>
         <span className="text-black  text-lg">
  {/* {(sumCartItemSellingPrice(cart.cart?.cartItems || [])).toLocaleString("vi-VN")}đ */}
  {cart.cart?.totalSellingPrice.toLocaleString("vi-VN")}đ
</span>


        </div>
        <div className="flex justify-between items-center">
          <span>Discount</span>
          <span>
           
            {cart.cart?.couponPrice?.toLocaleString("vi-VN")} đ
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span className="text-teal-600"><strong>Free
            </strong></span>
        </div>
        <div className="flex justify-between items-center">
          <span>Platform fee</span>
          <span className="text-teal-600"><strong>Free
            </strong></span>
        </div>
      </div>
      <Divider />

      <div className="font-medium px-5 py-2 flex justify-between items-center">
        <span>Total</span>
        <span className="text-red-600 font-bold text-lg">{cart.cart?.totalSellingPrice.toLocaleString("vi-VN")}đ</span>
      </div>
    </div>
  );
 };
//  sumCartItemSellingPrice(cart.cart?.cartItems || [])
// sumCartItemMrpPrice(cart.cart?.cartItems || [])

export default PricingCard;

import { Button, Divider } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";


const PricingCard = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="space-y-3 p-5">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span>800.000đ</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Discount</span>
          <span>
            100.000đ
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span>30.000đ</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Platform fee</span>
          <span className="text-teal-600">Free</span>
        </div>
      </div>
      <Divider />

      <div className="font-medium px-5 py-2 flex justify-between items-center">
        <span>Total</span>
        <span>730.000đ</span>
      </div>
    </div>
  );
 };
//  sumCartItemSellingPrice(cart.cart?.cartItems || [])
// sumCartItemMrpPrice(cart.cart?.cartItems || [])

export default PricingCard;

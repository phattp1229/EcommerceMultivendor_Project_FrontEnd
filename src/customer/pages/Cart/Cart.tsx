import {
  Alert,
  Button,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { teal } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CartItemCard from "./CartItemCard";
import { useNavigate } from "react-router-dom";
import PricingCard from "./PricingCard";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { Close } from "@mui/icons-material";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [couponCode, setCouponCode] = useState("");

  const [snackbarOpen, setOpenSnackbar] = useState(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    setCouponCode(e.target.value);
  };

  const handleApllyCoupon = (apply: string) => {
    // console.log(couponCode,apply)

    // eslint-disable-next-line no-var
    var code = couponCode;
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <>
        <div className="pt-10 px-5 sm:px-10 md:px-60 lg:px-60 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 ">
            <div className="lg:col-span-2 space-y-3 ">
              {[1,1,1,1,1].map((item) => <CartItemCard/>)}
            </div>

            <div className="col-span-1  text-sm space-y-3">
              <div className="border rounded-md px-5 py-3 space-y-5">
                <div className="">
                  <div className="flex gap-3 text-sm items-center">
                    <LocalOfferIcon sx={{ color: teal[600], fontSize: "17px" }}/>
                    <span>Apply Coupons</span>
                  </div>
                </div>
            {/* eslint-disable-next-line no-constant-condition */}    
            {true ? (
                    <div className="flex justify-between items-center">
                    <TextField id="outlined-basic"
                      value={couponCode}
                      onChange={handleChange}
                      placeholder="coupon code"
                      className=""
                      size="small"
                    />
                    <Button
                      onClick={() => handleApllyCoupon("true")}
                      disabled={couponCode ? false : true}
                      size="small">
                      Apply
                    </Button>
                  </div>
                  ) : (
                  <div className="flex">
                   <div className="p-1 pl-5 pr-3 border rounded-full flex gap-2 items-center">
                      <span className=""> Applied</span>
                      <IconButton
                        onClick={() => handleApllyCoupon("false")}
                        size="small"
                      >
                        <Close className="text-red-600" />
                      </IconButton>
                    </div>
                  </div>
                )}
              </div>

              <section className="border rounded-md">
                <PricingCard />
                <div className="p-5">
                  <Button
                    onClick={() => navigate("/checkout/address")}
                    sx={{ py: "11px" }}
                    variant="contained"
                    fullWidth>
                    BUY NOW
                  </Button>
                </div>
              </section>

              <div className="border rounded-md px-5 py-4 flex justify-between items-center cursor-pointer">
                <span>Add From Whishlist</span>
                <FavoriteIcon sx={{ color: teal[600], fontSize: "21px" }} />
              </div>
            </div>
          </div>
        </div>
       : (
        <div className="h-[85vh] flex justify-center items-center flex-col">
          <div className="text-center py-5">
            <h1 className="text-lg font-medium">hay its feels so light!</h1>
            <p className="text-gray-500 text-sm">
              there is nothing in your bag, lets add some items
            </p>
          </div>
          <Button variant="outlined" sx={{ py: "11px" }}>
            Add Item From Wishlist
          </Button>
        </div>
      )
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={"error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {"Coupon Applied successfully"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;


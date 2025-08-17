import {
  Alert,
  Button,
  IconButton,
  Snackbar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { teal } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Close } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItemCard from "./CartItemCard";
import PricingCard from "./PricingCard";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchCustomerCart } from "../../../Redux Toolkit/Customer/CartSlice";
import { fetchAllCoupons, applyCoupon } from "../../../Redux Toolkit/Customer/CouponSlice";
import type { CartItem } from "../../../types/cartTypes";
import { Box, Paper, Typography } from "@mui/material";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, auth, coupon } = useAppSelector((store) => store);
  const [couponCode, setCouponCode] = useState("");
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomerCart(localStorage.getItem("jwt") || ""));
  }, [auth.jwt]);

  const handleChange = (e: any) => setCouponCode(e.target.value);

  const handleApplyCoupon = (apply: string) => {
    let code = couponCode;
    if (apply === "false") {
      code = cart.cart?.couponCode || "";
    }
    dispatch(
      applyCoupon({
        apply,
        code,
        orderValue: cart.cart?.totalSellingPrice || 100,
        jwt: localStorage.getItem("jwt") || "",
      })
    );
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  useEffect(() => {
    if (coupon.couponApplied || coupon.error) {
      setOpenSnackbar(true);
      setCouponCode("");
    }
  }, [coupon.couponApplied, coupon.error]);

 const handleOpenDialog = () => {
  dispatch(fetchAllCoupons(localStorage.getItem("jwt") || ""));
  setOpenDialog(true);
};

  const handleSelectCoupon = (code: string) => {
    setCouponCode(code);
    setOpenDialog(false);
  };
const pastelColors = [
  "#E3F2FD", // xanh nhạt
  "#FCE4EC", // hồng nhạt
  "#FFF3E0", // cam nhạt
  "#E8F5E9", // xanh lá nhạt
  "#F3E5F5"  // tím nhạt
];
  return (
    <>
      {cart.cart && cart.cart?.cartItems.length !== 0 ? (
        <div className="pt-10 px-5 sm:px-10 md:px-60 lg:px-60 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 ">
            <div className="lg:col-span-2 space-y-3 ">
              {cart.cart?.cartItems.map((item: CartItem) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            <div className="col-span-1 text-sm space-y-3">
              <div className="border rounded-md px-5 py-3 space-y-5">
                <div className="flex gap-3 text-sm items-center">
                  <LocalOfferIcon sx={{ color: teal[600], fontSize: "17px" }} />
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                    <strong>Apply Coupon</strong>
                  </span>
                </div>
                {!cart.cart?.couponCode ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-2">
                      <TextField
                        value={couponCode}
                        onChange={handleChange}
                        placeholder="coupon code"
                        size="small"
                      />
                      <Button
                        onClick={() => handleApplyCoupon("true")}
                        disabled={!couponCode}
                        size="small"
                        variant="contained"
                      >
                        Apply
                      </Button>
                    </div>
                     <Button
                      variant="outlined"
                      size="small"
                      onClick={handleOpenDialog}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      View Coupons
                    </Button>
                  </div>
                ) : (
                  <div className="flex">
                    <div className="p-1 pl-5 pr-3 border rounded-full flex gap-2 items-center">
                      <span>{cart.cart.couponCode} Applied</span>
                      <IconButton
                        onClick={() => handleApplyCoupon("false")}
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
                    fullWidth
                  >
                    Buy Now
                  </Button>
                </div>
              </section>

              <div className="border rounded-md px-5 py-4 flex justify-between items-center cursor-pointer">
                <span>Add From Wishlist</span>
                <FavoriteIcon sx={{ color: teal[600], fontSize: "21px" }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
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
      )}

      {/* Dialog hiển thị coupon */}
<Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
  <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2" }}>
    Available Coupons
  </DialogTitle>
  <DialogContent>
    <Box display="flex" flexDirection="column" gap={1.5}>
      {coupon.coupons?.map((c, index) => (
        <Box
          key={c.id}
          onClick={() => handleSelectCoupon(c.code)}
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            borderRadius: "10px",
            backgroundColor: pastelColors[index % pastelColors.length],
            cursor: "pointer",
            transition: "all 0.2s ease",
            border: "1px solid rgba(0,0,0,0.08)",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <LocalOfferIcon sx={{ color: "#ff7043" }} />
            <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
              {c.code} - {c.discountPercentage}% OFF
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Valid: {c.validityStartDate} → {c.validityEndDate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Min Order: {c.minimumOrderValue.toLocaleString()}đ
          </Typography>
        </Box>
      ))}
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: "bold", color: "#1976d2" }}>
      Close
    </Button>
  </DialogActions>
</Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={coupon.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {coupon.error ? coupon.error : "Coupon Applied successfully"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;

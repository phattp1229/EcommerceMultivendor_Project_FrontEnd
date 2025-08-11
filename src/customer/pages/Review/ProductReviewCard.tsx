import React from "react";
import { Avatar, IconButton, Box, Rating, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import type { Review } from "../../../types/reviewTypes";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { deleteReview } from "../../../Redux Toolkit/Customer/ReviewSlice";

interface ProductReviewCardProps {
item: Review;
}

const formatDate = (iso?: string) => {
if (!iso) return "";
const d = new Date(iso);
if (isNaN(d.getTime())) return iso; // fallback nếu server trả format lạ
return d.toLocaleString("vi-VN");
};

const ProductReviewCard: React.FC<ProductReviewCardProps> = ({ item }) => {
const { customer } = useAppSelector((store) => store);
const dispatch = useAppDispatch();

const handleDeleteReview = () => {
dispatch(deleteReview({ reviewId: item.id, jwt: localStorage.getItem("jwt") || "" }));
};

const initial = item.customer?.fullName?.charAt(0)?.toUpperCase() ?? "?";
const ratingValue = Number(item.rating) || 0;

return (
<div className="flex justify-between">
<Grid container spacing={2}>
<Grid size="auto">
<Box>
<Avatar
className="text-white"
sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}
alt={item.customer?.fullName || "User"}
src=""
>
{initial}
</Avatar>
</Box>
</Grid>
    <Grid>
      <div className="space-y-2">
        <div>
          <p className="font-semibold text-lg">{item.customer?.fullName}</p>
          <p className="opacity-70 text-sm">{formatDate(item.createdAt)}</p>
        </div>

        <Rating
          readOnly
          value={ratingValue}
          name="review-rating"
          precision={0.5}
        />

        <p>{item.reviewText}</p>

        {item.productImages?.length ? (
          <Grid container spacing={1}>
            {item.productImages.map((image, idx) => (
              <Grid  key={image || idx}>
                <img
                  className="w-24 h-24 object-cover rounded"
                  src={image}
                  alt={`review-image-${idx + 1}`}
                />
              </Grid>
            ))}
          </Grid>
        ) : null}
      </div>
    </Grid>
  </Grid>

  {item.customer?.id === customer.customer?.id && (
    <div>
      <IconButton onClick={handleDeleteReview} aria-label="delete review">
        <DeleteIcon sx={{ color: red[700] }} />
      </IconButton>
    </div>
  )}
</div>
);
};

export default ProductReviewCard;
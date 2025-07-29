import React from "react";
import { Avatar, IconButton, Rating, Box, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import Grid from "@mui/material/Grid";

const ProductReviewCard = () => {
  const [value, setValue] = React.useState(4.5);
  const dispatch = useAppDispatch()

  return (
    <div className="flex justify-between">
      <Grid container spacing={2} gap-3>
        <Grid size={1} >
          <Box>
            <Avatar
              className="text-white"
              sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}
              src="">
                P
            </Avatar>
          </Box>
        </Grid>
        <Grid size={9}>
          <div className="space-y-2">
            <div className="">
              <p className="font-semibold text-lg">Phat</p>
              <p className="opacity-70">2025-07-28 11:21PM</p>
            </div>

            <div>
              <Rating readOnly value={4.5} name="half-rating" defaultValue={2.5} precision={0.5}/>
            </div>
            <p>Sản phẩm tốt , đẹp</p>
            <div>
              <img className="w-24 h-24 object-cover"
              src="https://product.hstatic.net/1000360022/product/02__2__3772339fad454be8887073f82a40f628_1024x1024.jpg" alt="">
              </img>
            </div>
          </div>
        </Grid>
      </Grid>
       <div className="">
        <IconButton>
          <DeleteIcon sx={{ color: red[700] }} />
        </IconButton>
      </div>
    </div>
  );
};

export default ProductReviewCard;

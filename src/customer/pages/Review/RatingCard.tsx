import React from "react";
import { Box, LinearProgress, Rating, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import type { Review } from "../../../types/reviewTypes";

type Star = 1 | 2 | 3 | 4 | 5;
const STARS: readonly Star[] = [5, 4, 3, 2, 1];

const toStar = (x: number): 0 | Star => {
  if (x >= 4.5) return 5;
  if (x >= 3.5) return 4;
  if (x >= 2.5) return 3;
  if (x >= 1.5) return 2;
  if (x >= 0.5) return 1;
  return 0; // <0.5 thì không tính sao
};

const RatingCard: React.FC = () => {
  // lấy trực tiếp từ Redux để tránh truyền props sai
  const reviews: Review[] = useAppSelector((s) => s.review.reviews) ?? [];

  const total = reviews.length;
  const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
  const avg = total ? Number((sum / total).toFixed(1)) : 0;

  const buckets: Record<Star, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    const star = toStar(Number(r.rating) || 0); // star: 0 | Star
    if (star !== 0) {
      buckets[star] += 1; // đã narrow -> OK
    }
  }

  const perc: Record<Star, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  STARS.forEach((s) => {
    const n = buckets[s];
    perc[s] = total ? Math.round((n / total) * 100) : 0;
  });

  const rows = [
    { label: "Excellent", star: 5 as Star, color: "success" as const },
    { label: "Very Good", star: 4 as Star, color: "success" as const },
    { label: "Good",      star: 3 as Star, color: "primary" as const },
    { label: "Average",   star: 2 as Star, color: "warning" as const },
    { label: "Poor",      star: 1 as Star, color: "error"   as const },
  ];

  return (
    <div className="border p-5 rounded-md">
      <div className="flex items-center space-x-3 pb-10">
        <Rating name="avg-rating" value={avg} precision={0.1} readOnly />
        <Typography variant="body2" sx={{ opacity: 0.6 }}>{total} Ratings</Typography>
        <Typography variant="body2" sx={{ opacity: 0.6 }}>• Average: {avg}</Typography>
      </div>

      {rows.map((row) => (
        <Box key={row.star} sx={{ mb: 1.5 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid size={2}><p className="p-0">{row.label}</p></Grid>
            <Grid size={7}>
              <LinearProgress
                variant="determinate"
                value={perc[row.star]}
                color={row.color}
                sx={{ bgcolor: "#d0d0d0", borderRadius: 4, height: 7 }}
              />
            </Grid>
            <Grid size={2}><p className="opacity-50 p-2">{buckets[row.star]}</p></Grid>
          </Grid>
        </Box>
      ))}
    </div>
  );
};

export default RatingCard;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
Alert,
Box,
Button,
Card,
CardContent,
CardHeader,
Chip,
Grid,
IconButton,
InputAdornment,
Pagination,
Select,
MenuItem,
FormControl,
InputLabel,
Snackbar,
Stack,
TextField,
Typography
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PaidIcon from "@mui/icons-material/Paid";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LinkIcon from "@mui/icons-material/Link";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useAppSelector } from "../../../../Redux Toolkit/Store";

import {
ResponsiveContainer,
CartesianGrid,
XAxis,
YAxis,
Tooltip,
AreaChart,
Area
} from "recharts";

type RevenuePoint = { month: string; value: number };
type Product = { id: number; name: string; categoryId: string; slug: string };

const brand = {
primary: "#ee4d2d",
green: "#10b981",
purple: "#7e57c2",
light: "#fff7f5",
} as const;

const kpi = { earnings: 1240, orders: 38, clicks: 1520, growth: 12.4 };

const revenue: RevenuePoint[] = [
{ month: "Jan", value: 120 },
{ month: "Feb", value: 180 },
{ month: "Mar", value: 90 },
{ month: "Apr", value: 240 },
{ month: "May", value: 300 },
{ month: "Jun", value: 260 },
];
const orders: RevenuePoint[] = [
{ month: "Jan", value: 12 },
{ month: "Feb", value: 16 },
{ month: "Mar", value: 8 },
{ month: "Apr", value: 22 },
{ month: "May", value: 28 },
{ month: "Jun", value: 24 },
];
const clicks: RevenuePoint[] = [
{ month: "Jan", value: 140 },
{ month: "Feb", value: 210 },
{ month: "Mar", value: 120 },
{ month: "Apr", value: 280 },
{ month: "May", value: 340 },
{ month: "Jun", value: 300 },
];

const mockProducts: Product[] = [
{ id: 101, name: "Air Max 270", categoryId: "men-shoes", slug: "air-max-270" },
{ id: 202, name: "iPhone 15", categoryId: "electronics-mobiles", slug: "iphone-15" },
{ id: 303, name: "Adidas Hoodie", categoryId: "men-hoodie", slug: "adidas-hoodie" },
];

const currency = (n: number) =>
n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const MiniChart: React.FC<{
title: string; color: string; data: RevenuePoint[]; icon: React.ReactNode; value: string; sub?: string;
}> = ({ title, color, data, icon, value, sub }) => (
<Card variant="outlined" sx={{ borderRadius: 2 }}>
<CardContent>
<Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
<Typography color="text.secondary">{title}</Typography>
{icon}
</Stack>
<Typography variant="h5" fontWeight={700} mb={0.5}>{value}</Typography>
{sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
<Box sx={{ width: "100%", height: 120, mt: 1 }}>
<ResponsiveContainer>
<AreaChart data={data}>
<defs>
<linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
<stop offset="5%" stopColor={color} stopOpacity={0.35} />
<stop offset="95%" stopColor={color} stopOpacity={0.02} />
</linearGradient>
</defs>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="month" tick={{ fontSize: 10 }} />
<YAxis tick={{ fontSize: 10 }} />
<Tooltip />
<Area type="monotone" dataKey="value" stroke={color} fill={`url(#grad-${title})`} strokeWidth={2} />
</AreaChart>
</ResponsiveContainer>
</Box>
</CardContent>
</Card>
);

const KocDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { customer } = useAppSelector((s) => s);
  const [keyword, setKeyword] = useState("");
  const [snack, setSnack] = useState<{ open: boolean; msg: string; type: "success" | "info" }>({
    open: false, msg: "", type: "success"
  });

const kocCode = customer.customer?.id;
const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

const filtered = useMemo(() => {
if (!keyword) return mockProducts;
return mockProducts.filter((p) => p.name.toLowerCase().includes(keyword.toLowerCase()));
}, [keyword]);

const makeAffiliateLink = (p: Product) =>
  `${baseUrl}/product-details/${p.categoryId}/${p.slug}/${p.id}?ref=${kocCode}`;

const copy = async (text: string) => {
try {
await navigator.clipboard.writeText(text);
setSnack({ open: true, msg: "Copied to clipboard", type: "success" });
} catch {
setSnack({ open: true, msg: "Copy failed", type: "info" });
}
};

// Pagination
const [page, setPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(5);
useEffect(() => { setPage(1); }, [keyword]);
const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
const paged = useMemo(() => {
const start = (page - 1) * rowsPerPage;
return filtered.slice(start, start + rowsPerPage);
}, [filtered, page, rowsPerPage]);

return (
<Stack spacing={3}>
<Stack direction="row" alignItems="center" gap={1}>
  <Typography variant="h5" fontWeight={700}>KOC Dashboard</Typography>
  <Chip size="small" label="beta" />
  <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate("/account/affiliate-campaign")}>Affiliate Campaign</Button>
</Stack>

  {/* KPI nhanh */}
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 3}}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color="text.secondary">Earnings</Typography>
            <PaidIcon />
          </Stack>
          <Typography variant="h5" fontWeight={700}>{currency(kpi.earnings)}</Typography>
          <Typography variant="caption" color="text.secondary">Total this month</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={{ xs: 12, md: 3}}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color="text.secondary">Orders</Typography>
            <ShoppingCartIcon />
          </Stack>
          <Typography variant="h5" fontWeight={700}>{kpi.orders}</Typography>
          <Typography variant="caption" color="text.secondary">Converted from links</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={{ xs: 12, md: 3}}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color="text.secondary">Clicks</Typography>
            <LinkIcon />
          </Stack>
          <Typography variant="h5" fontWeight={700}>{kpi.clicks}</Typography>
          <Typography variant="caption" color="text.secondary">Unique clicks</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={{ xs: 12, md: 3}}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color="text.secondary">Growth</Typography>
            <TrendingUpIcon />
          </Stack>
          <Typography variant="h5" fontWeight={700}>{kpi.growth}%</Typography>
          <Typography variant="caption" color="text.secondary">vs last month</Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>

  {/* Biểu đồ */}
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 4}}>
      <MiniChart title="Revenue" color={brand.primary} data={revenue} icon={<PaidIcon />} value={currency(kpi.earnings)} sub="This month" />
    </Grid>
    <Grid size={{ xs: 12, md: 4}}>
      <MiniChart title="Orders" color={brand.green} data={orders} icon={<ShoppingCartIcon />} value={`${kpi.orders}`} sub="Converted orders" />
    </Grid>
    <Grid size={{ xs: 12, md: 4}}>
      <MiniChart title="Clicks" color={brand.purple} data={clicks} icon={<LinkIcon />} value={`${kpi.clicks}`} sub="Unique clicks" />
    </Grid>
  </Grid>
  {/* LINKS SẢN PHẨM */}
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardHeader title="Product Affiliate Links" />
    <CardContent>
      <TextField
        size="small"
        placeholder="Search products…"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        sx={{ mb: 2, maxWidth: 360 }}
      />

      <Stack spacing={1.5}>
        {paged.map((p) => {
          const link = makeAffiliateLink(p);
          return (
            <Card key={p.id} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", md: "row" } as any}
                  alignItems={{ xs: "stretch", md: "center" } as any}
                  justifyContent="space-between"
                  spacing={1.5}
                >
                  <Box>
                    <Typography fontWeight={600}>{p.name}</Typography>
                    <Typography variant="caption" color="text.secondary">#{p.id}</Typography>
                  </Box>

                  <TextField
                    value={link}
                    size="small"
                    fullWidth
                    sx={{ "& .MuiInputBase-input": { textOverflow: "ellipsis" } }}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => copy(link)}><ContentCopyIcon /></IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button variant="outlined" onClick={() => copy(link)}>Copy</Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* Pagination controls */}
      <Box mt={2} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="rows-label">Rows</InputLabel>
          <Select
            labelId="rows-label"
            label="Rows"
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
          >
            {[5, 10, 20, 50].map(n => <MenuItem key={n} value={n}>{n}/page</MenuItem>)}
          </Select>
        </FormControl>

        <Pagination
          page={page}
          count={totalPages}
          onChange={(_, v) => setPage(v)}
          color="primary"
          shape="rounded"
        />
      </Box>
    </CardContent>
  </Card>

  <Snackbar
    open={snack.open}
    autoHideDuration={2200}
    onClose={() => setSnack({ ...snack, open: false })}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
  >
    <Alert severity={snack.type} variant="filled" onClose={() => setSnack({ ...snack, open: false })}>
      {snack.msg}
    </Alert>
  </Snackbar>
</Stack>
);
};

export default KocDashboard;
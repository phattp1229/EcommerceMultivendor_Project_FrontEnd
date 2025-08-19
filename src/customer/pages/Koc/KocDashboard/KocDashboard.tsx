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
import { api } from "../../../../Config/Api";

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

const kpi = { earnings: 0, orders: 0, clicks: 0, growth: 0 };

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
  console.log('=== KocDashboard COMPONENT RENDERED ===');
  const navigate = useNavigate();
  const { customer } = useAppSelector((s) => s);
  console.log('Customer state:', customer);
  const [keyword, setKeyword] = useState("");
  const [snack, setSnack] = useState<{ open: boolean; msg: string; type: "success" | "info" }>({
    open: false, msg: "", type: "success"
  });

  // Affiliate links state
  const [affiliateLinks, setAffiliateLinks] = useState<any[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [productDetails, setProductDetails] = useState<{[key: string]: any}>({});

const kocCode = customer.customer?.id;
const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

// Fetch affiliate links from API
const fetchAffiliateLinks = async () => {
  console.log('=== fetchAffiliateLinks STARTED ===');
  try {
    setLoadingLinks(true);
    const jwt = localStorage.getItem('jwt');
    console.log('Fetching affiliate links with JWT:', jwt ? 'Present' : 'Missing');
    console.log('JWT value:', jwt);

    console.log('Making request to: http://localhost:5454/api/koc/my-links');
    const response = await fetch('http://localhost:5454/api/koc/my-links', {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Affiliate links data:', data);
      console.log('✅ Data type:', typeof data);
      console.log('✅ Data length:', Array.isArray(data) ? data.length : 'Not array');
      setAffiliateLinks(data);
    } else {
      const errorText = await response.text();
      console.error('Failed to fetch affiliate links:', response.status, errorText);
      setAffiliateLinks([]);
    }
  } catch (error) {
    console.error('Error fetching affiliate links:', error);
    setAffiliateLinks([]);
  } finally {
    setLoadingLinks(false);
    console.log('=== fetchAffiliateLinks FINISHED ===');
  }
};

// Load affiliate links on component mount
useEffect(() => {
  console.log('KocDashboard useEffect triggered - calling fetchAffiliateLinks');
  fetchAffiliateLinks();
}, []);

// Fetch product details for each affiliate link
useEffect(() => {
  const fetchProductsDetails = async () => {
    console.log('🔍 Starting to fetch product details for', affiliateLinks.length, 'links');
    const newProductDetails: {[key: string]: any} = {};

    for (const linkData of affiliateLinks) {
      const productId = extractProductId(linkData.targetUrl);
      console.log('📝 Extracted product ID:', productId, 'from URL:', linkData.targetUrl);

      if (productId && !productDetails[productId]) {
        console.log('🚀 Fetching product details for ID:', productId);
        const productInfo = await fetchProductDetails(productId);
        console.log('📦 Product info received:', productInfo);
        console.log('🏪 Business name:', productInfo?.businessName);
        console.log('🏷️ Brand:', productInfo?.brand);
        console.log('📋 All product fields:', Object.keys(productInfo || {}));

        if (productInfo) {
          newProductDetails[productId] = productInfo;
        }
      }
    }

    console.log('✅ New product details to add:', newProductDetails);
    if (Object.keys(newProductDetails).length > 0) {
      setProductDetails(prev => ({ ...prev, ...newProductDetails }));
    }
  };

  if (affiliateLinks.length > 0) {
    fetchProductsDetails();
  }
}, [affiliateLinks]);

const filtered = useMemo(() => {
if (!keyword) return affiliateLinks;
return affiliateLinks.filter((link: any) =>
  link.targetUrl?.toLowerCase().includes(keyword.toLowerCase()) ||
  link.shortToken?.toLowerCase().includes(keyword.toLowerCase())
);
}, [keyword, affiliateLinks]);

const makeAffiliateLink = (p: Product) =>
  `${baseUrl}/product-details/${p.categoryId}/${p.slug}/${p.id}?ref=${kocCode}`;

// Extract product ID from target URL
const extractProductId = (targetUrl: string): string | null => {
  try {
    const match = targetUrl.match(/\/product-details\/\d+\/[^/]+\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

// Fetch product details
const fetchProductDetails = async (productId: string) => {
  try {
    const jwt = localStorage.getItem("jwt");
    const response = await api.get(`/products/${productId}`, {
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};

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
        {paged.map((linkData: any) => {
          const productId = extractProductId(linkData.targetUrl);
          const product = productId ? productDetails[productId] : null;

          return (
            <Card key={linkData.id} variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 2 }}>
                {/* Main Layout: Product Left + Links Right */}
                <Grid container spacing={3}>
                  {/* LEFT SIDE - Product Info */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card variant="outlined" sx={{ height: '100%', backgroundColor: '#fafafa' }}>
                      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {product ? (
                          <Stack direction="row" spacing={2} height="100%">
                            {/* Left: Product Image */}
                            <Box
                              component="img"
                              src={product.images?.[0] || '/placeholder-product.jpg'}
                              alt={product.title || 'Product'}
                              sx={{
                                width: 120,
                                height: 120,
                                borderRadius: 2,
                                objectFit: 'cover',
                                border: '1px solid #e0e0e0',
                                flexShrink: 0
                              }}
                            />

                            {/* Right: Product Details */}
                            <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
                              <Box>
                                <Typography fontWeight={600} variant="subtitle1" color="text.primary" sx={{ mb: 0.5 }}>
                                  {product.title || 'Product Name'}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  {product.seller?.businessDetails?.businessName || product.brand || 'Shop Name'}
                                </Typography>

                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                  Category: {product.category?.name || 'N/A'}
                                </Typography>
                              </Box>

                              <Box>
                                {/* Price Section - VND Format */}
                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                                  <Typography variant="h6" color="primary" fontWeight={600}>
                                    {(product.sellingPrice || product.price || 0).toLocaleString('vi-VN')}₫
                                  </Typography>
                                  {product.price && product.sellingPrice && product.price > product.sellingPrice && (
                                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                      {product.price.toLocaleString('vi-VN')}₫
                                    </Typography>
                                  )}
                                </Stack>

                                {product.discountPercent && (
                                  <Chip
                                    label={`-${product.discountPercent}% OFF`}
                                    color="error"
                                    size="small"
                                    sx={{ fontWeight: 500 }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Stack>
                        ) : (
                          <Stack spacing={2} alignItems="center" justifyContent="center" height="100%">
                            <Box
                              sx={{
                                width: '100%',
                                height: 200,
                                borderRadius: 2,
                                backgroundColor: '#e0e0e0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                aspectRatio: '3/4' // Portrait ratio
                              }}
                            >
                              <Typography variant="body2" color="text.secondary">
                                Loading product...
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                              Product ID: {productId || 'Not found'}
                            </Typography>
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* RIGHT SIDE - Links Section */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2}>
                      {/* Header với thông tin link */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography fontWeight={600} color="primary" variant="h6">
                            Link #{linkData.id} - {linkData.shortToken}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Clicks: {linkData.totalClick || 0} • Status: Active
                          </Typography>
                        </Box>
                        <Chip
                          label="Active"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Stack>

                      {/* Short Link */}
                      <Box>
                        <Typography variant="body2" fontWeight={500} color="text.secondary" mb={0.5}>
                          🔗 Short Link:
                        </Typography>
                        <TextField
                          value={linkData.generatedUrl}
                          size="small"
                          fullWidth
                          sx={{
                            "& .MuiInputBase-input": {
                              textOverflow: "ellipsis",
                              fontSize: '0.875rem'
                            },
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: '#f8f9fa'
                            }
                          }}
                          slotProps={{
                            input: {
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => copy(linkData.generatedUrl)}
                                    size="small"
                                    sx={{ color: brand.primary }}
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                      </Box>

                      {/* Target Link */}
                      <Box>
                        <Typography variant="body2" fontWeight={500} color="text.secondary" mb={0.5}>
                          🎯 Target Link:
                        </Typography>
                        <TextField
                          value={linkData.targetUrl}
                          size="small"
                          fullWidth
                          sx={{
                            "& .MuiInputBase-input": {
                              textOverflow: "ellipsis",
                              fontSize: '0.875rem'
                            },
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: '#f8f9fa'
                            }
                          }}
                          slotProps={{
                            input: {
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => copy(linkData.targetUrl)}
                                    size="small"
                                    sx={{ color: brand.primary }}
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                      </Box>

                      {/* Action Buttons */}
                      <Stack direction="row" spacing={1} justifyContent="flex-start">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => copy(linkData.generatedUrl)}
                          startIcon={<ContentCopyIcon />}
                          sx={{
                            borderColor: brand.primary,
                            color: brand.primary,
                            '&:hover': {
                              backgroundColor: brand.light,
                              borderColor: brand.primary
                            }
                          }}
                        >
                          Copy Short
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => copy(linkData.targetUrl)}
                          startIcon={<LinkIcon />}
                          sx={{
                            backgroundColor: brand.primary,
                            '&:hover': {
                              backgroundColor: '#d73527'
                            }
                          }}
                        >
                          Copy Target
                        </Button>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
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
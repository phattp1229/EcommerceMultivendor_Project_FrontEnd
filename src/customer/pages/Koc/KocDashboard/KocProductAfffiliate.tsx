import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";
import { api } from "../../../../Config/Api";

type RevenuePoint = { month: string; value: number };

const brand = {
  primary: "#ee4d2d",
  light: "#fff7f5",
} as const;

type Props = {
  affiliateLinks: any[];
  loading: boolean;
};

const KocProductAffilaite: React.FC<Props> = ({ affiliateLinks, loading }) => {
  // local UI state (chỉ cho phần links)
  const [keyword, setKeyword] = useState("");
  const [snack, setSnack] = useState<{ open: boolean; msg: string; type: "success" | "info" }>({
    open: false,
    msg: "",
    type: "success",
  });
  const [productDetails, setProductDetails] = useState<Record<string, any>>({});

  // ===== helpers =====
  const extractProductId = (targetUrl: string): string | null => {
    try {
      const match = targetUrl.match(/\/product-details\/\d+\/[^/]+\/(\d+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const fetchProductDetails = async (productId: string) => {
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await api.get(`/products/${productId}`, {
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      });
      return response.data;
    } catch {
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

  // fetch chi tiết product cho từng link (one-shot per link)
  useEffect(() => {
    const run = async () => {
      const next: Record<string, any> = {};
      for (const link of affiliateLinks) {
        const productId = extractProductId(link.targetUrl);
        if (productId && !productDetails[productId]) {
          const info = await fetchProductDetails(productId);
          if (info) next[productId] = info;
        }
      }
      if (Object.keys(next).length) setProductDetails((prev) => ({ ...prev, ...next }));
    };
    if (affiliateLinks.length) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affiliateLinks]);

  // filter + pagination
  const filtered = useMemo(() => {
    if (!keyword) return affiliateLinks;
    return affiliateLinks.filter(
      (link: any) =>
        link.targetUrl?.toLowerCase().includes(keyword.toLowerCase()) ||
        link.shortToken?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, affiliateLinks]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  useEffect(() => setPage(1), [keyword]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  return (
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

        {loading ? (
          <Box py={4} display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {paged.map((linkData: any) => {
              const productId = extractProductId(linkData.targetUrl);
              const product = productId ? productDetails[productId] : null;

              return (
                <Card key={linkData.id} variant="outlined" sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
                  <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={3}>
                      {/* LEFT: product */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined" sx={{ height: "100%", backgroundColor: "#fafafa" }}>
                          <CardContent sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                            {product ? (
                              <Stack direction="row" spacing={2} height="100%">
                                <Box
                                  component="img"
                                  src={product.images?.[0] || "/placeholder-product.jpg"}
                                  alt={product.title || "Product"}
                                  sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 2,
                                    objectFit: "cover",
                                    border: "1px solid #e0e0e0",
                                    flexShrink: 0,
                                  }}
                                />
                                <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
                                  <Box>
                                    <Typography fontWeight={600} variant="subtitle1" color="text.primary" sx={{ mb: 0.5 }}>
                                      {product.title || "Product Name"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                      {product.seller?.businessDetails?.businessName || product.brand || "Shop Name"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                                      Category: {product.category?.name || "N/A"}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                                      <Typography variant="h6" color="primary" fontWeight={600}>
                                        {(product.sellingPrice || product.price || 0).toLocaleString("vi-VN")}₫
                                      </Typography>
                                      {product.price &&
                                        product.sellingPrice &&
                                        product.price > product.sellingPrice && (
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ textDecoration: "line-through" }}
                                          >
                                            {product.price.toLocaleString("vi-VN")}₫
                                          </Typography>
                                        )}
                                    </Stack>
                                    {product.discountPercent && (
                                      <Chip label={`-${product.discountPercent}% OFF`} color="error" size="small" sx={{ fontWeight: 500 }} />
                                    )}
                                  </Box>
                                </Box>
                              </Stack>
                            ) : (
                              <Stack spacing={2} alignItems="center" justifyContent="center" height="100%">
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: 200,
                                    borderRadius: 2,
                                    backgroundColor: "#e0e0e0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    aspectRatio: "3/4",
                                  }}
                                >
                                  <Typography variant="body2" color="text.secondary">
                                    Loading product...
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                  Product ID: {productId || "Not found"}
                                </Typography>
                              </Stack>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* RIGHT: link info */}
                      <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={2}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography fontWeight={600} color="primary" variant="h6">
                                Link #{linkData.id} - {linkData.shortToken}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Clicks: {linkData.totalClick || 0} • Status: Active
                              </Typography>
                            </Box>
                            <Chip label="Active" color="success" size="small" sx={{ fontWeight: 500 }} />
                          </Stack>

                          {/* Short link */}
                          <Box>
                            <Typography variant="body2" fontWeight={500} color="text.secondary" mb={0.5}>
                              🔗 Short Link:
                            </Typography>
                            <TextField
                              value={linkData.generatedUrl}
                              size="small"
                              fullWidth
                              sx={{
                                "& .MuiInputBase-input": { textOverflow: "ellipsis", fontSize: "0.875rem" },
                                "& .MuiOutlinedInput-root": { backgroundColor: "#f8f9fa" },
                              }}
                              slotProps={{
                                input: {
                                  readOnly: true,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton onClick={() => copy(linkData.generatedUrl)} size="small" sx={{ color: brand.primary }}>
                                        <ContentCopyIcon fontSize="small" />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                },
                              }}
                            />
                          </Box>

                          {/* Target link */}
                          <Box>
                            <Typography variant="body2" fontWeight={500} color="text.secondary" mb={0.5}>
                              🎯 Target Link:
                            </Typography>
                            <TextField
                              value={linkData.targetUrl}
                              size="small"
                              fullWidth
                              sx={{
                                "& .MuiInputBase-input": { textOverflow: "ellipsis", fontSize: "0.875rem" },
                                "& .MuiOutlinedInput-root": { backgroundColor: "#f8f9fa" },
                              }}
                              slotProps={{
                                input: {
                                  readOnly: true,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton onClick={() => copy(linkData.targetUrl)} size="small" sx={{ color: brand.primary }}>
                                        <ContentCopyIcon fontSize="small" />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                },
                              }}
                            />
                          </Box>

                          <Stack direction="row" spacing={1} justifyContent="flex-start">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => copy(linkData.generatedUrl)}
                              startIcon={<ContentCopyIcon />}
                              sx={{
                                borderColor: brand.primary,
                                color: brand.primary,
                                "&:hover": { backgroundColor: brand.light, borderColor: brand.primary },
                              }}
                            >
                              Copy Short
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => copy(linkData.targetUrl)}
                              startIcon={<LinkIcon />}
                              sx={{ backgroundColor: brand.primary, "&:hover": { backgroundColor: "#d73527" } }}
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
        )}

        {/* Pagination */}
        <Box mt={2} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="rows-label">Rows</InputLabel>
            <Select
              labelId="rows-label"
              label="Rows"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}/page
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Pagination page={page} count={totalPages} onChange={(_, v) => setPage(v)} color="primary" shape="rounded" />
        </Box>
      </CardContent>

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
    </Card>
  );
};

export default KocProductAffilaite;

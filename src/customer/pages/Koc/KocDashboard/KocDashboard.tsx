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
  Typography,
  CircularProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PaidIcon from "@mui/icons-material/Paid";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LinkIcon from "@mui/icons-material/Link";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/Store";
import { api } from "../../../../Config/Api";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import {
  fetchKocDashboard,
  fetchKocHistory,
} from "../../../../Redux Toolkit/Customer/Koc/KocCommissionSlice";
import KocProductAffilaite from "./KocProductAfffiliate";
 // đường dẫn cùng folder
type RevenuePoint = { month: string; value: number };
type Product = { id: number; name: string; categoryId: string; slug: string };

const brand = {
  primary: "#ee4d2d",
  green: "#10b981",
  purple: "#7e57c2",
  light: "#fff7f5",
} as const;

const currency = (n: number) => `${Number(n || 0).toLocaleString("vi-VN")} ₫`;


const MiniChart: React.FC<{
  title: string;
  color: string;
  data: RevenuePoint[];
  icon: React.ReactNode;
  value: string;
  sub?: string;
}> = ({ title, color, data, icon, value, sub }) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography color="text.secondary">{title}</Typography>
        {icon}
      </Stack>
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      )}
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
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#grad-${title})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

const KocDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { customer } = useAppSelector((s) => s);
  const { dashboard, history, loading, error } = useAppSelector(
    (state) => state.kocCommission
  );

  const [keyword, setKeyword] = useState("");
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "info";
  }>({ open: false, msg: "", type: "success" });

  // ================== AFFILIATE LINKS ==================
  const [affiliateLinks, setAffiliateLinks] = useState<any[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [productDetails, setProductDetails] = useState<{ [key: string]: any }>({});

  const kocCode = customer.customer?.id;
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

  const fetchAffiliateLinks = async () => {
    try {
      setLoadingLinks(true);
      const jwt = localStorage.getItem("jwt");
      const response = await fetch("http://localhost:5454/api/koc/my-links", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAffiliateLinks(data || []);
      } else {
        setAffiliateLinks([]);
      }
    } catch (err) {
      setAffiliateLinks([]);
    } finally {
      setLoadingLinks(false);
    }
  };

  useEffect(() => {
    // fetch BE: commission dashboard + history
    dispatch(fetchKocDashboard());
    dispatch(fetchKocHistory());
    // fetch links
    fetchAffiliateLinks();
  }, [dispatch]);

  // fetch product details for each link (one-shot per link)
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
      if (Object.keys(next).length) {
        setProductDetails((prev) => ({ ...prev, ...next }));
      }
    };
    if (affiliateLinks.length) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affiliateLinks]);

  // ================== KPI (REAL DATA) ==================
  // hỗ trợ cả 2 kiểu key từ BE: {pendingCommission,...} hoặc {totalPending,...}
  const pending =
    (dashboard as any)?.pendingCommission ??
    (dashboard as any)?.totalPending ??
    0;
  const confirmed =
    (dashboard as any)?.confirmedCommission ??
    (dashboard as any)?.totalConfirmed ??
    0;
  const paid =
    (dashboard as any)?.paidCommission ??
    (dashboard as any)?.totalPaid ??
    0;

  // earnings = confirmed + paid (giống BE bạn đã làm trước đó)
  const earnings =
    (dashboard as any)?.totalCommission ?? Number(confirmed || 0) + Number(paid || 0);

  // orders (tính theo số commission có trạng thái CONFIRMED/PAID)
  const ordersCount = useMemo(
    () =>
      (history || []).filter(
        (x: any) => x.status === "CONFIRMED" || x.status === "PAID"
      ).length,
    [history]
  );

  // clicks tổng từ các affiliate link
  const totalClicks = useMemo(
    () => affiliateLinks.reduce((s, l) => s + (l?.totalClick || 0), 0),
    [affiliateLinks]
  );

  // ================== CHART DATA (tạo từ history) ==================
  // build 6 tháng gần nhất
  const monthLabel = (mIdx: number) =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      mIdx
    ];

  const lastMonths = useMemo(() => {
    const now = new Date();
    const arr: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      arr.push({ key, label: monthLabel(d.getMonth()) });
    }
    return arr;
  }, []);

  const { revenueSeries, orderSeries } = useMemo(() => {
    const revMap = new Map<string, number>();
    const ordMap = new Map<string, number>();
    lastMonths.forEach(({ key }) => {
      revMap.set(key, 0);
      ordMap.set(key, 0);
    });

    (history || []).forEach((h: any) => {
      const d = new Date(h.createdAt);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!revMap.has(key)) return; // chỉ tính trong 6 tháng
      // tính doanh thu theo commissionAmount với status CONFIRMED/PAID
      if (h.status === "CONFIRMED" || h.status === "PAID") {
        revMap.set(key, (revMap.get(key) || 0) + (h.commissionAmount || 0));
        ordMap.set(key, (ordMap.get(key) || 0) + 1);
      }
    });

    const revenueSeries: RevenuePoint[] = lastMonths.map(({ key, label }) => ({
      month: label,
      value: revMap.get(key) || 0,
    }));
    const orderSeries: RevenuePoint[] = lastMonths.map(({ key, label }) => ({
      month: label,
      value: ordMap.get(key) || 0,
    }));
    return { revenueSeries, orderSeries };
  }, [history, lastMonths]);

  // clicks chart hiện không có time-series từ BE → hiển thị phẳng theo tổng
  const clicksSeries: RevenuePoint[] = lastMonths.map((m) => ({
    month: m.label,
    value: 0,
  }));

  // ================== HELPERS ==================
  const makeAffiliateLink = (p: Product) =>
    `${baseUrl}/product-details/${p.categoryId}/${p.slug}/${p.id}?ref=${kocCode}`;

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
    } catch (error) {
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

  // ================== FILTER + PAGINATION (links) ==================
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
  useEffect(() => {
    setPage(1);
  }, [keyword]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  // ================== RENDER ==================
  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="h5" fontWeight={700}>
          KOC Dashboard
        </Typography>
        <Chip size="small" label="beta" />
        <Button
          variant="outlined"
          sx={{ ml: 2 }}
          onClick={() => navigate("/account/affiliate-campaign")}
        >
          Affiliate Campaign
        </Button>
      </Stack>

      {/* KPI nhanh */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary">Earnings</Typography>
                <PaidIcon />
              </Stack>
              <Typography variant="h5" fontWeight={700}>
                {currency(Number(earnings || 0))}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Confirmed + Paid
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary">Orders</Typography>
                <ShoppingCartIcon />
              </Stack>
              <Typography variant="h5" fontWeight={700}>{ordersCount}</Typography>
              <Typography variant="caption" color="text.secondary">
                Converted from links
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary">Clicks</Typography>
                <LinkIcon />
              </Stack>
              <Typography variant="h5" fontWeight={700}>{totalClicks}</Typography>
              <Typography variant="caption" color="text.secondary">
                Unique clicks (sum)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary">Growth</Typography>
                <TrendingUpIcon />
              </Stack>
              <Typography variant="h5" fontWeight={700}>
                {/* chưa có công thức growth → tạm 0 */}
                0%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Biểu đồ */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MiniChart
            title="Revenue"
            color={brand.primary}
            data={revenueSeries}
            icon={<PaidIcon />}
            value={currency(Number(earnings || 0))}
            sub="Last 6 months"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MiniChart
            title="Orders"
            color={brand.green}
            data={orderSeries}
            icon={<ShoppingCartIcon />}
            value={`${ordersCount}`}
            sub="Converted orders"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MiniChart
            title="Clicks"
            color={brand.purple}
            data={clicksSeries}
            icon={<LinkIcon />}
            value={`${totalClicks}`}
            sub="(no timeseries yet)"
          />
        </Grid>
      </Grid>

      {/* LINKS SẢN PHẨM */}
<KocProductAffilaite
  affiliateLinks={affiliateLinks}
  loading={loadingLinks}
/>

      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snack.type}
          variant="filled"
          onClose={() => setSnack({ ...snack, open: false })}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default KocDashboard;

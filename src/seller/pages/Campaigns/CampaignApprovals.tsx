import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Checkbox,
  Typography,
  IconButton,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  Rating,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"; // ✅ MUI v7 imports
import type { SelectChangeEvent } from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterAlt as FilterAltIcon,
  MoreHoriz as MoreHorizIcon,
  Group as GroupIcon,
  Verified as VerifiedIcon,
  AccessTime as AccessTimeIcon,
  Block as BlockIcon,
  InfoOutlined as InfoOutlinedIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material"; // ✅ MUI Icons v7
import { api } from "../../../Config/Api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux Toolkit/Store";
import type { KocRegistration, RegistrationApprovalResponse } from "../../../types/affiliateCampaignTypes";

// Shopee-like palette
const palette = {
  primary: "#ee4d2d",
  primaryDark: "#d94426",
  primaryLight: "#ff6a49",
  accent: "#f69113",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
};

// Types
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

type CampaignApplication = {
  id: number;
  kocId: string;
  kocName: string;
  avatarUrl?: string;
  rating: number; // 0-5 (fake data)
  tags: string[]; // fake data
  reach: number; // followers (fake data)
  cr: number; // conversion rate % (fake data)
  orders: number; // historical orders (fake data)
  campaignId: number;
  campaignName: string;
  productCount: number; // fake data
  commissionRate: number; // %
  appliedAt: string; // ISO date
  status: ApplicationStatus;
  note?: string; // fake data
};

// Helper function to generate fake KOC data for display
const generateFakeKocData = (kocId: number) => {
  const fakeProfiles = [
    { rating: 4.7, tags: ["Top KOC"], reach: 128000, cr: 3.2, orders: 410, note: "Chuyên đồ skincare, review giữ tone thương hiệu." },
    { rating: 4.2, tags: ["Beauty"], reach: 95000, cr: 2.8, orders: 320, note: "Có kinh nghiệm review mỹ phẩm cao cấp." },
    { rating: 4.5, tags: ["Lifestyle"], reach: 89000, cr: 2.1, orders: 150, note: "Content đa dạng, tương tác tốt với audience." },
    { rating: 4.0, tags: ["New", "Gaming"], reach: 19000, cr: 1.0, orders: 19, note: "KOC mới, tiềm năng phát triển." },
    { rating: 4.3, tags: ["Beauty"], reach: 64000, cr: 2.0, orders: 120, note: "Chuyên về makeup và skincare routine." },
    { rating: 3.9, tags: ["Gadgets"], reach: 24000, cr: 1.3, orders: 45, note: "Review công nghệ, thiết bị điện tử." },
    { rating: 3.6, tags: ["Fashion"], reach: 12000, cr: 0.8, orders: 12, note: "Thời trang trẻ, phong cách năng động." },
    { rating: 4.0, tags: ["Lifestyle"], reach: 52000, cr: 1.7, orders: 90, note: "Lifestyle blogger với nội dung chất lượng." }
  ];

  const index = kocId % fakeProfiles.length;
  return fakeProfiles[index];
};





// Helpers
const fmt = new Intl.NumberFormat("vi-VN");
const fmtPercent = (v: number) => `${v.toFixed(1)}%`;
const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("vi-VN", { hour12: false }) : "-";

function StatusChip({ s }: { s: ApplicationStatus }) {
  if (s === "PENDING")
    return (
      <Chip
        label="Chờ duyệt"
        icon={<AccessTimeIcon />}
        variant="outlined"
        sx={{
          color: palette.warning,
          borderColor: `${palette.warning}55`,
          bgcolor: `${palette.warning}10`,
          fontWeight: 500,
        }}
        size="small"
      />
    );
  if (s === "APPROVED")
    return (
      <Chip
        label="Đã duyệt"
        icon={<VerifiedIcon />}
        variant="outlined"
        sx={{
          color: palette.success,
          borderColor: `${palette.success}55`,
          bgcolor: `${palette.success}10`,
          fontWeight: 500,
        }}
        size="small"
      />
    );
  return (
    <Chip
      label="Từ chối"
      icon={<BlockIcon />}
      variant="outlined"
      sx={{
        color: palette.danger,
        borderColor: `${palette.danger}55`,
        bgcolor: `${palette.danger}10`,
        fontWeight: 500,
      }}
      size="small"
    />
  );
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <Chip
    label={children}
    size="small"
    variant="outlined"
    sx={{ borderColor: (theme) => theme.palette.divider }}
  />
);

const CampaignApprovals: React.FC = () => {
  const [data, setData] = useState<CampaignApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | ApplicationStatus>("ALL");
  const [campaign, setCampaign] = useState<string>("ALL");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [detail, setDetail] = useState<CampaignApplication | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<CampaignApplication | null>(null);

  // Snackbar for notifications
  const [snack, setSnack] = useState<{ open: boolean; msg: string; type: "success" | "error" }>({
    open: false,
    msg: "",
    type: "success",
  });

  const jwt = useSelector((state: RootState) => state.auth.jwt);

  // Fetch KOC registrations from API
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/sellers/campaign-registrations", {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      // Transform API response to match UI format
      const transformedData: CampaignApplication[] = response.data.map((reg: KocRegistration) => {
        const fakeData = generateFakeKocData(reg.koc.id);
        return {
          id: reg.id,
          kocId: reg.koc.kocCode,
          kocName: reg.koc.customer.fullName,
          avatarUrl: undefined, // No avatar in API
          rating: fakeData.rating,
          tags: fakeData.tags,
          reach: fakeData.reach,
          cr: fakeData.cr,
          orders: fakeData.orders,
          campaignId: reg.campaign.id,
          campaignName: reg.campaign.name,
          productCount: reg.campaign.productCount, // Real product count from backend
          commissionRate: reg.campaign.commissionPercent,
          appliedAt: reg.registeredAt,
          status: reg.status,
          note: fakeData.note,
        };
      });

      setData(transformedData);
    } catch (error: any) {
      console.error("Failed to fetch registrations:", error);
      setSnack({
        open: true,
        msg: error?.response?.data?.message || "Failed to load registrations",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jwt) {
      fetchRegistrations();
    }
  }, [jwt]);

  useEffect(() => {
    setSelected({});
    setPage(1);
  }, [query, status, campaign]);

  const campaigns = useMemo(() => {
    const set = new Set(data.map((d) => `${d.campaignId}__${d.campaignName}`));
    return ["ALL", ...Array.from(set)];
  }, [data]);

  const filtered = useMemo(() => {
    return data
      .filter((d) =>
        query.trim()
          ? d.kocName.toLowerCase().includes(query.toLowerCase()) ||
            d.kocId.toLowerCase().includes(query.toLowerCase())
          : true
      )
      .filter((d) => (status === "ALL" ? true : d.status === status))
      .filter((d) =>
        campaign === "ALL"
          ? true
          : `${d.campaignId}__${d.campaignName}` === campaign
      )
      .sort((a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      );
  }, [data, query, status, campaign]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const anySelected = Object.values(selected).some(Boolean);
  const selectedIds = Object.entries(selected)
    .filter(([, v]) => v)
    .map(([k]) => k);

  // Approve single registration
  const approveRegistration = async (id: number) => {
    try {
      setActionLoading(id);
      await api.post(`/api/sellers/affiliate-registrations/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      // Update local state
      setData((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "APPROVED" as ApplicationStatus } : d))
      );

      setSnack({
        open: true,
        msg: "Registration approved successfully",
        type: "success",
      });
    } catch (error: any) {
      console.error("Failed to approve registration:", error);
      setSnack({
        open: true,
        msg: error?.response?.data?.message || "Failed to approve registration",
        type: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Reject single registration
  const rejectRegistration = async (id: number) => {
    try {
      setActionLoading(id);
      await api.post(`/api/sellers/affiliate-registrations/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      // Update local state
      setData((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "REJECTED" as ApplicationStatus } : d))
      );

      setSnack({
        open: true,
        msg: "Registration rejected successfully",
        type: "success",
      });
    } catch (error: any) {
      console.error("Failed to reject registration:", error);
      setSnack({
        open: true,
        msg: error?.response?.data?.message || "Failed to reject registration",
        type: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Batch approve (for UI compatibility)
  function approve(ids: string[]) {
    ids.forEach(id => approveRegistration(Number(id)));
    setSelected({});
  }

  // Batch reject (for UI compatibility)
  function reject(ids: string[]) {
    ids.forEach(id => rejectRegistration(Number(id)));
    setSelected({});
  }

  return (
    <Box display="grid" gap={2}>
      {/* Header */}
      <Box
        sx={{
          borderRadius: 3,
          p: 3,
          color: "#fff",
          boxShadow: 3,
          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryLight} 45%, ${palette.accent} 100%)`,
        }}
      >
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems={{ md: "flex-end" }} justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Duyệt KOC tham gia chiến dịch
            </Typography>
            <Typography sx={{ opacity: 0.9 }}>
              Kiểm duyệt hồ sơ, chấp thuận/từ chối và quản lý ứng viên theo chiến dịch.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              onClick={() =>
                approve(filtered.filter((d) => d.status === "PENDING").map((d) => d.id.toString()))
              }
              sx={{ bgcolor: "#fff", color: "#111", ":hover": { bgcolor: "#fff" } }}
              variant="contained"
              startIcon={<CheckIcon />}
              disabled={loading || actionLoading !== null}
            >
              Duyệt tất cả đang chờ
            </Button>
            <Button
              onClick={() =>
                reject(filtered.filter((d) => d.status === "PENDING").map((d) => d.id.toString()))
              }
              variant="outlined"
              startIcon={<CloseIcon />}
              sx={{ color: "#fff", borderColor: "#fff", ":hover": { borderColor: "#fff" } }}
              disabled={loading || actionLoading !== null}
            >
              Từ chối tất cả đang chờ
            </Button>
          </Stack>
        </Box>

        {/* Quick stats */}
        <Box mt={2} display="grid" gridTemplateColumns={{ xs: "1fr 1fr", md: "repeat(4, 1fr)" }} gap={1.5}>
          <Card sx={{ bgcolor: "#ffffff1a", color: "#fff", border: "1px solid #ffffff4d" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Tổng ứng viên
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {fmt.format(filtered.length)}
                  </Typography>
                </Box>
                <GroupIcon />
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: "#ffffff1a", color: "#fff", border: "1px solid #ffffff4d" }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Chờ duyệt
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {fmt.format(filtered.filter((d) => d.status === "PENDING").length)}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: "#ffffff1a", color: "#fff", border: "1px solid #ffffff4d" }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Đã duyệt
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {fmt.format(filtered.filter((d) => d.status === "APPROVED").length)}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: "#ffffff1a", color: "#fff", border: "1px solid #ffffff4d" }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Từ chối
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {fmt.format(filtered.filter((d) => d.status === "REJECTED").length)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filters */}
      <Card variant="outlined">
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <FilterAltIcon sx={{ color: palette.primary }} />
              <Typography variant="subtitle1">Bộ lọc</Typography>
            </Stack>
          }
        />
        <CardContent>
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr 1fr" }} gap={2}>
            <TextField
              placeholder="Tìm theo tên hoặc mã KOC…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl>
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                label="Trạng thái"
                value={status}
                onChange={(e: SelectChangeEvent) => setStatus(e.target.value as any)}
              >
                <MenuItem value="ALL">Tất cả</MenuItem>
                <MenuItem value="PENDING">Chờ duyệt</MenuItem>
                <MenuItem value="APPROVED">Đã duyệt</MenuItem>
                <MenuItem value="REJECTED">Từ chối</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="campaign-label">Chiến dịch</InputLabel>
              <Select
                labelId="campaign-label"
                label="Chiến dịch"
                value={campaign}
                onChange={(e: SelectChangeEvent) => setCampaign(e.target.value as string)}
              >
                {campaigns.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c === "ALL" ? "Tất cả" : c.split("__")[1]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Actions */}
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Checkbox
            checked={paged.length > 0 && paged.every((row) => selected[row.id])}
            onChange={(e) => {
              const patch: Record<string, boolean> = {};
              paged.forEach((row) => (patch[row.id] = e.target.checked));
              setSelected((prev) => ({ ...prev, ...patch }));
            }}
          />
          <Typography color="text.secondary" variant="body2">
            Chọn trang hiện tại ({paged.filter((r) => selected[r.id]).length}/{paged.length})
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={() => approve(selectedIds)}
            disabled={!anySelected}
            sx={{ bgcolor: palette.primary, ":hover": { bgcolor: palette.primaryDark } }}
          >
            Duyệt đã chọn
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={() => reject(selectedIds)}
            disabled={!anySelected}
          >
            Từ chối đã chọn
          </Button>
          {/* More actions (example) */}
        </Stack>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: (theme) => theme.palette.action.hover }}>
              <TableCell padding="checkbox" />
              <TableCell width={320}>KOC</TableCell>
              <TableCell width={180}>Chiến dịch</TableCell>
              <TableCell width={220}>Hiệu suất</TableCell>
              <TableCell width={140}>Hoa hồng</TableCell>
              <TableCell width={160}>Nộp lúc</TableCell>
              <TableCell width={140}>Trạng thái</TableCell>
              <TableCell align="right" width={80}>
                <IconButton size="small" disabled>
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Loading registrations...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No KOC registrations found for your campaigns.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row, idx) => (
              <TableRow key={row.id} hover selected={Boolean(selected[row.id])}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={Boolean(selected[row.id])}
                    onChange={(e) =>
                      setSelected((prev) => ({ ...prev, [row.id]: e.target.checked }))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={row.avatarUrl} alt={row.kocName} />
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={600}>{row.kocName}</Typography>
                        {row.tags.slice(0, 2).map((t) => (
                          <Chip
                            key={t}
                            label={t}
                            size="small"
                            variant="outlined"
                            sx={{
                              color: palette.primary,
                              borderColor: `${palette.primary}55`,
                              bgcolor: `${palette.primary}0F`,
                            }}
                          />
                        ))}
                      </Stack>
                      <Stack direction="row" spacing={1.5} alignItems="center" mt={0.5}>
                        <Pill>#{row.kocId}</Pill>
                        <Pill>{fmt.format(row.reach)} follow</Pill>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Rating value={row.rating} precision={0.5} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">
                            {row.rating.toFixed(1)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{row.campaignName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.productCount} sản phẩm
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    CR: <b>{fmtPercent(row.cr)}</b>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {fmt.format(row.orders)} đơn đã tạo
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{row.commissionRate}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    theo doanh thu
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{fmtDate(row.appliedAt)}</Typography>
                </TableCell>
                <TableCell>
                  <StatusChip s={row.status} />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setMenuAnchor(e.currentTarget);
                      setMenuRow(row);
                    }}
                  >
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography color="text.secondary" variant="body2">
          Trang {page}/{totalPages} • Tổng {fmt.format(filtered.length)} ứng viên
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Trước
          </Button>
          <Button
            variant="outlined"
            size="small"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Sau
          </Button>
        </Stack>
      </Box>

      {/* Detail Dialog */}
      <Dialog open={!!detail} onClose={() => setDetail(null)} maxWidth="sm" fullWidth>
        {detail && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar src={detail.avatarUrl} alt={detail.kocName} />
                <Typography fontWeight={700}>{detail.kocName}</Typography>
                <StatusChip s={detail.status} />
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Ứng tuyển vào {detail.campaignName} • {fmtDate(detail.appliedAt)}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Pill>#{detail.kocId}</Pill>
                <Pill>{fmt.format(detail.reach)} follow</Pill>
                <Pill>{fmtPercent(detail.cr)} CR</Pill>
                <Pill>{fmt.format(detail.orders)} đơn</Pill>
                <Pill>{detail.commissionRate}% hoa hồng</Pill>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center" mt={2}>
                <Rating value={detail.rating} precision={0.5} readOnly />
                {detail.tags.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    variant="outlined"
                    sx={{ color: palette.primary, borderColor: `${palette.primary}55` }}
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={1} alignItems="flex-start" mt={2}>
                <InfoOutlinedIcon fontSize="small" sx={{ mt: "2px" }} />
                <Typography variant="body2" color="text.secondary">
                  {detail.note || "Chưa có ghi chú. Bạn có thể liên hệ KOC để bổ sung thông tin."}
                </Typography>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between" }}>
              <Typography variant="caption" color="text.secondary">
                Gợi ý: Ưu tiên duyệt KOC có mạng xã hội nhiều follow
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={() => {
                    rejectRegistration(detail.id);
                    setDetail(null);
                  }}
                  disabled={actionLoading === detail.id || detail.status === "REJECTED"}
                >
                  Từ chối
                </Button>
                <Button
                  variant="contained"
                  startIcon={actionLoading === detail.id ? <CircularProgress size={16} /> : <CheckIcon />}
                  onClick={() => {
                    approveRegistration(detail.id);
                    setDetail(null);
                  }}
                  disabled={actionLoading === detail.id || detail.status === "APPROVED"}
                  sx={{ bgcolor: palette.primary, ":hover": { bgcolor: palette.primaryDark } }}
                >
                  Duyệt
                </Button>
              </Stack>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Row menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            if (menuRow) setDetail(menuRow);
            setMenuAnchor(null);
          }}
        >
          Xem hồ sơ
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuRow) navigator.clipboard.writeText(menuRow.kocId);
            setMenuAnchor(null);
          }}
        >
          Copy mã KOC
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.type}
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignApprovals;

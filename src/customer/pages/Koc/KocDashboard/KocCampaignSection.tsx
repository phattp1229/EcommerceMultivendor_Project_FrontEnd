import React, { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import { useAppDispatch } from "../../../../Redux Toolkit/Store";
import { fetchKocRegistrations, registerKocCampaign } from "../../../../Redux Toolkit/Customer/Koc/KocSlice";
import CampaignIcon from "@mui/icons-material/Campaign";
import PercentIcon from "@mui/icons-material/Percent";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { fetchActiveCampaigns } from "../../../util/affiliateCampaignApi";
import type { AffiliateCampaign, AffiliateRegistrationResponse } from "../../../../types/affiliateCampaignTypes";
import { useNavigate } from "react-router-dom";

const brand = {
  primary: "#ee4d2d",
  light: "#fff7f5",
} as const;

const KocCampaignSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<AffiliateRegistrationResponse[]>([]);
  const [openRegister, setOpenRegister] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; type: "success" | "info" | "warning" | "error" }>({ open: false, msg: "", type: "success" });
  const [campaignId, setCampaignId] = useState("");
  const [campaigns, setCampaigns] = useState<AffiliateCampaign[]>([]);

  // Lấy danh sách campaign ACTIVE (để enrich dữ liệu hiển thị: % commission, expiredAt)
  useEffect(() => {
    fetchActiveCampaigns().then((data) => setCampaigns(Array.isArray(data) ? data : []));
  }, []);

  // Lấy các đăng ký của KOC
  useEffect(() => {
    dispatch(fetchKocRegistrations())
      .unwrap()
      .then((data) => setRegistrations(Array.isArray(data) ? data : []))
      .catch(() => setRegistrations([]));
  }, [dispatch]);

  const campaignById = useMemo(() => {
    const map: Record<number, AffiliateCampaign> = {} as any;
    campaigns.forEach((c) => (map[c.id] = c));
    return map;
  }, [campaigns]);

  const handleRegister = async () => {
    if (!campaignId) {
      setSnack({ open: true, msg: "Please select a campaign", type: "warning" });
      return;
    }
    setRegistering(true);
    try {
      await dispatch(registerKocCampaign(Number(campaignId))).unwrap();
      setSnack({ open: true, msg: "Registration successful!", type: "success" });
      dispatch(fetchKocRegistrations()).unwrap().then((d) => setRegistrations(Array.isArray(d) ? d : []));
      setOpenRegister(false);
      setCampaignId("");
    } catch (e: any) {
      console.error("Registration failed:", e);
      let errorMsg = "Registration failed";
      if (typeof e === "string") {
        errorMsg = e;
      } else if (e?.message) {
        errorMsg = e.message;
      }

      // Handle specific error cases
      if (errorMsg.includes("KOC doesn't exist")) {
        errorMsg = "You need to become a KOC first. Redirecting to KOC signup...";
        setTimeout(() => navigate("/become-koc"), 2000);
      } else if (errorMsg.includes("already signed up")) {
        errorMsg = "You have already registered for this campaign.";
      } else if (errorMsg.includes("Campaign Affiliate doesn't exist")) {
        errorMsg = "Campaign not found or no longer available.";
      }

      setSnack({ open: true, msg: errorMsg, type: "error" });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
        <CardHeader title="My registered campaigns" />
        <CardContent>
          {Array.isArray(registrations) && registrations.length === 0 ? (
            <Typography color="text.secondary">Bạn chưa đăng ký chiến dịch nào.</Typography>
          ) : (
            <Stack spacing={1.5}>
              {registrations.map((reg) => {
                const c = campaignById[reg.campaignId];
                const commission = (reg as any).commissionPercent ?? c?.commissionPercent;
                const expiredAt = (reg as any).expiredAt ?? c?.expiredAt;
                const startedAt = (reg as any).startedAt ?? c?.createdAt;
                const description = (reg as any).campaignDescription ?? c?.description;
                const campaignCode = c?.campaignCode || `AFF-${reg.campaignId}`;
                const statusColor = reg.status === "APPROVED" ? "success" : reg.status === "REJECTED" ? "error" : "warning";
                return (
                  <Card
                    key={reg.id}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      border: `2px solid ${brand.primary}22`,
                      background: `linear-gradient(135deg, ${brand.light} 0%, #ffffff 100%)`,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 25px ${brand.primary}15`,
                        border: `2px solid ${brand.primary}40`,
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" gap={2}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: `${brand.primary}15`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <CampaignIcon sx={{ color: brand.primary, fontSize: 24 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ color: brand.primary, mb: 0.5 }}>
                              {reg.campaignTitle}
                            </Typography>
                            <Typography variant="body2" sx={{ color: brand.primary, opacity: 0.8, mb: 1 }}>
                              {campaignCode}
                            </Typography>
                            {description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontStyle: "italic", lineHeight: 1.4 }}>
                                {description}
                              </Typography>
                            )}
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {typeof commission === "number" && (
                                <Chip
                                  size="small"
                                  color="success"
                                  icon={<PercentIcon />}
                                  label={`${commission}% commission`}
                                  sx={{ fontWeight: 600 }}
                                />
                              )}
                              {startedAt && (
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  icon={<AccessTimeIcon />}
                                  label={`Start: ${new Date(startedAt).toLocaleDateString()}`}
                                />
                              )}
                              {expiredAt && (
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  icon={<AccessTimeIcon />}
                                  label={`Ends: ${new Date(expiredAt).toLocaleDateString()}`}
                                  color={new Date(expiredAt) < new Date() ? "error" : "default"}
                                />
                              )}
                            </Stack>
                          </Box>
                        </Box>
                        <Stack spacing={1} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                          <Chip
                            label={reg.status === "APPROVED" ? "Approved" : reg.status === "REJECTED" ? "Rejected" : "Pending"}
                            color={statusColor as any}
                            sx={{ fontWeight: 600 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ textAlign: { xs: "left", sm: "right" } }}>
                            Registered: {new Date(reg.registeredAt).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: brand.light,
          border: `1px solid ${brand.primary}22`,
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            background: `linear-gradient(90deg, ${brand.primary}0F, transparent 60%)`,
          }}
        >
          <CampaignIcon sx={{ color: brand.primary }} />
          <Typography variant="h6" fontWeight={700}>Affiliate Campaign</Typography>
        </Box>
        <CardContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Đăng ký chiến dịch để nhận hoa hồng cao hơn trong khung thời gian cụ thể.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenRegister(true)}
            sx={{ bgcolor: brand.primary, "&:hover": { bgcolor: "#d73f20" } }}
          >
            Register Campaign
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openRegister} onClose={() => setOpenRegister(false)} fullWidth maxWidth="sm">
        <DialogTitle>Register Campaign</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              select
              label="Chọn chiến dịch"
              size="small"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              placeholder="Chọn chiến dịch"
            >
              {campaigns.map((c) => (
                <MenuItem key={c.id} value={String(c.id)}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{c.campaignCode}</Typography>
                    </Box>
                    <Chip size="small" color="success" label={`${c.commissionPercent}%`} />
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRegister(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: brand.primary, "&:hover": { bgcolor: "#d73f20" } }}
            disabled={registering}
            onClick={handleRegister}
          >
            {registering ? "Đang đăng ký..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default KocCampaignSection;

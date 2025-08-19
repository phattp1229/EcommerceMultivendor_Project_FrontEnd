import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  Chip,
  Box,
  Button,
  Avatar,
  Rating,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { api } from "../../../Config/Api";
import type { KocRegistration, RegistrationApprovalResponse } from "../../../types/affiliateCampaignTypes";

// Fake data generator for UI enhancement
const generateFakeKocData = (kocId: number) => ({
  followers: Math.floor(Math.random() * 50000) + 1000,
  rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${kocId}`,
  socialPlatforms: ["Instagram", "TikTok", "Facebook"].slice(0, Math.floor(Math.random() * 3) + 1),
});

const brand = {
  primary: "#ee4d2d",
  light: "#fff7f5",
} as const;

const KocRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<KocRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    registrationId: number | null;
    action: "approve" | "reject" | null;
    kocName: string;
  }>({ open: false, registrationId: null, action: null, kocName: "" });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; type: "success" | "error" }>({
    open: false,
    msg: "",
    type: "success",
  });

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const jwt = localStorage.getItem("jwt") || "";
      const res = await api.get("/api/sellers/campaign-registrations", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("API Response:", res.data);
      // Đảm bảo res.data là array
      if (Array.isArray(res.data)) {
        setRegistrations(res.data);
      } else {
        console.error("API response is not an array:", res.data);
        setRegistrations([]);
        setSnack({ open: true, msg: "Invalid data format received", type: "error" });
      }
    } catch (error: any) {
      console.error("Failed to fetch registrations:", error);
      setRegistrations([]);
      setSnack({ open: true, msg: "Failed to load registrations", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (registrationId: number, action: "approve" | "reject") => {
    try {
      setActionLoading(registrationId);
      const jwt = localStorage.getItem("jwt") || "";
      await api.put(`/api/sellers/affiliate-registrations/${action}/${registrationId}`, {}, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      
      setSnack({ 
        open: true, 
        msg: `Registration ${action}d successfully!`, 
        type: "success" 
      });
      
      // Update local state
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: action.toUpperCase() as "APPROVED" | "REJECTED" }
            : reg
        )
      );
    } catch (error: any) {
      setSnack({ 
        open: true, 
        msg: error?.response?.data?.message || `Failed to ${action} registration`, 
        type: "error" 
      });
    } finally {
      setActionLoading(null);
      setConfirmDialog({ open: false, registrationId: null, action: null, kocName: "" });
    }
  };

  const openConfirmDialog = (registrationId: number, action: "approve" | "reject", kocName: string) => {
    setConfirmDialog({ open: true, registrationId, action, kocName });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Card>
        <CardHeader
          title="KOC Campaign Registrations"
          subheader={`${Array.isArray(registrations) ? registrations.length : 0} total registrations`}
          avatar={<CampaignIcon sx={{ color: brand.primary }} />}
        />
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : !Array.isArray(registrations) || registrations.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No KOC registrations found for your campaigns.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {registrations.map((reg) => {
                const fakeData = generateFakeKocData(reg.koc.id);
                const statusColor = reg.status === "APPROVED" ? "success" : reg.status === "REJECTED" ? "error" : "warning";
                const isPending = reg.status === "PENDING";
                
                return (
                  <Card 
                    key={reg.id} 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 2,
                      border: `1px solid ${brand.primary}22`,
                      "&:hover": { boxShadow: 2 }
                    }}
                  >
                    <CardContent>
                      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
                        {/* KOC Info */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                          <Avatar 
                            src={fakeData.avatar} 
                            sx={{ width: 56, height: 56 }}
                          />
                          <Box>
                            <Typography variant="h6" fontWeight={600}>
                              {reg.koc.customer.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              @{reg.koc.customer.account.username} • {reg.koc.kocCode}
                            </Typography>
                            <Stack direction="row" spacing={2} mt={1}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <PeopleIcon fontSize="small" color="action" />
                                {/* <Typography variant="caption">
                                  {fakeData.followers.toLocaleString()} followers
                                </Typography> */}
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <Rating value={fakeData.rating} precision={0.1} size="small" readOnly />
                                <Typography variant="caption">({fakeData.rating})</Typography>
                              </Box>
                            </Stack>
                            <Stack direction="row" spacing={0.5} mt={0.5}>
                              {fakeData.socialPlatforms.map((platform) => (
                                <Chip key={platform} label={platform} size="small" variant="outlined" />
                              ))}
                            </Stack>
                          </Box>
                        </Box>

                        {/* Campaign Info */}
                        <Box sx={{ minWidth: 200 }}>
                          <Typography variant="subtitle2" fontWeight={600} color={brand.primary}>
                            {reg.campaign.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {reg.campaign.campaignCode}
                          </Typography>
                          <Chip 
                            size="small" 
                            color="success" 
                            label={`${reg.campaign.commissionPercent}% commission`}
                            sx={{ mt: 1 }}
                          />
                          <Typography variant="caption" display="block" mt={1} color="text.secondary">
                            Applied: {new Date(reg.registeredAt).toLocaleDateString()}
                          </Typography>
                        </Box>

                        {/* Actions */}
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                          <Chip 
                            label={reg.status} 
                            color={statusColor as any}
                            sx={{ fontWeight: 600, minWidth: 80 }}
                          />
                          {isPending && (
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Approve">
                                <IconButton
                                  color="success"
                                  size="small"
                                  disabled={actionLoading === reg.id}
                                  onClick={() => openConfirmDialog(reg.id, "approve", reg.koc.customer.fullName)}
                                >
                                  {actionLoading === reg.id ? <CircularProgress size={20} /> : <CheckIcon />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  color="error"
                                  size="small"
                                  disabled={actionLoading === reg.id}
                                  onClick={() => openConfirmDialog(reg.id, "reject", reg.koc.customer.fullName)}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          )}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogTitle>
          {confirmDialog.action === "approve" ? "Approve" : "Reject"} Registration
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmDialog.action} <strong>{confirmDialog.kocName}</strong>'s registration?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmDialog.action === "approve" ? "success" : "error"}
            onClick={() => confirmDialog.registrationId && confirmDialog.action && 
              handleAction(confirmDialog.registrationId, confirmDialog.action)
            }
          >
            {confirmDialog.action === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snack.type} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default KocRegistrations;

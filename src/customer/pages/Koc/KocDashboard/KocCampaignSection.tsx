import React, { useEffect, useState } from "react";


import {
  Card, CardHeader, CardContent, Typography, Stack, Chip, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert
} from "@mui/material";
import { useAppDispatch } from "../../../../Redux Toolkit/Store";
import { fetchKocRegistrations, registerKocCampaign } from "../../../../Redux Toolkit/Customer/Koc/KocSlice";
import CampaignIcon from "@mui/icons-material/Campaign";
import { fetchActiveCampaigns } from "../../../util/affiliateCampaignApi";

const brand = {
  primary: "#ee4d2d",
  light: "#fff7f5",
} as const;

const KocCampaignSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const [registrations, setRegistrations] = useState<any[]>([]); // Sửa lại type nếu đã có
  const [openRegister, setOpenRegister] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; type: "success" | "info" }>({ open: false, msg: "", type: "success" });
  const [campaignId, setCampaignId] = useState("");
  const [campaigns, setCampaigns] = useState<any[]>([]); // <-- Đặt ở đây // Sửa lại type nếu đã có
  // Lấy danh sách campaign ACTIVE
  useEffect(() => {
    fetchActiveCampaigns().then(data => setCampaigns(Array.isArray(data) ? data : []));
  }, []);
  useEffect(() => {
    dispatch(fetchKocRegistrations())
      .unwrap()
      .then(data => setRegistrations(Array.isArray(data) ? data : []))
      .catch(() => setRegistrations([]));
  }, [dispatch]);

  const handleRegister = async () => {
    if (!campaignId) {
      setSnack({ open: true, msg: "Vui lòng nhập Campaign ID", type: "info" });
      return;
    }
    setRegistering(true);
    try {
      await dispatch(registerKocCampaign(Number(campaignId))).unwrap();
      setSnack({ open: true, msg: "Đăng ký thành công!", type: "success" });
      dispatch(fetchKocRegistrations()).unwrap().then(setRegistrations);
      setOpenRegister(false);
      setCampaignId("");
    } catch (e: any) {
      setSnack({ open: true, msg: e?.message || "Đăng ký thất bại", type: "info" });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
        <CardHeader title="Chiến dịch đã đăng ký" />
        <CardContent>
          {Array.isArray(registrations) && registrations.length === 0 ? (
            <Typography color="text.secondary">Bạn chưa đăng ký chiến dịch nào.</Typography>
          ) : (
            <Stack spacing={1.5}>
              {Array.isArray(registrations) && registrations.map((reg) => (
                <Card key={reg.id} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography fontWeight={600}>{reg.campaignTitle}</Typography>
                        <Typography variant="caption" color="text.secondary">#{reg.campaignId}</Typography>
                      </Box>
                      <Typography variant="body2">{new Date(reg.registeredAt).toLocaleString()}</Typography>
                      <Chip label={reg.status} color={reg.status === "APPROVED" ? "success" : reg.status === "REJECTED" ? "error" : "warning"} />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
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
              onChange={e => setCampaignId(e.target.value)}
              placeholder="Chọn chiến dịch"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.name} (#{c.id})</option>
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

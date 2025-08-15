import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

// ===== Helpers to convert DOB between display and input =====
function toISOFromVi(dobVi: string) {
  // input like "29/12/2003" -> "2003-12-29"
  const m = dobVi.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "";
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}
function toViFromISO(iso: string) {
  // input like "2003-12-29" -> "29/12/2003"
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const [, yyyy, mm, dd] = m;
  return `${dd}/${mm}/${yyyy}`;
}

// ===== Mock data =====
const mockUser = {
  name: "Phạm Tấn Phát",
  email: "phamtanphat@example.com",
  cccd: "082203004429",
  dob: "29/12/2003", // hiển thị dạng vi-VN
  gender: "MALE" as "MALE" | "FEMALE" | "OTHER",
  phone: "0379205270",
  avatar: "https://i.pravatar.cc/150?u=nguyenvana",
  joinedAt: "2024-05-20",
};

type FormState = typeof mockUser & { dobISO?: string };

export default function AdminMyProfile() {
  const [user, setUser] = useState({ ...mockUser }); // view data
  const [edit, setEdit] = useState<FormState>(() => ({ ...mockUser, dobISO: toISOFromVi(mockUser.dob) }));
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: "success" | "error"; msg: string }>({
    open: false,
    type: "success",
    msg: "",
  });

  // Basic validations
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!edit.name?.trim()) e.name = "Vui lòng nhập họ tên";
    if (!/^\d{9,11}$/.test(edit.phone || "")) e.phone = "Số điện thoại 9–11 số";
    if (!/^\d{12}$/.test(edit.cccd || "")) e.cccd = "CCCD phải 12 số";
    if (!edit.dobISO) e.dobISO = "Chọn ngày sinh";
    else if (new Date(edit.dobISO) > new Date()) e.dobISO = "Ngày sinh không được ở tương lai";
    return e;
  }, [edit]);

  const startEdit = () => {
    setEdit({ ...user, dobISO: toISOFromVi(user.dob) });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEdit({ ...user, dobISO: toISOFromVi(user.dob) });
  };

  const save = async () => {
    if (Object.keys(errors).length) {
      setToast({ open: true, type: "error", msg: "Vui lòng kiểm tra lại các trường" });
      return;
    }
    try {
      setSaving(true);
      // ===== MOCK API CALL =====
      await new Promise((r) => setTimeout(r, 800));
      // Update view state from edit state (convert dob back to vi)
      const next = {
        name: edit.name.trim(),
        email: edit.email,
        cccd: edit.cccd,
        dob: toViFromISO(edit.dobISO || ""),
        gender: edit.gender,
        phone: edit.phone,
        avatar: user.avatar,
        joinedAt: user.joinedAt,
      };
      setUser(next);
      setIsEditing(false);
      setToast({ open: true, type: "success", msg: "Update successfully" });
    } catch (e: any) {
      setToast({ open: true, type: "error", msg: e?.message || "Có lỗi xảy ra" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 560, width: "100%", borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Avatar src={user.avatar} sx={{ width: 100, height: 100 }} />
            <Typography variant="h5" fontWeight={700}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {new Date(user.joinedAt).toLocaleDateString("vi-VN")}
            </Typography>
            <Divider flexItem sx={{ my: 1 }} />

            {/* VIEW mode */}
            {!isEditing && (
              <>
                <Box width="100%">
                  <Typography variant="subtitle1" fontWeight={600}>Email</Typography>
                  <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  <Typography variant="subtitle1" fontWeight={600} mt={2}>Phone</Typography>
                  <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
                  <Typography variant="subtitle1" fontWeight={600} mt={2}>CCCD</Typography>
                  <Typography variant="body2" color="text.secondary">{user.cccd}</Typography>
                  <Typography variant="subtitle1" fontWeight={600} mt={2}>Birth Day</Typography>
                  <Typography variant="body2" color="text.secondary">{user.dob}</Typography>
                  <Typography variant="subtitle1" fontWeight={600} mt={2}>Gender</Typography>
                  <Typography variant="body2" color="text.secondary">{user.gender}</Typography>
                </Box>

                <Divider flexItem sx={{ my: 1 }} />
                <Button variant="contained" color="primary" fullWidth onClick={startEdit}>
                  Edit Profile
                </Button>
              </>
            )}

            {/* EDIT mode */}
            {isEditing && (
              <Stack width="100%" spacing={2}>
                <TextField
                  label="Họ và tên"
                  size="small"
                  value={edit.name}
                  onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  label="Email"
                  size="small"
                  value={edit.email}
                  InputProps={{ readOnly: true }}
                  helperText="Email cố định"
                />
                <TextField
                  label="Số điện thoại"
                  size="small"
                  value={edit.phone}
                  onChange={(e) => setEdit((s) => ({ ...s, phone: e.target.value }))}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
                <TextField
                  label="CCCD"
                  size="small"
                  value={edit.cccd}
                  onChange={(e) => setEdit((s) => ({ ...s, cccd: e.target.value }))}
                  error={!!errors.cccd}
                  helperText={errors.cccd}
                />
                <TextField
                  label="Ngày sinh"
                  type="date"
                  size="small"
                  value={edit.dobISO || ""}
                  onChange={(e) => setEdit((s) => ({ ...s, dobISO: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dobISO}
                  helperText={errors.dobISO}
                />
                <TextField
                  select
                  label="Giới tính"
                  size="small"
                  value={edit.gender}
                  onChange={(e) => setEdit((s) => ({ ...s, gender: e.target.value as any }))}
                >
                  <MenuItem value="MALE">Nam</MenuItem>
                  <MenuItem value="FEMALE">Nữ</MenuItem>
                  <MenuItem value="OTHER">Khác</MenuItem>
                </TextField>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button variant="contained" onClick={save} disabled={saving}>
                    {saving ? "Đang lưu..." : "Lưu"}
                  </Button>
                  <Button variant="outlined" onClick={cancelEdit} disabled={saving}>
                    Hủy
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={toast.open}
        autoHideDuration={2200}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast.type} variant="filled" onClose={() => setToast((t) => ({ ...t, open: false }))}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

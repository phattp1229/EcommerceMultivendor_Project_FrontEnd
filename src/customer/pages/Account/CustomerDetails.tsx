import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Wc as WcIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { useAppSelector, useAppDispatch } from "../../../Redux Toolkit/Store";
import { updateCustomerProfile } from "../../../Redux Toolkit/Customer/CustomerProfileSlice";

/**
 * A cleaner, more professional profile form using MUI v5.
 * Highlights
 * - Prominent header card with avatar + quick info
 * - Two-column layout on desktop, single-column on mobile
 * - Sticky action bar that appears only in edit mode
 * - Subtle dividers, spacing, and accessible labels
 */

const CustomerDetails = () => {
  const { customer } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const jwt = useAppSelector((store) => store.auth.jwt);
  const { enqueueSnackbar } = useSnackbar();

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState(""); // ISO YYYY-MM-DD
  const [gender, setGender] = useState("");

  useEffect(() => {
    if (customer.customer) {
      setFullName(customer.customer.fullName || "");
      setMobile(customer.customer.mobile || "");
      setGender(customer.customer.gender || "");

      const raw = customer.customer.dob || "";
      if (/^\d{2}-\d{2}-\d{4}$/.test(raw)) {
        const [dd, mm, yyyy] = raw.split("-");
        setDob(`${yyyy}-${mm}-${dd}`);
      } else {
        setDob(raw);
      }
    }
  }, [customer.customer]);

  const inputStyleProps = {
    InputProps: {
      style: { fontWeight: 500 },
    },
    InputLabelProps: {
      style: { fontWeight: 600 },
    },
  } as const;

  const handleUpdate = async () => {
    try {
      const payload = {
        fullName,
        mobile,
        gender,
        dob: dob?.trim() ? dob : null,
      };

      await dispatch(updateCustomerProfile({ jwt: jwt as string, data: payload })).unwrap();
      enqueueSnackbar("Update profile successfully!", { variant: "success" });
      setIsEditing(false);
    } catch (e) {
      enqueueSnackbar("Update failed!", { variant: "error" });
    }
  };

  const handleCancel = () => {
    if (customer.customer) {
      setFullName(customer.customer.fullName || "");
      setMobile(customer.customer.mobile || "");
      setGender(customer.customer.gender || "");
      const raw = customer.customer.dob || "";
      if (/^\d{2}-\d{2}-\d{4}$/.test(raw)) {
        const [dd, mm, yyyy] = raw.split("-");
        setDob(`${yyyy}-${mm}-${dd}`);
      } else {
        setDob(raw);
      }
    }
    setIsEditing(false);
  };

  const isKoc = Boolean(customer.customer?.koc);
  const email = customer.customer?.account?.email || "";
  const nameForAvatar = customer.customer?.fullName || "User";

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      {/* HEADER CARD */}
      <Card
        sx={{
          overflow: "hidden",
          borderRadius: 4,
          boxShadow: (t) => `0 10px 30px rgba(0,0,0,${t.palette.mode === "light" ? 0.06 : 0.4})`,
        }}
      >
        <Box
          sx={{
            background: (t) =>
              t.palette.mode === "light"
                ? "linear-gradient(135deg, #EEF2FF 0%, #FDF2F8 100%)"
                : "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
            px: { xs: 3, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} spacing={3}>
            <Avatar sx={{ width: 80, height: 80, fontSize: 28 }}>
              {nameForAvatar.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="h5" fontWeight={800} sx={{ mr: 1 }}>
                  {nameForAvatar}
                </Typography>
                <Chip
                  size="small"
                  color={isKoc ? "secondary" : "default"}
                  label={isKoc ? "KOC" : "Customer"}
                  sx={{ fontWeight: 700, borderRadius: 1 }}
                />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
              </Stack>
            </Box>

            {!isEditing ? (
              <Tooltip title="Edit Profile">
                <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              </Tooltip>
            ) : (
              <Stack direction="row" spacing={1}>
                <Tooltip title="Cancel">
                  <Button startIcon={<CloseIcon />} variant="text" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Tooltip>
                <Tooltip title="Save changes">
                  <Button startIcon={<SaveIcon />} variant="contained" onClick={handleUpdate}>
                    Save
                  </Button>
                </Tooltip>
              </Stack>
            )}
          </Stack>
        </Box>

        <CardHeader
          title={<Typography variant="subtitle1" fontWeight={800}>Personal Details</Typography>}
          subheader="Keep your information up to date"
          sx={{ pb: 0, px: { xs: 3, md: 4 } }}
        />

        <CardContent sx={{ px: { xs: 3, md: 4 }, pb: 4 }}>
          <Grid container spacing={2.5}>
            <Grid size = {{xs:12 , sm: 6}}>
              <TextField
                {...inputStyleProps}
                label="Full Name"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
                placeholder="John Doe"
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, opacity: 0.6 }} />,
                }}
              />
            </Grid>

            <Grid size = {{xs:12 , sm: 6}}>
              <TextField
                {...inputStyleProps}
                label="Email"
                fullWidth
                value={email}
                disabled
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, opacity: 0.6 }} />,
                }}
              />
            </Grid>

            <Grid size = {{xs:12 , sm: 6}}>
              <TextField
                {...inputStyleProps}
                label="Mobile"
                fullWidth
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={!isEditing}
                placeholder="090xxxxxxx"
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, opacity: 0.6 }} />,
                }}
              />
            </Grid>

            <Grid size = {{xs:12 , sm: 6}}>
              <TextField
                {...inputStyleProps}
                label="Date of Birth"
                type="date"
                fullWidth
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={!isEditing}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CakeIcon sx={{ mr: 1, opacity: 0.6 }} />,
                }}
              />
            </Grid>

            <Grid size = {{xs:12 , sm: 6}}>
              <TextField
                {...inputStyleProps}
                label="Gender"
                fullWidth
                select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={!isEditing}
                SelectProps={{ native: true }}
                InputProps={{
                  startAdornment: <WcIcon sx={{ mr: 1, opacity: 0.6 }} />,
                }}
              >
                <option value=""></option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </TextField>
            </Grid>

            <Grid size = {{xs:12 , sm: 6}}>
              <TextField
                {...inputStyleProps}
                label="Customer Type"
                fullWidth
                value={isKoc ? "KOC" : "Customer"}
                disabled
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="caption" color="text.secondary">
            Your data is securely stored. Changes require clicking <b>Save</b>.
          </Typography>
        </CardContent>
      </Card>

      {/* STICKY ACTION BAR - appears only in edit mode */}
      {isEditing && (
        <Box
          sx={{
            position: "sticky",
            bottom: 16,
            mt: 3,
            zIndex: 100,
          }}
        >
          <Card sx={{ borderRadius: 999, px: 2, py: 1, boxShadow: 6 }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <Button startIcon={<CloseIcon />} onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleUpdate}>
                Save changes
              </Button>
            </Stack>
          </Card>
        </Box>
      )}
    </Container>
  );
};

export default CustomerDetails;
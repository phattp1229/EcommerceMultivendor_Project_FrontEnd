import { useState } from "react";
import {
  Button, Dialog, DialogContent, TextField, Stack, Box, Typography,
  InputAdornment, IconButton, Chip, Paper, Divider, Alert, LinearProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { SiTiktok } from "react-icons/si";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createKoc, resetKocState } from "../../../Redux Toolkit/Customer/Koc/KocSlice";
import { useSnackbar } from "notistack";
import { fetchCustomerProfile } from "../../../Redux Toolkit/Customer/CustomerProfileSlice";
import { useNavigate } from "react-router-dom";

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: 0,
    overflow: 'visible',
    maxWidth: 600,
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
  color: 'white',
  padding: theme.spacing(3),
  position: 'relative',
  textAlign: 'center',
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
}));

const SocialInputField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    '&:hover': {
      backgroundColor: '#f1f3f4',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ee4d2d',
        borderWidth: 2,
      },
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ee4d2d',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
  borderRadius: 12,
  padding: '12px 32px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(238, 77, 45, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #d63916 0%, #e55a2b 100%)',
    boxShadow: '0 6px 16px rgba(238, 77, 45, 0.4)',
  },
}));

export default function KocSignupButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    facebookLink: "",
    instagramLink: "",
    tiktokLink: "",
    youtubeLink: "",
  });

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const jwt = localStorage.getItem("jwt") || "";
  const { customer, koc } = useAppSelector((s) => s);
  const customerId = customer.customer?.id;
  const alreadyKoc = !!customer.customer?.koc; // backend đang set cờ này

  const handleOpen = () => {
    if (!jwt) {
      enqueueSnackbar("You need to log in first", { variant: "warning" });
      navigate("/login");
      return;
    }
    if (!customerId) {
      enqueueSnackbar("Cannot detect your customer profile", { variant: "error" });
      return;
    }
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); dispatch(resetKocState()); };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const hasAny =
      form.facebookLink || form.instagramLink || form.tiktokLink || form.youtubeLink;
    if (!hasAny) {
      enqueueSnackbar("Please provide at least one social link", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        createKoc({
          jwt,
          data: { customerId: customerId!, ...form },
        })
      ).unwrap();
      enqueueSnackbar("🎉 Welcome to KOC Program! Your application is being reviewed.", { variant: "success" });
      setOpen(false);
      // refresh profile để cập nhật flag customer.koc
      await dispatch(
        fetchCustomerProfile({ jwt, navigate })
      );
    } catch (err: any) {
      enqueueSnackbar(typeof err === "string" ? err : "Failed to sign up KOC", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (alreadyKoc) return null; // đã là KOC thì ẩn nút

  const socialPlatforms = [
    {
      name: 'tiktokLink',
      label: 'TikTok Profile',
      placeholder: 'https://www.tiktok.com/@yourusername',
      icon: <SiTiktok style={{ fontSize: 20, color: '#000000' }} />,
      color: '#000000',
    },
    {
      name: 'facebookLink',
      label: 'Facebook Page',
      placeholder: 'https://www.facebook.com/yourpage',
      icon: <FacebookIcon sx={{ color: '#1877F2' }} />,
      color: '#1877F2',
    },
    {
      name: 'instagramLink',
      label: 'Instagram Profile',
      placeholder: 'https://www.instagram.com/yourusername',
      icon: <InstagramIcon sx={{ color: '#E4405F' }} />,
      color: '#E4405F',
    },
    {
      name: 'youtubeLink',
      label: 'YouTube Channel',
      placeholder: 'https://www.youtube.com/c/yourchannel',
      icon: <YouTubeIcon sx={{ color: '#FF0000' }} />,
      color: '#FF0000',
    },
  ];

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          background: 'linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)',
          borderRadius: 2,
          px: 3,
          py: 1.5,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 12px rgba(238, 77, 45, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d63916 0%, #e55a2b 100%)',
            boxShadow: '0 6px 16px rgba(238, 77, 45, 0.4)',
          },
        }}
      >
        🌟 Become a KOC
      </Button>

      <StyledDialog open={open} onClose={!loading ? handleClose : undefined}>
        {loading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />}

        {/* Header Section */}
        <HeaderSection>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              🚀 Join KOC Program
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 400, mx: 'auto' }}>
              Become a Key Opinion Consumer and start earning commissions by sharing products you love!
            </Typography>
          </Box>

          {/* Benefits */}
          <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 3 }}>
            <Box textAlign="center">
              <MonetizationOnIcon sx={{ fontSize: 32, mb: 0.5 }} />
              <Typography variant="caption" display="block">Earn Commission</Typography>
            </Box>
            <Box textAlign="center">
              <TrendingUpIcon sx={{ fontSize: 32, mb: 0.5 }} />
              <Typography variant="caption" display="block">Grow Audience</Typography>
            </Box>
            <Box textAlign="center">
              <StarIcon sx={{ fontSize: 32, mb: 0.5 }} />
              <Typography variant="caption" display="block">Premium Support</Typography>
            </Box>
          </Stack>
        </HeaderSection>

        {/* Content Section */}
        <ContentSection>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Alert
              severity="info"
              sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor: '#e3f2fd',
                '& .MuiAlert-icon': { color: '#1976d2' }
              }}
            >
              <Typography variant="body2">
                <strong>Required:</strong> Please provide at least one social media profile to verify your influence and audience.
              </Typography>
            </Alert>

            <Stack spacing={3}>
              {socialPlatforms.map((platform) => (
                <SocialInputField
                  key={platform.name}
                  name={platform.name}
                  label={platform.label}
                  placeholder={platform.placeholder}
                  value={form[platform.name as keyof typeof form]}
                  onChange={onChange}
                  disabled={loading}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          {platform.icon}
                        </InputAdornment>
                      ),
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons - Always visible at bottom */}
          <Box sx={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            pt: 2,
            borderTop: '1px solid #f0f0f0'
          }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={handleClose}
                disabled={loading}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <SubmitButton
                onClick={handleSubmit}
                disabled={loading}
                variant="contained"
              >
                {loading ? 'Submitting...' : '🎯 Submit Application'}
              </SubmitButton>
            </Stack>
          </Box>
        </ContentSection>
      </StyledDialog>
    </>
  );
}

import { useState } from "react";
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createKoc, resetKocState } from "../../../Redux Toolkit/Customer/Koc/KocSlice";
import { useSnackbar } from "notistack";
import { fetchCustomerProfile } from "../../../Redux Toolkit/Customer/CustomerProfileSlice";
import { useNavigate } from "react-router-dom";

export default function KocSignupButton() {
  const [open, setOpen] = useState(false);
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
    try {
      await dispatch(
        createKoc({
          jwt,
          data: { customerId: customerId!, ...form },
        })
      ).unwrap();
      enqueueSnackbar("Signed up as KOC successfully!", { variant: "success" });
      setOpen(false);
      // refresh profile để cập nhật flag customer.koc
      await dispatch(
        fetchCustomerProfile({ jwt, navigate })
      );
    } catch (err: any) {
      enqueueSnackbar(typeof err === "string" ? err : "Failed to sign up KOC", {
        variant: "error",
      });
    }
  };

  if (alreadyKoc) return null; // đã là KOC thì ẩn nút

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Sign up KOC
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Sign up as KOC</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField name="tiktokLink" label="TikTok link" value={form.tiktokLink} onChange={onChange}/>
            <TextField name="facebookLink" label="Facebook link" value={form.facebookLink} onChange={onChange}/>
            <TextField name="instagramLink" label="Instagram link" value={form.instagramLink} onChange={onChange}/>
            <TextField name="youtubeLink" label="YouTube link" value={form.youtubeLink} onChange={onChange}/>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

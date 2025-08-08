import { Divider, Button, TextField, MenuItem } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../../Redux Toolkit/Store";
import { useState, useEffect } from "react";
import { updateCustomerProfile } from "../../../Redux Toolkit/Customer/CustomerProfileSlice";
import { useSnackbar } from "notistack";

const CustomerDetails = () => {
  const { customer } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const jwt = useAppSelector((store) => store.auth.jwt);

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState(""); // giữ ISO: YYYY-MM-DD
  const [gender, setGender] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (customer.customer) {
      setFullName(customer.customer.fullName || "");
      setMobile(customer.customer.mobile || "");
      setGender(customer.customer.gender || "");

      const raw = customer.customer.dob || "";
      if (/^\d{2}-\d{2}-\d{4}$/.test(raw)) {
        // Nếu dữ liệu cũ DD-MM-YYYY -> đổi sang ISO cho input date
        const [dd, mm, yyyy] = raw.split("-");
        setDob(`${yyyy}-${mm}-${dd}`);
      } else {
        // Đã là ISO hoặc rỗng
        setDob(raw);
      }
    }
  }, [customer.customer]);

  const inputStyleProps = {
    InputProps: {
      style: { fontWeight: "bold", color: "#000" },
    },
    InputLabelProps: {
      style: { fontWeight: "bold", color: "#333" },
    },
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        fullName,
        mobile,
        gender,
        dob: dob?.trim() ? dob : null, // gửi ISO hoặc null cho LocalDate
      };

      console.log("Payload gửi backend:", payload);
      console.log("JWT gửi đi:", jwt);

      await dispatch(updateCustomerProfile({ jwt: jwt as string, data: payload })).unwrap();
      enqueueSnackbar("Update profile successfully!", { variant: "success" });
      setIsEditing(false);
    } catch {
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

  return (
    <div className="flex justify-center py-10">
      {/* KHÔNG dùng onSubmit để tránh double-submit */}
      <form className="w-full lg:w-[70%] space-y-5">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600">Personal Details</h1>
          {!isEditing && (
            <Button variant="outlined" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        <TextField
          {...inputStyleProps}
          label="Full Name"
          fullWidth
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={!isEditing}
        />
        <Divider />

        <TextField
          {...inputStyleProps}
          label="Email"
          fullWidth
          value={customer.customer?.email || ""}
          disabled
        />
        <Divider />

        <TextField
          {...inputStyleProps}
          label="Mobile"
          fullWidth
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          disabled={!isEditing}
        />
        <Divider />

        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          value={dob} // ISO: YYYY-MM-DD
          onChange={(e) => setDob(e.target.value)}
          disabled={!isEditing}
          InputLabelProps={{ shrink: true }}
        />
        <Divider />

        <TextField
          {...inputStyleProps}
          label="Gender"
          fullWidth
          select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          disabled={!isEditing}
        >
          <MenuItem value="MALE">Male</MenuItem>
          <MenuItem value="FEMALE">Female</MenuItem>
          <MenuItem value="OTHER">Other</MenuItem>
        </TextField>
        <Divider />

        <TextField
          {...inputStyleProps}
          label="Customer Type"
          fullWidth
          value={customer.customer?.koc ? "KOC" : "Customer"}
          disabled
        />
        <Divider />

        {isEditing && (
          <div className="flex gap-3">
            {/* type="button" để không submit form */}
            <Button onClick={handleUpdate} type="button" variant="contained" color="primary">
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CustomerDetails;

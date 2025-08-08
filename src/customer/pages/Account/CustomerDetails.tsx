import { Divider, Button, TextField, MenuItem } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../../Redux Toolkit/Store";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { updateCustomerProfile } from "../../../Redux Toolkit/Customer/CustomerProfileSlice";
import { useSnackbar } from 'notistack'; 

const CustomerDetails = () => {
  const { customer } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const jwt = useAppSelector((store) => store.auth.jwt);

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const { enqueueSnackbar } = useSnackbar(); 
  
  useEffect(() => {
    if (customer.customer) {
      setFullName(customer.customer.fullName || "");
      setMobile(customer.customer.mobile || "");
      setDob(customer.customer.dob || "");
      setGender(customer.customer.gender || "");
    }
  }, [customer.customer]);
    const inputStyleProps = {
      InputProps: {
        style: {
          fontWeight: "bold",
          color: "#000",
        },
      },
      InputLabelProps: {
        style: {
          fontWeight: "bold",
          color: "#333",
        },
      },
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      const formattedDob = dayjs(dob).format("DD-MM-YYYY");
  console.log("DOB gửi đi:", formattedDob);
    dispatch(
      updateCustomerProfile({
        jwt: jwt as string,
        data: {
          fullName,
          mobile,
          gender,
          dob: dayjs(dob).format("DD-MM-YYYY"),
          
        },
      })
    );
    setIsEditing(false);
  };
const handleUpdate = async () => {
    try {
       const formattedDob = dayjs(dob).format("DD-MM-YYYY");
    const payload = { fullName, mobile, gender, dob: formattedDob };
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
      setDob(customer.customer.dob || "");
      setGender(customer.customer.gender || "");
    }
    setIsEditing(false);
  };

  return (
    <div className="flex justify-center py-10">
      <form onSubmit={handleSubmit} className="w-full lg:w-[70%] space-y-5">
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
          value={customer.customer?.email}
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
          fullWidth
          type="date"
          {...inputStyleProps}
          value={dayjs(dob).format("YYYY-MM-DD")}
          onChange={(e) => setDob(e.target.value)}
          disabled={!isEditing}
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
          label="customer Type"
          fullWidth
          value={customer.customer?.koc ? "KOC" : "Customer"}
          disabled
        />
        <Divider />

        {isEditing && (
          <div className="flex gap-3">
            <Button onClick={handleUpdate} type="submit" variant="contained" color="primary">
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

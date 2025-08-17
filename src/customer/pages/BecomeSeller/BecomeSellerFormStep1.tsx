import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Grid, Typography } from "@mui/material";
import OTPInput from "../../components/OtpFild/OTPInput";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";

// Validation schema


const BecomeSellerFormStep1 = ({ formik, handleOtpChange }: any) => {



    const handleResendOTP = () => {
        console.log("handle resend otp")
    }

    return (
        <Box>
            <p className="text-xl font-bold text-center pb-9">Contact Details</p>

            <div className="space-y-9">
                <TextField
                fullWidth
                name="mobile"
                label="Mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
                />

                <TextField
                fullWidth
                name="taxCode"
                label="TaxCode Number"
                value={formik.values.taxCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.taxCode && Boolean(formik.errors.taxCode)}
                helperText={formik.touched.taxCode && formik.errors.taxCode}
                />

                <div>
               <label htmlFor="businessDetails.businessLicenseUrl">
  <Button variant="contained" component="span">
    Upload Business License
  </Button>
</label>

<input
  accept=".pdf,.jpg,.jpeg,.png"
  id="businessDetails.businessLicenseUrl"
  name="businessDetails.businessLicenseUrl"
  type="file"
  onChange={async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      const url = await uploadToCloudinary(file);            // nên dùng secure_url nếu có
      // ✅ Ghi đúng vào nested field:
      formik.setFieldValue("businessDetails.businessLicenseUrl", url);
    } catch (err) {
      console.error("Upload failed", err);
      formik.setFieldError("businessDetails.businessLicenseUrl", "Upload failed");
    }
  }}
  style={{ display: "none" }}
/>

{/* Hiển thị link đã up */}
{formik.values.businessDetails?.businessLicenseUrl && (
  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
    ✅ Uploaded:{" "}
    <a
      href={formik.values.businessDetails.businessLicenseUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {formik.values.businessDetails.businessLicenseUrl.split("/").pop()}
    </a>
  </Typography>
)}



                </div>

            </div>
        </Box>
    );
};

export default BecomeSellerFormStep1;

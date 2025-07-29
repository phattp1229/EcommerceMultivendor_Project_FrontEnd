import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Grid, Typography } from "@mui/material";
import OTPInput from "../../components/OtpFild/OTPInput";

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
                name="TaxCode"
                label="TaxCode Number"
                value={formik.values.TaxCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.TaxCode && Boolean(formik.errors.TaxCode)}
                helperText={formik.touched.TaxCode && formik.errors.TaxCode}
                />

                <div>
                <input
                    accept=".pdf,.jpg,.jpeg,.png"
                    id="business-license"
                    name="businessLicense"
                    type="file"
                    onChange={(event) => {
                    formik.setFieldValue("businessLicense", event.currentTarget.files?.[0]);
                    }}
                    style={{ display: "none" }}
                />

                <label htmlFor="business-license">
                    <Box
                    border="2px dashed #aaa"
                    p={1.5}
                    textAlign="center"
                    sx={{ cursor: "pointer", borderRadius: 2 }}
                    >
                    <Typography variant="body1" color="textSecondary">
                        {formik.values.businessLicense
                        ? formik.values.businessLicense.name
                        : "Click or drag to upload your business license"}
                    </Typography>
                    </Box>
                </label>

                {formik.touched.businessLicense && formik.errors.businessLicense && (
                    <Typography variant="caption" color="error">
                    {formik.errors.businessLicense}
                    </Typography>
                )}
                </div>
            </div>
        </Box>
    );
};

export default BecomeSellerFormStep1;

import {
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import BecomeSellerFormStep1 from "./BecomeSellerFormStep1";
import BecomeSellerFormStep2 from "./BecomeSellerFormStep2";
import BecomeSellerFormStep3 from "./BecomeSellerFormStep3";
import BecomeSellerFormStep4 from "./BecomeSellerFormStep4";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createSeller } from "../../../Redux Toolkit/Seller/sellerAuthenticationSlice";

const steps = [
  "Tax Details & Mobile",
  "Pickup Address",
  "Bank Details",
  "Shop Details",
];

// ✅ Yup validation schema cho tất cả step
const validationSchema = Yup.object({
  mobile: Yup.string().required("Mobile is required"),
  taxCode: Yup.string().required("Tax Code is required"),
  businessDetails: Yup.object({
    businessLicenseUrl: Yup.string().required("Business license is required"),
    businessName: Yup.string().required("Business name is required"),
  }),
  pickupAddress: Yup.object({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    locality: Yup.string().required("Locality is required"),
  }),
  bankDetails: Yup.object({
    accountNumber: Yup.string()
      .required("Account Number is required")
      .matches(/^[0-9]+$/, "Account number must be numeric"),
    bankName: Yup.string().required("Bank Name is required"),
    accountHolderName: Yup.string().required("Account Holder Name is required"),
  }),
  account: Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  }),
});

const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useAppDispatch();
  const { sellerAuth } = useAppSelector((store) => store);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  const [otp, setOtp] = useState<any>();

  // Show error when sellerAuth.error changes
  useEffect(() => {
    if (sellerAuth.error) {
      setShowError(true);
      setIsSubmitting(false); // reset submit state nếu lỗi
    }
  }, [sellerAuth.error]);

  const formik = useFormik({
    initialValues: {
      account: {
        username: "",
        email: "",
        password: "",
        otp: "",
      },
      mobile: "",
      taxCode: "",
      pickupAddress: {
        name: "",
        mobile: "",
        postalCode: "",
        street: "",
        locality: "",
        city: "",
        state: "",
      },
      bankDetails: {
        accountNumber: "",
        bankName: "",
        accountHolderName: "",
      },
      sellerName: "",
      businessDetails: {
        businessName: "",
        businessEmail: "",
        businessMobile: "",
        businessLicenseUrl: "",
        logo: "",
        banner: "",
        businessAddress: "",
      },
    },
    validationSchema,
    validateOnMount: false, // 👈 tránh validate ngay khi load
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (isSubmitting || sellerAuth.loading) return;

      setIsSubmitting(true);
      setShowError(false);

      dispatch(createSeller(values))
        .unwrap()
        .finally(() => setIsSubmitting(false));
    },
  });

  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
    formik.setFieldValue("account.otp", otpValue);
  };

  const isLastStep = activeStep === steps.length - 1;

  // ✅ Chỉ sang step tiếp theo nếu step hiện tại không lỗi
  const handleNext = async () => {
    const errors = await formik.validateForm();
    if (activeStep === 0) {
      if (errors.mobile || errors.taxCode || errors.businessDetails?.businessLicenseUrl) return;
    }
    if (activeStep === 1) {
      if (errors.pickupAddress) return;
    }
    if (activeStep === 2) {
      if (errors.bankDetails) return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="mt-20 space-y-10">
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            // Tránh Enter tự submit khi chưa ở bước cuối
            if (e.key === "Enter" && !isLastStep) {
              e.preventDefault();
            }
          }}
        >
          <div>
            {activeStep === 0 ? (
              <BecomeSellerFormStep1
                formik={formik}
                handleOtpChange={handleOtpChange}
              />
            ) : activeStep === 1 ? (
              <BecomeSellerFormStep2 formik={formik} />
            ) : activeStep === 2 ? (
              <BecomeSellerFormStep3 formik={formik} />
            ) : (
              <BecomeSellerFormStep4 formik={formik} />
            )}
          </div>

          <div className="flex items-center justify-between mt-8">
            <Button
              type="button"
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
              variant="contained"
            >
              Back
            </Button>

            {isLastStep ? (
              <Button
                type="submit"
                disabled={sellerAuth.loading || isSubmitting}
                variant="contained"
              >
                {sellerAuth.loading || isSubmitting ? (
                  <CircularProgress
                    size="small"
                    sx={{ width: "27px", height: "27px" }}
                  />
                ) : (
                  "Create Account"
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                variant="contained"
                disabled={isSubmitting}
              >
                Continue
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {sellerAuth.error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SellerAccountForm;

 
import { Button, CircularProgress, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import OTPInput from '../../components/OtpFild/OTPInput'
import {  useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import { sendLoginSignupOtp, signup } from '../../../Redux Toolkit/Customer/AuthSlice';
import { Password } from '@mui/icons-material';

const SignupForm = () => {

    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [timer, setTimer] = useState<number>(30); // Timer state
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store)

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: '',
            name: "",
            username:'',
            password:''
        },

        onSubmit: (values: any) => {
            // Handle form submission
            dispatch(signup({ fullName: values.name, email: values.email, otp, navigate }))
            console.log('Form data:', values);
        }
    });

    const handleOtpChange = (otp: any) => {

        setOtp(otp);

    };

    const handleResendOTP = () => {
        // Implement OTP resend logic
        dispatch(sendLoginSignupOtp({ email: formik.values.email }))
        console.log('Resend OTP');
        setTimer(30);
        setIsTimerActive(true);
    };

    const handleSentOtp = () => {
        setIsOtpSent(true);
        handleResendOTP();
    }

    const handleLogin = () => {
        formik.handleSubmit()
    }

    useEffect(() => {
        let interval: any;

        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimerActive(false);
                        return 30; // Reset timer for next OTP request
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive]);

    return (
        <div>
            <h1 className='text-center font-bold text-l text-primary-color pb-2'>Signup</h1>
            <form className="space-y-3">



                <TextField
                    fullWidth
                    name="email"
                    label="Enter Your Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email ? formik.errors.email as string : undefined}
                />

                {auth.otpSent && <div className="space-y-1">
                    <p className="font-medium text-sm">
                        * Enter OTP sent to your mobile number
                    </p>
                    <OTPInput
                        length={6}
                        onChange={handleOtpChange}
                        error={false}
                    />
                    <p className="text-xs space-x-1">
                        {isTimerActive ? (
                            <span>Resend OTP in {timer} seconds</span>
                        ) : (
                            <>
                                Didn't receive OTP?{" "}
                                <span
                                    onClick={handleResendOTP}
                                    className="text-teal-600 cursor-pointer hover:text-teal-800 font-semibold"
                                >
                                    Resend OTP
                                </span>
                            </>
                        )}
                    </p>
                    {formik.touched.otp && formik.errors.otp && <p>{formik.errors.otp as string}</p>}
                </div>}

             {auth.otpSent && (
                <>
                <TextField
                     fullWidth
                    name="name"
                    label="Enter Your FullName"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name ? formik.errors.name as string : undefined}
                />
                    <TextField
                    fullWidth
                    name="username"
                    label="Enter Username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username ? formik.errors.username as string : undefined}
                    margin="normal"
                    />

                    <TextField
                    fullWidth
                    name="password"
                    type="password"
                    label="Enter Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password ? formik.errors.password as string : undefined}
                    margin="normal"
                    />

                    <TextField
                    fullWidth
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword ? formik.errors.confirmPassword as string : undefined}
                    margin="normal"
                    />

                    <TextField
                    fullWidth
                    name="mobile"
                    label="Mobile Number"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile ? formik.errors.mobile as string : undefined}
                    margin="normal"
                    />
                </>
                )}
                {auth.otpSent && <div>
                    <Button
                        disabled={auth.loading}
                        onClick={handleLogin}
                        fullWidth variant='contained' sx={{ py: "9px" }}> {auth.loading ? <CircularProgress size="small"
                            sx={{ width: "22px", height: "22px" }} /> : " Signup "}  </Button>
                </div>}

                {!auth.otpSent && <Button
                    fullWidth
                    variant='contained'
                    onClick={handleSentOtp}
                    disabled={auth.loading}
                    sx={{ py: "9px" }}>
                    {auth.loading ? <CircularProgress size="small"
                        sx={{ width: "22px", height: "22px" }} /> : "sent otp"}

                </Button>
                }



            </form>


        </div>
    )
}

export default SignupForm
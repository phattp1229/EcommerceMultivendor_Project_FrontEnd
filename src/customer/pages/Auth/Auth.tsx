import React, { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import { Alert, Button, Snackbar } from '@mui/material';
import SignupForm from './SignupForm';
import { useAppSelector } from '../../../Redux Toolkit/Store';

const Auth = () => {
    const [isLoginPage, setIsLoginPage] = useState(true);
    const handleCloseSnackbar = () => setSnackbarOpen(false)
    const { auth } = useAppSelector(store => store)
    const [snackbarOpen, setSnackbarOpen] = useState(false);

useEffect(() => {
  if (isLoginPage && (auth.error || auth.success)) {
    setSnackbarOpen(true);
  }

  if (!isLoginPage && auth.otpSent) {
    setSnackbarOpen(true);
  }
}, [auth.error, auth.success, auth.otpSent, isLoginPage]);


    return (
        <div className='flex justify-center h-[90vh] items-center'>
            <div className='max-w-md h-[85vh] rounded-md border shadow-lg '>
                <img className='w-full rounded-t-md' src="/login_banner.png" alt="" />
                <div className='mt-8 px-10'>
                    {isLoginPage ? <LoginForm /> : <SignupForm />}

                    <div className='flex items-center gap-1 justify-center mt-5'>
                        <p>{isLoginPage && "Don't"} have Account ?</p>
                        <Button onClick={() => setIsLoginPage(!isLoginPage)} size='small'>{isLoginPage ? "create account" : "login"}</Button>
                    </div>
                </div>


            </div>
         <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
        >
                <Alert
                onClose={handleCloseSnackbar}
                severity={auth.error ? "error" : "success"}
                variant="filled"
                sx={{ width: '100%' }}
                >
                {
                    isLoginPage
                    ? (auth.error || "Login successful!")
                    : "OTP sent to your email!"
                }
                </Alert>

        </Snackbar>


        </div>
    )
}

export default Auth
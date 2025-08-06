 
import {  Button, CircularProgress, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import OTPInput from '../../components/OtpFild/OTPInput'
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import { sendLoginSignupOtp, signin } from '../../../Redux Toolkit/Customer/AuthSlice';
import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack'; // nếu dùng notistack
// import { resetAuthFlags } from '../../../Redux Toolkit/Customer/AuthSlice'; // import action

//validate
const validationSchema = Yup.object({
  username: Yup.string().required('Username cannot be blank'),
  password: Yup.string().required('Password cannot be blank'),
});

const LoginForm = () => {

    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [timer, setTimer] = useState<number>(30); // Timer state
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store)

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
 validationSchema: validationSchema,
           onSubmit: (values : any) => {
             dispatch(signin({
               username: values.username, 
               password: values.password,
               navigate}))
             console.log('Form data:', values);
           }
    });

    const handleLogin = () => {
        formik.handleSubmit()
    }

    // useEffect(() => {
    //     if (auth.isLoggedIn) {
    //         enqueueSnackbar("Login Succesfully !", { variant: "success" });
    //     }
    // }, [auth.isLoggedIn, dispatch]);



    return (
        <div>
            <h1 className='text-center font-bold text-xl text-primary-color pb-8'>Login</h1>
            <form className="space-y-5">

        <TextField
          fullWidth
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username ? formik.errors.username as string : undefined}
            />
            <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password ? formik.errors.password as string : undefined}
                />
                {<div>
                    <Button disabled={auth.loading} onClick={handleLogin}
                        fullWidth variant='contained' sx={{ py: "11px" }}>{
                            auth.loading ? <CircularProgress  />: "Login"}</Button>
                </div>}


            </form>

         
        </div>
    )
}

export default LoginForm
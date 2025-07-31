import { Button, TextField } from '@mui/material';
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import { verifyLoginOtp,verifyLogin } from '../../../Redux Toolkit/Seller/sellerAuthenticationSlice';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

//validate
const validationSchema = Yup.object({
  username: Yup.string().required('Username cannot be blank'),
  password: Yup.string().required('Password cannot be blank'),
});

const SellerLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
     validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(verifyLogin({
        username: values.username, 
        password: values.password,
        navigate
      }));
    }
  });

  return (
    <div>
      <h1 className='text-center font-bold text-xl text-primary-color pb-5'>Login As Seller</h1>
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
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
        helperText={formik.touched.password && formik.errors.password}
            />
        <Button
          type="submit"
          fullWidth
          variant='contained'
          sx={{ py: "11px" }}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default SellerLoginForm;

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Box, Button, TextField,} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAppDispatch } from '../../../Redux Toolkit/Store';


// Validation schema
const ContactSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    .required('Required'),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, 'Invalid pincode')
    .required('Required'),
  address: Yup.string().required('Required'),
  locality: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
});

interface AddressFormProp {
  handleClose: () => void;
  paymentGateway:string
}

const AddressForm:React.FC<AddressFormProp> = ({handleClose,paymentGateway}) => {
  const dispatch=useAppDispatch()
  const formik = useFormik({
    initialValues: {
      name: '',
      mobile: '',
      postalCode: '',
      street: '',
      locality: '',
      city: '',
      state: '',
    },
    validationSchema: ContactSchema,
    onSubmit: (values) => {
      console.log("form submited", values);
      handleCreateOrder();
      handleClose();
    },
  });

  const handleCreateOrder=()=>{
    // Dispatch action to create order

  }
 
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto'}}>
      <p className='text-xl font-bold text-center pb-5'>
        Contact Details
      </p>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid size={6}>
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
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              name="pinCode"
              label="Pin Code"
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
              helperText={formik.touched.postalCode && formik.errors.postalCode}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              name="address"
              label="Address (House No, Building, Street)"
              value={formik.values.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.street && Boolean(formik.errors.street)}
              helperText={formik.touched.street && formik.errors.street}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              name="locality"
              label="Locality/Town"
              value={formik.values.locality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.locality && Boolean(formik.errors.locality)}
              helperText={formik.touched.locality && formik.errors.locality}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </Grid>
          <Grid  size={6}>
            <TextField
              fullWidth
              name="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            />
          </Grid>
          <Grid size={12}>
            <Button sx={{py:"14px"}} type="submit" variant="contained" color="primary" fullWidth>
              Add Address
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
 
export default AddressForm;
 
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Box, Button, TextField,} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import type { Address } from '../../../types/customerTypes';
import { createOrder } from '../../../Redux Toolkit/Customer/OrderSlice';


// Validation schema
const ContactSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  mobile: Yup.string()
  .matches(/^0\d{9}$/, 'Invalid mobile number')
  .required('Required'),
  postalCode: Yup.string()
    .matches(/^\d{5}$/, 'Invalid postal code')
    .required('Required'),
  street: Yup.string().required('Required'),
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
      handleCreateOrder(values as unknown as Address);
      handleClose();
    },
  });

  const handleCreateOrder=(address: Address)=>{
    // Dispatch action to create order
    dispatch(createOrder({address, jwt: localStorage.getItem('jwt') || '', paymentGateway}));
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
              name="postalCode"
              label="Postal Code"
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
              name="street"
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
 
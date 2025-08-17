import { TextField } from '@mui/material'
import React from 'react'
interface BecomeSellerFormStep2Props {
  formik: any; // Replace 'any' with the correct type for formik instance
}

const BecomeSellerFormStep4 = ({ formik }: BecomeSellerFormStep2Props) => {
  return (
    <div className='space-y-5'>

      <TextField
        fullWidth
        name="businessDetails.businessName"
        label="Shop Name"
        value={formik.values.businessDetails.businessName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched?.businessDetails?.businessName && Boolean(formik.errors?.businessDetails?.businessName)}
        helperText={formik.touched?.businessDetails?.businessName && formik.errors?.businessDetails?.businessName}
      />

      <TextField
        fullWidth
        name="businessAddress"
        label="Shop Address"
        value={formik.values.businessAddress}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.businessAddress && Boolean(formik.errors.businessAddress)}
        helperText={formik.touched.businessAddress && formik.errors.businessAddress}
      />

     <TextField
      fullWidth
      name="account.email"
      label="Shop Email"
      value={formik.values.account.email}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched?.account?.email && Boolean(formik.errors?.account?.email)}
      helperText={formik.touched?.account?.email && formik.errors?.account?.email}
    />

    <TextField
      fullWidth
      name="account.username"
      label="Username"
      value={formik.values.account.username}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched?.account?.username && Boolean(formik.errors?.account?.username)}
      helperText={formik.touched?.account?.username && formik.errors?.account?.username}
    />

    <TextField
      fullWidth
      name="account.password"
      label="Enter Password"
      type="password"
      value={formik.values.account.password}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched?.account?.password && Boolean(formik.errors?.account?.password)}
      helperText={formik.touched?.account?.password && formik.errors?.account?.password}
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
    </div>
  )
}

export default BecomeSellerFormStep4
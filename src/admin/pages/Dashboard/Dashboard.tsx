import React, { useEffect, useState } from 'react'
import AdminRoutes from '../../../routes/AdminRoutes'

// import DrawerList from './DrawerList'
import Navbar from '../../../admin seller/components/navbar/Navbar'
import AdminDrawerList from '../../components/DrawerList'
import { Alert, Snackbar } from '@mui/material'
import { useAppSelector } from '../../../Redux Toolkit/Store'

const AdminDashboard = () => {
  //@ts-ignore
  const { adminDeals,admin } = useAppSelector(store => store)
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }
  useEffect(() => {
    if (adminDeals.dealCreated || adminDeals.dealUpdated ||adminDeals.error || admin.categoryUpdated) {
      setOpenSnackbar(true)
    }
  }, [adminDeals.dealCreated, adminDeals.dealUpdated, adminDeals.error,admin.categoryUpdated])
  return (
    <>
      <div className="min-h-screen">
        <Navbar DrawerList={AdminDrawerList} />
        <section className="lg:flex lg:h-[90vh]">
          <div className="hidden lg:block h-full">
            <AdminDrawerList />
          </div>
          <div className="p-10 w-full lg:w-[80%]  overflow-y-auto">
            <AdminRoutes />
          </div>
        </section>

      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen} autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={"success"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {adminDeals.error ? adminDeals.error : adminDeals.dealCreated ? "Deal created successfully" : adminDeals.dealUpdated 
          ? "deal updated successfully" : admin.categoryUpdated?"Category Updated successfully": ""}
        </Alert>
      </Snackbar>
    </>



  )
}

export default AdminDashboard
import { Alert, Button, Divider, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Order from './Order'
import CustomerDetails from './CustomerDetails'
import SavedCards from './SavedCards'
import OrderDetails from './OrderDetails'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'
import { performLogout } from '../../../Redux Toolkit/Customer/AuthSlice'
import Addresses from './Adresses'
import {Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from "@mui/material";
import KocSignupButton from '../BecomeKoc/KocSignup'
import KocDashboard from '../Koc/KocDashboard'


const baseMenu = [
  { name: "Orders", path: "/account/orders" },
  { name: "Profile", path: "/account/profile" },
  { name: "Saved Cards", path: "/account/saved-card" },
  { name: "Addresses", path: "/account/addresses" },
  { name: "Logout", path: "/" }
]

const Profile = () => {
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch()
    const { customer ,orders} = useAppSelector(store => store)
    const [snackbarOpen, setOpenSnackbar] = useState(false);

    // const handleLogout = () => {
    //     dispatch(performLogout())
    //     navigate("/")
    // }
    const confirmLogout = () => {
    dispatch(performLogout());
    setOpenLogoutDialog(false);
    navigate("/");
    };

    const cancelLogout = () => {
    setOpenLogoutDialog(false);
    };
    
  const menu = [
    ...(customer.customer?.koc ? [{ name: "KOC Dashboard", path: "/account/koc-dashboard" }] : []),
    ...baseMenu
  ];

        const handleClick = (item: any) => {
        if (item.name === "Logout") {
            setOpenLogoutDialog(true); // mở hộp thoại xác nhận
        } else {
            navigate(`${item.path}`);
        }
        };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        if (customer.profileUpdated || orders.orderCanceled ||customer.error) {
            setOpenSnackbar(true);
        }
    }, [customer.profileUpdated,orders.orderCanceled]);
    return (
          <div className='px-5 lg:px-52 min-h-screen mt-10 '>

            <div>
                <h1 className='text-xl font-bold pb-5'>{customer.customer?.fullName}</h1>
                
            </div>
            <Divider />
            <div className='grid grid-cols-1 lg:grid-cols-3 lg:min-h-[78vh]'>

                <div className="col-span-1 lg:border-r lg:pr-5 py-5 h-full  flex flex-row flex-wrap lg:flex-col gap-3">
                {!customer.customer?.koc && (
                    <div className='w-full'>
                    <KocSignupButton />
                    </div>
                )}
                    {menu.map((item, index) => <div
                        onClick={() => handleClick(item)}
                        className={`${menu.length - 1 !== index ? "border-b" : ""} ${item.path == location.pathname ? "bg-primary-color text-white" : ""} px-5 py-3 rounded-md hover:bg-teal-500 hover:text-white cursor-pointer `}>
                        <p>{item.name}</p>
                    </div>)}

                </div>
                <div className='lg:col-span-2 lg:pl-5 py-5'>

                    <Routes>
                        <Route path='/' element={<CustomerDetails />} />
                        <Route path='/orders' element={<Order />} />
                        <Route path='/orders/:orderId/:orderItemId' element={<OrderDetails />} />
                        <Route path='/profile' element={<CustomerDetails />} />
                        <Route path='/saved-card' element={<SavedCards />} />
                        <Route path='/addresses' element={<Addresses />} />
                        {/* addresses */}
                         <Route path='/koc-dashboard/*' element={<KocDashboard />} />
                    </Routes>

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
                    severity={customer.error ? "error" : "success"}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {customer.error ? customer.error : orders.orderCanceled?"order canceled successfully": "success"}
                </Alert>
            </Snackbar>
             <Dialog
                open={openLogoutDialog}
                onClose={cancelLogout}
            >
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to log out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelLogout}>Cancel</Button>
                    <Button onClick={confirmLogout} autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Profile
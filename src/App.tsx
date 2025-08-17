import './App.css'
import { ThemeProvider } from '@emotion/react';
import customeTheme from './Theme/customeTheme';
import Navbar from './customer/components/Navbar/Navbar'
import Home from './customer/pages/Home/Home';
import Product from './customer/pages/Product/Products';
import ProductDetails from './customer/pages/Product/ProductDetails/ProductDetails';
import Reviews from './customer/pages/Review/Reviews';
import Cart from './customer/pages/Cart/Cart';
import AddressPage from './customer/pages/Checkout/CheckoutPage';
import Profile from './customer/pages/Account/Profile';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
import AdminDashboard from './admin/pages/Dashboard/Dashboard';
import { fetchSellerProfile } from './Redux Toolkit/Seller/sellerSlice';
import { useAppDispatch, useAppSelector } from './Redux Toolkit/Store';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Auth from './customer/pages/Auth/Auth';
import { fetchCustomerProfile } from './Redux Toolkit/Customer/CustomerProfileSlice';
import { SnackbarProvider } from 'notistack';
import PaymentSucess from './customer/pages/Payment/PaymentSuccess';
import PaymentSuccess from './customer/pages/Payment/PaymentSuccess';
import PaypalCallback from './customer/pages/Payment/PaypalPaymentCallBack';
import SellerLoginForm from './customer/pages/BecomeSeller/SellerLoginForm';
import SellerAccountVerification from './seller/pages/SellerAccountVerification';
import SellerAccountVerified from './seller/pages/SellerAccountVerified';
import AdminAuth from './admin/pages/Auth/AdminAuth';
import Mobile from './data/Products/mobile';
import CustomerRoutes from './routes/CustomerRoutes';
import { homeCategories } from './data/homeCategories';
import { createHomeCategories, fetchHomePageData} from './Redux Toolkit/Customer/Customer/AsyncThunk';
import Wishlist from './customer/pages/Wishlist/Wishlist';
import { fetchUserProfile } from './Redux Toolkit/Admin/UserSlice';



function App() {
  const dispatch = useAppDispatch()
  const { auth, sellerAuth, sellers, customer ,user} = useAppSelector(store => store)
const navigate=useNavigate();

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(fetchCustomerProfile({jwt:localStorage.getItem("jwt") || auth.jwt || "",navigate}));
      dispatch(fetchSellerProfile(localStorage.getItem("jwt") || sellerAuth.jwt));
      dispatch(fetchUserProfile({jwt:localStorage.getItem("jwt") || auth.jwt || "",navigate}));
    }

  }, [auth.jwt, sellerAuth.jwt])

  useEffect(() => {
    // dispatch(createHomeCategories(homeCategories))
    dispatch(fetchHomePageData())
  }, [dispatch])

  return (

        <ThemeProvider theme={customeTheme}>
          <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000}
        >
      <div className='App' >


        <Routes>
          {sellers.profile && <Route path='/seller/*' element={<SellerDashboard />} />}
          {user.user?.account?.role?.name === "ROLE_MANAGER" && <Route path='/admin/*' element={<AdminDashboard />} />}
          <Route path='/verify-seller/:otp' element={<SellerAccountVerification />} />
          <Route path='/seller-account-verified' element={<SellerAccountVerified />} />
          <Route path='/become-seller' element={<BecomeSeller />} />
          <Route path='/admin-login' element={<AdminAuth />} />
          <Route path='/dummy' element={<Mobile />} />

          <Route path='*' element={<CustomerRoutes />} />

        </Routes>
        {/* <Footer/> */}
         {/* <ToastContainer position="top-right" autoClose={2500} newestOnTop /> */}
      </div>


    </SnackbarProvider>
    </ThemeProvider>
  )
}export default App;

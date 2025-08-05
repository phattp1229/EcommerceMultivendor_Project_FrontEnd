import './App.css'
import { ThemeProvider } from '@emotion/react';
import customeTheme from './Theme/customeTheme';
import Navbar from './customer/components/Navbar/Navbar'
import Home from './customer/pages/Home/Home';
import Product from './customer/pages/Product/Products';
import ProductDetails from './customer/pages/Product/ProductDetails/ProductDetails';
import Reviews from './customer/pages/Review/Reviews';
import Cart from './customer/pages/Cart/Cart';
import AddressPage from './customer/pages/Checkout/AddressPage';
import Profile from './customer/pages/Account/Profile';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
import AdminDashboard from './admin/pages/Dashboard/Dashboard';
import { fetchSellerProfile } from './Redux Toolkit/Seller/sellerSlice';
import { useAppDispatch, useAppSelector } from './Redux Toolkit/Store';
import { useEffect } from 'react';

import Auth from './customer/pages/Auth/Auth';
import { fetchUserProfile } from './Redux Toolkit/Customer/UserSlice';
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
import { createHomeCategories} from './Redux Toolkit/Customer/Customer/AsyncThunk';



function App() {
  const dispatch = useAppDispatch()
  const { auth, sellerAuth, sellers, user } = useAppSelector(store => store)
const navigate=useNavigate();

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(fetchUserProfile({jwt:localStorage.getItem("jwt") || auth.jwt || "",navigate}));
      dispatch(fetchSellerProfile(localStorage.getItem("jwt") || sellerAuth.jwt))
    }

  }, [auth.jwt, sellerAuth.jwt])

  useEffect(() => {
    dispatch(createHomeCategories(homeCategories))
    // dispatch(fetchHomePageData())
  }, [dispatch])

  return (
    //   <div className="">
    //     <ThemeProvider theme={customeTheme}>
    //   <SnackbarProvider
    //   maxSnack={3}
    //   anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    //   autoHideDuration={3000}
    //     >
    //       <div>
    //         <Navbar/>
    //         <Routes>
    //           <Route path="/" element={<Home />} />
    //           <Route path="/login" element={<Auth />} />
    //            <Route path="/seller/login" element={<SellerLoginForm />} />
    //           <Route path="/products/:category" element={<Product />} />
    //           <Route path="/reviews/:productId" element={<Reviews />} />
    //           <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails />} />
    //           <Route path="/cart" element={<Cart />} />
    //           <Route path="/checkout/address" element={<AddressPage />} />
    //           <Route path="/payment-success/:paymentOrderId" element={<PaymentSucess/>} /> //Dành cho Stripe
    //           <Route path="/payment/paypal/callback:" element={<PaypalCallback />} /> // Dành cho PayPal
    //           <Route path="/become-seller" element={<BecomeSeller />} />
    //           <Route path="/account/*" element={<Profile />} />
    //           <Route path="/seller/*" element={<SellerDashboard />} />
    //           <Route path="/admin/*" element={<AdminDashboard />} />
    //         </Routes>
    //       </div>
    //       </SnackbarProvider>
    //     </ThemeProvider>
    // </div>
        <ThemeProvider theme={customeTheme}>
          <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000}
        >
      <div className='App' >


        <Routes>
          {sellers.profile && <Route path='/seller/*' element={<SellerDashboard />} />}
          {user.user?.role === "ROLE_MANAGER" && <Route path='/admin/*' element={<AdminDashboard />} />}
          <Route path='/verify-seller/:otp' element={<SellerAccountVerification />} />
          <Route path='/seller-account-verified' element={<SellerAccountVerified />} />
          <Route path='/become-seller' element={<BecomeSeller />} />
          <Route path='/admin-login' element={<AdminAuth />} />

          <Route path='/dummy' element={<Mobile />} />

          <Route path='*' element={<CustomerRoutes />} />

        </Routes>
        {/* <Footer/> */}
      </div>


    </SnackbarProvider>
    </ThemeProvider>
  )
}export default App;

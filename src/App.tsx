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
import { Route, Routes, useNavigate } from 'react-router-dom';
import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
import AdminDashboard from './admin/pages/Dashboard/Dashboard';
import { fetchSellerProfile } from './Redux Toolkit/Seller/sellerSlice';
import { useAppDispatch, useAppSelector } from './Redux Toolkit/Store';
import { useEffect } from 'react';
import LoginForm from './customer/pages/Auth/LoginForm';




function App() {
  const dispatch = useAppDispatch()
  const {sellers} = useAppSelector(store => store)
  const navigate=useNavigate();

  useEffect(()=>{
    dispatch(fetchSellerProfile(localStorage.getItem("jwt") || ""))
  },[])

  useEffect(() =>{
    if(sellers.profile){
      navigate("/seller")
    }
  },[sellers.profile])

  return (
      <div className="">
        <ThemeProvider theme={customeTheme}>
          <div>
            <Navbar/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/products/:category" element={<Product />} />
              <Route path="/reviews/:productId" element={<Reviews />} />
              <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout/address" element={<AddressPage />} />
              <Route path="/become-seller" element={<BecomeSeller />} />
              <Route path="/account/*" element={<Profile />} />
              <Route path="/seller/*" element={<SellerDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </div>
        </ThemeProvider>

    </div>
  )
}export default App;

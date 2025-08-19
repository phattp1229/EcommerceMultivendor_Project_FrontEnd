import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../customer/pages/Home/Home'

import ProductDetails from '../customer/pages/Product/ProductDetails/ProductDetails'
import Cart from '../customer/pages/Cart/Cart'
import Address from '../customer/pages/Checkout/CheckoutPage'
import Profile from '../customer/pages/Account/Profile'
import KocDashboard from '../customer/pages/Koc/KocDashboard/KocDashboard'
import AffiliateCampaignPage from '../customer/pages/Koc/AffiliateCampaignPage';
import MyAffiliateLinks from '../customer/pages/Koc/MyAffiliateLinks';
import BecomeSeller from '../customer/pages/BecomeSeller/BecomeSeller'
import Footer from '../customer/components/Footer/Footer'
import Navbar from '../customer/components/Navbar/Navbar'
import NotFound from '../customer/pages/NotFound/NotFound'
import Auth from '../customer/pages/Auth/Auth'
import { useAppDispatch, useAppSelector } from '../Redux Toolkit/Store'
import { fetchCustomerCart } from '../Redux Toolkit/Customer/CartSlice'

import Reviews from '../customer/pages/Review/Reviews'
import WriteReviews from '../customer/pages/Review/WriteReview'
import Wishlist from '../customer/pages/Wishlist/Wishlist'
import { getWishlistByCustomerId } from '../Redux Toolkit/Customer/WishlistSlice'
import SearchProducts from '../customer/pages/Search/SearchProducts'
import PaymentSucess from '../customer/pages/Payment/PaymentSuccess'
import Products from '../customer/pages/Product/Products'
import PaypalCallback from '../customer/pages/Payment/PaypalPaymentCallBack'



const CustomerRoutes = () => {
  const dispatch = useAppDispatch()
    const { cart, auth } = useAppSelector(store => store);

    useEffect(() => {
        dispatch(fetchCustomerCart(localStorage.getItem("jwt") || ""))
        dispatch(getWishlistByCustomerId())
    }, [auth.jwt])
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/chat-bot' element={<ChatBot />} /> */}
        <Route path='/products/:categoryId' element={<Products />} />
        <Route path='/search-products' element={<SearchProducts />} />
        <Route path='/reviews/:productId' element={<Reviews />} />
        <Route path='/reviews/:productId/create' element={<WriteReviews />} />
        <Route path='/product-details/:categoryId/:name/:productId' element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/checkout/address' element={<Address />} />
  <Route path='/account/koc-dashboard/*' element={<KocDashboard />} />
  <Route path='/account/affiliate-campaign' element={<AffiliateCampaignPage />} />
  <Route path='/koc/my-affiliate-links' element={<MyAffiliateLinks />} />
  <Route path='/account/*' element={<Profile />} />
        <Route path='/login' element={<Auth/>} />
        <Route path="/payment/paypal/callback:" element={<PaypalCallback />} /> // Dành cho PayPal
        <Route path="/payment-success" element={<PaymentSucess/>} /> //Dành cho Stripe
        <Route path='*' element={<NotFound/>} />
      </Routes>
      <Footer />
    </>

  )
}

export default CustomerRoutes
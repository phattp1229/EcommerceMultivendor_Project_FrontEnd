import './App.css'
import { ThemeProvider } from '@emotion/react';
import customeTheme from './Theme/customeTheme';
import Navbar from './customer/components/Navbar/Navbar'
import Home from './customer/pages/Home/Home';
import Product from './customer/pages/Product/Product';
import ProductDetails from './customer/pages/Product/ProductDetails/ProductDetails';
import Reviews from './customer/pages/Review/Reviews';
import Cart from './customer/pages/Cart/Cart';
import { Add } from '@mui/icons-material';
import AddressPage from './customer/pages/Checkout/AddressPage';
import Profile from './customer/pages/Account/Profile';
import { Route, Routes } from 'react-router-dom';




function App() {
  return (
      <div className="">
        <ThemeProvider theme={customeTheme}>
          <div>
            <Navbar/>
            {/* <Home/> */}
            {/* <Product/> */}
            {/* <ProductDetails/> */}
            {/* <Reviews/> */}
            {/* <Cart/> */}
            {/* <AddressPage/> */}
            {/* <Profile/> */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:category" element={<Product />} />
              <Route path="/reviews/:productId" element={<Reviews />} />
              <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout/address" element={<AddressPage />} />
              <Route path="/account/profile" element={<Profile />} />
            </Routes>
          </div>
        </ThemeProvider>

    </div>
  )
}export default App;

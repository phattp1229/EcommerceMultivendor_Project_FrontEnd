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
            <AddressPage/>
          </div>
        </ThemeProvider>

    </div>
  )
}export default App;

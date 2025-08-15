import { Route, Routes } from 'react-router-dom'
import SellersTable from '../admin/pages/sellers/SellersTable'
import Coupon from '../admin/pages/Coupon/Coupon'
import CouponForm from '../admin/pages/Coupon/CreateCouponForm'
import GridTable from '../admin/pages/Home Page/GridTable'
import ElectronicsTable from '../admin/pages/Home Page/ElectronicsTable'
import ShopByCategoryTable from '../admin/pages/Home Page/ShopByCategoryTable'
import Deal from '../admin/pages/Home Page/Deal'
import ListKocTable from '../admin/pages/Koc/ListKocTable'
import Profile from '../admin/pages/Profile'



const AdminRoutes = () => {
  return (
    <div>
    <Routes>
    <Route path='/' element={<SellersTable/>}/>
    <Route path='/list-koc' element={<ListKocTable/>}/> 
    <Route path='/coupon' element={<Coupon/>}/>
    <Route path='/add-coupon' element={<CouponForm/>}/>
    <Route path='/home-grid' element={<GridTable/>}/>
    <Route path='/electronics-category' element={<ElectronicsTable/>}/>
    <Route path='/shop-by-category' element={<ShopByCategoryTable/>}/>
    <Route path='/deals' element={<Deal/>}/>
    <Route path='/account' element={<Profile />} />
  </Routes>

    </div>
  )
}

export default AdminRoutes
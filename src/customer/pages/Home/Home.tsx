//import React from 'react'
import ElectronicCategory from "./ElectronicCategory/ElectronicCategory"
import CategoryGrid from "./TopBrands/Grid"
import Deals from "./Deals/Deals"
import ShopByCategory from "./ShopByCategory/ShopByCategory"
import { useAppSelector } from '../../../Redux Toolkit/Store'
const Home = () => {

  const { homePage } = useAppSelector(store => store)

  return (
    <>
        <div className='space-y-5 lg:space-y-10 relative'>
          <ElectronicCategory />
          <CategoryGrid />
         

          <div className="pt-20">
            <h1 className='text-lg lg:text-4xl font-bold text-primary-color 
            pb-5 lg:pb-20 text-center'> TODAY'S DEAL</h1>
           <Deals />
        </div>

          <div className="pt-20">
            <h1 className='text-lg lg:text-4xl font-bold text-primary-color 
            pb-5 lg:pb-20 text-center'> SHOP BY CATEGORY</h1>
          </div>
          <ShopByCategory />
        </div>
    </>
  )
}

export default Home
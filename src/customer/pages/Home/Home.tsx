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
        {!homePage.loading && (
        <div className='space-y-5 lg:space-y-10 relative'>
          {homePage.homePageData?.electricCategories && <ElectronicCategory />}
          <CategoryGrid />
          <Deals />
          <ShopByCategory />
        </div>
      )}
    </>
  )
}

export default Home
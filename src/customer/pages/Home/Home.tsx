//import React from 'react'
import ElectronicCategory from "./ElectronicCategory/ElectronicCategory"
import CategoryGrid from "./CategoryGrid/CategoryGrid"
import Deals from "./Deals/Deals"
import ShopByCategory from "./ShopByCategory/ShopByCategory"
const Home = () => {
  return (
    <>
        <div className='space-y-5 lg:space-y-10 relative'>
            <ElectronicCategory />
            <CategoryGrid />
            <Deals />
            <ShopByCategory />
        </div>
    </>
  )
}

export default Home
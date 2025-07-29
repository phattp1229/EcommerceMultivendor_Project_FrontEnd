//import React from 'react'
import ElectronicCategory from "./ElectronicCategory/ElectronicCategory"
import CategoryGrid from "./TopBrands/Grid"
import Deals from "./Deals/Deals"
import ShopByCategory from "./ShopByCategory/ShopByCategory"
import { useAppSelector } from '../../../Redux Toolkit/Store'
import { Button } from "@mui/material"
import { Storefront } from "@mui/icons-material"
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

          <div className="py-20">
            <h1 className='text-lg lg:text-4xl font-bold text-primary-color 
            pb-5 lg:pb-20 text-center'> SHOP BY CATEGORY</h1>
          </div>
          <ShopByCategory />
        </div>

        <section className='mt-20 lg:px-20 relative h-[200px] lg:h-[450px] object-cover'>
          <img className='w-full h-full object-cover' 
          src="https://stutern-udemy.netlify.app/images/header-img.jpg" alt="" />
          <div className='absolute top-1/2 left-4 lg:left-[15rem] transform-translate-y-1/2 font-semibold lg:text-4xl space-y-3'>
          <h1>Sell your Product</h1>
            <p className='text-lg md:text-2xl'>With <span className='logo'>Zonix Mall</span></p>
            <Button startIcon={<Storefront/>} variant='contained' size='large'>
              Become Seller
            </Button>
          </div>
        </section>
    </>
  )
}

export default Home
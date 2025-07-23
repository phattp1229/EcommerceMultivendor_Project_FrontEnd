//import React from 'react'
import ElectronicCategory from "./ElectronicCategory/ElectronicCategory"
import CategoryGrid from "./CategoryGrid/CategoryGrid"
const Home = () => {
  return (
    <>
        <div className='space-y-5 lg:space-y-10 relative'>
            <ElectronicCategory />
            <CategoryGrid />
        </div>
    </>
  )
}

export default Home
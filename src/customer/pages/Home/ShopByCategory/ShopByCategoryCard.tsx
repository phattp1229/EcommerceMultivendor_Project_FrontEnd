import "./ShopByCategory.css"
const ShopByCategoryCard = () => {
  return (
    <div className='flex gap-3 justify-center items-center group cursor-pointer'>
      <div className='custome-border w-[150px] h-[150px] lg:w-[249px] lg:h-[249px] rounded-full bg-primary-color' >
        <img className='rounded-full group-hover:scale-95 transition-transform transform-duratopm-700 oject-cover object-top h-full w-full'
        src="https://rukminim2.flixcart.com/image/312/312/xif0q/computer/x/9/j/-original-imahyjzh7m2zsqdg.jpeg?q=70" alt = ""/>
      </div>
      <h1>Electronics</h1>
    </div>
  )
}

export default ShopByCategoryCard
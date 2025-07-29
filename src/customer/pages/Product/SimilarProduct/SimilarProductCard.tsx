
const SimilarProductCard = () => {
  return (
    <div>
        <div className='group px-4 relative'>
            <div className='card'>
                <img className="card-media oject-top" 
                src={"https://product.hstatic.net/1000360022/product/ao-so-mi-oxford-nam-tay-dai-blank-color-embroider-form-slim__2__bc173162154a485cb817e55f7a8471e1_1024x1024.jpg"} alt=""/>
            </div>

            <div className='details pt-3 space-y-1 group-hover-effect rounded-md'> 
                <div className='name'>
                    <h1>Niky</h1>
                    <p>Blue Skirt</p>
                </div>
                <div className='price flex items-center gap-3'>
                    <span className='font-sans text-gray-800'>450.000 đ</span>
                    <span className='thin-line-through text-gray-400'>500.000 đ</span>
                    <span className="text-primary-color font-semibold">-10%</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SimilarProductCard

const SimilarProductCard = () => {
  return (
    <div>
                <div className='group px-4 relative'>
            <div className='card'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
                {images.map((item,index) => <img className="card-media oject-top" src={item} alt="" 
                style={{transform: `translateX(${(index - currentImage) * 100}% `}}/>)}

                {isHovered && <div className='indicator flex flex-col items-center space-y-2'>
                <div className="flex gap-3">

                    <Button variant="contained" color="secondary" >      
                        <FavoriteIcon sx={{ color: teal[500] }} />
                    </Button>                   
                    <Button variant="contained" color="secondary" >
                        <ModeCommentIcon />
                    </Button>
                    </div>    
                </div>}
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
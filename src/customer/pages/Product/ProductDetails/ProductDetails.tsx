import React, { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import { teal } from '@mui/material/colors';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Wallet } from '@mui/icons-material';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, Divider, Modal, Rating } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../../../Redux Toolkit/Store';
import { useNavigate, useParams } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SimilarProduct from '../SimilarProduct/SimilarProduct';
import ProductReviewCard from '../../Review/ProductReviewCard';


const ProductDetails = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useAppDispatch();
    const { products, review } = useAppSelector(store => store)
    const navigate = useNavigate()
    const { productId,categoryId } = useParams()
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1)

    //     useEffect(() => {

    //     if (productId) {
    //         dispatch(fetchProductById(Number(productId)))
    //         dispatch(fetchReviewsByProductId({ productId: Number(productId) }))
    //     }
    //     dispatch(getAllProducts({ category: categoryId}));

    // }, [productId])

    // const handleAddCart = () => {
    //     dispatch(addItemToCart({
    //         jwt: localStorage.getItem('jwt'),
    //         request: { productId: Number(productId), size: "FREE", quantity }

    //     }))
    // }
  return (
      <div className='px-5 lg:px-20 pt-10 '>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

                <section className='flex flex-col lg:flex-row gap-5'>
                    <div className='w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3'>
                        {[1,1,1,1].map((item, index) => <img className='lg:w-full w-[50px] cursor-pointer rounded-md' 
                        src="https://media.routine.vn/1200x1500/prod/media/10s25shs002-jpg-wgv4.webp" alt="" />)}
                    </div>
                    <div className='w-full lg:w-[85%]'>
                        <img className='w-full rounded-md cursor-zoom-out' 
                        src="https://media.routine.vn/1200x1500/prod/product/10s25shs002-blue-1-jpg-ir16.webp" alt="" />
                    </div>
                </section>
            
                <section>
                    <h1 className='font-bold text-lg text-teal-950'>Ramm Clothing</h1>
                    <p className='text-gray-500 font-semibold'>men black shirt</p>

                    <div className='flex justify-between items-center py-2 border w-[180px] px-3 mt-5'>
                        <div className='flex gap-1 items-center'>
                            <span>4</span>
                            <StarIcon sx={{ color: teal[600], fontSize: "17px" }} />
                        </div>
                        <Divider orientation="vertical" flexItem />
                        <span>
                            358 Ratings
                        </span>
                    </div>
                     <div className='space-y-2'>
                        <div className='price flex items-center gap-3 mt-5 text-lg'>
                            <span className='font-semibold text-gray-800' >79.999đ</span>
                            <span className='text thin-line-through text-gray-400 '>100.000đ</span>
                            <span className='text-[#00927c] font-semibold'>20% off</span>
                        </div>
                        <p className='text-sm'>Inclusive of all taxes. Free Shipping above 150.000đ</p>
                    </div>

                    <div className='mt-7 space-y-3'>

                        <div className='flex items-center gap-4'>
                            <ShieldIcon sx={{ color: teal[400] }} />
                            <p>Authentic & Quality Assured</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            <WorkspacePremiumIcon sx={{ color: teal[400] }} />
                            <p>100% money back guarantee</p>
                        </div>

                        <div className='flex items-center gap-4'>
                            <LocalShippingIcon sx={{ color: teal[400] }} />
                            <p>Free Shipping & Returns</p>
                        </div>
                        <div className='flex items-center gap-4'>
                            <Wallet sx={{ color: teal[400] }} />
                            <p>Pay on delivery might be available</p>
                        </div>
                    </div>

                    <div className='mt-7 space-y-2'>
                        <h1>QUANTITY:</h1>
                        <div className=' flex items-center gap-2  w-[140px] justify-between'>

                            <Button disabled={quantity == 1} onClick={() => setQuantity(quantity - 1)} variant='outlined'>
                                <RemoveIcon />
                            </Button>
                            <span className='px-3 text-lg font-semibold'>
                                {quantity}
                            </span>
                            <Button onClick={() => setQuantity(quantity + 1)} variant='outlined'>
                                <AddIcon />
                            </Button>

                        </div>
                    </div>

                    <div className="mt-12 flex items-center gap-5">
                        <Button
                            //onClick={handleAddCart}
                            sx={{ py: "1rem" }}
                            variant='contained' fullWidth startIcon={<AddShoppingCartIcon />}>
                            Add To Bag
                        </Button>
                        <Button
                            sx={{ py: "1rem" }}
                            variant='outlined' fullWidth startIcon={<FavoriteBorderIcon />}>
                            Whishlist
                        </Button>

                    </div>

                    <div className='mt-5'>
                        <p >Mẫu áo sơ mi tay ngắn nam oxford fitted là dòng sản phẩm thời trang cao cấp, 
                            được đội ngũ thiết kế Routine chăm chút tỉ mỉ trong từng đường kim mũi chỉ, 
                            chú trọng đến từng chi tiết dù là nhỏ nhất. Sản phẩm sở hữu những đặc tính vượt trội 
                            mà chắc chắn bạn sẽ yêu thích </p>
                    </div>
                    <div className='mt-7'>
                        <ProductReviewCard />
                        <Divider />
                    </div>
                </section>
            </div>

            <div className='mt-20'>
                <h1 className="text-lg font-bold">Similar Product</h1>
                <div className='pt-5'>
                    <SimilarProduct/>
                </div>
            </div>
        </div>
  )
}

export default ProductDetails
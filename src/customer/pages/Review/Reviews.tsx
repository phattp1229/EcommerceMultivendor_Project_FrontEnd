import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useParams } from 'react-router-dom';
import { Divider, Rating } from '@mui/material';
import ProductReviewCard from './ProductReviewCard';
import RatingCard from './RatingCard';

const Reviews = () => {
    const dispatch = useAppDispatch();
    const { productId } = useParams()

    return (
        <div className='p-5 lg:p-20 flex flex-col lg:flex-row gap-20'>
            <section className='w-full md:w-1/2 lg:w-[30%] space-y-2'>
                <img className='w-full' 
                src="https://cdn.hstatic.net/products/1000360022/ao-thun-nam-hoa-tiet-gradient-drifting-in-daze-form-oversize_6e48c4a213e4446494aeae450399668c_1024x1024.jpg" alt="" />
                <div>
                    <div>
                        <p className='font-bold text-xl'> Men Clothing</p>
                        <p className='text-lg text-gray-600'>Men T-Shirt</p>
                    </div>

                    <div className='price flex items-center gap-3 mt-5 text-lg'>
                        <span className='font-semibold text-gray-800' > ₹4000</span>
                        <span className='text thin-line-through text-gray-400 '>₹6000</span>
                        <span className='text-[#00927c] font-semibold'>20% off</span>
                    </div>

                </div>
            </section>
            <section className="w-full md:w-1/2 lg:w-[70%]">
                <h1 className="font-semibold text-lg pb-4">
                    Review & Ratings
                </h1>
               <RatingCard/>
                <div className='mt-10'>
                    <div className="space-y-5">
                        {[1,1,1,1,1,1].map((item) =><> <ProductReviewCard/>
                                <Divider />
                         </>)}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Reviews
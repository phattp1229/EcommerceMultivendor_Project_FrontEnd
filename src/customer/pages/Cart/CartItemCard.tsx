import { Button, Divider, IconButton, Typography } from '@mui/material'
import React from 'react'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { CartItem } from '../../../types/cartTypes';
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import { deleteCartItem, updateCartItem } from '../../../Redux Toolkit/Customer/CartSlice';

interface CartItemProps {
    item:CartItem
}

const CartItemCard : React.FC<CartItemProps> = ({ item }) => {
    const dispatch = useAppDispatch();
    
    const handleUpdateQuantity=(value:number)=>{
        dispatch(updateCartItem({jwt:localStorage.getItem("jwt"),
            cartItemId:item.id, cartItem:{quantity:item.quantity + value}}))
    }
    const handleRemoveCartItem=()=>{
        dispatch(deleteCartItem({
            jwt:localStorage.getItem("jwt") || "", 
            cartItemId:item.id}))
    }
    return (
        <div className=' border rounded-md relative'>
            <div className='p-5 flex gap-3'>

                <div>
                    <img className='w-[90px] rounded-md' 
                    src={item.product.images[0]}
                    // src="https://www.taneira.com/dw/image/v2/BKMH_PRD/on/demandware.static/-/Sites-Taneira-product-catalog/default/dw422bdf2e/images/Taneira/Catalog/BFW22CW0042_1.jpg?sw=1000&sh=1500"
                     alt="" />
                </div>
                <div className="space-y-1.5">
                <h1 className="font-semibold text-base text-gray-800">{item.product.title}</h1>
            <p className="text-sm text-gray-600">
  <span className="font-medium text-red-700">Sold by: </span>{" "}
  <span className="text-lg font-bold">
    {item.product?.seller?.businessDetails.businessName}
  </span>
</p>

                <p className="text-sm text-black-600">
                    <span className="font-medium">Size:</span> {item.product.sizes} — <span className="font-medium">Color:</span> {item.product.color}
                </p>

          

                <p className="text-sm text-gray-500">
                    <span className="font-medium text-teal-600">7 days replacement </span> available
                </p>

                <p className="text-sm text-gray-500">
                    <span className="font-medium">Quantity:</span> {item.quantity}
                </p>
                </div>

            </div>
            <Divider />
            <div className='px-5 py-2 flex justify-between items-center'>
          <div className='flex items-center gap-2 w-[140px] justify-between'>
            <Button size='small' disabled={item.quantity == 1} onClick={() => handleUpdateQuantity(-1)} >
              <RemoveIcon />
            </Button>
            <span className='px-3 font-semibold'>{item.quantity}</span>
            <Button size='small' onClick={() => handleUpdateQuantity(1)} >
              <AddIcon />
            </Button>
          </div>

          {/* Giá hiển thị giống Shopee */}
          <div className="flex flex-col items-end">
            <p className="text-sm text-gray-400 line-through">
              {item.mrpPrice.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-lg font-bold text-red-600">
              {item.sellingPrice.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>

            <div className='absolute top-1 right-1'>
                <IconButton onClick={handleRemoveCartItem} color='primary' >
                    <CloseIcon />
                </IconButton>
            </div>

        </div>
    )
}

export default CartItemCard
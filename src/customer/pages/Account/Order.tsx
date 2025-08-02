import { useEffect } from "react";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import OrderItemCard from "./OrderItemCard"
import { fetchCustomerOrderHistory } from "../../../Redux Toolkit/Customer/OrderSlice";

const Order = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCustomerOrderHistory(localStorage.getItem('jwt') || ''));
  }, []);
  
  return (
    <div className='text-sm min-h-screen'>
       <div className='pb-5'>
       <h1 className='font-semibold'>All orders
        </h1>
        <p>from anytime</p>
       </div>
        <div className='space-y-2'>
            {[1,1,1,1,1,1,1].map((item)=><OrderItemCard/>)}
        </div>
        
    </div>
  )
}

export default Order
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { useEffect, useRef } from "react";
import { completeStripePayment, paymentSuccessStripe } from "../../../Redux Toolkit/Customer/OrderSlice";

import { toast } from 'react-toastify';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();

    const { orders } = useAppSelector(store => store)
    // // Lấy paymentOrderId từ URL. ID này là của đối tượng PaymentOrder.
    // const { paymentOrderId } = useParams();

    // // Lấy trạng thái loading trực tiếp từ Redux store.
    // const { loading } = useAppSelector(store => store.orders);

    // useEffect(() => {
    //     const jwt = localStorage.getItem('jwt') || '';
    //     const params = new URLSearchParams(location.search);

    //     // Kiểm tra xem URL có chứa 'session_id' không.
    //     // Đây là dấu hiệu cho biết người dùng được chuyển hướng từ Stripe.
    //     if (params.has('session_id') && paymentOrderId) {
    //         // Nếu là Stripe, gọi API để hoàn tất đơn hàng ở backend.
    //         dispatch(completeStripePayment({
    //             paymentOrderId: Number(paymentOrderId),
    //             jwt
    //         }));
    //     }
    //     // Nếu không có 'session_id', có nghĩa là người dùng đến từ luồng PayPal
    //     // (đã được xử lý ở trang callback) hoặc truy cập trực tiếp.
    //     // Trong trường hợp này, chúng ta không cần làm gì cả.

    // }, [dispatch, location.search, paymentOrderId]); // Dependencies cho useEffect

    // Giao diện sẽ hiển thị spinner khi 'loading' (từ Redux) là true,
    // và hiển thị thông báo thành công khi 'loading' là false.

     const getQueryParam = (key: string): string | null => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    const stripeSessionId = getQueryParam("session_id"); 


const executed = useRef(false); // dùng flag để đảm bảo chỉ chạy 1 lần

useEffect(() => {
  const jwt = localStorage.getItem("jwt") || "";

  if (!stripeSessionId || executed.current) return;

  executed.current = true;

  dispatch(
    paymentSuccessStripe({
      paymentId: stripeSessionId,
      paymentLinkId: stripeSessionId,
      jwt,
    })
  )
    .unwrap()
    .then(() => {
      toast.success("Payment successfully!");
    })
    .catch((err) => {
      toast.error("Payment failed! " + err);
    });

}, [stripeSessionId]);


    return (
        <div className="min-h-[90vh] flex justify-center items-center">
            {orders ? <div className="bg-primary-color text-white p-8 w-[90%] lg:w-[25%] border rounded-md h-[40vh] flex flex-col gap-7 items-center justify-center">
                <h1 className="text-3xl font-semibold">Congratulations!</h1>
                <h1 className="text-2xl font-semibold">Your Order Get Success</h1>
                <p className="text-sm">Thank you for your purchase.</p>
                <div>
                    <Button onClick={()=>navigate("/")} color="secondary" variant="contained">Shopping More</Button>
                </div>

            </div> : <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            //   onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>}
           
        </div>
    );
}

export default PaymentSuccess;
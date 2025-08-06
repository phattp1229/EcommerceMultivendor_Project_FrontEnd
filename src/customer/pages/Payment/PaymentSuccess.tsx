import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { useEffect } from "react";
import { completeStripePayment } from "../../../Redux Toolkit/Customer/OrderSlice";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();

    // Lấy paymentOrderId từ URL. ID này là của đối tượng PaymentOrder.
    const { paymentOrderId } = useParams();

    // Lấy trạng thái loading trực tiếp từ Redux store.
    const { loading } = useAppSelector(store => store.orders);

    useEffect(() => {
        const jwt = localStorage.getItem('jwt') || '';
        const params = new URLSearchParams(location.search);

        // Kiểm tra xem URL có chứa 'session_id' không.
        // Đây là dấu hiệu cho biết người dùng được chuyển hướng từ Stripe.
        if (params.has('session_id') && paymentOrderId) {
            // Nếu là Stripe, gọi API để hoàn tất đơn hàng ở backend.
            dispatch(completeStripePayment({
                paymentOrderId: Number(paymentOrderId),
                jwt
            }));
        }
        // Nếu không có 'session_id', có nghĩa là người dùng đến từ luồng PayPal
        // (đã được xử lý ở trang callback) hoặc truy cập trực tiếp.
        // Trong trường hợp này, chúng ta không cần làm gì cả.

    }, [dispatch, location.search, paymentOrderId]); // Dependencies cho useEffect

    // Giao diện sẽ hiển thị spinner khi 'loading' (từ Redux) là true,
    // và hiển thị thông báo thành công khi 'loading' là false.
    return (
        <div className="min-h-[90vh] flex justify-center items-center">
            {loading ? (
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <div className="bg-primary-color text-white p-8 w-[90%] lg:w-[30%]
                    border rounded-md h-auto flex flex-col gap-7 items-center justify-center text-center">
                    <h1 className="text-3xl font-semibold">Congratulations!</h1>
                    <h1 className="text-2xl font-semibold">Your Order Is Successful.</h1>
                    <p className="text-sm">Thank you for your purchase.</p>
                    <div>
                        <Button onClick={() => navigate("/")} color="secondary" variant="contained">
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentSuccess;
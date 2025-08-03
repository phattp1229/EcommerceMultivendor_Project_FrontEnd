import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../Config/Api';


const PaypalCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Processing your payment...');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get('paymentId');
        const PayerID = params.get('PayerID');
        const paymentOrderId = params.get('paymentOrderId'); // Lấy từ URL gốc hoặc lưu trong state/localstorage

        if (paymentId && PayerID && paymentOrderId) {
            const completePayment = async () => {
                try {
                    const jwt = localStorage.getItem('jwt');
                    await api.post('/api/orders/paypal/complete', {
                        paymentId,
                        payerId: PayerID,
                        paymentOrderId: Number(paymentOrderId)
                    }, {
                        headers: { Authorization: `Bearer ${jwt}` }
                    });

                    setMessage('Payment successful! Redirecting...');
                    // Chuyển hướng đến trang thành công
                    navigate(`/payment-success/${paymentOrderId}`);

                } catch (error) {
                    setMessage('Payment failed. Please try again.');
                    // Chuyển hướng đến trang thất bại
                    navigate('/payment/failed');
                }
            };

            completePayment();
        }
    }, [location, navigate]);

    return (
        <div>
            <h1>{message}</h1>
            {/* Bạn có thể hiển thị một spinner ở đây */}
        </div>
    );
};

export default PaypalCallback;
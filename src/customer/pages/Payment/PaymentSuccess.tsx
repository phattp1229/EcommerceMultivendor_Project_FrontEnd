import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import store, { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { use, useEffect } from "react";
import { paymentSuccess } from "../../../Redux Toolkit/Customer/OrderSlice";


const PaymentSucess = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const {orders} = useAppSelector(store => store);

    const getQueryParams =(key: string): string | null => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };
    const paymentId = getQueryParams('paymentId');
    const paymentLinkId = getQueryParams('paymentLinkId');

    useEffect(() => {
        if(paymentId){
            dispatch(paymentSuccess({
                paymentId,
                paymentLinkId: paymentLinkId || '',
                jwt: localStorage.getItem('jwt') || ''
            }));
        }
    }, [paymentId]);

  return (
    <div className="min-h-[90vh] flex justify-center items-center">
        { orders? <div className="bg-primary-color text-white p-8 w-[90%] lg:w-[25%]
            border rounded-m h-[40vh] flex flex-col gap-7 items-center justify-center">
                <h1 className="text-3xl font-semibold">Congratulations!</h1>
                <h1 className="text-2xl font-semibold">Your Order Get Success.</h1>
                <div>
                    <Button onClick={()=>navigate("/")} color="secondary" variant="contained">Shopping More</Button>
                </div>

            </div> : <Backdrop sx={{ 
                color: "#fff", 
                zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}>
            <CircularProgress color="inherit" />
            </Backdrop>}
    </div>
  );
}

export default PaymentSucess;
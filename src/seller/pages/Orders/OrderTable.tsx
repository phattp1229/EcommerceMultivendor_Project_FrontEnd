import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Menu, MenuItem, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchSellerOrders, updateOrderStatus } from '../../../Redux Toolkit/Seller/sellerOrderSlice';
import type { Order, OrderItem } from '../../../types/orderTypes';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const orderStatus = [
  { color: '#FFA500', label: 'PENDING' }, 
  { color: '#F5BCBA', label: 'PLACED' }, 
  { color: '#F5BCBA', label: 'CONFIRMED' },
  { color: '#1E90FF', label: 'SHIPPED' }, 
   { color: '#32CD32', label: 'DELIVERED' }, 
   { color: '#FF0000', label: 'CANCELLED' },

];
const orderStatusColor = {
  PENDING: { color: '#FFA500', label: 'PENDING' }, // Orange
  CONFIRMED:{ color: '#F5BCBA', label: 'CONFIRMED' },
  PLACED:{ color: '#F5BCBA', label: 'PLACED' }, 
  SHIPPED: { color: '#1E90FF', label: 'SHIPPED' }, // DodgerBlue
  DELIVERED: { color: '#32CD32', label: 'DELIVERED' }, // LimeGreen
  CANCELLED: { color: '#FF0000', label: 'CANCELLED' } // Red
};
 const paymentStatusColor = {
  PENDING:   { color: '#FFA500', label: 'PENDING' },   // Orange
  PROCESSING:    { color: '#DC143C', label: 'PROCESSING' },    // Crimson
  COMPLETED: { color: '#2E8B57', label: 'COMPLETED' }, // SeaGreen
  FAILED:  { color: '#6A5ACD', label: 'FAILED' },  // SlateBlue
} ;
export default function OrderTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { sellerOrder } = useAppSelector(store => store);
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = React.useState<{ [key: number]: HTMLElement | null }>({});

  const handleClick = (event: React.MouseEvent<HTMLElement>, orderId: number) => {
    setAnchorEl((prev) => ({ ...prev, [orderId]: event.currentTarget }));
  };

  const handleClose = (orderId: number) => {
    setAnchorEl((prev) => ({ ...prev, [orderId]: null }));
  };

  React.useEffect(() => {
    dispatch(fetchSellerOrders(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  const handleUpdateOrder = (orderId: number, orderStatus: any) => {
    dispatch(updateOrderStatus({
      jwt: localStorage.getItem("jwt") || "",
      orderId,
      orderStatus,
    }));
    handleClose(orderId);
  };

  return (
    <>
      <h1 className='pb-5 font-bold text-xl'>All Orders</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order Id</StyledTableCell>
              <StyledTableCell align='left' sx={{ pl: 6 }}>Products</StyledTableCell>
              <StyledTableCell >Shipping Address</StyledTableCell>
               <StyledTableCell align="center">Payment Status</StyledTableCell>
              <StyledTableCell align="center">Order Status</StyledTableCell>
              <StyledTableCell align="right">Update</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellerOrder.orders && sellerOrder.orders.length > 0 ? sellerOrder.orders.map((item: Order) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell align="left">{item.id}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                 <div className='flex flex-col gap-4'>
                  {item.orderItems.map((orderItem: OrderItem) => (
                    <div key={orderItem.id} className='flex gap-5'>
                      <img className='w-28 rounded-md' src={orderItem.product.images[0]} alt="" />
                      <div className='flex flex-col justify-between py-2'>
                        <div style={{
                          border: "1px solid #ddd", 
                          borderRadius: "8px", 
                          padding: "8px", 
                          backgroundColor: "#fafafa"
                        }}>
                          <h4 style={{ margin: "4px 0", color: "#1976d2" }}>
                            Title: {orderItem.product.title}
                          </h4>
                          <p style={{ margin: "2px 0", fontSize: "14px" }}>
                            Price: <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                              {orderItem.product.sellingPrice?.toLocaleString("vi-VN")} đ
                            </span>
                          </p>
                          <p style={{ margin: "2px 0", fontSize: "14px" }}>
                            Color: <span style={{ fontWeight: "bold" }}>{orderItem.product.color ?? "N/A"}</span>
                          </p>
                          <p style={{ margin: "2px 0", fontSize: "14px" }}>
                            Quantity: <span style={{ fontWeight: "bold" }}>{orderItem.quantity ?? "N/A"}</span>
                          </p>
                          <p style={{ margin: "2px 0", fontSize: "14px" }}>
                            Size: <span style={{ fontWeight: "bold" }}>{orderItem.size ?? "N/A"}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                </StyledTableCell>
                <StyledTableCell>
                  <div style={{
                      maxWidth: "280px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "8px",
                      backgroundColor: "#fafafa"
                  }}>
                      <h4 style={{ margin: "4px 0", fontWeight: "bold", color: "#1976d2" }}>
                          {item.shippingAddress.name}
                      </h4>

                      <p style={{ margin: "2px 0", fontSize: "14px" }}>
                          {item.shippingAddress.street}, {item.shippingAddress.city}
                      </p>

                      <p style={{ margin: "2px 0", fontSize: "14px" }}>
                          {item.shippingAddress.state}  
                      </p>
                      <p style={{ margin: "2px 0", fontSize: "14px" }}>
                          <strong>PostalCode:</strong> {item.shippingAddress.postalCode}
                      </p>
                      <p style={{ margin: "2px 0", fontSize: "14px" }}>
                          <strong>Mobile:</strong> {item.shippingAddress.mobile}
                      </p>
                  </div>
                </StyledTableCell>
                <StyledTableCell 
                 sx={{color:paymentStatusColor[item.paymentStatus].color}} 
                 align="center">
                   <Box sx={{borderColor:paymentStatusColor[item.paymentStatus].color}}  
                   className={`border px-2 py-1 rounded-full text-xs`}>
                  {item.paymentStatus}</Box> 
                 </StyledTableCell>
                <StyledTableCell 
                 sx={{color:orderStatusColor[item.orderStatus].color}} 
                 align="center">
                   <Box sx={{borderColor:orderStatusColor[item.orderStatus].color}}  
                   className={`border px-2 py-1 rounded-full text-xs`}>
                  {item.orderStatus}</Box> 
                 </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    size='small'
                    onClick={(e) => handleClick(e, item.id)}
                    color='primary'
                    className='bg-primary-color'>
                    Status
                  </Button>
                  <Menu
                    id={`status-menu ${item.id}`}
                    anchorEl={anchorEl[item.id]}
                    open={Boolean(anchorEl[item.id])}
                    onClose={() => handleClose(item.id)}
                    MenuListProps={{
                      'aria-labelledby': `status-menu ${item.id}`,
                    }}
                  >
                    {orderStatus.map((status) =>
                      <MenuItem 
                      key={status.label} 
                      onClick={() => handleUpdateOrder(item.id, status.label)}>
                        {status.label}</MenuItem>
                    )}
                  </Menu>
                </StyledTableCell>
              </StyledTableRow>
            )) : (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  <div style={{ padding: '20px', color: '#666' }}>
                    {sellerOrder.loading ? 'Loading orders...' : 'No orders found'}
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

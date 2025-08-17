import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, styled, Tooltip, Chip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchSellerProducts, updateProductStock,deleteProduct } from '../../../Redux Toolkit/Seller/sellerProductSlice';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSnackbar } from 'notistack';





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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ProductTable() {

  const { sellerProduct } = useAppSelector(store => store);
  const dispatch = useAppDispatch();
  const navigate=useNavigate();
const { enqueueSnackbar } = useSnackbar();
const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [target, setTarget] = React.useState<{ id: number; title: string } | null>(null);

  React.useEffect(() => {
    dispatch(fetchSellerProducts(localStorage.getItem("jwt")))
  }, [])

  const handleUpdateStack = (id: number | undefined)=>() => {
    dispatch(updateProductStock(id))
  }

  // mở dialog xác nhận
  const askDelete = (id?: number, title?: string) => {
    if (!id) return;
    setTarget({ id, title: title ?? '' });
    setConfirmOpen(true);
  };
const handleDelete = async () => {
    if (!target) return;
    try {
      setDeletingId(target.id);
      await dispatch(deleteProduct(target.id)).unwrap();
      enqueueSnackbar('Delete product successfully!', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(typeof err === 'string' ? err : 'Delete product failed', { variant: 'error' });
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
      setTarget(null);
    }
  };
  // đặt helper nhỏ ở trên file (tuỳ)
const fmtVND = (v:number) => `${v.toLocaleString("vi-VN")}\u00A0đ`;
  return (
    <>
      <h1 className='pb-5 font-bold text-xl'>Products</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Images</StyledTableCell>
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="right">MRP</StyledTableCell>
              <StyledTableCell align="right">Selling Price</StyledTableCell>
              <StyledTableCell align="right">Color</StyledTableCell>
              <StyledTableCell align="right">Size</StyledTableCell>
              <StyledTableCell align="right">Quantity</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Update</StyledTableCell>
               <StyledTableCell align="right">Delete</StyledTableCell> {/* 👈 thêm cột */}
            </TableRow>
          </TableHead>
          <TableBody>
            {sellerProduct.products.map((item) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell component="th" scope="row">
                  <div className='flex gap-1 flex-wrap'>
                    {item.images.map((image) => <img className='w-20 rounded-md' src={image} alt="" />)}

                  </div>
                </StyledTableCell>
                <StyledTableCell align="left">{item.title}</StyledTableCell>
                <StyledTableCell align="right">  {fmtVND(item.mrpPrice)}</StyledTableCell>
                <StyledTableCell align="right"> {fmtVND(item.sellingPrice)}</StyledTableCell>
                <StyledTableCell align="right">{item.color}</StyledTableCell>
                 <StyledTableCell align="right">{item.sizes}</StyledTableCell>
                <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                <StyledTableCell align="right">
                <Chip
                 label={item.in_stock ? "active" : "hidden"}
               color={item.in_stock ? "success" : "default"}
              variant={item.in_stock ? "filled" : "outlined"}
               size="small"
                 clickable
                 onClick={handleUpdateStack(item.id)}   // giữ y nguyên logic của bạn
                    sx={
                      item.in_stock
                      ? {}: { bgcolor: "grey.100", color: "text.secondary", borderColor: "grey.300" }} /> </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton onClick={(()=>navigate("/seller/update-product/"+item.id))} color='primary' className='bg-primary-color'>
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Tooltip title="Delete">
                    <span>
                      <IconButton
                        onClick={() =>  askDelete(item.id, item.title)}
                        color="error"
                        disabled={deletingId === item.id}
                      >
                        <DeleteOutlineIcon/>
                      </IconButton>
                    </span>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Confirm dialog (thay cho window.confirm) */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Delete "${target?.title ?? ''}"? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={!!deletingId}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>

  );
}

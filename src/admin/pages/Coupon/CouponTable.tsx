import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, IconButton, Menu, MenuItem, Select, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import type { Coupon } from '../../../types/couponTypes';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteCoupon } from '../../../Redux Toolkit/Admin/AdminCouponSlice';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import  { useState } from "react";
const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        background: '#fef3c7', // vàng nhạt
        color: '#b45309',
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
        background: '#fff',
        color: '#333',
        borderBottom: '1px solid #f5f5f5',
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': { backgroundColor: '#fafaf9' },
    '&:hover': { backgroundColor: '#f1f5f9' },
    '&:last-child td, &:last-child th': { border: 0 },
}));

const accountStatuses = [
    { status: 'ACTIVE', title: 'Active', description: 'Coupon is active' },
    { status: 'INACTIVE', title: 'InActive', description: 'Coupon is no-active' },
];

export default function CouponTable() {
    const [page, setPage] = React.useState(0);
    const [status, setStatus] = React.useState(accountStatuses[0].status)
    const { sellers, adminCoupon } = useAppSelector(store => store)
    const dispatch = useAppDispatch();
 // state confirm
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
   const handleOpenConfirm = (id:number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseConfirm = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      dispatch(deleteCoupon({ id: selectedId, jwt: localStorage.getItem("jwt") || "" }));
    }
    handleCloseConfirm();
  };

    const handleDeleteCoupon = (id:number) => {
        dispatch(deleteCoupon({ id, jwt: localStorage.getItem("jwt") || "" }))
    }

    return (
        <>
            <div className='pb-5 w-60'>
                <Select
                    id="demo-simple-select"
                    value={status}
                    color='primary'
                    className='text-primary-color'
                    sx={{
                        background: '#fff8e1',
                        borderRadius: 2,
                        fontWeight: 600,
                        color: '#b45309',
                        '& .MuiSelect-icon': { color: '#fbbf24' },
                    }}
                >
                    {accountStatuses.map((status) =>
                        <MenuItem value={status.status}>{status.title}</MenuItem>)}
                </Select>
            </div>

            <TableContainer component={Paper} sx={{
                borderRadius: 3,
                boxShadow: '0 4px 24px 0 rgba(251,191,36,0.10)',
                border: '1px solid #fef3c7',
            }}>
                <Table sx={{ minWidth: 700, background: '#fff' }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Coupon Code</StyledTableCell>
                            <StyledTableCell >Start Date</StyledTableCell>
                            <StyledTableCell >End Date</StyledTableCell>
                            <StyledTableCell >Min Order Value</StyledTableCell>
                            <StyledTableCell >Discount %</StyledTableCell>
                            <StyledTableCell align="right">Status</StyledTableCell>
                            <StyledTableCell align="right">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adminCoupon.coupons?.map((coupon: Coupon) => (
                            <StyledTableRow key={coupon.id}>
                                <StyledTableCell component="th" scope="row">
                                    {coupon.code}
                                </StyledTableCell>
                                <StyledTableCell >{coupon.validityStartDate}</StyledTableCell>
                                <StyledTableCell >{coupon.validityEndDate}</StyledTableCell>
                                <StyledTableCell >{coupon.minimumOrderValue}</StyledTableCell>
                                <StyledTableCell >{coupon.discountPercentage}</StyledTableCell>
                                <StyledTableCell align="right">
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '2px 14px',
                                        borderRadius: 12,
                                        fontWeight: 700,
                                        fontSize: 13,
                                        letterSpacing: 1,
                                        background: coupon.active ? '#d1fae5' : '#fee2e2',
                                        color: coupon.active ? '#047857' : '#b91c1c',
                                    }}>
                                        {coupon.active ? "Active" : "Inactive"}
                                    </span>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <IconButton onClick={() => handleOpenConfirm(coupon.id)}>
                    <DeleteOutlineIcon className='text-red-700 cursor-pointer' />
                  </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
             <Dialog
        open={openDialog}
        onClose={handleCloseConfirm}
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this coupon? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
        </>
    );
}

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Chip } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchTransactionsBySeller } from '../../../Redux Toolkit/Seller/transactionSlice';
import type { Transaction } from '../../../types/Transaction';
import { redableDateTime } from '../../../util/redableDateTime';

const orderStatusColor = {
  PENDING: { color: '#FFA500', label: 'PENDING' }, // Orange
  SHIPPED: { color: '#1E90FF', label: 'SHIPPED' }, // DodgerBlue
  DELIVERED: { color: '#32CD32', label: 'DELIVERED' }, // LimeGreen
  CANCELLED: { color: '#FF0000', label: 'CANCELLED' } // Red
};

export default function TransactionTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { sellerOrder, transaction } = useAppSelector(store => store);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchTransactionsBySeller(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 6, mt: 3, background: 'linear-gradient(135deg, #f8fafc 60%, #e0f7fa 100%)' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>Date</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>Customer Details</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>Order</TableCell>
              <TableCell align="right" sx={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transaction.transactions.map((item: Transaction, idx: number) => (
              <TableRow
                key={item.id}
                sx={{
                  background: idx % 2 === 0 ? '#f5fafd' : '#e3f2fd',
                  transition: 'background 0.2s',
                  '&:hover': { background: '#ffe0b2' }
                }}
              >
                <TableCell align="left">
                  <Box>
                    <Box fontWeight={600} fontSize={16}>{redableDateTime(item.date).split("at")[0]}</Box>
                    <Box fontSize={13} color="#888" fontWeight={500}>{redableDateTime(item.date).split("at")[1]}</Box>
                  </Box>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Box>
                    <Box fontWeight={700} fontSize={16}>{item.customer.fullName}</Box>
                    <Box fontSize={14} color="#1976d2" fontWeight={600}>{item.customer.email}</Box>
                    <Box fontWeight={600} color="#555" fontSize={14}>{item.customer.mobile}</Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={`Order Id: ${item.order.id}`} sx={{ bgcolor: '#ff9800', color: '#fff', fontWeight: 700, fontSize: 15, px: 1.5, borderRadius: 2 }} />
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                    <MonetizationOnIcon sx={{ color: '#43a047', fontSize: 22 }} />
                    <Box fontWeight={700} fontSize={17} color="#43a047">
                      {item.order.totalSellingPrice?.toLocaleString("vi-VN")}đ
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

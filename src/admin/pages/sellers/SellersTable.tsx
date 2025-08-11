// SellersTable.tsx
import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, FormControl, Menu, MenuItem, Select, styled, TablePagination,
  Chip
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchSellers, updateSellerAccountStatus } from '../../../Redux Toolkit/Seller/sellerSlice';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    background: '#ffe0b2', // cam nhạt
    color: '#ff5722',
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    boxShadow: 'none',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    background: '#fff',
    color: '#333',
    borderBottom: '1px solid #f5f5f5',
  },
}));
const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': { backgroundColor: '#fff8f1' },
  '&:hover': { backgroundColor: '#ffe0b2' },
  '& td, & th': {
    borderBottom: '3px solid #fef3c7', // line kẻ vàng nhạt như bên coupon
  },
  '&:last-child td, &:last-child th': { border: 0 },
}));

const accountStatuses = [
    { status: 'PENDING_VERIFICATION', title: 'Pending Verification', description: 'Account is created but not yet verified' },
    { status: 'ACTIVE', title: 'Active', description: 'Account is active and in good standing' },
    { status: 'SUSPENDED', title: 'Suspended', description: 'Account is temporarily suspended, possibly due to violations' },
    { status: 'BANNED', title: 'Banned', description: 'Account is permanently banned due to severe violations' },
    { status: 'CLOSED', title: 'Closed', description: 'Account is permanently closed, possibly at user request' }
];

export default function SellersTable() {
  const dispatch = useAppDispatch();

  // server-side pagination state
  const [page, setPage] = React.useState(0);          // 0-based
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sort] = React.useState('id,desc');           // an toàn

  // filter
  const [accountStatus, setAccountStatus] = React.useState('ACTIVE');

  // lấy dữ liệu từ slice (CHỈ lấy nhánh sellers, không lấy root state)
  const sellersState = useAppSelector(s => s.sellers);
  const pageData = sellersState.sellersPage;
  const loading = sellersState.loading;

  React.useEffect(() => {
    // ✅ dùng page + rowsPerPage, không hardcode 0/10 nữa
    dispatch(fetchSellers({ status: accountStatus, page, size: rowsPerPage, sort }));
  }, [dispatch, accountStatus, page, rowsPerPage, sort]);

  const handleAccountStatusChange = (event: any) => {
    setAccountStatus(event.target.value as string);
    setPage(0); // đổi filter thì về trang 0
  };
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // menu đổi status
  const [anchorEl, setAnchorEl] = React.useState<{ [key: number]: HTMLElement | null }>({});
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, sellerId: number) =>
    setAnchorEl(prev => ({ ...prev, [sellerId]: e.currentTarget }));
  const handleClose = (sellerId: number) =>
    setAnchorEl(prev => ({ ...prev, [sellerId]: null }));

  const handleUpdateSellerAccountStatus = (id: number, status: string) => {
    const restoreProducts = status === "ACTIVE"; // chỉ bật lại khi ACTIVE

  dispatch(updateSellerAccountStatus({ id, status, restoreProducts }))
    .unwrap()
    .then(() => {
      // refetch theo trang hiện tại
      dispatch(fetchSellers({ status: accountStatus, page, size: rowsPerPage, sort }));
    });
  };

  const rows = pageData?.content ?? [];

  return (
    <>
      <div className="pb-5 w-60">
        <FormControl color="primary" fullWidth>
          <Select
            id="seller-status-filter"
            value={accountStatus}
            onChange={handleAccountStatusChange}
            className="text-primary-color"
            sx={{
              background: '#fff3e0',
              borderRadius: 2,
              fontWeight: 600,
              color: '#ff5722',
              '& .MuiSelect-icon': { color: '#ff9800' },
            }}
          >
            {accountStatuses.map(s => (
              <MenuItem key={s.status} value={s.status}>{s.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 24px 0 rgba(255,152,0,0.15)',
          border: '1px solid #ffe0b2',
        }}
      >
        <Table sx={{ minWidth: 700, background: '#fff' }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Seller Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile</StyledTableCell>
              <StyledTableCell>TaxCode</StyledTableCell>
              <StyledTableCell>Bussiness Name</StyledTableCell>
              <StyledTableCell align="right">Account Status</StyledTableCell>
              <StyledTableCell align="right">Change Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(seller => (
              <StyledTableRow key={seller.id}>
                <StyledTableCell>{seller.sellerName}</StyledTableCell>
                <StyledTableCell>{seller.email}</StyledTableCell>
                <StyledTableCell>{seller.mobile}</StyledTableCell>
                <StyledTableCell>{seller.taxCode}</StyledTableCell>
                <StyledTableCell>{seller.businessDetails?.businessName}</StyledTableCell>
                <StyledTableCell align="right">
                  <Chip
                    label={seller.accountStatus}
                    size="small"
                    variant="filled"
                    sx={{
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: 1,
                      bgcolor:
                        seller.accountStatus === "ACTIVE"
                          ? "#43a047"
                          : seller.accountStatus === "SUSPENDED"
                          ? "#e53935"
                          : seller.accountStatus === "BANNED"
                          ? "#d84315"
                          : seller.accountStatus === "PENDING_VERIFICATION"
                          ? "#ffb300"
                          : "#757575",
                      color: "#fff",
                      borderRadius: 2,
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    onClick={(e) => handleClick(e, seller.id!)}
                    sx={{
                      color: "#ff5722",
                      background: "#ffe0b2",
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 2,
                      boxShadow: '0 2px 8px 0 rgba(255,152,0,0.08)',
                      border: '1px solid #ffcc80',
                      transition: 'background 0.2s',
                      '&:hover': {
                        background: "#ffd180",
                        color: "#ff9800",
                        boxShadow: '0 4px 16px 0 rgba(255,152,0,0.13)',
                      },
                    }}
                  >
                    Change Status
                  </Button>
                  <Menu
                    anchorEl={anchorEl[seller.id!]}
                    open={Boolean(anchorEl[seller.id!])}
                    onClose={() => handleClose(seller.id!)}
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        minWidth: 180,
                        boxShadow: '0 4px 16px 0 rgba(255,152,0,0.15)',
                      }
                    }}
                  >
                    {accountStatuses.map(st => (
                      <MenuItem
                        key={st.status}
                        onClick={() => handleUpdateSellerAccountStatus(seller.id!, st.status)}
                        sx={{
                          fontWeight: 600,
                          color: "#ff5722",
                          '&:hover': { background: "#fff3e0", color: "#ff9800" }
                        }}
                      >
                        {st.title}
                      </MenuItem>
                    ))}
                  </Menu>
                </StyledTableCell>
              </StyledTableRow>
            ))}

            {rows.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} align="center">No Data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={pageData?.totalElements ?? 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 50]}
          sx={{
            background: "#fff8f1",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            color: "#ff9800",
            '.MuiTablePagination-actions': { color: "#ff9800" }
          }}
        />
      </TableContainer>
    </>
  );
}

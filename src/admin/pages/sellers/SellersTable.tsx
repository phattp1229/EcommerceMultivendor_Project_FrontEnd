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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: { backgroundColor: theme.palette.common.black, color: theme.palette.common.white },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
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
    dispatch(updateSellerAccountStatus({ id, status }))
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
          >
            {accountStatuses.map(s => (
              <MenuItem key={s.status} value={s.status}>{s.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
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
                  variant="outlined"
                  color={
                    seller.accountStatus === "ACTIVE"
                      ? "success"
                      : seller.accountStatus === "SUSPENDED"
                      ? "error"
                      : "warning"
                  }
                  sx={{ fontWeight: 600 }}
                />
              </StyledTableCell>
                <StyledTableCell align="right">
                  <Button onClick={(e) => handleClick(e, seller.id!)}>Change Status</Button>
                  <Menu
                    anchorEl={anchorEl[seller.id!]}
                    open={Boolean(anchorEl[seller.id!])}
                    onClose={() => handleClose(seller.id!)}
                  >
                    {accountStatuses.map(st => (
                      <MenuItem key={st.status} onClick={() => handleUpdateSellerAccountStatus(seller.id!, st.status)}>
                        {st.title}
                      </MenuItem>
                    ))}
                  </Menu>
                </StyledTableCell>
              </StyledTableRow>
            ))}

            {rows.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
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
        />
      </TableContainer>
    </>
  );
}

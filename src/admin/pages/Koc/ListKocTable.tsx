import React, { useEffect, useState } from "react";
import {
  Card, CardContent, Chip, Stack, Typography,
  FormControl, InputLabel, Select, MenuItem, Button, Menu
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { DataGrid, GridToolbar, type GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  adminFetchKoc,
  selectKocAdminList,
  selectKocAdminLoading,
  selectKocAdminTotal,
  selectKocAdminPage,
  selectKocAdminSize,
  adminUpdateKocStatus,
  type AccountStatus,
} from "../../../Redux Toolkit/Customer/Koc/KocSlice";

const statusColor = (s: AccountStatus) =>
  s === "ACTIVE"
    ? { bg: "#d1fae5", color: "#047857" }
    : s === "SUSPENDED"
    ? { bg: "#fee2e2", color: "#b91c1c" }
    : { bg: "#fef9c3", color: "#b45309" };

/** Cell component cho cột Change Status */
const ChangeStatusCell = ({ row }: { row: any }) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const changeTo = (next: AccountStatus) => {
    const jwt = localStorage.getItem("jwt") || "";
    dispatch(adminUpdateKocStatus({ jwt, id: row.id, status: next }));
    handleClose();
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Button
        size="small"
        variant="outlined"
        onClick={handleOpen}
        sx={{
          color: "#0284c7",
          background: "#e0f2fe",
          borderColor: "#bae6fd",
          fontWeight: 600,
          borderRadius: 2,
          px: 2,
          textTransform: "none",
          '&:hover': {
            background: "#bae6fd",
            borderColor: "#7dd3fc",
            color: "#0369a1"
          }
        }}
      >
        Change
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 4px 16px 0 rgba(2,132,199,0.10)',
          }
        }}
      >
        <MenuItem onClick={() => changeTo("ACTIVE")} sx={{ color: "#047857", fontWeight: 600, '&:hover': { background: "#d1fae5" } }}>ACTIVE</MenuItem>
        <MenuItem onClick={() => changeTo("PENDING_VERIFICATION")} sx={{ color: "#b45309", fontWeight: 600, '&:hover': { background: "#fef9c3" } }}>PENDING_VERIFICATION</MenuItem>
        <MenuItem onClick={() => changeTo("SUSPENDED")} sx={{ color: "#b91c1c", fontWeight: 600, '&:hover': { background: "#fee2e2" } }}>SUSPENDED</MenuItem>
      </Menu>
    </div>
  );
};

export default function KocListTable() {
  const dispatch = useAppDispatch();
  const rows = useAppSelector(selectKocAdminList);
  const loading = useAppSelector(selectKocAdminLoading);
  const total = useAppSelector(selectKocAdminTotal);
  const page = useAppSelector(selectKocAdminPage);
  const size = useAppSelector(selectKocAdminSize);

  const [statusFilter, setStatusFilter] = useState<"All" | AccountStatus>("All");
  const statusParam = statusFilter === "All" ? undefined : statusFilter;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt") || "";
    dispatch(adminFetchKoc({ jwt, page: 0, size: 10, status: statusParam }));
  }, [dispatch, statusParam]);

  const handlePage = (m: { page: number; pageSize: number }) => {
    const jwt = localStorage.getItem("jwt") || "";
    dispatch(adminFetchKoc({ jwt, page: m.page, size: m.pageSize, status: statusParam }));
  };

  const handleChangeStatus = (e: SelectChangeEvent) => {
    const v = e.target.value as "All" | AccountStatus;
    setStatusFilter(v);
    const jwt = localStorage.getItem("jwt") || "";
    const s = v === "All" ? undefined : v;
    dispatch(adminFetchKoc({ jwt, page: 0, size, status: s }));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80, headerAlign: "center", align: "center", headerClassName: "col-id" },
    { field: "name", headerName: "Name", flex: 1, minWidth: 220, headerClassName: "col-id" },
    { field: "kocId", headerName: "Koc Code", width: 140, headerAlign: "center", align: "center", headerClassName: "col-id" },
    { field: "email", headerName: "Email", flex: 1, minWidth: 260, headerClassName: "col-id" },
    {
      field: "accountStatus",
      headerName: "Status",
      width: 160,
      headerAlign: "center",
      align: "center",
      headerClassName: "col-id",
      renderCell: (p) => {
        const c = statusColor(p.value as AccountStatus);
        return (
          <Chip
            size="small"
            label={p.value as string}
            sx={{
              background: c.bg,
              color: c.color,
              fontWeight: 700,
              borderRadius: 2,
              border: 'none',
              fontSize: 13,
              letterSpacing: 1
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Change Status",
      width: 180,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      headerClassName: "col-id",
      align: "center",
      renderCell: (params) => <ChangeStatusCell row={params.row} />,
    },
  ];

  return (
    <Card className="shadow-md rounded-2xl">
      <CardContent>
        {/* Header: tiêu đề trái, filter phải */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700}>KOC List</Typography>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={statusFilter} onChange={handleChangeStatus}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="PENDING_VERIFICATION">PENDING_VERIFICATION</MenuItem>
              <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <div style={{ width: "100%" }}>
          <DataGrid
            autoHeight
            rows={rows ?? []}
            getRowId={(r) => r.id}
            columns={columns}
            loading={loading}
            density="compact"
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={{ page, pageSize: size }}
            onPaginationModelChange={handlePage}
            rowCount={total}
            paginationMode="server"
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
            getRowClassName={(p) => (p.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#fef3c7", // vàng nhạt
                color: "#78350f",           // chữ nâu
                borderRadius: "12px 12px 0 0",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 0.5,
                borderBottom: '1px solid #fde68a',
              },
              "& .MuiDataGrid-cell": { outline: "none", fontSize: 15 },
              "& .even": { backgroundColor: "#f9fafb" },
              "& .odd": { backgroundColor: "#fff" },
              "& .MuiDataGrid-row:hover": { backgroundColor: "#f1f5f9" },
              "& .MuiDataGrid-footerContainer": { backgroundColor: "#fef3c7", color: "#b45309", borderTop: '1px solid #fde68a' },
              "& .col-id": {
                backgroundColor: "#fef3c7", // vàng nhạt
                color: "#78350f",           // chữ nâu
                fontWeight: 700
              },
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

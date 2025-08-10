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
  s === "ACTIVE" ? "success" : s === "SUSPENDED" ? "error" : "warning";

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
      <Button size="small" variant="outlined" onClick={handleOpen}>
        Change
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => changeTo("ACTIVE")}> ACTIVE</MenuItem>
        <MenuItem onClick={() => changeTo("PENDING_VERIFICATION")}> PENDING_VERIFICATION</MenuItem>
        <MenuItem onClick={() => changeTo("SUSPENDED")}> SUSPENDED</MenuItem>
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
    { field: "name", headerName: "Customer", flex: 1, minWidth: 220, headerClassName: "col-id" },
    { field: "customerId", headerName: "Customer ID", width: 140, headerAlign: "center", align: "center" , headerClassName: "col-id"},
    { field: "email", headerName: "Email", flex: 1, minWidth: 260 , headerClassName: "col-id"},
    {
      field: "accountStatus",
      headerName: "Status",
      width: 200,
      headerAlign: "center",
      align: "center",
       headerClassName: "col-id",
      renderCell: (p) => (
        <Chip size="small" label={p.value as string} color={statusColor(p.value as AccountStatus)} variant="outlined" />
      ),
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
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "#e0f2fe",color: "#0f172a", borderRadius: "12px 12px 0 0", fontWeight: 700 },
              "& .MuiDataGrid-cell": { outline: "none" },
              "& .even": { backgroundColor: "#fafafa" },
              "& .MuiDataGrid-row:hover": { backgroundColor: "#f1f5f9" },
              "& .MuiDataGrid-footerContainer": { backgroundColor: "#fff" },
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

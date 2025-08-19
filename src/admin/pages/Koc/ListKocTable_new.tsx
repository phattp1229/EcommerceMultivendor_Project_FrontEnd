import React, { useEffect, useState } from "react";
import {
  Card, CardContent, Chip, Stack, Typography,
  FormControl, InputLabel, Select, MenuItem, Button, Menu,
  IconButton, Tooltip, Box
} from "@mui/material";
import { Facebook, Instagram, YouTube } from "@mui/icons-material";
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

/** Component hiển thị social links */
const SocialLinksCell = ({ row }: { row: any }) => {
  const links = [
    { url: row.facebookLink, icon: Facebook, color: "#1877f2", name: "Facebook" },
    { url: row.instagramLink, icon: Instagram, color: "#e4405f", name: "Instagram" },
    { url: row.youtubeLink, icon: YouTube, color: "#ff0000", name: "YouTube" },
  ];

  return (
    <Box display="flex" gap={0.5}>
      {links.map(({ url, icon: Icon, color, name }) =>
        url ? (
          <Tooltip key={name} title={`${name}: ${url}`}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                window.open(url, '_blank');
              }}
              sx={{
                color: color,
                '&:hover': { backgroundColor: `${color}20` }
              }}
            >
              <Icon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null
      )}
      {!row.facebookLink && !row.instagramLink && !row.youtubeLink && (
        <Typography variant="body2" color="text.secondary">No links</Typography>
      )}
    </Box>
  );
};

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

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {(["PENDING_VERIFICATION", "ACTIVE", "SUSPENDED"] as AccountStatus[])
          .filter(s => s !== row.accountStatus)
          .map(status => (
            <MenuItem key={status} onClick={() => changeTo(status)}>
              {status.replace("_", " ")}
            </MenuItem>
          ))}
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

  console.log("KOC Rows:", rows);

  const [statusFilter, setStatusFilter] = useState<"All" | AccountStatus>("All");
  const statusParam = statusFilter === "All" ? undefined : statusFilter;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt") || "";
    dispatch(adminFetchKoc({ jwt, page: 0, size: 10, status: statusParam }));
  }, [dispatch, statusParam]);

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
    { field: "kocCode", headerName: "Koc Code", width: 140, headerAlign: "center", align: "center", headerClassName: "col-id" },
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
      field: "socialLinks",
      headerName: "Social Links",
      width: 200,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      headerClassName: "col-id",
      align: "center",
      renderCell: (params) => <SocialLinksCell row={params.row} />,
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
              <MenuItem value="PENDING_VERIFICATION">Pending</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="SUSPENDED">Suspended</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* DataGrid */}
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          paginationMode="server"
          rowCount={total}
          paginationModel={{ page, pageSize: size }}
          onPaginationModelChange={(model) => {
            const jwt = localStorage.getItem("jwt") || "";
            dispatch(adminFetchKoc({ jwt, page: model.page, size: model.pageSize, status: statusParam }));
          }}
          pageSizeOptions={[5, 10, 25]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e2e8f0',
            },
            '& .col-id': {
              fontWeight: 700,
              color: '#475569',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { adminFetchKoc, selectKocAdminList, selectKocAdminLoading } from "../../../Redux Toolkit/Customer/Koc/KocSlice";

export default function KocListTable() {
  const dispatch = useAppDispatch();
  const list = useAppSelector(selectKocAdminList);
  const loading = useAppSelector(selectKocAdminLoading);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt") || "";
    // NOTE: Đúng y chang URL Postman: "/admin/koc"
    dispatch(adminFetchKoc({ jwt, page: 0, size: 10 }));
  }, [dispatch]);

  console.log("KOC rows len =", list.length, list); // xem console

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Customer", flex: 1 },
    { field: "customerId", headerName: "Customer ID", width: 140 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "accountStatus", headerName: "Status", width: 180 },
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={list ?? []}
        getRowId={(r) => r.id}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
      />
    </div>
  );
}

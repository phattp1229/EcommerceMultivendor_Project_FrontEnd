// src/seller/pages/Campaigns/CampaignList.tsx
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, Stack, Typography, Chip, Button, CircularProgress, Box, IconButton, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchSellerCampaigns, deleteSellerCampaign } from "../../../Redux Toolkit/Seller/sellerCampaignSlice";
import type { AffiliateCampaign } from "../../../types/affiliateCampaignTypes";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
const CampaignList: React.FC = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { list, loading, error } = useAppSelector(s => s.sellerCampaign);
    const statusColor = status === 'ACTIVE' ? '#43a047' : status === 'EXPIRED' ? '#ff9800' : '#bdbdbd';
    const statusTextColor = '#fff';
  useEffect(() => { dispatch(fetchSellerCampaigns()); }, []);

  // const handleDelete = async (id: number) => {
  //   if (window.confirm('Are you sure you want to delete this campaign?')) {
  //     await dispatch(deleteSellerCampaign({ id }));
  //     dispatch(fetchSellerCampaigns());
  //   }
  // };
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  // State for viewing products
  const [openProductsDialog, setOpenProductsDialog] = React.useState(false);
  const [selectedCampaign, setSelectedCampaign] = React.useState<AffiliateCampaign | null>(null);
  const [campaignProducts, setCampaignProducts] = React.useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = React.useState(false);

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

 const handleConfirmDelete = async () => {
  if (deleteId == null) return;
  try {
    await dispatch(deleteSellerCampaign({ id: deleteId })).unwrap();
    enqueueSnackbar("Campaign deleted successfully!", { variant: "success" });
    // Optionally refresh:
    dispatch(fetchSellerCampaigns());
  } catch (err: any) {
    const msg = typeof err === "string" ? err : err?.message || "Delete campaign failed";
    enqueueSnackbar(msg, { variant: "error" });
  } finally {
    setOpenConfirm(false);
    setDeleteId(null);
  }
};

  // Function to fetch products for a campaign
  const fetchCampaignProducts = async (campaignId: number) => {
    setLoadingProducts(true);
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await fetch(`http://localhost:5454/sellers/campaigns/${campaignId}/products`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (response.ok) {
        const products = await response.json();
        setCampaignProducts(products);
      } else {
        console.error("Failed to fetch campaign products");
        setCampaignProducts([]);
      }
    } catch (error) {
      console.error("Error fetching campaign products:", error);
      setCampaignProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Function to handle view products
  const handleViewProducts = (campaign: AffiliateCampaign) => {
    setSelectedCampaign(campaign);
    setOpenProductsDialog(true);
    fetchCampaignProducts(campaign.id);
  };
  return (
    <Card>
      <CardHeader
        title="My Campaigns"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<PeopleIcon />} onClick={() => nav("/seller/campaigns/koc-registrations")}>
              KOC Registrations
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => nav("/seller/campaigns/new")}>
              New Campaign
            </Button>
          </Stack>
        }
      />
      <CardContent>
        {loading && <CircularProgress />}
        {/* {error && <Typography color="error" mb={2}>{String(error)}</Typography>} */}

        {!loading && list.length === 0 && (
          <Typography color="text.secondary">No campaigns yet.</Typography>
        )}

        <Stack spacing={2}>
          {list.map((c: AffiliateCampaign) => {
            const expired = new Date(c.expiredAt).getTime() < Date.now();
            const status = !c.active ? "INACTIVE" : expired ? "EXPIRED" : "ACTIVE";
        
            return (
              <Card
                key={c.id}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  border: 'none',
                  background: 'linear-gradient(90deg, #fff 60%, #e0f7fa 100%)',
                  transition: 'transform 0.15s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6, borderColor: '#ff9800' }
                }}
              >
                <Box sx={{ position: 'absolute', left: -18, top: -18, zIndex: 2 }}>
  {status === 'ACTIVE' && <span style={{ fontSize: 32, filter: 'drop-shadow(0 2px 6px #43a04788)', animation: 'pulse 1.2s infinite' }}>🌟</span>}
  {status === 'EXPIRED' && <span style={{ fontSize: 32, filter: 'drop-shadow(0 2px 6px #ff980088)', animation: 'shake 0.7s infinite' }}>⏰</span>}
  {status === 'INACTIVE' && <span style={{ fontSize: 32, filter: 'drop-shadow(0 2px 6px #bdbdbd88)' }}>⏸️</span>}
</Box>
                <CardContent>
                  <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" gap={2}>
                    <Box>
                      <Typography fontWeight={700} fontSize={22} color="#222" mb={0.5}>
                        {c.name}
                        <Chip
                        size="medium"
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                            {status === 'ACTIVE' && <span style={{ display: 'inline-flex', animation: 'pulse 1.2s infinite' }}>🟢</span>}
                            {status === 'EXPIRED' && <span style={{ display: 'inline-flex', animation: 'shake 0.7s infinite' }}>⏰</span>}
                            {status === 'INACTIVE' && <span style={{ display: 'inline-flex', opacity: 0.7 }}>⏸️</span>}
                            <span>{status}</span>
                            </Box>
                        }
                        sx={{
                            ml: 2,
                            fontWeight: 700,
                            fontSize: 16,
                            px: 2,
                            bgcolor: statusColor,
                            color: statusTextColor,
                            borderRadius: 2,
                            letterSpacing: 1,
                            boxShadow: status === 'ACTIVE' ? '0 0 8px 2px #43a04755' : undefined,
                            transition: 'box-shadow 0.3s',
                        }}
                        />  
                      </Typography>
                      <Typography fontSize={15} color="#555" fontWeight={500} mb={0.5}>
                        Code: <b>{c.campaignCode}</b> &nbsp;•&nbsp; <span style={{ color: '#ff5722' }}>{c.commissionPercent}%</span>
                      </Typography>
                      <Typography fontSize={14} color="#888">
  Start at: {c.startAt ? new Date(c.startAt).toLocaleString() : "Chưa kích hoạt"} 
  &nbsp;•&nbsp; 
  Ends: {new Date(c.expiredAt).toLocaleString()}
</Typography>
                      <Typography fontSize={14} color="#888">
                        Created: {new Date(c.createdAt).toLocaleString()}
                      </Typography>
                     
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Products">
                        <IconButton sx={{ bgcolor: '#f3e5f5', '&:hover': { bgcolor: '#ce93d8' } }} onClick={() => handleViewProducts(c)}>
                          <VisibilityIcon sx={{ color: '#7b1fa2' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton sx={{ bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#90caf9' } }} onClick={() => nav(`/seller/campaigns/update/${c.id}`)}>
                          <EditIcon sx={{ color: '#1976d2' }} />
                        </IconButton>
                      </Tooltip>
                   <Tooltip title="Delete">
                  <IconButton
                    sx={{ bgcolor: '#ffebee', '&:hover': { bgcolor: '#ffcdd2' } }}
                    onClick={() => confirmDelete(c.id)}
                  >
                    <DeleteIcon sx={{ color: '#d32f2f' }} />
                  </IconButton>
                </Tooltip>

                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this campaign? This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
    <Button onClick={handleConfirmDelete} color="error" variant="contained">
      Delete
    </Button>
  </DialogActions>
</Dialog>

        {/* Products Dialog */}
        <Dialog
          open={openProductsDialog}
          onClose={() => setOpenProductsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Products in Campaign: {selectedCampaign?.name}
          </DialogTitle>
          <DialogContent>
            {loadingProducts ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : campaignProducts.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={3}>
                No products found in this campaign
              </Typography>
            ) : (
              <Stack spacing={2} mt={1}>
                {campaignProducts.map((product: any) => (
                  <Card key={product.id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        {product.images && product.images.length > 0 && (
                          <Box
                            component="img"
                            src={product.images[0]}
                            alt={product.title}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                        )}
                        <Box flex={1}>
                          <Typography fontWeight={600} fontSize={16}>
                            {product.title}
                          </Typography>
                          <Typography color="text.secondary" fontSize={14}>
                            Brand: {product.brand} • Category: {product.category?.name}
                          </Typography>
                          <Typography color="primary" fontWeight={600}>
                            {product.sellingPrice.toLocaleString("vi-VN")}đ
                            {product.discountedPrice && (
                              <Typography component="span" sx={{ textDecoration: 'line-through', ml: 1, color: 'text.secondary' }}>
                                {product.discountedPrice}
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                        <Chip
                          label={product.in_stock ? "In Stock" : "Out of Stock"}
                          color={product.in_stock ? "success" : "error"}
                          size="small"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProductsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

      </CardContent>
    </Card>
    
  );
};

export default CampaignList;

// src/seller/pages/Campaigns/CampaignList.tsx
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, Stack, Typography, Chip, Button, CircularProgress, Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchSellerCampaigns, deleteSellerCampaign } from "../../../Redux Toolkit/Seller/sellerCampaignSlice";
import type { AffiliateCampaign } from "../../../types/affiliateCampaignTypes";

const CampaignList: React.FC = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector(s => s.sellerCampaign);
    const statusColor = status === 'ACTIVE' ? '#43a047' : status === 'EXPIRED' ? '#ff9800' : '#bdbdbd';
    const statusTextColor = '#fff';
  useEffect(() => { dispatch(fetchSellerCampaigns()); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      await dispatch(deleteSellerCampaign({ id }));
      dispatch(fetchSellerCampaigns());
    }
  };

  return (
    <Card>
      <CardHeader
        title="My Campaigns"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => nav("/seller/campaigns/new")}>
            New Campaign
          </Button>
        }
      />
      <CardContent>
        {loading && <CircularProgress />}
        {error && <Typography color="error" mb={2}>{String(error)}</Typography>}

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
                        Created: {new Date(c.createdAt).toLocaleString()} &nbsp;•&nbsp; Ends: {new Date(c.expiredAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton sx={{ bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#90caf9' } }} onClick={() => nav(`/seller/campaigns/update/${c.id}`)}>
                          <EditIcon sx={{ color: '#1976d2' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton sx={{ bgcolor: '#ffebee', '&:hover': { bgcolor: '#ffcdd2' } }} onClick={() => handleDelete(c.id)}>
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
      </CardContent>
    </Card>
  );
};

export default CampaignList;

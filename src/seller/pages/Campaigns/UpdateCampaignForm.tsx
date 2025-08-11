import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../Redux Toolkit/Store';
import { fetchSellerCampaigns, updateSellerCampaign } from '../../../Redux Toolkit/Seller/sellerCampaignSlice';
import { fetchSellerProducts } from '../../../Redux Toolkit/Seller/sellerProductSlice';
import type { AffiliateCampaign } from '../../../types/affiliateCampaignTypes';
import { Grid, TextField, Button, Typography, Paper, FormControlLabel, Switch, Box, Chip } from '@mui/material';

const UpdateCampaignForm: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const campaigns = useSelector((state: RootState) => (state as any).sellerCampaign.list);
  // No products used in update form
  const [form, setForm] = useState<Partial<AffiliateCampaign>>({});
  // Product selection not used in update form
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch<any>(fetchSellerCampaigns(localStorage.getItem('jwt') || undefined));
    dispatch<any>(fetchSellerProducts(localStorage.getItem('jwt')));
  }, [dispatch]);

  useEffect(() => {
    if (campaignId && Array.isArray(campaigns) && campaigns.length > 0) {
      const campaign = campaigns.find((c: AffiliateCampaign) => String(c.id) === String(campaignId));
      if (campaign) {
        setForm({ ...campaign });
        // No productIds in AffiliateCampaign, so skip product selection for now or extend backend/model if needed
      }
    }
  }, [campaignId, campaigns]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = 'Campaign name is required.';
    if (typeof form.commissionPercent !== 'number' || form.commissionPercent < 0) newErrors.commissionPercent = 'Commission must be non-negative.';
    if (!form.expiredAt) newErrors.expiredAt = 'Expired date is required.';
    if (form.createdAt && form.expiredAt && new Date(form.expiredAt) > new Date(form.expiredAt)) {
      newErrors.expiredAt = 'Expired date cannot be before created date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'commissionPercent' ? Number(value) : value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !campaignId) return;
    console.log('Update campaign payload:', form);
    await dispatch<any>(updateSellerCampaign({
      id: Number(campaignId),
      updates: {
        ...form,
      },
    }));
    navigate('/seller/campaigns');
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: 'auto', mt: 6, borderRadius: 4, boxShadow: 6, background: 'linear-gradient(135deg, #f8fafc 60%, #e0f7fa 100%)' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight={700} color="#222" sx={{ letterSpacing: 1 }}>
          Update Campaign
        </Typography>
        {form.active !== undefined && (
          <Chip
            label={form.active ? 'ACTIVE' : 'INACTIVE'}
            color={form.active ? 'success' : 'default'}
            sx={{ fontWeight: 700, fontSize: 18, px: 2, py: 1, bgcolor: form.active ? '#43a047' : '#bdbdbd', color: '#fff', borderRadius: 2, ml: 2 }}
          />
        )}
      </Box>
      <form onSubmit={handleUpdate}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              label="Campaign Name"
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Commission (%)"
              name="commissionPercent"
              type="number"
              value={form.commissionPercent ?? ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.commissionPercent}
              helperText={errors.commissionPercent}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Expired At"
              name="expiredAt"
              type="date"
              value={form.expiredAt ? String(form.expiredAt).slice(0, 10) : ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.expiredAt}
              helperText={errors.expiredAt}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Description"
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
            />
          </Grid>
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!form.active}
                  onChange={(_, checked) => setForm(prev => ({ ...prev, active: checked }))}
                  color="primary"
                />
              }
              label={form.active ? 'Active' : 'Inactive'}
            />
          </Grid>
          <Grid size={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(90deg, #ff5722 0%, #ff9800 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                py: 1.5,
                borderRadius: 2,
                boxShadow: 2,
                mt: 2,
                '&:hover': { background: 'linear-gradient(90deg, #ff7043 0%, #ffa726 100%)' }
              }}
            >
              UPDATE CAMPAIGN
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default UpdateCampaignForm;

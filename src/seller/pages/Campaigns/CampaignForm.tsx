// src/seller/pages/Campaigns/CampaignForm.tsx
import React from "react";
import { Button, Card, CardContent, CardHeader, Stack, Switch, TextField, FormControlLabel, Box, Autocomplete, Chip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createSellerCampaign } from "../../../Redux Toolkit/Seller/sellerCampaignSlice";
import { fetchSellerProducts } from "../../../Redux Toolkit/Seller/sellerProductSlice";
import type { CreateAffiliateCampaignRequest } from "../../../types/affiliateCampaignTypes";
import type { Product } from '../../../types/productTypes';

const CampaignForm: React.FC = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([]);
  const { products, loading: loadingProducts } = useAppSelector((state) => state.sellerProduct);
 const [form, setForm] = React.useState<CreateAffiliateCampaignRequest>({
  name: "",
  description: "",
  commissionPercent: 10,
  expiredAt: "",
  active: true,
});
const [errors, setErrors] = React.useState<{ commission?: string; expiredAt?: string; products?: string }>({});


React.useEffect(() => {
  dispatch(fetchSellerProducts(localStorage.getItem("jwt")));
}, [dispatch]);
  const onSave = async () => {
    let hasError = false;
    const newErrors: { commission?: string; expiredAt?: string; products?: string } = {};
    // Validate commission
    if (form.commissionPercent < 0) {
      newErrors.commission = "Commission must be non-negative";
      hasError = true;
    }
    // Validate expired date
    if (!form.expiredAt) {
      newErrors.expiredAt = "Please select an expiration date";
      hasError = true;
    } else {
      const today = new Date();
      today.setHours(0,0,0,0);
      const expired = new Date(form.expiredAt);
      if (expired < today) {
        newErrors.expiredAt = "Expiration date cannot be in the past";
        hasError = true;
      }
    }
    // Validate products
    if (!selectedProducts.length) {
      newErrors.products = "You must select at least 1 product";
      hasError = true;
    }
    setErrors(newErrors);
    if (hasError) return;
    // Format expiredAt for backend
    let expiredAt = form.expiredAt;
    if (/^\d{4}-\d{2}-\d{2}$/.test(expiredAt)) {
      expiredAt = expiredAt + 'T00:00:00';
    }
    const dataToSend = { ...form, expiredAt, productIds: selectedProducts.map(p => p.id!) };
    await dispatch(createSellerCampaign({ data: dataToSend })).unwrap();
    nav("/seller/campaigns");
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f8f9fa">
      <Card sx={{ minWidth: 600, maxWidth: 900, width: '100%', borderRadius: 3, boxShadow: 4, p: 3 }}>
        <CardHeader title="Create Campaign" sx={{ textAlign: 'center', pb: 0 }} />
        <CardContent>
          <Box mb={2}>
            <Typography fontWeight={600} mb={1}>
              Select products for this campaign
            </Typography>
            <Autocomplete
            multiple
            options={products.filter((p) => typeof p.id === 'number')}
            getOptionLabel={(option) => option.title}
            value={selectedProducts}
            onChange={(_, value) => setSelectedProducts(value)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={loadingProducts}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Products"
                  error={!!errors.products}
                  helperText={errors.products}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option.title} {...getTagProps({ index })} key={option.id} />
                ))
              }
              sx={{ background: '#fff' }}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Name" fullWidth value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField label="Commission %" type="number" fullWidth value={form.commissionPercent}
                onChange={(e) => setForm({ ...form, commissionPercent: Number(e.target.value) })}
                error={!!errors.commission}
                helperText={errors.commission}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField label="Expired at" type="date" fullWidth InputLabelProps={{ shrink: true }}
                value={form.expiredAt} onChange={(e) => setForm({ ...form, expiredAt: e.target.value })}
                error={!!errors.expiredAt}
                helperText={errors.expiredAt}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={<Switch checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} color="success" />}
                label="Active"
              />
            </Grid>
            <Grid size={12}>
              <TextField label="Description" fullWidth multiline minRows={3}
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} mt={4} justifyContent="center">
            <Button variant="contained" color="success" size="large" sx={{ px: 4 }} onClick={onSave}>Save</Button>
            <Button variant="outlined" size="large" sx={{ px: 4 }} onClick={() => nav("/seller/campaigns")}>Cancel</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CampaignForm;

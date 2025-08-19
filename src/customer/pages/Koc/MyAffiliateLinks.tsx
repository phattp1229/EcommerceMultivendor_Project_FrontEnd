import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface AffiliateLinkDto {
  id: number;
  shortToken: string;
  generatedUrl: string;
  targetUrl: string;
  totalClick: number;
  createdAt: string;
  campaignId: number;
  campaignCode: string;
  campaignName: string;
  commissionPercent: number;
  productId?: number;
  productTitle?: string;
  productImage?: string;
  productPrice?: number;
  kocCode: string;
  kocName: string;
}

const MyAffiliateLinks: React.FC = () => {
  const [links, setLinks] = useState<AffiliateLinkDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState<AffiliateLinkDto | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchMyLinks();
  }, []);

  const fetchMyLinks = async () => {
    try {
      const jwt = localStorage.getItem('jwt');
      const response = await fetch('http://localhost:5454/api/koc/my-links', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      } else {
        console.error('Failed to fetch affiliate links');
      }
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: 'Link copied to clipboard!', severity: 'success' });
    }).catch(() => {
      setSnackbar({ open: true, message: 'Failed to copy link', severity: 'error' });
    });
  };

  const handleViewDetails = (link: AffiliateLinkDto) => {
    setSelectedLink(link);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
        My Affiliate Links
      </Typography>
      
      {links.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" textAlign="center" py={4}>
              No affiliate links found. Join campaigns to get your affiliate links!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {links.map((link) => (
            <Card key={link.id} variant="outlined" sx={{ '&:hover': { boxShadow: 3 } }}>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                  {/* Campaign Info */}
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {link.campaignName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Code: {link.campaignCode} • Commission: {link.commissionPercent}%
                    </Typography>
                    
                    {/* Product Info if exists */}
                    {link.productId && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {link.productImage && (
                          <Box
                            component="img"
                            src={link.productImage}
                            alt={link.productTitle}
                            sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                          />
                        )}
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {link.productTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ${link.productPrice}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {/* Link Info */}
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LinkIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}>
                        {link.generatedUrl}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Stats & Actions */}
                  <Box textAlign="center">
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`${link.totalClick} clicks`}
                      color={link.totalClick > 0 ? 'success' : 'default'}
                      sx={{ mb: 1 }}
                    />
                    
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Copy Link">
                        <IconButton
                          color="primary"
                          onClick={() => copyToClipboard(link.generatedUrl)}
                          sx={{ bgcolor: 'primary.50' }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="View Details">
                        <IconButton
                          color="info"
                          onClick={() => handleViewDetails(link)}
                          sx={{ bgcolor: 'info.50' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Affiliate Link Details</DialogTitle>
        <DialogContent>
          {selectedLink && (
            <Stack spacing={2} mt={1}>
              <TextField
                label="Campaign"
                value={`${selectedLink.campaignName} (${selectedLink.campaignCode})`}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              
              <TextField
                label="Commission"
                value={`${selectedLink.commissionPercent}%`}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              
              <TextField
                label="Short Link"
                value={selectedLink.generatedUrl}
                fullWidth
                InputProps={{ 
                  readOnly: true,
                  endAdornment: (
                    <IconButton onClick={() => copyToClipboard(selectedLink.generatedUrl)}>
                      <ContentCopyIcon />
                    </IconButton>
                  )
                }}
              />
              
              <TextField
                label="Target URL"
                value={selectedLink.targetUrl}
                fullWidth
                multiline
                rows={2}
                InputProps={{ readOnly: true }}
              />
              
              <TextField
                label="Total Clicks"
                value={selectedLink.totalClick}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              
              <TextField
                label="Created At"
                value={new Date(selectedLink.createdAt).toLocaleString()}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyAffiliateLinks;

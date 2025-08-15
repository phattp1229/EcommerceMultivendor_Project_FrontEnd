import React from "react";
import { Stack, Typography } from "@mui/material";
import KocCampaignSection from "./KocDashboard/KocCampaignSection";

const AffiliateCampaignPage: React.FC = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>Affiliate Campaign</Typography>
      <KocCampaignSection />
    </Stack>
  );
};

export default AffiliateCampaignPage;

import { useState } from "react";
import { Box, Alert } from '@mui/material';
import CampaignInput from '../components/campaignInput';
import CampaignDisplay from "../components/campaignDisplay";
import QueryEditor from "../components/queryEditor";

import { retrieveCampaignDetails } from "../api"; 

export default function CampaignTroubleshooter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [campaignDetails, setCampaignDetails] = useState(null); 

  async function handleLoadCampaign(e) {
    e.preventDefault();
    setCampaignDetails(null);
    setError("");
    
    const campaignId = new FormData(e.target).get('campaignId');
    if (!campaignId || isNaN(campaignId)) {
      return setError("Please enter a valid campaign Id");
    }

    const details = await retrieveCampaignDetails(campaignId);
    if (details) {
      setCampaignDetails(details);
      console.log(details)
    } else {
      setError("Campaign not found. Please enter a valid campaign Id");
    }
  }
  

  return (
    <Box sx={{ maxWidth: 1500, px: 6, py: 3 }}>
      <h2 className="mb-4">Campaign Troubleshooter</h2>
      <Box className="d-flex gap-2 my-3 align-items-center py-2">
        <CampaignInput
          onSubmit={handleLoadCampaign}
          loading={loading}
          buttonLabel="Load Campaign"
        />
      </Box>
      {error && <Alert severity="error">{error}</Alert>}

      <CampaignDisplay campaignDetails={campaignDetails} />
      <QueryEditor campaignDetails={campaignDetails} />
    </Box>
  );
}
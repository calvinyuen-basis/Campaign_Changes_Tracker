import { useState } from "react";
import { Box, Alert } from '@mui/material';
import CampaignInput from '../components/CampaignInput';
import { getCampaignDetails } from "../api"; 
import CampaignDisplay from "../components/CampaignDisplay";

export default function CampaignTroubleshooter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [campaignDetails, setCampaignDetails] = useState(null); 

  async function handleLoadCampaign(e) {
    e.preventDefault();
    setError("");
    
    const campaignID = new FormData(e.target).get('campaignId'); // This line will be handled by CampaignIdForm
    if (!campaignID || isNaN(campaignID)) {
      return setError("Please enter a valid campaign ID");
    }

    const result = await getCampaignDetails(campaignID);
    if (!result.data) {
      return setError(result.message);
    }
    setCampaignDetails(result.data[0]);
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
    </Box>
  );
}
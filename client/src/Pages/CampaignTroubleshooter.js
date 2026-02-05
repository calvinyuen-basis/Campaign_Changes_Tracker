import { useState } from "react";
import { TextField, Button, Box, Alert } from '@mui/material';
import { getCampaignDetails } from "../api"; 

export default function CampaignTroubleshooter() {
  const [loading, setLoading] = useState(false);

  async function handleLoadCampaign(e) {
    e.preventDefault();

    const campaignID = new FormData(e.target).get('campaignId');
    const filteredData = await getCampaignDetails(campaignID);
  }
  

  return (
    <Box sx={{ maxWidth: 1500, px: 6, py: 3 }}>
      <h2 className="mb-4">Campaign Troubleshooter</h2>

      <Box className="d-flex gap-2 my-3 align-items-center py-2">
        <Box component="form" onSubmit={handleLoadCampaign} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Campaign ID"
            variant="outlined"
            name="campaignId"
            size="small"
            type="number"
            sx={{
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
            }}
          />
          <Button variant="contained" type="submit" disabled={loading} sx={{ mr: 5 }}>
            {loading ? 'Loading...' : 'Load Campaign'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
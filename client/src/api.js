
export async function getCampaignChanges(campaignId) {
  try {
    const res = await fetch(`http://localhost:5000/api/campaign/${campaignId}`);

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching campaign:", err);
    throw err; 
  }
}
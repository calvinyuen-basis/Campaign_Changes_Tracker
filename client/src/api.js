
export async function getCampaignChanges(campaignId) {
  try {
    const res = await fetch(`http://localhost:5000/api/campaign/${campaignId}`);
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    const data = await res.json();
    const filteredData = data
      .map(entry => ({
        ...entry,
        changes: entry.changes ? entry.changes.filter(change => 
          change.fieldName !== 'lastModified' && change.oldValue !== change.newValue
        ) : []
      }))
      .filter(entry => entry.changes && entry.changes.length > 0);
    return filteredData;

  } catch (err) {
    console.error("Error fetching campaign:", err);
    throw err; 
  }
}
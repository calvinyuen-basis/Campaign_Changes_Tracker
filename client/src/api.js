export async function retrieveCampaignDetails(campaignId) {
  try {
    const res = await fetch(`http://localhost:5000/api/campaigns/${campaignId}`);
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    const result = await res.json();
    return result;
  } catch (err) {
    console.error("Error fetching campaign:", err);
    throw err;
  }
}

export async function retrieveCampaignChanges(campaignId) {
  try {
    const res = await fetch(`http://localhost:5000/api/campaigns/${campaignId}/changes`);
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
      .filter(entry => entry.type === 'INITIAL' || (entry.changes && entry.changes.length > 0));
    return filteredData;

  } catch (err) {
    console.error("Error fetching campaign:", err);
    throw err;
  }
}

export async function retrieveDealTargeting(campaignId) {
  try {
    const res = await fetch(`http://localhost:5000/api/campaigns/${campaignId}/deals`);
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    const result = await res.json();
    return result.data;

  } catch (err) {
    console.error("Error fetching campaign:", err);
    throw err;
  }
}

export async function retrieveDomainTargeting(campaignId) {
  try {
    const res = await fetch(`http://localhost:5000/api/campaigns/${campaignId}/domainLists`);
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    const result = await res.json();
    return result;

  } catch (err) {
    console.error("Error fetching campaign:", err);
    throw err;
  }
}

export async function retrieveCampaignGeoTargeting(campaignId) {
}
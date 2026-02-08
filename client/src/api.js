export async function send(method='GET', url, body=null) {
  try {
    const res = await fetch(`${process.env.REACT_APP_PUBLIC_BACKEND_URL}${url}`)
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function retrieveCampaignDetails(campaignId) {
  return send("GET", `/api/campaigns/${campaignId}`);
}

export async function retrieveDealTargeting(campaignId) {
  return send("GET", `/api/campaigns/${campaignId}/deals`);
}

export async function retrieveDomainTargeting(campaignId) {
  return send("GET", `/api/campaigns/${campaignId}/domainLists`);
}

export async function retrieveGeoTargeting(advertiserId, campaignId) {
  return send("GET", `/api/campaigns/${campaignId}/geo/${advertiserId}`);
}

export async function retrieveCampaignChanges(campaignId) {
  return send("GET", `/api/campaigns/${campaignId}/changes`);
}
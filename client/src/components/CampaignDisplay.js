import JsonView from '@uiw/react-json-view';

export default function CampaignDisplay({ campaignDetails }) {

  async function getCampaignTargeting(campaignDetails) {
  // deal 
  if (campaignDetails.dealjs) {
    console.log(campaignDetails.dealjs);
  }
  // audience 
  if (campaignDetails.audienceTargetingjs) {
    console.log(campaignDetails.audienceTargetingjs);
  }
  // contextual 
  if (campaignDetails.contextualjs) {
    console.log(campaignDetails.contextualjs);
  }
  // device 
  if (campaignDetails.deviceTargetingjs) {
    console.log(campaignDetails.deviceTargetingjs);
  }
  // traffic type
  if (campaignDetails.trafficTypes) {
    console.log(campaignDetails.trafficTypes);
  }
  // domain
  if (campaignDetails.domainListIdsjs) {
    console.log(campaignDetails.domainListIdsjs);
  } 
}

// deal (js)
// geo (api)
// audience (js)
// contextual (js)
// device (js)
// domain (js)
// traffic (js)
// ad

  if (!campaignDetails) {
    return null;
  }

  getCampaignTargeting(campaignDetails);  

  return (
    <div className="border rounded-3 shadow-sm p-4 mb-3">
      <JsonView value={campaignDetails} collapsed={1} style={{ padding: '5px', borderRadius: '3px', fontSize: '12px' }}/>
    </div>
  );
}

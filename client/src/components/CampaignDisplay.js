import JsonView from '@uiw/react-json-view';

export default function CampaignDisplay({ campaignDetails }) {
  
  if (!campaignDetails) return null;

  return (
    <div className="border rounded-3 shadow-sm p-4 mb-3">
      <JsonView value={campaignDetails} collapsed={1} style={{ padding: '5px', borderRadius: '3px', fontSize: '12px' }}/>
    </div>
  );
}

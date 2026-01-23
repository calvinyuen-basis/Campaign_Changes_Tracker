import { Tooltip as ReactTooltip } from 'react-tooltip';

export default function Tooltip() {
  return (
    <ReactTooltip 
      id="data-tooltip"
      place="top"
      style={{ 
        backgroundColor: '#333', 
        color: '#fff', 
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '14px'
      }}
    />
  );
}

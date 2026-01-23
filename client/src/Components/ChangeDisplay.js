import JsonView from '@uiw/react-json-view';
import { Collapse } from '@mui/material';
import { useState } from 'react';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';

export default function ChangeDisplay({ entry }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const safeParseJSON = (value) => {
    if (value === null || value === undefined) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  };
  const time = new Date(entry.committed).toLocaleTimeString();

  return (
    <div style={{ marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          cursor: 'pointer', 
          padding: '8px', 
          backgroundColor: '#e8e8e8', 
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>
          {entry.changes.length} modification{entry.changes.length !== 1 ? 's' : ''} at {time}
        </span>
        {isExpanded ? <FaChevronDown /> : <FaChevronLeft />}
      </div>
      <Collapse in={isExpanded}>
        <div style={{ paddingLeft: '10px', marginTop: '5px' }}>
          {entry.changes.map((change, index) => {
            return (
              <div key={index} style={{ marginBottom: '10px', listStyle: 'none' }}>
                <div 
                  style={{ 
                    cursor: 'pointer', 
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    userSelect: 'none'
                  }}
                >
                  <strong>{change.fieldName}</strong>
                </div>
                <Collapse in={true}>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px', padding: '5px' }}>
                    <div style={{ flex: 1 }}>
                      <strong>Old:</strong>
                      {change.oldValue !== null && change.oldValue !== undefined ? (
                        <JsonView value={safeParseJSON(change.oldValue)} collapsed={1} style={{ padding: '5px', borderRadius: '3px', fontSize: '12px' }} />
                      ) : (
                        <div style={{ padding: '5px', fontStyle: 'italic', color: '#999' }}>null</div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong>New:</strong>
                      {change.newValue !== null && change.newValue !== undefined ? (
                        <JsonView value={safeParseJSON(change.newValue)} collapsed={1} style={{ padding: '5px', borderRadius: '3px', fontSize: '12px' }} />
                      ) : (
                        <div style={{ padding: '5px', fontStyle: 'italic', color: '#999' }}>null</div>
                      )}
                    </div>
                  </div>
                </Collapse>
              </div>
            );
          })}
        </div>
      </Collapse>
    </div>
  );
}

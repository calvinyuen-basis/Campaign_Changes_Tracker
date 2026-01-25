import JsonView from '@uiw/react-json-view';
import { Collapse } from '@mui/material';
import { useState } from 'react';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';

function parse(value) {
  if (value === null || value === undefined) {
    return null;
  }

  // Already an object, return it
  if (typeof value === 'object') {
    return value;
  }

  // Try to parse if it's a string
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  // Return other types as-is
  return value;
}

function renderValue(value) {
  const parsed = parse(value);
  
  // Handle null/undefined
  if (parsed === null || parsed === undefined) {
    return <div className="p-2 fst-italic text-muted">{String(parsed)}</div>;
  }
  
  // Handle primitives (string, number, boolean)
  if (typeof parsed !== 'object') {
    return <div className="p-2">{String(parsed)}</div>;
  }
  
  // Handle objects/arrays with JsonView
  return <JsonView value={parsed} collapsed={1} style={{ padding: '5px', borderRadius: '3px', fontSize: '12px' }} />;
}

export default function ChangeDisplay({ entry }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const time = new Date(entry.committed).toLocaleTimeString();

  return (
    <div className="mb-3 border rounded shadow-sm">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="d-flex justify-content-between align-items-center p-2 bg-light rounded cursor-pointer"
        style={{ cursor: 'pointer' }}
      >
        <span>
          {entry.changes.length} modification{entry.changes.length !== 1 ? 's' : ''} at {time}
        </span>
        {isExpanded ? <FaChevronDown /> : <FaChevronLeft />}
      </div>
      <Collapse in={isExpanded}>
        <div className="px-3 mt-2">
          {entry.changes.map((change, index) => {
            return (
              <div key={index}>
                {index > 0 && <hr className="my-2" />}
                <div className="mb-3">
                  <div className="p-2 d-flex align-items-center">
                    <strong>{change.fieldName}</strong>
                  </div>
                  <Collapse in={true}>
                    <div className="d-flex gap-3 mt-2 p-2">
                      <div className="flex-fill">
                        <strong> Old: </strong>
                        {renderValue(change.oldValue)}
                      </div>
                      <div className="flex-fill">
                        <strong> New: </strong>
                        {renderValue(change.newValue)}
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            );
          })}
        </div>
      </Collapse>
    </div>
  );
}

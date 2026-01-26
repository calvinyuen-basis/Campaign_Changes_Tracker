import { Collapse } from '@mui/material';
import { useState } from 'react';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import ChangeDisplay from './ChangeDisplay';

export default function DisplayContainer({ entry }) {
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
          {entry.changes.map((change, index) => (
            <ChangeDisplay key={index} change={change} index={index} />
          ))}
        </div>
      </Collapse>
    </div>
  );
}

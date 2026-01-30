import { Collapse } from '@mui/material';
import { useState } from 'react';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import ChangeDisplay from './ChangeDisplay';
import { parseTimeStamp } from '../utils/dateTimeUtils';
import JsonView from '@uiw/react-json-view';

export default function DisplayContainer({ entry }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const time = parseTimeStamp(entry.committed);
  const isCreation = entry.type === "INITIAL";

  return (
    <div className="mb-3 border rounded shadow-sm">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="d-flex justify-content-between align-items-center p-2 bg-light rounded cursor-pointer"
        style={{ cursor: 'pointer' }}
      >
        <span>
          {isCreation ? `Created at ${time}` : `${entry.changes.length} modification${entry.changes.length !== 1 ? 's' : ''} at ${time}`}
        </span>
        {isExpanded ? <FaChevronDown /> : <FaChevronLeft />}
      </div>
      <Collapse in={isExpanded}>
        {isCreation ? 
          <div className="px-3 mt-2">
            <JsonView value={entry.entity} collapsed={1} style={{ padding: '5px', borderRadius: '3px', fontSize: '12px' }}/>;
          </div>
          : 
          <div className="px-3 mt-2">
            {entry.changes.map((change, index) => (
              <>
                {index > 0 && <hr className="my-2" />}
                <ChangeDisplay key={index} change={change} index={index} />
              </>
            ))}
          </div>
        }
      </Collapse>
    </div>
  );
}

import { useState } from 'react';
import { Collapse } from '@mui/material';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import JsonView from '@uiw/react-json-view';

import ChangeItem from './changeItem';
import { parseTimeStamp } from '../utils/utils';

export default function DisplayContainer(props) {
  const { changes, committed, type, entity } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const time = parseTimeStamp(committed);
  const isCreation = type === "INITIAL";

  return (
    <div className="mb-3 border rounded shadow-sm">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="d-flex justify-content-between align-items-center p-2 bg-light rounded cursor-pointer"
        style={{ cursor: 'pointer' }}
      >
        <span>
          {isCreation ? `Created at ${time}` : `${changes.length} modification${changes.length !== 1 ? 's' : ''} at ${time}`}
        </span>
        {isExpanded ? <FaChevronDown /> : <FaChevronLeft />}
      </div>
      <Collapse in={isExpanded}>
        {isCreation ? 
          <div className="px-3 mt-2">
            <JsonView value={entity} collapsed={1} style={{ padding: '5px', borderRadius: '3px', fontSize: '12px' }}/>;
          </div>
          : 
          <div className="px-3 mt-2">
            {changes.map((change, index) => (
              <>
                {index > 0 && <hr className="my-2" />}
                <ChangeItem key={index} change={change} index={index} />
              </>
            ))}
          </div>
        }
      </Collapse>
    </div>
  );
}

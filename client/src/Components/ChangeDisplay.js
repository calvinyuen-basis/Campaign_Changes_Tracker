import JsonView from '@uiw/react-json-view';
import { Collapse } from '@mui/material';

function parse(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'object') {
    return value;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  return value;
}

function renderValue(value) {
  const parsed = parse(value);
  
  if (parsed === null || parsed === undefined) {
    return <div className="p-2 fst-italic text-muted">{String(parsed)}</div>;
  }
  
  if (typeof parsed !== 'object') {
    return <div className="p-2">{String(parsed)}</div>;
  }
  
  return <JsonView value={parsed} collapsed={1} style={{ padding: '5px', borderRadius: '3px', fontSize: '12px' }}/>;
}

export default function ChangeItem({ change, index }) {
  return (
    <div className="mb-3" style={{ overflow: 'auto'}}>
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
  );
}

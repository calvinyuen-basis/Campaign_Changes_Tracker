import ChangeDisplay from './ChangeDisplay';

export default function DisplayContainer({ changes }) {
  if (!changes || changes.length === 0) {
    return null;
  }

  return (
    <div className="changes-container">
      {changes.map((entry, index) => (
        <ChangeDisplay 
          key={entry.id || index}
          entry={entry}
        />
      ))}
    </div>
  );
}

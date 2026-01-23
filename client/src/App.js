"use client";

import { useEffect, useState } from "react";
import { getCampaignChanges } from "./api";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import Tooltip from './Components/Tooltip';
import DisplayContainer from './Components/DisplayContainer';
import './App.css';

function parseData(result) {
  return result
    .map(entry => ({
      ...entry,
      changes: entry.changes ? entry.changes.filter(change => change.fieldName !== 'lastModified') : []
    }))
    .filter(entry => entry.changes && entry.changes.length > 0);
}

function getChangesByDate(data) {
  const counts = {};
  data.forEach(entry => {
    const date = new Date(entry.committed).toISOString().split("T")[0];
    if (entry.type === 'INITIAL') {
      counts[date] = 0
    } else {
      counts[date] = (counts[date] || 0) + 1;
    }
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

function getGutterStyle(entry, creationDate) {
  const baseClass = !entry ? 'color-empty' :
                    entry.count < 2 ? 'color-scale-1' :
                    entry.count < 4 ? 'color-scale-2' :
                    entry.count < 6 ? 'color-scale-3' : 'color-scale-4';
  
  if (creationDate && entry && entry.date) {
    const creationDateStr = new Date(creationDate).toISOString().split('T')[0];
    if (entry.date === creationDateStr) {
      return `${baseClass} color-bordered`;
    }
  }
  return baseClass;
}

function getMessage(entry) {
  if (entry && entry.count > 0) {
    return `${entry.count} change${entry.count !== 1 ? 's' : ''} on ${entry.date}`;
  }
  return 'No changes';
}

export default function App() {
  const [data, setData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(new Date());

  const [creationDate, setCreationDate] = useState(null);

  const [error, setError] = useState(null);
  const [changesOnSelectedDate, setChangesOnSelectedDate] = useState([]);

  function getChangesOnSelectedDate(selectedDate) {
    const res = data.filter(entry => {
      const entryDate = new Date(entry.committed).toISOString().split("T")[0];
      return entryDate === selectedDate;
    });
    return data.filter(entry => {
      const entryDate = new Date(entry.committed).toISOString().split("T")[0];
      return entryDate === selectedDate;
    });
  }

  useEffect(() => {
    async function loadCampaign() {
      try {
        const result = await getCampaignChanges(2899741);
        result.reverse();
        const creationDate = new Date(result[0].committed);
        setCreationDate(creationDate);
        setStartDate(creationDate);
        const parseResult = parseData(result);
        setData(parseResult);
        setHeatmapData(getChangesByDate(parseResult));
      } catch (err) {
        setError(err.message);
      }
    }
    loadCampaign();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: '40px', margin: '0 auto' }}>
      <h1>Campaign Changes Tracker</h1>
      {creationDate && <p>First change: {startDate.toLocaleDateString()}</p>}
      
      <div style={{
        overflowY: 'hidden',
      }}>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapData}
          classForValue={(entry) => getGutterStyle(entry, creationDate)}
          onClick={(item) => {
            if (item && item.date && item.count) {
              setChangesOnSelectedDate(getChangesOnSelectedDate(item.date));
            }
          }}
          tooltipDataAttrs={(item) => ({
            'data-tooltip-id': 'data-tooltip',
            'data-tooltip-content': getMessage(item),
          })}
          showOutOfRangeDays
          showWeekdayLabels
        />
      </div>
      <Tooltip />

      {changesOnSelectedDate.length > 0 && (
        <DisplayContainer changes={changesOnSelectedDate}/>
      )}
    </div>
  );
}

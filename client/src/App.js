"use client";

import { useEffect, useState } from "react";
import { getCampaignChanges } from "./api";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import Tooltip from './Components/Tooltip';
import './App.css';

function getChangesByDate(data) {
  const counts = {};
  data.forEach(obj => {
    const date = new Date(obj.committed).toISOString().split("T")[0];
    counts[date] = (counts[date] || 0) + 1;
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

function getColorFromCount(count) {
  if (!count) return 'color-empty';
  if (count.count < 2) return 'color-scale-1';
  if (count.count < 4) return 'color-scale-2';
  if (count.count < 6) return 'color-scale-3';
  return 'color-scale-4';
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    async function loadCampaign() {
      try {
        const result = await getCampaignChanges(2899741);
        setData(result.reverse());
        setChanges(getChangesByDate(result));
      } catch (err) {
        setError(err.message);
      }
    }
    loadCampaign();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Loading...</p>;

  const startDate = new Date(data[0].entity.dateStart);
  const endDate = new Date();

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Campaign Changes Tracker</h1>
      
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px' 
      }}>
        <div style={{ maxWidth: '700px' }}>
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={changes}
            classForValue={getColorFromCount}
            tooltipDataAttrs={(value) => {
              return {
                'data-tooltip-id': 'heatmap-tooltip',
                'data-tooltip-content': value && value.date
                  ? `${value.date}: ${value.count} change${value.count !== 1 ? 's' : ''}`
                  : 'No changes',
              };
            }}
          />
          <Tooltip />
        </div>
      </div>

      <details>
        <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>View Changes Data</summary>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}

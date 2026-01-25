"use client";

import { useEffect, useState } from "react";
import { getCampaignChanges } from "./api";
import DisplayContainer from './Components/DisplayContainer';
import CampaignHeatmap from './Components/CampaignHeatmap/CampaignHeatmap';
import DateRangePicker from './Components/DateRangePicker';
import { TextField, Button, Box } from '@mui/material';
import './App.css';

function getChangesByDate(data) {
  if (data.length === 0) return [];
  
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

export default function App() {
  const [data, setData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(new Date());

  const [campaignCreationDate, setCampaignCreationDate] = useState(null);

  const [error, setError] = useState(null);
  const [changesOnSelectedDate, setChangesOnSelectedDate] = useState([]);
  const [campaignId, setCampaignId] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState(null);
  const [dateRangeEnd, setDateRangeEnd] = useState(null);

  function getChangesOnSelectedDate(selectedDate) {
    if (!selectedDate) {
      return [];
    }
    return data.filter(entry => {
      if (entry) {
        const entryDate = new Date(entry.committed).toISOString().split("T")[0];
        return entryDate === selectedDate;
      }
    });
  }

  async function handleLoadCampaign(e) {
    e.preventDefault();
    console.log('Campaign ID from state:', campaignId);

    if (!campaignId || isNaN(campaignId)) {
      setError('Please enter a valid campaign ID');
      return;
    }

    setLoading(true);
    setError(null);
    setChangesOnSelectedDate([]);

    try {
      const result = await getCampaignChanges(Number(campaignId));
      const campaignCreationDate = new Date(result[result.length - 1].committed);
      const dateWithLastChange = new Date(result[0].committed);
      const today = new Date();
      console.log(result)
      
      setData(result);
      setHeatmapData(getChangesByDate(result));
      console.log(getChangesByDate(result));

      // Preserve the date of campiagn's creation as an indication for CalendarHeatmap
      setCampaignCreationDate(campaignCreationDate);
      // Get the first and last date of all campaign's changes to limit date pickers
      setFirstDate(campaignCreationDate);
      setLastDate(dateWithLastChange < today ? dateWithLastChange : today);
      // the min and max date for date pickers
      setDateRangeStart(campaignCreationDate);
      setDateRangeEnd(dateWithLastChange < today ? dateWithLastChange : today);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="p-5 mx-auto">
        <h2>Campaign Changes Tracker</h2>

        <Box className="d-flex gap-2 my-3 align-items-center py-2">
          <Box component="form" onSubmit={handleLoadCampaign} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Campaign ID"
              variant="outlined"
              onChange={(e) => setCampaignId(e.target.value)}
              size="small"
              type="number"
              sx={{
                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
              }}
            />
            <Button variant="contained" type="submit" disabled={loading} sx={{ mr: 5 }}>
              {loading ? 'Loading...' : 'Load Campaign'}
            </Button>
          </Box>
          {data.length > 0 && (
            <DateRangePicker
              dateRangeStart={dateRangeStart}
              dateRangeEnd={dateRangeEnd}
              setDateRangeStart={setDateRangeStart}
              setDateRangeEnd={setDateRangeEnd}
              firstDate={firstDate}
              lastDate={lastDate}
            />
          )}
        </Box>
      
      <CampaignHeatmap
        heatmapData={heatmapData}
        dateRangeStart={dateRangeStart}
        dateRangeEnd={dateRangeEnd}
        campaignCreationDate={campaignCreationDate}
        onDateClick={(date) => setChangesOnSelectedDate(getChangesOnSelectedDate(date))}
      />

      {changesOnSelectedDate.length > 0 && (
        <DisplayContainer changes={changesOnSelectedDate}/>
      )}
      </div>
  );
}

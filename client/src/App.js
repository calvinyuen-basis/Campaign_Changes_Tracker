"use client";

import { useEffect, useState } from "react";
import { getCampaignChanges } from "./api";
import DisplayContainer from './Components/DisplayContainer';
import CampaignHeatmap from './Components/CampaignHeatmap/CampaignHeatmap';
import DateRangePicker from './Components/DateRangePicker';
import { TextField, Button, Box, Alert } from '@mui/material';
import { formatDateString } from './utils/dateUtils';
import './App.css';

export default function App() {
  const [data, setData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [changesOnSelectedDate, setChangesOnSelectedDate] = useState([]);
  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);
  const [campaignCreationDate, setCampaignCreationDate] = useState(null);
  const [dateRangeStart, setDateRangeStart] = useState(null);
  const [dateRangeEnd, setDateRangeEnd] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function getChangesByDate(data) {
    if (data.length === 0) return [];
    
    const counts = {};
    data.forEach(entry => {
      const date = formatDateString(entry.committed);
      if (entry.type === 'INITIAL') {
        counts[date] = 0
      } else {
        counts[date] = (counts[date] || 0) + 1;
      }
    });

    // Get first and last dates
    const firstDate = new Date(data[data.length - 1].committed);
    const lastDate = new Date(data[0].committed);
    const today = new Date();
    const endDate = lastDate < today ? lastDate : today;

    // Fill in all dates between firstDate and endDate
    const result = [];
    const currentDate = new Date(firstDate);
    
    while (currentDate <= endDate) {
      const dateStr = formatDateString(currentDate);
      result.push({ date: dateStr, count: counts[dateStr] || 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Ensure last date is included
    const lastDateStr = formatDateString(endDate);
    if (result.length === 0 || result[result.length - 1].date !== lastDateStr) {
      result.push({ date: lastDateStr, count: counts[lastDateStr] || 0 });
    }
    
    console.log(result)
    return result;
  }

  function getChangesOnSelectedDate(selectedDate) {
    if (!selectedDate) {
      return [];
    }
    return data.filter(entry => {
      if (entry) {
        const entryDate = formatDateString(entry.committed);
        return entryDate === selectedDate;
      }
    });
  }

  async function handleLoadCampaign(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const campaignID = formData.get('campaignId');

    // validate the input value
    if (!campaignID || isNaN(campaignID)) {
      setError('Please enter a valid campaign ID');
      return;
    }
    setLoading(true);
    setError(null);
    setChangesOnSelectedDate([]);

    try {
      const result = await getCampaignChanges(Number(campaignID));
      // An existing campaign must have at least one entry in result
      if (result.length === 0) {
        return setError('This campaign does not exist. Please enter a valid campaign ID.');
      }
      setData(result);
      setHeatmapData(getChangesByDate(result));

      const campaignCreationDate = new Date(result[result.length - 1].committed);
      const dateWithLastChange = new Date(result[0].committed);
      const today = new Date();
      // Preserve the date of campiagn's creation as an indication for CalendarHeatmap
      setCampaignCreationDate(formatDateString(campaignCreationDate));
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
              name="campaignId"
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
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}
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

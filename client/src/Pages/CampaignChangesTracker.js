import { useState } from "react";
import { getCampaignChanges } from "../api";
import DisplayContainer from '../Components/DisplayContainer';
import CampaignHeatmap from '../Components/CampaignHeatmap/CampaignHeatmap';
import DateRangePicker from '../Components/DateRangePicker';
import { TextField, Button, Box, Alert } from '@mui/material';
import { formatDateString } from '../utils/dateUtils';

export default function CampaignChangesTracker() {
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

  function getChangesByDate(data, firstDate, endDate) {
    if (!data.length) return [];
    
    const counts = {};
    data.forEach(entry => {
      if (entry.type === 'UPDATE') {
        const date = formatDateString(entry.committed);
        counts[date] = (counts[date] || 0) + 1;
      }
    });

    const result = [];
    const currentDate = new Date(firstDate);
    const endDateStr = formatDateString(endDate);
    
    let dateStr = formatDateString(currentDate);
    while (dateStr !== endDateStr) {
      result.push({ date: dateStr, count: counts[dateStr] || 0 });
      currentDate.setDate(currentDate.getDate() + 1);
      dateStr = formatDateString(currentDate);
    }
    result.push({ date: endDateStr, count: counts[endDateStr] || 0 });
    
    return result;
  }

  function getChangesOnSelectedDate(selectedDate) {
    if (!selectedDate) return [];
    return data.filter(entry => formatDateString(entry.committed) === selectedDate);
  }

  async function handleLoadCampaign(e) {
    e.preventDefault();
    const campaignID = new FormData(e.target).get('campaignId');
    if (!campaignID || isNaN(campaignID)) {
      setError('Please enter a valid campaign ID');
      return;
    }

    setLoading(true);
    setError(null);
    setChangesOnSelectedDate([]);
    try {
      const result = await getCampaignChanges(Number(campaignID));
      if (!result.length) {
        setError('This campaign does not exist. Please enter a valid campaign ID.');
        return;
      }

      const creationDate = new Date(result[result.length - 1].committed);
      const lastChangeDate = new Date(result[0].committed);
      const endDate = lastChangeDate < new Date() ? lastChangeDate : new Date();

      setData(result);
      setHeatmapData(getChangesByDate(result, creationDate, endDate));
      setCampaignCreationDate(formatDateString(creationDate));
      setFirstDate(creationDate);
      setLastDate(endDate);
      setDateRangeStart(creationDate);
      setDateRangeEnd(endDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5">
      <h2 className="mb-4">Campaign Changes Tracker</h2>

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
        changesOnSelectedDate.map((entry, index) => (
          <DisplayContainer key={entry.id || index} entry={entry}/>
        ))
      )}
    </div>
  );
}

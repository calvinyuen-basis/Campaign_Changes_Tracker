import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function DateRangePicker({ 
  dateRangeStart, 
  dateRangeEnd, 
  setDateRangeStart, 
  setDateRangeEnd,
  firstDate,
  lastDate
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="d-flex gap-3">
        <DatePicker
          label="Start Date"
          value={dateRangeStart}
          onChange={(newValue) => setDateRangeStart(newValue)}
          minDate={firstDate}
          maxDate={dateRangeEnd || lastDate}
          slotProps={{ 
            textField: { 
              size: 'small',
              sx: { width: '170px' }
            } 
          }}
        />
        <DatePicker
          label="End Date"
          value={dateRangeEnd}
          onChange={(newValue) => setDateRangeEnd(newValue)}
          minDate={dateRangeStart || firstDate}
          maxDate={lastDate}
          slotProps={{ 
            textField: { 
              size: 'small',
              sx: { width: '170px' }
            } 
          }}
        />
      </div>
    </LocalizationProvider>
  );
}

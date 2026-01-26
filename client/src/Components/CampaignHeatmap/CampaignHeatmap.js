import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './CampaignHeatmap.css';
import { Tooltip } from 'react-tooltip';
import { formatDateString, isInDateRange } from '../../utils/dateUtils';

export default function CampaignHeatmap({ 
  heatmapData, 
  dateRangeStart, 
  dateRangeEnd, 
  campaignCreationDate, 
  onDateClick
}) {

  function getMessage(entry) {
    if (!isInDateRange(entry.date, dateRangeStart, dateRangeEnd)) return 'No Data (Out of selected date range)';
    let message = entry.count > 0 ? `${entry.count} change${entry.count !== 1 ? 's' : ''}` : 'No changes';
    message += ` on ${entry.date}`;
    if (entry.date === campaignCreationDate) {
      message += ' (date of creation)';
    }
    return message;
  }

  function getTotalChangesInRange() {
    return heatmapData
      .filter(item => isInDateRange(item.date, dateRangeStart, dateRangeEnd))
      .reduce((total, item) => total + item.count, 0);
  }

  function getGutterStyle(entry) {
    if (!entry || !isInDateRange(entry.date, dateRangeStart, dateRangeEnd)) return 'hidden';
    let colorClass;
    if (entry.count === 0) colorClass = 'color-empty';
    else if (entry.count < 2) colorClass = 'color-scale-1';
    else if (entry.count < 4) colorClass = 'color-scale-2';
    else if (entry.count < 6) colorClass = 'color-scale-3';
    else colorClass = 'color-scale-4';
    const isCreationDate = entry.date === campaignCreationDate;
    return isCreationDate ? `${colorClass} color-bordered` : colorClass;
  }

  if (!heatmapData || heatmapData.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-3 shadow-sm p-4 mb-3">
      <div>
        {getTotalChangesInRange()} changes between {formatDateString(dateRangeStart)} and {formatDateString(dateRangeEnd)}
      </div>
      <hr className="w-100" />
      <div className="campaign-heatmap-container">
        {/* <span className="weekday-labels-sticky">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </span> */}
        <CalendarHeatmap
          startDate={dateRangeStart}
          endDate={dateRangeEnd}
          values={heatmapData.filter(item => isInDateRange(item.date, dateRangeStart, dateRangeEnd))}
          classForValue={(entry) => getGutterStyle(entry)}
          onClick={(item) => onDateClick(item?.date)}
          tooltipDataAttrs={(item) => ({
            'data-tooltip-id': 'data-tooltip',
            'data-tooltip-content': getMessage(item),
          })}
          showOutOfRangeDays
          showMonthLabels
        />
      </div>

      <Tooltip 
        id="data-tooltip"
        place="top"
        style={{ 
          backgroundColor: '#333', 
          color: '#fff', 
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />
    </div>
  );
}

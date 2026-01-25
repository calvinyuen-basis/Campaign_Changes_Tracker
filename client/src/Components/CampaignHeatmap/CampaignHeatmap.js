import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './CampaignHeatmap.css';
import Tooltip from './Tooltip';

function getMessage(entry) {
  if (entry && entry.count > 0) {
    return `${entry.count} change${entry.count !== 1 ? 's' : ''} on ${entry.date}`;
  }
  return 'No changes';
}

export default function CampaignHeatmap({ 
  heatmapData, 
  dateRangeStart, 
  dateRangeEnd, 
  creationDate, 
  onDateClick
}) {
  function isInDateRange(itemDate) {
    if (!dateRangeStart && !dateRangeEnd) return true;
    const startDateStr = dateRangeStart ? new Date(dateRangeStart).toISOString().split('T')[0] : null;
    const endDateStr = dateRangeEnd ? new Date(dateRangeEnd).toISOString().split('T')[0] : null;
    const afterStart = !startDateStr || itemDate >= startDateStr;
    const beforeEnd = !endDateStr || itemDate <= endDateStr;
    return afterStart && beforeEnd;
  }

  function getTotalChangesInRange() {
    return heatmapData
      .filter(item => isInDateRange(item.date))
      .reduce((total, item) => total + item.count, 0);
  }

  function getGutterStyle(entry) {
    const styleClass = !entry ? 'color-empty' :
                      entry.count < 2 ? 'color-scale-1' :
                      entry.count < 4 ? 'color-scale-2' :
                      entry.count < 6 ? 'color-scale-3' : 'color-scale-4';
    
    if (creationDate && entry && entry.date) {
      const creationDateStr = new Date(creationDate).toISOString().split('T')[0];
      if (entry.date === creationDateStr) {
        return `${styleClass} color-bordered`;
      }
    }
    return styleClass;
  }

  return (
    <div className="border rounded-3 shadow-sm p-4">
      <div>
        {getTotalChangesInRange()} changes between {dateRangeStart ? new Date(dateRangeStart).toISOString().split('T')[0] : ''} and {dateRangeEnd ? new Date(dateRangeEnd).toISOString().split('T')[0] : ''}
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
          values={heatmapData.filter(item => isInDateRange(item.date))}
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
      <Tooltip />
      </div>
  );
}

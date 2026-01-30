export function formatDateString(date) {
  return new Date(date).toISOString().split('T')[0];
}

export function isInDateRange(currDate, startDate, endDate) {
  const start = formatDateString(startDate);
  const end = formatDateString(endDate);
  return (!start || currDate >= start) && (!end || currDate <= end);
}

export function parseTimeStamp(dateTime) {
  return new Date(dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}
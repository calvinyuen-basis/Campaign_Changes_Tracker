export function formatDateString(date) {
  return new Date(date).toISOString().split('T')[0];
}

export function isInDateRange(currDate, startDate, endDate) {
  const start = formatDateString(startDate);
  const end = formatDateString(endDate);
  return (!start || currDate >= start) && (!end || currDate <= end);
}

// Date Time utility functions
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

export function concatStringList(lst) {
  if (!lst || lst.length === 0) return null;
  return lst.map(str => `'${str}'`).join(', ');
}

// Recursive helper function to parse audience and contextual targeting into SQL clauses
export function parseTargeting(target, type, level=0) {
  const indent = "  ".repeat(level);
  if (target.type === "atomic") {
    let clause = "";
    if (target.blocked) {
      clause += "NOT ";
    }
    if (type === "audience") {
      clause += target.audienceType === "THIRD_PARTY"
        ? "a.thirdpartyaudiencedataset_audienceid"
        : "a.internaluseraudiences_audienceid";
      return `${indent}${clause} && array [${target.audienceId}]`;
    } 
    else if (type === "contextual") {
      clause += "contextualdataset_internalentryid";
      return `${indent}${clause} && array [${target.contextualEntryId}]`;
    }
  } else if (target.type === "composite") {
    const operator = ` ${target.logicalOperator} \n`;
    const nested = target.targets.map(t => parseTargeting(t, type, level + 1));
    return `${indent}(\n${nested.join(operator)}\n${indent})`;
  }
}


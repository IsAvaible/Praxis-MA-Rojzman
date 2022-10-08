/**
 * Format the time of a date object to a string in the format HH:MM
 * @param time The date object to convert
  */
export const formatHHMM = (time: Date) => {
    return time.toLocaleTimeString('de-DE', {hour: "2-digit", minute: "2-digit"})
}


/**
 * Format a date object to a string in the format DD. MM, YYYY
 * @param date The date object to convert
 */
export const formatDDMMYYYY = (date: Date) => {
    let day, month, year;
    [day, month, year] = date.toLocaleTimeString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' }).replace(/[.,]/g, '').split(' ');
    return `${day}. ${month}, ${year}`;
}
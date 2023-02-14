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


/**
 * Convert a number to the corresponding weekday in German
 * @param n
 */
export const numberToWeekdayDE = (n: number) => {
    if (n < 0 || n > 6) throw new Error('Invalid weekday number');
    return ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"][n];
}

/**
 * Returns the current data as a string with timezone offset
 */
export const nowToTimestampz = (): string => {
    let now = new Date();
    return (now).toISOString().replace(/Z$/, (now.getTimezoneOffset() < 0 ? '-' : '+') + String(Math.floor(Math.abs(now.getTimezoneOffset() / 60))).padStart(2, '0') + ':' + String(Math.abs(now.getTimezoneOffset() % 60)).padStart(2, '0'));
}
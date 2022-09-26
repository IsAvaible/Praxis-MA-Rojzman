/**
 * Format the time of a date object to a string in the format HH:MM
 * @param time The date object to convert
  */
export const formatHHMM = (time: Date) => {
    return time.toLocaleTimeString('de-DE', {hour: "2-digit", minute: "2-digit"})
}
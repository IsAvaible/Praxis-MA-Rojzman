/**
 * Escape a string for use in a regular expression.
 * @param str The string to escape
 */
export const escapeString = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')
}
/**
 * Returns a promise that resolves after the specified delay.
 * @param ms The delay in milliseconds
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
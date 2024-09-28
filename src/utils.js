/** @type {(ms:number) => Promise<void>} */
export const delay = (ms) => new Promise((release) => setTimeout(release, ms));

/** @type {(a:number, b:number) => number} */
export const descend = (a, b) => a > b ? -1 : 1;
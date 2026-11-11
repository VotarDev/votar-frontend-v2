/**
 * Adds a cache-busting `t` parameter so a replaced image shows straight away.
 * URLs that already have a query string are returned unchanged: on signed
 * storage URLs an extra parameter corrupts the signature and the image is
 * refused.
 */
export const withCacheBust = (url?: string | null): string | null => {
  if (!url) return null;
  return url.includes("?") ? url : `${url}?t=${Date.now()}`;
};

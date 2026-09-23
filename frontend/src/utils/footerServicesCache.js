/**
 * Client-side cache for Footer services list (getServiceFilterData with limit 200, page 0).
 * Avoids refetch on every page that includes Footer; reduces requests and improves performance.
 */

const TTL_MS = 5 * 60 * 1000; // 5 minutes

let memory = { data: null, ts: 0 };

export function getCachedFooterServices() {
  if (memory.data !== null && Date.now() - memory.ts < TTL_MS) {
    return memory.data;
  }
  return null;
}

export function getCachedFooterServicesStale() {
  return memory.data;
}

export function setCachedFooterServices(data) {
  if (data !== undefined && data !== null) {
    memory = { data, ts: Date.now() };
  }
}

export function isFooterServicesCacheStale() {
  return memory.data === null || Date.now() - memory.ts >= TTL_MS;
}

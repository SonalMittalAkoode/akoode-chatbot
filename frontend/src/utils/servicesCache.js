/**
 * In-memory cache for nav services API to avoid refetch on every NavBar mount
 * and to show data immediately when navigating. Reduces lag and improves performance.
 */

const TTL_MS = 5 * 60 * 1000; // 5 minutes

let memory = { data: null, ts: 0 };

/** Returns cached services if within TTL; otherwise null (caller may still use stale data via getCachedServicesStale). */
export function getCachedServices() {
  if (memory.data !== null && Date.now() - memory.ts < TTL_MS) {
    return memory.data;
  }
  return null;
}

/** Returns last-known data even if stale, for instant display while revalidating. */
export function getCachedServicesStale() {
  return memory.data;
}

export function setCachedServices(data) {
  if (Array.isArray(data)) {
    memory = { data, ts: Date.now() };
  }
}

export function isCacheStale() {
  return memory.data === null || Date.now() - memory.ts >= TTL_MS;
}

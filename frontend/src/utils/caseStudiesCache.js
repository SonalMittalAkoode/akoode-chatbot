const TTL_MS = 5 * 60 * 1000;

let memory = { data: null, ts: 0 };

export function getCachedCaseStudies() {
  if (memory.data !== null && Date.now() - memory.ts < TTL_MS) return memory.data;
  return null;
}

export function getCachedCaseStudiesStale() {
  return memory.data;
}

export function setCachedCaseStudies(data) {
  if (Array.isArray(data)) memory = { data, ts: Date.now() };
}

export function isCaseStudiesCacheStale() {
  return memory.data === null || Date.now() - memory.ts >= TTL_MS;
}

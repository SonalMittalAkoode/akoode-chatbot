const sources = new Set(['facebook', 'instagram', 'google', 'friend_recommendation', 'other', 'skipped']);
function cleanUserMetadata(value) {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.privacyConsent !== true) throw new Error('Please accept the Privacy Policy.');
  const result = { privacyConsent: true };
  for (const [key, max] of [['name', 120], ['email', 254], ['acquisitionSourceOther', 200]]) {
    if (value[key] === undefined) continue;
    if (typeof value[key] !== 'string' || value[key].trim().length > max) throw new Error('Please check your onboarding details.');
    if (value[key].trim()) result[key] = value[key].trim();
  }
  if (result.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw new Error('Please enter a valid email address.');
  if (value.acquisitionSource !== undefined && !sources.has(value.acquisitionSource)) throw new Error('Please choose a valid source.');
  result.acquisitionSource = value.acquisitionSource || 'skipped';
  if (result.acquisitionSource !== 'other') delete result.acquisitionSourceOther;
  return result;
}
module.exports = { cleanUserMetadata };

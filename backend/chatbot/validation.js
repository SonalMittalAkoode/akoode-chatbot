// code done by sonal: keep lead validation independent from model-generated output.
// code done by sonal: distinguish unknown fields from information the visitor chose not to supply.
const fields = ['fullName', 'email', 'company', 'phone', 'requirement', 'service', 'budget', 'timeline', 'companyStatus', 'phoneStatus'];
const required = fields.slice(0, 6);
function cleanDraft(input = {}) {
  const draft = Object.fromEntries(fields.map(key => [key, typeof input[key] === 'string' ? input[key].trim().slice(0, key === 'requirement' ? 3000 : 250) : '']));
  draft.companyStatus = ['individual', 'declined', 'provided'].includes(draft.companyStatus) ? draft.companyStatus : '';
  draft.phoneStatus = ['declined', 'provided'].includes(draft.phoneStatus) ? draft.phoneStatus : '';
  return draft;
}
function missingFields(draft) {
  // code done by sonal: the same opt-out rules apply to questions, review readiness and submission.
  const missing = required.filter(key => !draft[key] && !(key === 'company' && ['individual', 'declined'].includes(draft.companyStatus)) && !(key === 'phone' && draft.phoneStatus === 'declined'));
  if (draft.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(draft.email)) missing.push('email');
  if (draft.phone && (!/^\+?[\d\s().-]{7,30}$/.test(draft.phone) || !/^\d{7,15}$/.test(draft.phone.replace(/\D/g, '')))) missing.push('phone');
  if (draft.requirement && draft.requirement.length < 15) missing.push('requirement');
  return [...new Set(missing)];
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
function safeSource(value) {
  try {
    const url = new URL(value);
    const allowed = new URL(process.env.CHATBOT_SITE_URL || 'https://www.akoode.com');
    if (!['akoode.com', 'www.akoode.com', allowed.hostname, 'localhost'].includes(url.hostname)) return '';
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch { return ''; }
}
module.exports = { fields, cleanDraft, missingFields, escapeHtml, safeSource };

// code done by sonal: honor explicit contact preferences even if AI extraction misses the refusal.
function applyContactPreferences(draft, previous, incoming, text, lastField) {
  const value = text.toLowerCase().replace(/[’‘]/g, "'").replace(/\bdont\b/g, "don't");
  const refusal = /\b(?:don't|do not|won't|will not|prefer not|rather not|not comfortable|decline|skip|refuse)\b/;
  const clauses = value.split(/[.!?;,]|\b(?:but|and)\b/);
  const shortRefusal = /^(?:no(?: thanks)?|skip(?: it| this)?|prefer not(?: to)?|rather not|i'd rather not)[.!\s]*$/.test(value.trim());
  const individual = /\b(?:i(?:'m| am) (?:an? )?individual|(?:don't|do not|not) have (?:a |any |my own )?(?:company|business)|no company|not (?:a |an )?(?:company|business)|personal project|independent individual)\b/.test(value);
  const phoneDeclined = clauses.some(clause => refusal.test(clause) && /\b(?:phone|mobile|telephone|contact number)\b/.test(clause)) || (lastField === 'phone' && shortRefusal);
  const companyDeclined = !individual && (clauses.some(clause => refusal.test(clause) && /\bcompany\b/.test(clause)) || (lastField === 'company' && shortRefusal));
  // Fresh, explicitly supplied replacements can reverse a previous opt-out. Old repeated values cannot.
  for (const field of ['company', 'phone']) {
    const status = `${field}Status`;
    const supplied = field === 'phone' ? String(incoming[field] || '').replace(/\D/g, '') : String(incoming[field] || '').toLowerCase();
    const explicitlyPresent = field === 'phone' ? supplied.length >= 7 && value.replace(/\D/g, '').includes(supplied) : value.includes(supplied);
    const fresh = incoming[field] && incoming[field] !== previous[field] && explicitlyPresent;
    if (fresh) draft[status] = 'provided';
    else if (['individual', 'declined'].includes(previous[status])) draft[status] = previous[status];
  }
  if (individual) draft.companyStatus = 'individual';
  else if (companyDeclined) draft.companyStatus = 'declined';
  if (phoneDeclined) draft.phoneStatus = 'declined';
  if (['individual', 'declined'].includes(draft.companyStatus)) draft.company = '';
  if (draft.phoneStatus === 'declined') draft.phone = '';
  return { companySkipped: individual || companyDeclined, phoneSkipped: phoneDeclined };
}
module.exports = { applyContactPreferences };

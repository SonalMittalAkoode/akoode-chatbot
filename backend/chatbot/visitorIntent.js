// code done by sonal: distinguish portfolio requests and career enquiries from ordinary sales chat.
function requestsWork(text) {
  const value = text.toLowerCase();
  if (/\b(?:don't|do not|no need to)\s+(?:show|send|share)\b/.test(value)) return false;
  return /\b(?:case stud(?:y|ies)|portfolio|(?:your|akoode(?:'s)?)\s+(?:past |previous |recent |completed )?(?:work|projects)|(?:examples|projects)\s+(?:you(?:'ve| have)?|built by|delivered by)|(?:see|show|share|view)\s+(?:me |us |some |your )*(?:work|examples))\b/i.test(value);
}
function careerIntent(text, parsed = {}) {
  const value = text.toLowerCase();
  const building = /\b(?:build|develop|create|design|need|want)\b.{0,50}\b(?:job|career|recruitment)\s+(?:portal|website|platform|app|software|system)\b/.test(value);
  if (building) return false;
  return parsed.visitorIntent === 'CAREER' || /\b(?:looking for|seeking|need|want|apply for|applying for|interested in)\s+(?:a |an |any |the )?(?:job|internship|vacancy|position|employment)|\b(?:job seeker|resume|cv|are you hiring|job openings|career opportunities|internships?|vacancies)\b/.test(value);
}
module.exports = { requestsWork, careerIntent };

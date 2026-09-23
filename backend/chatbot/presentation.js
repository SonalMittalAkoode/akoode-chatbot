// code done by sonal: contextual shortcuts and verified page labels, independent of lead submission.
function sourceCards(urls, context) {
  // code done by sonal: canonical/legacy URLs can describe the same project; display it once.
  const seenTitles = new Set();
  return urls.map(url => {
    const page = context.find(item => item.url === url);
    const path = new URL(url).pathname;
    const category = /\/blog\//.test(path) ? 'Insight' : /\/case-stud/.test(path) ? 'Case study' : /\/industr/.test(path) ? 'Industry' : /\/services/.test(path) ? 'Service' : 'Explore Akoode';
    return { url, title: (page?.title || path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Akoode Technologies').replace(/\s*\|\s*Akoode.*$/i, '').slice(0, 180), category };
  }).filter(card => {
    const key = card.title.trim().toLowerCase();
    if (seenTitles.has(key)) return false;
    seenTitles.add(key); return true;
  });
}
function quickReplies(result, proposed = []) {
  const state = result.conversation;
  // code done by sonal: career navigation replaces sales suggestions for job seekers.
  if (result.career) return [];
  // Shortcuts send a chat message only. Contact details and final consent are never auto-filled.
  // code done by sonal: visitors can explicitly opt out without typing or inventing contact data.
  if (state.state === 'HANDOFF') {
    if (state.lastField === 'company') return [{ label: "I'm an individual", message: "I don't have a company; I'm an individual." }];
    if (state.lastField === 'phone') return [{ label: 'Skip phone number', message: "I don't want to share my phone number." }];
    return [];
  }
  // code done by sonal: plain-language choices answer the current discovery question.
  const discoveryReplies = {
    platform: [['Website', 'I want a website.'], ['Mobile app', 'I want a mobile app.'], ['Both', 'I want both a website and a mobile app.'], ['Not sure yet', 'I am not sure yet.']],
    integrations: [['WhatsApp', 'Connect it to WhatsApp.'], ['Calendar', 'Connect it to my calendar.'], ['Nothing else', 'No other connections for now.'], ['Not sure yet', 'I am not sure yet.']],
    ai: [['Include AI help', 'Yes, include AI help for customer questions.'], ['Keep it simple', 'No AI for now; keep it simple.'], ['Explain the options', 'What would AI help with in my project?'], ['Decide later', 'I will decide later.']],
  };
  if (state.discoveryTopic) return discoveryReplies[state.discoveryTopic].map(([label, message]) => ({ label, message }));
  const topic = String(state.facts.project || result.draft.service || 'this project').slice(0, 90);
  const candidates = Array.isArray(proposed) ? proposed.filter(item => item && typeof item.label === 'string' && typeof item.message === 'string'
    && item.label.trim().length >= 2 && item.label.length <= 42 && item.message.length >= 5 && item.message.length <= 250
    && !/[\r\n<>@]/.test(item.label + item.message)
    && !/\b(?:consent|submit|booked|scheduled|my name|my email|my phone)\b/i.test(item.message)) : [];
  const replies = [];
  if (state.ctaOffered && !state.handoffDeclined) replies.push({ label: 'Talk to the team', message: 'Please connect me with the Akoode team.' });
  replies.push(...candidates.slice(0, state.ctaOffered && !state.handoffDeclined ? 2 : 3));
  if (!candidates.length) replies.push({ label: 'Tell me more', message: `What else should I know about ${topic}?` }, { label: 'Relevant examples', message: `Are there relevant examples or case studies for ${topic}?` });
  if (state.ctaOffered && !state.handoffDeclined) replies.push({ label: 'Just exploring', message: 'Not now. I would like to explore more information first.' });
  const seen = new Set();
  return replies.filter(item => {
    const key = item.label.trim().toLowerCase();
    if (seen.has(key)) return false; seen.add(key); return true;
  }).slice(0, 4).map(item => ({ label: item.label.trim(), message: item.message.trim() }));
}
module.exports = { sourceCards, quickReplies };

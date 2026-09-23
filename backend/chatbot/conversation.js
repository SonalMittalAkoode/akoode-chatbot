// code done by sonal: deterministic conversation policy, separate from retrieval and lead submission.
const { cleanDraft, missingFields } = require('./validation');
// code done by sonal: respect individual enquiries and optional contact preferences.
const { applyContactPreferences } = require('./contactPreferences');
// code done by sonal: career visitors get an application route instead of sales qualification.
const { careerIntent } = require('./visitorIntent');
const STATES = { DISCOVERY: 'DISCOVERY', QUALIFICATION: 'QUALIFICATION', HANDOFF: 'HANDOFF' };
const factKeys = ['project', 'industry', 'feature', 'projectContext'];
const CTA = 'Would you like me to connect you with our team?';
// code done by sonal: offer direct external scheduling while retaining the optional email follow-up.
const HANDOFF = "Use 'Reserve your slot' below to book directly with our founder on Calendly. Or, after you review and send your enquiry, I'll share your project details with our team so we can reach out to arrange a discussion.";
const questions = {
  project: 'What are you looking to build or improve?',
  industry: 'What kind of business is this for?',
  feature: 'What is the main feature or problem you want it to address?',
};
const contactQuestions = {
  fullName: "What's your full name?", email: "What's the best email to reach you?",
  company: 'And your company name?', phone: 'What phone number should the team use?',
  requirement: 'What would you like the team to help you build or improve?',
  service: 'Which service would you like to discuss with the team?',
};
function normalized(text) { return text.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim(); }
function declinesHandoff(text) {
  return /\b(?:don't|do not|not ready to|no need to)\s+(?:contact|call|connect|schedule|book|arrange|share|send|talk)|^(?:no(?: thanks| thank you)?|not now|maybe later|not yet)[.!\s]*$/.test(normalized(text));
}
function requestsHandoff(text) {
  const value = normalized(text);
  if (declinesHandoff(value)) return false;
  return /\b(?:contact (?:the |your |akoode |a )*team|talk (?:to|with) (?:someone|a person|a human|(?:the |your |akoode )*team)|(?:please )?call me|(?:set up|set|schedule|arrange|book) (?:a |the )?(?:meeting|call|discussion)|connect me|send (?:me |us )?(?:a )?(?:quote|quotation)|(?:i |we )want to discuss|don't ask (?:me )?(?:any |so many |this many |more |any more )*questions|do not ask (?:me )?(?:any |more |any more )*questions|stop asking)\b/.test(value);
}
function mergeKnown(previous = {}, incoming = {}, keys) {
  return Object.fromEntries(keys.map(key => {
    const value = typeof incoming[key] === 'string' ? incoming[key].trim() : '';
    return [key, (value && !/^(unknown|not provided|n\/a)$/i.test(value) ? value : previous[key] || '').slice(0, 3000)];
  }));
}
function compactAnswer(reply, text) {
  // The model supplies only the substantive answer. Policy owns all questions and handoff wording.
  const sentences = String(reply || '').trim().split(/(?<=[.!?])\s+/);
  let safe = sentences.filter(s => !s.includes('?') && !/\b(?:booked|scheduled|confirmed)\b.*\b(?:meeting|call|appointment)\b|\b(?:meeting|call|appointment)\b.*\b(?:booked|scheduled|confirmed)\b|\b(?:i(?:'ve| have)|we(?:'ve| have))\s+(?:sent|shared|emailed)\b/i.test(s)).join(' ');
  safe = safe.replace(/Akoode Technologies specializes in/gi, 'We work on').replace(/Akoode Technologies offers/gi, 'We offer').replace(/Akoode Technologies develops/gi, 'We develop');
  const detailed = /\b(detail|details|explain|compare|comparison|walk me through|in depth)\b/i.test(text);
  if (!detailed) {
    safe = safe.split(/(?<=[.!])\s+/).slice(0, 2).join(' ');
    if (safe.split(/\s+/).length > 55) safe = safe.split(/\s+/).slice(0, 55).join(' ').replace(/[,;:]$/, '') + '…';
  }
  return safe.slice(0, 5000);
}
function projectSummary(draft, facts) {
  const text = draft.requirement || [facts.project, facts.industry, facts.feature].filter(Boolean).join('; ');
  if (!text) return '';
  const words = text.replace(/[\r\n?]+/g, ' ').split(/\s+/);
  const brief = words.slice(0, 45).join(' ');
  return `Here's what I understand: ${brief}${words.length > 45 ? '…' : /[.!]$/.test(brief) ? '' : '.'}`;
}
function previousConversation(session) {
  if (session.conversation?.state) return session.conversation;
  // code done by sonal: resume chats opened before state tracking was introduced.
  let state = STATES.DISCOVERY; let ctaOffered = false; let questionCount = 0; let lastField = ''; let handoffDeclined = false;
  for (const message of session.messages || []) {
    if (message.role === 'user') {
      if (requestsHandoff(message.content) || (ctaOffered && /^(yes|sure|ok|okay|please do|go ahead)[.!\s]*$/i.test(message.content.trim()))) { state = STATES.HANDOFF; handoffDeclined = false; }
      else if (declinesHandoff(message.content)) { state = STATES.QUALIFICATION; handoffDeclined = true; }
      continue;
    }
    const content = message.content;
    if (/would you like.*(?:team|connect|discuss|contact)|shall I.*(?:connect|team)/i.test(content)) { ctaOffered = true; continue; }
    const contact = Object.keys(contactQuestions).find(key => content.includes(contactQuestions[key]));
    if (contact) { lastField = contact; continue; }
    if (state !== STATES.HANDOFF && content.includes('?') && !/\b(?:name|email|phone|company name|budget|timeline)\b/i.test(content)) questionCount++;
  }
  return { state, ctaOffered, questionCount: Math.min(3, questionCount), lastField, handoffDeclined };
}
function planTurn(session, text, parsed, hasContext = true) {
  const prior = previousConversation(session);
  // code done by sonal: use visitor words, never inferred model facts, to establish platform choice.
  const choices = { ...(prior.choices || {}) };
  const visitorText = [...(session.messages || []).filter(m => m.role === 'user').map(m => m.content), text].join(' ');
  const platformText = /\b(website|web site|web app|mobile app|app|both)\b/i.test(text) ? text : visitorText;
  const wantsWeb = /\b(website|web site|web app)\b/i.test(platformText) && !/\b(no|not|without) (?:a |an )?(website|web site|web app)\b/i.test(platformText);
  const wantsApp = /\b(mobile app|app)\b/i.test(platformText.replace(/web app/gi, '')) && !/\b(no|not|without) (?:a |an )?(mobile app|app)\b/i.test(platformText);
  if ((wantsWeb || wantsApp) && !/\?/.test(platformText)) choices.platform = wantsWeb && wantsApp ? 'both' : wantsWeb ? 'website' : 'app';
  if (prior.discoveryTopic === 'platform' && /\bboth\b/i.test(text)) choices.platform = 'both';
  if (prior.discoveryTopic && /\b(not sure|skip|decide later|recommend)\b/i.test(text)) choices[prior.discoveryTopic] = 'undecided';
  if (prior.discoveryTopic === 'integrations' && !text.includes('?')) choices.integrations = text.slice(0, 500);
  if (prior.discoveryTopic === 'ai' && /^(yes|no|yes please|no thanks|keep it simple)[.!\s]*$/i.test(text.trim())) choices.ai = /^yes/i.test(text.trim()) ? 'yes' : 'no';
  if (/\b(no ai|without ai|don['?]?t want ai|do not want ai)\b/i.test(text)) choices.ai = 'no';
  if (/\b(want|include|add|integrate|use) (?:an? )?ai\b/i.test(text)) choices.ai = 'yes';
  const answeringChoice = Boolean(prior.discoveryTopic) && !requestsHandoff(text);

  const facts = mergeKnown(prior.facts, parsed.facts, factKeys);
  const draft = cleanDraft(mergeKnown(session.draft, parsed.draft, Object.keys(cleanDraft())));
  const preferences = applyContactPreferences(draft, session.draft || {}, parsed.draft || {}, text, prior.lastField);
  // code done by sonal: first reply follows the visible name question; no names are invented.
  const firstName = draft.fullName?.split(/\s+/)[0] || '';
  const introduced = Boolean(firstName && !session.draft?.fullName);
  if (careerIntent(text, parsed)) {
    return { reply: `${firstName ? `${firstName}, please` : 'Please'} check our careers page for current opportunities and apply there.`, draft, qualified: false, career: true, summary: parsed.summary || 'Visitor is seeking a job opportunity.', conversation: { ...prior, state: STATES.DISCOVERY, facts, lastField: '', ctaOffered: false, handoffDeclined: true, audience: 'CAREER' } };
  }
  if (introduced && !facts.project && !draft.requirement && parsed.handoffIntent !== 'REQUEST' && !requestsHandoff(text)) {
    return { reply: `Nice to meet you, ${firstName}. What would you like to build or explore?`, draft, qualified: false, summary: parsed.summary || '', conversation: { ...prior, state: STATES.DISCOVERY, facts, lastField: '', audience: 'BUSINESS' } };
  }
  // Remember a valid email supplied incidentally, including mailto/Markdown pasted by a visitor.
  const email = text.match(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+/i)?.[0];
  if (email) draft.email = email;
  // Declining a single contact field is not declining the entire conversation/handoff.
  const declined = !answeringChoice && !(preferences.companySkipped || preferences.phoneSkipped) && (declinesHandoff(text) || parsed.handoffIntent === 'DECLINE');
  const explicit = requestsHandoff(text) || (!declined && parsed.handoffIntent === 'REQUEST');
  const accepted = !answeringChoice && prior.ctaOffered && !declined && (parsed.handoffIntent === 'ACCEPT' || /^(?:yes|yeah|yep|sure|okay|ok|please do|go ahead|sounds good)[.!\s]*$/i.test(text.trim()));
  let state = Object.values(STATES).includes(prior.state) ? prior.state : STATES.DISCOVERY;
  if (declined) state = facts.project || draft.requirement ? STATES.QUALIFICATION : STATES.DISCOVERY;
  else if (explicit || accepted) state = STATES.HANDOFF;
  else if (state !== STATES.HANDOFF && (facts.project || draft.requirement)) state = STATES.QUALIFICATION;
  const askedTopics = [...new Set(prior.askedTopics || [])];
  let count = Math.min(3, Math.max(0, Number(prior.questionCount) || 0));
  let ctaOffered = declined ? false : Boolean(prior.ctaOffered);
  let lastField = '';
  let discoveryTopic = '';
  const sufficient = Boolean((facts.project || draft.requirement) && (facts.industry || facts.projectContext) && facts.feature);
  const potentialLead = parsed.qualified === true;
  let reply = hasContext ? compactAnswer(parsed.reply, text) : "I don't have verified information from the website to answer that. Our team can help clarify it.";
  if (state === STATES.HANDOFF) {
    const entering = prior.state !== STATES.HANDOFF;
    const missing = missingFields(draft);
    lastField = ['fullName', 'email', 'company', 'phone', 'requirement', 'service'].find(key => missing.includes(key)) || '';
    const prefix = entering ? [firstName ? `${firstName}, let's connect you with the team.` : '', prior.ctaOffered ? '' : projectSummary(draft, facts), HANDOFF].filter(Boolean).join(' ') : '';
    // Contact-only replies get a natural transition rather than repeating a marketing answer.
    const substantiveQuestion = /\?|^(?:how|what|why|can|does|do|is|are|tell me|explain)\b/i.test(text.trim());
    const contactReply = entering || (prior.lastField && !substantiveQuestion) || explicit;
    if (contactReply) reply = '';
    let next = lastField ? contactQuestions[lastField] : 'Please review your details below. You can make corrections here, then use the consent checkbox and send button when you are ready.';
    if (!entering && prior.lastField === 'fullName' && draft.fullName && lastField === 'email') next = `Nice to meet you, ${draft.fullName.split(/\s+/)[0]}. ${next}`;
    const acknowledgement = preferences.phoneSkipped ? "No problem — we can follow up by email." : preferences.companySkipped ? "No problem — we can continue without a company name." : '';
    reply = [prefix, acknowledgement, reply, next].filter(Boolean).join(' ');
  } else if (!declined && potentialLead && !prior.handoffDeclined) {
    const topic = Object.keys(questions).find(key => !facts[key] && !(key === 'project' && draft.requirement) && !(key === 'industry' && facts.projectContext) && !askedTopics.includes(key));
    // code done by sonal: clarify the delivery format before discussing connections and optional AI.
    const hasProject = Boolean(facts.project || draft.requirement);
    const pendingChoice = prior.discoveryTopic && !choices[prior.discoveryTopic] && /\?/.test(text) ? prior.discoveryTopic : '';
    const choiceTopic = pendingChoice || (hasProject ? ['platform', 'integrations', 'ai'].find(key => !choices[key] && !askedTopics.includes(key)) : '');
    if (choiceTopic && (pendingChoice || count < 3) && !ctaOffered) {
      discoveryTopic = choiceTopic;
      const choiceQuestions = {
        platform: 'Would you like a website, a mobile app, or both?',
        integrations: 'Besides the features you mentioned, should it connect to anything else, such as WhatsApp, your calendar, or tools you already use?',
        ai: 'Would you like optional AI help, such as answering common customer questions, or keep it simple without AI?',
      };
      // A description of a business need is not a request for an assumed website solution.
      if (choiceTopic === 'platform' && !text.includes('?')) reply = '';
      reply = [reply, choiceQuestions[choiceTopic]].filter(Boolean).join(' ');
      if (!askedTopics.includes(choiceTopic)) { askedTopics.push(choiceTopic); count++; }
    } else if (sufficient || count >= 3 || !topic) {
      if (!ctaOffered) {
        reply = [reply, projectSummary(draft, facts), CTA].filter(Boolean).join(' ');
        ctaOffered = true;
      }
    } else if (!ctaOffered) {
      reply = [reply, questions[topic]].filter(Boolean).join(' ');
      askedTopics.push(topic); count++;
    }
  }
  if (!reply) reply = declined ? 'No problem. We can keep the conversation here.' : 'You can ask me about the project or tell me when you want to connect with the team.';
  // code done by sonal: greet a newly supplied name without repeating it on every response.
  if (introduced && !reply.includes(firstName)) reply = `Nice to meet you, ${firstName}. ${reply}`;
  const conversation = { state, facts, choices, discoveryTopic, askedTopics, questionCount: count, ctaOffered, lastField, handoffDeclined: declined || (prior.handoffDeclined && !explicit && !accepted) || false };
  return { reply, draft, qualified: potentialLead && state === STATES.HANDOFF, summary: (parsed.summary || session.summary || projectSummary(draft, facts)).slice(0, 6000), conversation };
}
module.exports = { STATES, factKeys, requestsHandoff, declinesHandoff, compactAnswer, planTurn };

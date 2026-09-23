// code done by sonal: behavior regressions for early handoff, concise replies and known facts.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { planTurn, requestsHandoff, compactAnswer } = require('./conversation');
const { missingFields } = require('./validation');
const facts = { project: 'Website + CRM', industry: 'Real estate', feature: 'Property listings and broker details', projectContext: 'Buyer-facing website, single admin CRM' };
const draft = { requirement: 'A real-estate website and single-admin CRM for property listings and broker details.', service: 'Website and CRM development' };
function extraction(overrides = {}) {
  return { reply: '', draft: {}, facts: {}, qualified: true, summary: 'Website and CRM project for real estate.', handoffIntent: 'NONE', ...overrides };
}
function session(result = {}) { return { messages: [], draft: result.draft || {}, summary: result.summary || '', conversation: result.conversation || {} }; }
// code done by sonal: refusal regressions exercise the exact phrases reported by the visitor.
test('individual enquiry and phone refusal advance to review instead of repeating questions', () => {
  let current = planTurn(session(), 'Connect me', extraction({ draft: { ...draft, fullName: 'Test Visitor', email: 'visitor@example.test' }, facts }));
  assert.equal(current.conversation.lastField, 'company');
  current = planTurn(session(current), "i dont have company i'm an individual", extraction({ handoffIntent: 'DECLINE' }));
  assert.equal(current.draft.companyStatus, 'individual');
  assert.equal(current.draft.company, '');
  assert.equal(current.conversation.state, 'HANDOFF');
  assert.equal(current.conversation.lastField, 'phone');
  assert.ok(!current.reply.includes('company name?'));
  current = planTurn(session(current), 'i dont want to share my phone number', extraction({ handoffIntent: 'DECLINE' }));
  assert.equal(current.draft.phoneStatus, 'declined');
  assert.equal(current.draft.phone, '');
  assert.equal(current.qualified, true);
  assert.deepEqual(missingFields(current.draft), []);
  assert.ok(current.reply.includes('review your details'));
  assert.ok(!current.reply.includes('phone number should'));
  current = planTurn(session(current), 'Thanks', extraction());
  assert.deepEqual(missingFields(current.draft), []);
  assert.ok(!current.reply.includes('?'));
});
test('short skip answers apply only to the outstanding field and can later be corrected', () => {
  let current = planTurn(session(), 'Connect me', extraction({ draft: { ...draft, fullName: 'Test Visitor', email: 'visitor@example.test', company: 'ABC' }, facts }));
  current = planTurn(session(current), 'skip', extraction());
  assert.equal(current.draft.phoneStatus, 'declined');
  assert.equal(current.draft.company, 'ABC');
  current = planTurn(session(current), 'Actually use +1 202 555 0123', extraction({ draft: { phone: '+1 202 555 0123' } }));
  assert.equal(current.draft.phoneStatus, 'provided');
  assert.equal(current.draft.phone, '+1 202 555 0123');
});
test('unknown or malformed contact fields are not silently accepted as explicit opt-outs', () => {
  assert.ok(missingFields({ ...draft, fullName: 'Test', email: 'visitor@example.test' }).includes('phone'));
  assert.ok(missingFields({ ...draft, fullName: 'Test', email: 'bad', companyStatus: 'individual', phoneStatus: 'declined' }).includes('email'));
});
test('explicit handoff variants immediately ask for contact details without reconfirmation', () => {
  for (const text of ['contact the team', 'talk to someone', 'call me', 'set up a meeting', 'schedule a meeting', 'connect me', 'send me a quotation', 'I want to discuss this']) {
    const result = planTurn(session(), text, extraction({ draft, facts }));
    assert.equal(result.conversation.state, 'HANDOFF', text);
    assert.ok(result.reply.includes("What's your full name?"), text);
    assert.ok(!result.reply.includes('Would you like'), text);
    assert.equal(result.conversation.questionCount, 0);
    assert.ok(result.reply.indexOf('real-estate') < result.reply.indexOf("What's your full name?"));
  }
});
test('stop asking requests interrupt discovery even with little context or no retrieved passages', () => {
  for (const text of ["Don't ask more questions", "Don't ask me this many questions, just set a meeting with the Akoode team.", 'do not ask me any more questions']) {
    const result = planTurn(session(), text, extraction(), false);
    assert.equal(result.conversation.state, 'HANDOFF');
    assert.ok(!/what kind of business|main feature|would you like/i.test(result.reply));
    assert.ok(result.reply.includes("What's your full name?"));
  }
});
test('negated contact requests and ordinary negative project details do not trigger handoff', () => {
  assert.equal(requestsHandoff("Don't contact the team yet"), false);
  const result = planTurn(session(), 'No CRM, just a website', extraction({ facts: { project: 'Website' }, draft: { requirement: 'Build a business website without a CRM.' } }));
  assert.equal(result.conversation.state, 'QUALIFICATION');
  assert.equal(result.conversation.handoffDeclined, false);
});
test('unsolicited name, company and Markdown email are extracted and never requested again', () => {
  const result = planTurn(session(), "Connect me. I'm Sonal from ABC Technologies. My email is [sonal@example.com](mailto:sonal@example.com).", extraction({ draft: { ...draft, fullName: 'Sonal', company: 'ABC Technologies', email: '' }, facts }));
  assert.equal(result.draft.email, 'sonal@example.com');
  assert.equal(result.draft.company, 'ABC Technologies');
  assert.equal(result.conversation.lastField, 'phone');
  assert.ok(!/what's your full name|best email|company name/i.test(result.reply));
});
test('blank model fields cannot erase known contact or project facts on subsequent turns', () => {
  let result = planTurn(session(), 'Connect me', extraction({ draft: { ...draft, fullName: 'Sonal', company: 'ABC', email: 'sonal@example.com' }, facts }));
  result = planTurn(session(result), '+1 202 555 0123', extraction({ draft: { phone: '+1 202 555 0123' } }));
  assert.equal(result.draft.fullName, 'Sonal');
  assert.equal(result.conversation.facts.industry, 'Real estate');
  assert.deepEqual(missingFields(result.draft), []);
  assert.ok(result.reply.includes('review your details'));
  assert.ok(!result.reply.includes('?'));
});
test('known project and completed discovery offer a CTA with a short summary', () => {
  const result = planTurn({ ...session(), conversation: { state: 'QUALIFICATION', choices: { platform: 'website', integrations: 'CRM', ai: 'no' } } }, 'Single admin', extraction({ draft, facts }));
  assert.equal(result.conversation.state, 'QUALIFICATION');
  assert.equal(result.conversation.questionCount, 0);
  assert.ok(result.reply.includes('Would you like me to connect'));
  assert.ok(!result.reply.includes("What's your full name?"));
});
test('at most three discovery questions are asked, topics do not repeat, and CTA is not repeated', () => {
  let current = session(); const asked = [];
  for (let i = 0; i < 5; i++) {
    const result = planTurn(current, 'Still considering', extraction());
    asked.push(result.reply); current = session(result);
  }
  assert.equal(current.conversation.questionCount, 3);
  assert.equal(new Set(current.conversation.askedTopics).size, 3);
  assert.equal(asked.filter(reply => reply.includes('Would you like me to connect')).length, 1);
  assert.equal(asked.filter(reply => reply.includes('What kind of business')).length, 1);
});
test('accepting the offered CTA moves directly into lead capture, declining stops sales questions', () => {
  const offered = planTurn({ ...session(), conversation: { state: 'QUALIFICATION', choices: { platform: 'website', integrations: 'CRM', ai: 'no' } } }, 'A website and CRM for real estate', extraction({ draft, facts }));
  const accepted = planTurn(session(offered), 'Yes', extraction());
  assert.equal(accepted.conversation.state, 'HANDOFF');
  assert.ok(!accepted.reply.includes('Would you like'));
  const declined = planTurn(session(offered), 'Not now', extraction({ handoffIntent: 'DECLINE' }));
  const next = planTurn(session(declined), 'I am just browsing', extraction());
  assert.ok(!next.reply.includes('?'));
});
test('terse replies stay concise, detail requests preserve detail, and capture transitions sound natural', () => {
  const long = 'Here is a useful detail about the project. '.repeat(20);
  assert.ok(compactAnswer(long, 'yes').split(/\s+/).length <= 56);
  assert.ok(compactAnswer(long, 'Please explain in detail').length > 300);
  const prior = planTurn(session(), 'Call me', extraction({ draft, facts }));
  const result = planTurn(session(prior), 'Sonal Mittal', extraction({ draft: { fullName: 'Sonal Mittal' } }));
  assert.equal(result.reply, "Nice to meet you, Sonal. What's the best email to reach you?");
  assert.equal((result.reply.match(/\?/g) || []).length, 1);
});
test('no booked-meeting claim survives and handoff accurately describes review plus email workflow', () => {
  const result = planTurn(session(), 'Schedule a meeting', extraction({ draft, facts, reply: 'Your meeting has been scheduled. I have emailed the team.' }));
  assert.ok(!/has been scheduled|have emailed/.test(result.reply));
  assert.ok(result.reply.includes('after you review and send your enquiry'));
  assert.ok(result.reply.includes('reach out to arrange a discussion'));
  // code done by sonal: external Calendly link is offered without claiming a confirmed booking.
  assert.ok(result.reply.includes("Use 'Reserve your slot' below"));
  assert.equal(compactAnswer('Your meeting is confirmed. I have shared the details.', 'thanks'), '');
});
test('budget and timeline stay optional and complete leads still require explicit review/send', () => {
  const result = planTurn(session(), 'Connect me, skip budget and timeline', extraction({ draft: { ...draft, fullName: 'Sonal', email: 'sonal@example.com', company: 'ABC', phone: '+1 202 555 0123' }, facts }));
  assert.equal(result.draft.budget, ''); assert.equal(result.draft.timeline, '');
  assert.deepEqual(missingFields(result.draft), []);
  assert.equal(result.qualified, true);
  assert.ok(result.reply.includes('consent checkbox and send button'));
  assert.ok(!/what.*budget|what.*timeline/i.test(result.reply));
});
test('pre-update conversations resume an existing handoff offer without restarting discovery', () => {
  const old = { draft, messages: [{ role: 'assistant', content: 'Would you like our team to discuss this with you?' }] };
  const result = planTurn(old, 'Yes', extraction({ facts }));
  assert.equal(result.conversation.state, 'HANDOFF');
  assert.ok(result.reply.includes("What's your full name?"));
  assert.ok(!result.reply.includes('Would you like'));
});

// code done by sonal: the salon example must clarify platform and optional connections before handoff.
test('salon enquiry does not assume website and asks about connections then AI', () => {
  const salon = extraction({ facts: { project: 'Website', industry: 'Hair salon', feature: 'Bookings and payments' }, draft: { requirement: 'Salon services, appointment bookings and online payments.' } });
  let result = planTurn(session(), 'i have a hair salon and i want to showcase my services and want customer to book it and also want a payment gateway', salon);
  assert.equal(result.conversation.discoveryTopic, 'platform');
  assert.equal(result.conversation.ctaOffered, false);
  assert.equal(result.reply, 'Would you like a website, a mobile app, or both?');
  result = planTurn(session(result), 'Mobile app', extraction());
  assert.equal(result.conversation.choices.platform, 'app');
  assert.equal(result.conversation.discoveryTopic, 'integrations');
  result = planTurn(session(result), 'No', extraction({ handoffIntent: 'DECLINE' }));
  assert.equal(result.conversation.handoffDeclined, false);
  assert.equal(result.conversation.discoveryTopic, 'ai');
  const explained = planTurn(session(result), 'What would AI help with?', extraction({ reply: 'It could answer common customer questions.' }));
  assert.equal(explained.conversation.discoveryTopic, 'ai');
  assert.equal(explained.conversation.questionCount, 3);
  result = planTurn(session(explained), 'No', extraction({ handoffIntent: 'DECLINE' }));
  assert.equal(result.conversation.choices.ai, 'no');
  assert.equal(result.conversation.handoffDeclined, false);
  assert.equal(result.conversation.ctaOffered, true);
  assert.equal(result.conversation.state, 'QUALIFICATION');
  assert.match(result.draft.requirement, /bookings and online payments/);
});
test('explicit platform is remembered and direct handoff still interrupts choices', () => {
  let result = planTurn(session(), 'I want a website for salon bookings', extraction({ facts: { project: 'Salon bookings' } }));
  assert.equal(result.conversation.discoveryTopic, 'integrations');
  result = planTurn(session(result), 'Please connect me with the team', extraction());
  assert.equal(result.conversation.state, 'HANDOFF');
  assert.equal(result.conversation.discoveryTopic, '');
});

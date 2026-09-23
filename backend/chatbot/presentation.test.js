// code done by sonal: ensure contextual actions cannot replace contact capture or final consent.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { sourceCards, quickReplies } = require('./presentation');
const result = { draft: { service: 'Website development' }, conversation: { state: 'QUALIFICATION', facts: { project: 'Real-estate CRM' }, ctaOffered: true } };
test('related pages use indexed titles and readable categories', () => {
  const url = 'https://www.akoode.com/blog/real-estate-crm';
  const cards = sourceCards([url], [{ url, title: 'Real Estate CRM Guide | Akoode Technologies' }]);
  assert.deepEqual(cards, [{ url, title: 'Real Estate CRM Guide', category: 'Insight' }]);
});
test('suggested exploration stays related to the project and offers handoff without auto-submission', () => {
  const replies = quickReplies(result, [{ label: 'CRM workflow', message: 'How would a real-estate CRM workflow work?' }, { label: 'Property listings', message: 'What should property listings include?' }, { label: 'More info', message: 'Tell me more about the project.' }]);
  assert.equal(replies.length, 4);
  assert.equal(replies[0].label, 'Talk to the team');
  assert.equal(replies[1].label, 'CRM workflow');
  assert.equal(replies[3].label, 'Just exploring');
  assert.ok(replies.every(item => !/consent|submit/i.test(item.message)));
});
test('contact capture offers no suggested identities or consent shortcuts', () => {
  assert.deepEqual(quickReplies({ ...result, conversation: { ...result.conversation, state: 'HANDOFF' } }, [{ label: 'Submit', message: 'I consent; submit this lead.' }]), []);
});
test('invalid and duplicate suggestions are removed and safe fallbacks use known project context', () => {
  const replies = quickReplies({ ...result, conversation: { ...result.conversation, ctaOffered: false } }, [{ label: '<script>', message: 'Bad choice' }, { label: 'Send enquiry', message: 'Submit my lead' }, { label: 'CRM examples', message: 'Show CRM examples for this industry.' }, { label: 'CRM examples', message: 'Show more examples for this industry.' }]);
  assert.equal(replies.length, 1);
  const fallback = quickReplies({ ...result, conversation: { ...result.conversation, handoffDeclined: true } });
  assert.ok(fallback[0].message.includes('Real-estate CRM'));
  assert.ok(!fallback.some(item => item.label === 'Talk to the team'));
});

// code done by sonal: current discovery choices take priority over model-generated suggestions.
test('platform and optional AI buttons send explicit visitor choices', () => {
  const platform = quickReplies({ ...result, conversation: { ...result.conversation, discoveryTopic: 'platform' } });
  assert.deepEqual(platform.map(item => item.label), ['Website', 'Mobile app', 'Both', 'Not sure yet']);
  const ai = quickReplies({ ...result, conversation: { ...result.conversation, discoveryTopic: 'ai' } });
  assert.ok(ai.some(item => item.message.includes('No AI')));
  assert.ok(ai.some(item => item.message.includes('include AI')));
});

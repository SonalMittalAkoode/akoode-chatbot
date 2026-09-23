// code done by sonal: regression coverage for name-first introductions and career/portfolio routing.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { requestsWork, careerIntent } = require('./visitorIntent');
const { planTurn } = require('./conversation');
const { quickReplies } = require('./presentation');
test('name-only introduction is remembered and greeted without qualification or source fallback', () => {
  const result = planTurn({ messages: [], draft: {} }, 'Sonal', { draft: { fullName: 'Sonal' }, facts: {}, qualified: false, reply: '', handoffIntent: 'NONE', summary: 'Visitor is Sonal.' }, false);
  assert.equal(result.reply, 'Nice to meet you, Sonal. What would you like to build or explore?');
  assert.equal(result.draft.fullName, 'Sonal'); assert.equal(result.qualified, false);
});
test('work requests are explicit rather than triggered by ordinary project discussion', () => {
  for (const text of ['Show me your work', 'Can I see your portfolio?', 'Share relevant case studies', 'Show examples you have built', 'What are your previous projects?']) assert.equal(requestsWork(text), true, text);
  for (const text of ['I want to build a website', 'Tell me more about CRM features', 'How does this work?', 'Do not show me case studies']) assert.equal(requestsWork(text), false, text);
});
test('job seekers get the career route, no lead capture and no sales shortcuts', () => {
  const result = planTurn({ messages: [], draft: { fullName: 'Sonal' } }, 'I am looking for a job. Are you hiring?', { draft: {}, facts: {}, qualified: true, reply: 'What is your phone?', handoffIntent: 'REQUEST', summary: 'Job enquiry.', visitorIntent: 'CAREER' });
  assert.equal(result.career, true); assert.equal(result.qualified, false);
  assert.ok(result.reply.includes('Sonal')); assert.ok(result.reply.includes('careers page')); assert.ok(result.reply.includes('apply there'));
  assert.ok(!result.reply.includes('?')); assert.deepEqual(quickReplies(result), []);
});
test('building a recruitment product is business work, not a job application', () => {
  assert.equal(careerIntent('I need a job portal website for my recruitment company', { visitorIntent: 'CAREER' }), false);
});

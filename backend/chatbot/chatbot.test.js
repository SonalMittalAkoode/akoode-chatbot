// code done by sonal: regression tests run against a uniquely named disposable local database.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const express = require('express');
const crypto = require('crypto');
const { cleanDraft, missingFields, escapeHtml, safeSource } = require('./validation');
const { normalize, extract, robotRules, refreshKnowledge } = require('./crawl');
const { Session, Lead, Chunk, State, Rate } = require('./models');
const { emailContent, deliverPending } = require('./email');
const originalFetch = global.fetch;
const database = `akoode_chatbot_test_${crypto.randomBytes(6).toString('hex')}`;
let server; let base; let token; let lastAiRequest;
const draft = { fullName: 'Test Visitor', email: 'visitor@example.test', company: 'Test Company', phone: '+1 202 555 0123', requirement: 'Build an AI chatbot for our customer support business.', service: 'AI chatbot', budget: '', timeline: '' };
before(async () => {
  process.env.CHATBOT_PROXY_SECRET = 'test-secret-only-'.repeat(4);
  process.env.GEMINI_API_KEY = 'test-not-a-real-key'; process.env.CHATBOT_AI_MODEL = 'test-model';
  process.env.CHATBOT_LEAD_EMAIL = 'sales@example.test'; process.env.SENDGRID_API_KEY = 'SG.test-only'; process.env.SENDGRID_FROM_EMAIL = 'sender@example.test';
  await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`, { serverSelectionTimeoutMS: 3000 });
  await Promise.all([Session.init(), Lead.init(), Chunk.init(), State.init(), Rate.init()]);
  await State.create({ _id: 'knowledge', generation: 'test' });
  await Chunk.create({ generation: 'test', url: 'https://www.akoode.com/services/artificial-intelligence', title: 'AI chatbot development', text: 'Akoode develops AI chatbot systems for customer support and business automation.' });
  global.fetch = async (url, options) => {
    if (String(url) !== 'https://generativelanguage.googleapis.com/v1beta/models/test-model:generateContent') return originalFetch(url, options);
    // code done by sonal: verify Gemini authentication stays in a header, never a URL.
    assert.equal(options.headers['x-goog-api-key'], 'test-not-a-real-key');
    assert.ok(!String(url).includes('test-not-a-real-key'));
    lastAiRequest = JSON.parse(options.body);
    // code done by sonal: include extracted project facts while policy controls the handoff.
    return new Response(JSON.stringify({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ reply: '', draft, qualified: true, facts: { project: 'AI chatbot', industry: 'Customer support', feature: 'Answer support questions', projectContext: '' }, handoffIntent: 'NONE', summary: 'Visitor wants an AI chatbot for customer support.', sources: ['https://attacker.example', 'https://www.akoode.com/services/artificial-intelligence'] }) }] } }] }), { status: 200 });
  };
  const app = express(); app.use(express.json()); app.use('/chatbot', require('./router'));
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${server.address().port}/chatbot`;
});
after(async () => {
  global.fetch = originalFetch;
  if (server) await new Promise(resolve => server.close(resolve));
  // Only the random test database created by this process may be removed.
  if (mongoose.connection.name === database && database.startsWith('akoode_chatbot_test_')) await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
async function request(path, method = 'GET', body, overrides = {}) {
  return originalFetch(`${base}/${path}`, { method, headers: { 'Content-Type': 'application/json', 'x-chatbot-secret': process.env.CHATBOT_PROXY_SECRET, 'x-chatbot-client': crypto.randomUUID(), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...overrides }, ...(body ? { body: JSON.stringify(body) } : {}) });
}
test('lead validation rejects missing/invalid contact information and escapes email HTML', () => {
  assert.deepEqual(missingFields(cleanDraft(draft)), []);
  assert.ok(missingFields(cleanDraft({ ...draft, email: 'not-an-email', phone: 'bad' })).includes('email'));
  assert.ok(missingFields(cleanDraft({ ...draft, requirement: 'Hi' })).includes('requirement'));
  assert.equal(escapeHtml('<script>'), '&lt;script&gt;');
  assert.equal(safeSource('https://www.akoode.com/services?secret=value#x'), 'https://www.akoode.com/services');
  assert.equal(safeSource('https://attacker.example/'), '');
});
test('crawler excludes private/external URLs, boilerplate, query secrets and noindex pages', () => {
  for (const url of ['/api/secret', '/thebusinesshub/leads', 'https://attacker.example', '/blog?preview=secret', '/file.pdf']) assert.equal(normalize(url, 'https://www.akoode.com'), null);
  assert.equal(normalize('/services#ai', 'https://www.akoode.com'), 'https://www.akoode.com/services');
  const page = extract('<title>AI</title><nav>secret navigation</nav><main>' + 'Useful Akoode content. '.repeat(100) + '<a href="/about-us">About</a></main>', 'https://www.akoode.com');
  assert.ok(page.chunks.length > 1); assert.ok(!page.chunks[0].text.includes('secret navigation'));
  assert.deepEqual(page.links, ['/about-us']);
  assert.equal(extract('<meta name="robots" content="noindex"><main>Private</main>', 'https://www.akoode.com'), null);
  const allowed = robotRules('User-agent: *\nDisallow: /private/\nAllow: /private/public\nUser-agent: OtherBot\nDisallow: /');
  assert.equal(allowed('/private/secret'), false); assert.equal(allowed('/private/public'), true); assert.equal(allowed('/services'), true);
});
test('backend requires proxy authentication and valid session tokens', async () => {
  assert.equal((await request('session', 'POST', {}, { 'x-chatbot-secret': 'wrong' })).status, 403);
  assert.equal((await request('session')).status, 401);
  const response = await request('session', 'POST', { source: 'https://www.akoode.com/services?tracking=private' });
  assert.equal(response.status, 200); token = (await response.json()).token;
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.equal((await Session.findOne()).source, 'https://www.akoode.com/services');
});
test('chat preserves context, filters untrusted source URLs and validates message size', async () => {
  assert.equal((await request('message', 'POST', { message: 'a'.repeat(2001) })).status, 400);
  // code done by sonal: explicit handoff opens lead review without repeating a CTA.
  let response = await request('message', 'POST', { message: `${draft.requirement} Please connect me with the team.` });
  assert.equal(response.status, 200);
  let data = await response.json(); assert.equal(data.ready, true); assert.equal(data.sources.length, 1);
  // code done by sonal: titles/actions survive session reload; contact capture has no shortcut consent.
  assert.deepEqual(data.sourceCards, []);
  assert.deepEqual(data.quickReplies, []);
  const restored = await (await request('session')).json();
  assert.deepEqual(restored.messages.at(-1).sourceCards, []);
  response = await request('message', 'POST', { message: 'Please use my previously supplied business details.' });
  assert.equal(response.status, 200); assert.equal(lastAiRequest.contents.length, 3);
  assert.deepEqual(lastAiRequest.contents.map(message => message.role), ['user', 'model', 'user']);
  assert.equal(lastAiRequest.generationConfig.responseMimeType, 'application/json');
  assert.ok(lastAiRequest.generationConfig.responseJsonSchema.required.includes('draft'));
  assert.ok(lastAiRequest.systemInstruction.parts[0].text.includes('Website excerpts:'));
  assert.equal((await Session.findOne({ tokenHash: crypto.createHash('sha256').update(token).digest('hex') })).conversation.state, 'HANDOFF');
});
test('lead requires consent, is idempotent and contains summary and full transcript', async () => {
  assert.equal((await request('lead', 'POST', { consent: false })).status, 400);
  assert.equal((await request('lead', 'POST', { consent: true })).status, 200);
  assert.equal((await request('lead', 'POST', { consent: true })).status, 200);
  assert.equal(await Lead.countDocuments(), 1);
  const lead = await Lead.findOne(); assert.equal(lead.transcript.length, 4); assert.ok(lead.summary); assert.equal(lead.notification, 'pending');
  const html = emailContent(lead); for (const value of [draft.email, draft.company, draft.phone, lead.summary, 'Full conversation transcript', 'Date/time (UTC)']) assert.ok(html.includes(value));
  assert.equal((await request('message', 'POST', { message: 'Another project' })).status, 409);
});
test('email failures stay queued and retry successfully without a real email being sent', async () => {
  const sg = require('@sendgrid/mail'); const oldSend = sg.send;
  try {
    sg.send = async () => { throw new Error('Simulated outage'); };
    await deliverPending(); let lead = await Lead.findOne(); assert.equal(lead.notification, 'pending'); assert.equal(lead.attempts, 1);
    let sent;
    sg.send = async message => { sent = message; };
    await Lead.updateOne({ _id: lead._id }, { $set: { nextAttempt: new Date(0) } });
    await deliverPending(); lead = await Lead.findOne(); assert.equal(lead.notification, 'sent');
    assert.equal(sent.subject, 'New Akoode Website Lead – Test Visitor/Test Company');
    assert.equal(sent.to, 'sales@example.test');
  } finally { sg.send = oldSend; }
});
test('rate limiting and expiry are enforced server-side', async () => {
  for (let i = 0; i < 20; i++) assert.equal((await request('session', 'GET', null, { 'x-chatbot-client': 'rate-test' })).status, 200);
  assert.equal((await request('session', 'GET', null, { 'x-chatbot-client': 'rate-test' })).status, 429);
  await Session.updateMany({}, { $set: { expiresAt: new Date(0) } });
  assert.equal((await request('session')).status, 401);
});
test('empty knowledge and provider failure cannot fabricate successful answers or save failed turns', async () => {
  let r = await request('session', 'POST', {}); token = (await r.json()).token;
  await State.updateOne({ _id: 'knowledge' }, { $set: { generation: 'absent' } });
  r = await request('message', 'POST', { message: 'What services can Akoode deliver?' });
  assert.equal(r.status, 200); const reply = await r.json(); assert.equal(reply.ready, false); assert.deepEqual(reply.sources, []); assert.ok(reply.reply.includes('verified information'));
  await State.updateOne({ _id: 'knowledge' }, { $set: { generation: 'test' } });
  const mockFetch = global.fetch;
  try {
    global.fetch = async () => { throw new Error('Provider unavailable'); };
    r = await request('message', 'POST', { message: 'Build AI chatbot business automation' }); assert.equal(r.status, 503);
    const data = await (await request('session')).json(); assert.equal(data.messages.length, 2);
  } finally { global.fetch = mockFetch; }
});
test('refresh failures preserve active knowledge and successful refreshes discover sitemap and linked pages', async () => {
  const mockFetch = global.fetch;
  let fail = true;
  const fixture = {
    'https://www.akoode.com/robots.txt': 'User-agent: *\nDisallow: /private/',
    'https://www.akoode.com/sitemap.xml': '<urlset><url><loc>https://www.akoode.com/services</loc></url></urlset>',
    'https://www.akoode.com/': '<main>' + 'Akoode verified company information. '.repeat(10) + '<a href="/about-us">About</a></main>',
    'https://www.akoode.com/services': '<main>' + 'Akoode service information and FAQs. '.repeat(10) + '</main>',
    'https://www.akoode.com/about-us': '<main>' + 'Akoode About information and industries. '.repeat(10) + '</main>',
  };
  try {
    global.fetch = async url => new Response(fixture[url] || '', { status: fail && String(url).endsWith('/services') ? 500 : fixture[url] ? 200 : 404 });
    await assert.rejects(refreshKnowledge(), /Crawl failed/);
    assert.equal((await State.findById('knowledge')).generation, 'test');
    assert.equal(await Chunk.countDocuments({ generation: { $ne: 'test' } }), 0);
    fail = false;
    const report = await refreshKnowledge(); assert.equal(report.pages, 3); assert.ok(report.chunks >= 3);
    assert.equal((await State.findById('knowledge')).generation, report.generation);
  } finally { global.fetch = mockFetch; }
});
// code done by sonal: the real submission route accepts opt-outs while retaining explicit consent.
test('individual email-only lead survives reload and submits with consent', async () => {
  const created = await request('session', 'POST', {}); token = (await created.json()).token;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await Session.updateOne({ tokenHash }, { $set: { qualified: true, summary: 'Individual visitor wants a chatbot and email follow-up.', draft: { ...draft, company: '', phone: '', companyStatus: 'individual', phoneStatus: 'declined' } } });
  const restored = await (await request('session')).json();
  assert.equal(restored.ready, true);
  assert.equal(restored.draft.phoneStatus, 'declined');
  assert.equal((await request('lead', 'POST', { consent: false })).status, 400);
  assert.equal((await request('lead', 'POST', { consent: true })).status, 200);
  const savedSession = await Session.findOne({ tokenHash });
  const lead = await Lead.findOne({ sessionId: savedSession._id });
  assert.equal(lead.details.phone, '');
  assert.equal(lead.details.companyStatus, 'individual');
  const html = emailContent(lead);
  assert.ok(html.includes('Individual (no company)'));
  assert.ok(html.includes('Not shared (visitor declined)'));
});
// code done by sonal: portfolio cards are shown only for the turn that explicitly requests work.
test('explicit work requests return case studies only; later ordinary replies have no cards', async () => {
  const active = await State.findById('knowledge');
  await Chunk.create({ generation: active.generation, url: 'https://www.akoode.com/case-studies/support-chatbot', title: 'Customer Support Chatbot', text: 'AI chatbot development customer support business automation case study.' });
  const created = await request('session', 'POST', {}); token = (await created.json()).token;
  let response = await request('message', 'POST', { message: 'Show me your AI chatbot case studies.' });
  let data = await response.json();
  assert.equal(response.status, 200); assert.equal(data.caseStudiesRequested, true);
  assert.ok(data.sourceCards.length > 0); assert.ok(data.sourceCards.every(page => page.category === 'Case study'));
  const restored = await (await request('session')).json();
  assert.equal(restored.messages.at(-1).caseStudiesRequested, true);
  response = await request('message', 'POST', { message: 'What should I consider when building a chatbot?' });
  data = await response.json(); assert.equal(data.caseStudiesRequested, false); assert.deepEqual(data.sourceCards, []);
});


test('onboarding metadata attaches to new and existing sessions without changing conversation', async () => {
  assert.equal((await request('session', 'POST', { userMetadata: { privacyConsent: false } })).status, 400);
  const userMetadata = { name: 'Visitor', email: 'visitor@example.test', privacyConsent: true, acquisitionSource: 'google' };
  const created = await request('session', 'POST', { userMetadata });
  assert.equal(created.status, 200); token = (await created.json()).token;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  let saved = await Session.findOne({ tokenHash }).lean();
  assert.deepEqual(saved.userMetadata, userMetadata);
  assert.equal(saved.draft.fullName, 'Visitor');
  assert.equal(saved.draft.email, 'visitor@example.test');
  assert.equal((await request('session', 'PATCH', { userMetadata: { privacyConsent: true, email: 'invalid' } })).status, 400);
  assert.equal((await request('session', 'PATCH', { userMetadata: { privacyConsent: true, acquisitionSource: 'skipped' } })).status, 200);
  saved = await Session.findOne({ tokenHash }).lean();
  assert.deepEqual(saved.userMetadata, { privacyConsent: true, acquisitionSource: 'skipped' });
  assert.equal(saved.messages.length, 0);
  assert.equal(saved.submitted, false);
  await Session.updateOne({ tokenHash }, { $set: { 'draft.fullName': 'Corrected name' }, $unset: { 'draft.email': 1 } });
  const updated = await request('session', 'PATCH', { userMetadata });
  assert.equal(updated.status, 200);
  const restored = await updated.json();
  assert.equal(restored.draft.fullName, 'Corrected name');
  assert.equal(restored.draft.email, 'visitor@example.test');
  assert.equal((await (await request('session')).json()).draft.fullName, 'Corrected name');
});

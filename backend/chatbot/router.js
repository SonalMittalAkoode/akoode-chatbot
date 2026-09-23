// code done by sonal: private proxy API, bounded sessions, consent and idempotent lead capture.
const express = require('express');
const crypto = require('crypto');
const { Session, Lead, Rate } = require('./models');
const { answer } = require('./ai');
const { missingFields, safeSource } = require('./validation');
const router = express.Router();
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
router.use(async (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  const expected = process.env.CHATBOT_PROXY_SECRET || '';
  const received = req.get('x-chatbot-secret') || '';
  if (expected.length < 32 || !crypto.timingSafeEqual(Buffer.from(hash(expected)), Buffer.from(hash(received)))) return res.status(403).json({ message: 'Chatbot unavailable.' });
  try {
    const bucket = Math.floor(Date.now() / 60000);
    const key = `${hash(req.get('x-chatbot-client') || req.ip)}:${bucket}`;
    let rate;
    try { rate = await Rate.findOneAndUpdate({ _id: key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 120000) } }, { upsert: true, new: true }); }
    catch (error) { if (error.code !== 11000) throw error; rate = await Rate.findOneAndUpdate({ _id: key }, { $inc: { count: 1 } }, { new: true }); }
    if (rate.count > 20) return res.status(429).set('Retry-After', '60').json({ message: 'Please wait a minute before sending more messages.' });
    next();
  } catch { res.status(503).json({ message: 'Chat is temporarily unavailable. Please contact our team.' }); }
});
router.post('/session', async (req, res) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    await Session.create({ tokenHash: hash(token), source: safeSource(req.body?.source), expiresAt: new Date(Date.now() + 24 * 3600000) });
    res.json({ token });
  } catch { res.status(503).json({ message: 'Unable to start chat. Please try again.' }); }
});
router.use(async (req, res, next) => {
  const token = req.get('Authorization')?.replace(/^Bearer /, '') || '';
  if (!/^[a-f0-9]{64}$/.test(token)) return res.status(401).json({ message: 'Please start a new chat.' });
  try {
    req.chat = await Session.findOne({ tokenHash: hash(token), expiresAt: { $gt: new Date() } });
    if (!req.chat) return res.status(401).json({ message: 'Chat expired. Please start a new chat.' });
    next();
  } catch { res.status(503).json({ message: 'Chat is temporarily unavailable.' }); }
});
router.get('/session', (req, res) => res.json({ messages: req.chat.messages, draft: req.chat.draft, ready: req.chat.qualified && !missingFields(req.chat.draft).length, submitted: req.chat.submitted }));
router.delete('/session', async (req, res) => {
  try { await Session.deleteOne({ _id: req.chat._id }); res.json({ deleted: true }); }
  catch { res.status(503).json({ message: 'Could not clear this chat. Please retry.' }); }
});
router.post('/message', async (req, res) => {
  const text = req.body?.message;
  if (typeof text !== 'string' || !text.trim() || text.length > 2000) return res.status(400).json({ message: 'Please enter between 1 and 2,000 characters.' });
  let locked;
  try {
    locked = await Session.findOneAndUpdate({ _id: req.chat._id, submitted: false, $or: [{ lockedUntil: { $exists: false } }, { lockedUntil: { $lte: new Date() } }] }, { $set: { lockedUntil: new Date(Date.now() + 60000) } }, { new: true });
    if (!locked) return res.status(409).json({ message: 'This chat is busy or already submitted. Please wait or start a new chat.' });
    if (locked.messages.length >= 80) return res.status(400).json({ message: 'Please start a new chat or contact our team to continue.' });
    const result = await answer(locked, text.trim());
    // code done by sonal: restore contextual shortcuts and readable citations with the conversation.
    locked.messages.push({ role: 'user', content: text.trim() }, { role: 'assistant', content: result.reply, sourceCards: result.sourceCards, quickReplies: result.quickReplies, caseStudiesRequested: result.caseStudiesRequested, career: result.career });
    locked.draft = result.draft; locked.qualified = result.qualified; locked.summary = result.summary;
    // code done by sonal: retain question history and handoff state across requests/reloads.
    locked.conversation = result.conversation;
    await locked.save();
    res.json({ reply: result.reply, sources: result.sources, sourceCards: result.sourceCards, quickReplies: result.quickReplies, caseStudiesRequested: result.caseStudiesRequested, career: Boolean(result.career), draft: result.draft, ready: result.qualified && !missingFields(result.draft).length });
  } catch { res.status(503).json({ message: 'The assistant is temporarily unavailable. Your message was not saved; please retry or contact our team.' }); }
  finally { if (locked) await Session.updateOne({ _id: locked._id }, { $unset: { lockedUntil: 1 } }).catch(() => {}); }
});
router.post('/lead', async (req, res) => {
  if (req.body?.consent !== true) return res.status(400).json({ message: 'Please confirm that Akoode may contact you about this project.' });
  let session;
  try {
    // code done by sonal: serialize lead submission with messages so reviewed data cannot race a reply.
    session = await Session.findOneAndUpdate({ _id: req.chat._id, $or: [{ lockedUntil: { $exists: false } }, { lockedUntil: { $lte: new Date() } }] }, { $set: { lockedUntil: new Date(Date.now() + 60000) } }, { new: true });
    if (!session) return res.status(409).json({ message: 'Please wait for the current request before submitting.' });
    if (!session.qualified || missingFields(session.draft).length || !session.summary) return res.status(400).json({ message: 'Please finish discussing your project and contact details first.' });
    if (!process.env.CHATBOT_LEAD_EMAIL || !process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) return res.status(503).json({ message: 'Team notifications are temporarily unavailable. Please use the contact page.' });
    const retention = Math.max(1, Math.min(365, Number(process.env.CHATBOT_LEAD_RETENTION_DAYS) || 90));
    await Lead.updateOne({ sessionId: session._id }, { $setOnInsert: { details: session.draft, summary: session.summary, transcript: session.messages, source: session.source, consentAt: new Date(), expiresAt: new Date(Date.now() + retention * 86400000) } }, { upsert: true });
    await Session.updateOne({ _id: session._id }, { $set: { submitted: true } });
    res.json({ message: 'Thank you. Your project details have been saved for our team, and an email notification is queued.' });
  } catch { res.status(503).json({ message: 'Could not save your request. Please retry.' }); }
  finally { if (session) await Session.updateOne({ _id: session._id }, { $unset: { lockedUntil: 1 } }).catch(() => {}); }
});
module.exports = router;

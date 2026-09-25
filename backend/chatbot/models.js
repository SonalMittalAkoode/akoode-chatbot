// code done by sonal: isolated chatbot storage, expiry and durable email outbox.
const mongoose = require('mongoose');
const { Schema } = mongoose;
const message = new Schema({ role: String, content: String }, { _id: false });
// code done by sonal: retain UI actions/citations on chat reload without changing lead transcripts.
const chatMessage = message.clone();
chatMessage.add({
  // code done by sonal: persist the explicit work request and career navigation on reload.
  caseStudiesRequested: Boolean, career: Boolean,
  sourceCards: { type: [new Schema({ url: String, title: String, category: String }, { _id: false })], default: undefined },
  quickReplies: { type: [new Schema({ label: String, message: String }, { _id: false })], default: undefined },
});
const session = new Schema({
  tokenHash: { type: String, unique: true },
  messages: [chatMessage], source: String,
  userMetadata: { type: new Schema({
    name: { type: String, maxlength: 120 }, email: { type: String, maxlength: 254 },
    acquisitionSource: { type: String, enum: ['facebook', 'instagram', 'google', 'friend_recommendation', 'other', 'skipped'] },
    acquisitionSourceOther: { type: String, maxlength: 200 }, privacyConsent: Boolean,
  }, { _id: false }), default: undefined },
  draft: { type: Schema.Types.Mixed, default: {} },
  // code done by sonal: session-only conversation state; lead records and retention stay unchanged.
  conversation: { type: Schema.Types.Mixed, default: {} },
  qualified: Boolean, summary: String, submitted: { type: Boolean, default: false },
  lockedUntil: Date,
  expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
}, { timestamps: true });
const lead = new Schema({
  sessionId: { type: Schema.Types.ObjectId, unique: true },
  details: Schema.Types.Mixed, summary: String, transcript: [message], source: String,
  consentAt: Date,
  notification: { type: String, enum: ['pending', 'sending', 'sent'], default: 'pending' },
  attempts: { type: Number, default: 0 }, nextAttempt: { type: Date, default: Date.now },
  sentAt: Date, expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
}, { timestamps: true });
const chunk = new Schema({ generation: { type: String, index: true }, url: String, title: String, text: String });
chunk.index({ title: 'text', text: 'text' }, { weights: { title: 3, text: 1 } });
const state = new Schema({ _id: String, generation: String, pages: Number, chunks: Number, refreshedAt: Date, lockedUntil: Date });
const rate = new Schema({ _id: String, count: Number, expiresAt: { type: Date, index: { expireAfterSeconds: 0 } } });
module.exports = {
  Session: mongoose.model('ChatbotSession', session), Lead: mongoose.model('ChatbotLead', lead),
  Chunk: mongoose.model('ChatbotChunk', chunk), State: mongoose.model('ChatbotState', state),
  Rate: mongoose.model('ChatbotRate', rate),
};

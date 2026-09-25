// Vercel entry point for the existing chatbot router. The main website API stays on api.akoode.com.
const express = require('express');
const mongoose = require('mongoose');
const { waitUntil } = require('@vercel/functions');
const { deliverPending } = require('./chatbot/email');
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '12kb' }));
let connection;
app.use('/chatbot', async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URL) throw new Error('DATABASE_NOT_CONFIGURED');
    if (!connection) connection = mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 10000, maxPoolSize: 5,
    }).catch(error => { connection = undefined; throw error; });
    await connection;
    // Finish durable outbox work within the function lifetime, not a process timer.
    res.on('finish', () => {
      if (res.statusCode < 400) waitUntil(deliverPending().catch(() => console.error('[chatbot] Notification retry failed.')));
    });
    next();
  } catch {
    console.error('[chatbot] Database unavailable; check Atlas connection and network access.');
    res.status(503).json({ message: 'Chat is temporarily unavailable. Please retry.' });
  }
});
app.use('/chatbot', require('./chatbot/router'));
module.exports = app;

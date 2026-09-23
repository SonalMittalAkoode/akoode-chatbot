// code done by sonal: run manually or from a scheduled job after publishing website changes.
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { refreshKnowledge } = require('../chatbot/crawl');
(async () => {
  try {
    if (!process.env.MONGODB_URL) throw new Error('Set MONGODB_URL in backend/.env.');
    await mongoose.connect(process.env.MONGODB_URL, { serverSelectionTimeoutMS: 10000 });
    console.log('Chatbot knowledge refresh complete:', await refreshKnowledge());
  } catch (error) { console.error(error.message); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
})();

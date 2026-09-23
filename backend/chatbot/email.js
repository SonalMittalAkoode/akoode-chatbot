// code done by sonal: durable, retryable sales notifications; never log personal data.
const { Lead } = require('./models');
const { escapeHtml } = require('./validation');
function emailContent(lead) {
  // code done by sonal: explain missing contact fields without representing an opt-out as a phone number.
  const details = Object.entries(lead.details).filter(([key]) => !['companyStatus', 'phoneStatus'].includes(key)).map(([key, value]) => {
    const display = key === 'company' && lead.details.companyStatus === 'individual' ? 'Individual (no company)' : ['company', 'phone'].includes(key) && lead.details[`${key}Status`] === 'declined' ? 'Not shared (visitor declined)' : value || 'Not provided';
    return `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(display)}</p>`;
  }).join('');
  const transcript = lead.transcript.map(m => `${m.role}: ${m.content}`).join('\n\n');
  return `${details}<p><strong>Date/time (UTC):</strong> ${escapeHtml(lead.consentAt.toISOString())}</p><p><strong>Page:</strong> ${escapeHtml(lead.source)}</p><h2>AI-generated conversation summary</h2><p>${escapeHtml(lead.summary)}</p><h2>Full conversation transcript</h2><pre style="white-space:pre-wrap">${escapeHtml(transcript)}</pre>`;
}
async function deliverPending() {
  if (!process.env.CHATBOT_LEAD_EMAIL || !process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) return;
  const lead = await Lead.findOneAndUpdate({ notification: { $in: ['pending', 'sending'] }, nextAttempt: { $lte: new Date() } },
    { $set: { notification: 'sending', nextAttempt: new Date(Date.now() + 120000) }, $inc: { attempts: 1 } }, { new: true });
  if (!lead) return;
  try {
    // Lazy import keeps the chatbot module loadable before email configuration exists.
    const { sendMail } = require('../middlewares/sendgrid');
    await sendMail({ to: process.env.CHATBOT_LEAD_EMAIL,
      subject: `New Akoode Website Lead – ${lead.details.fullName}/${lead.details.company}`.replace(/[\r\n]/g, ' '),
      html: emailContent(lead), replyTo: lead.details.email });
    await Lead.updateOne({ _id: lead._id }, { $set: { notification: 'sent', sentAt: new Date() } });
  } catch {
    await Lead.updateOne({ _id: lead._id }, { $set: { notification: 'pending', nextAttempt: new Date(Date.now() + Math.min(3600000, 30000 * 2 ** Math.min(lead.attempts, 7))) } });
    console.warn('Chatbot notification pending retry. Check email configuration/provider health.');
  }
}
function startEmailWorker() {
  const timer = setInterval(() => deliverPending().catch(() => console.warn('Chatbot notification worker unavailable.')), 15000);
  timer.unref();
  return timer;
}
module.exports = { emailContent, deliverPending, startEmailWorker };

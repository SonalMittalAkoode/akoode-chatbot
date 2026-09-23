const sgMail = require("@sendgrid/mail");

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY is not defined in environment variables");
}
if (!process.env.SENDGRID_FROM_EMAIL) {
  throw new Error("SENDGRID_FROM_EMAIL is not defined. Set it to a verified sender (e.g. sourabh@akoode.in) in .env");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ to, subject, html, from, replyTo, bcc, attachments }) => {
  // Allow callers to override the sender per email (e.g. updates@ vs hr@);
  // fall back to the global verified sender when not provided.
  const fromAddress = from || process.env.SENDGRID_FROM_EMAIL;
  if (!fromAddress) {
    throw new Error("SENDGRID_FROM_EMAIL is not set in environment variables");
  }
  const msg = {
    to,
    from: fromAddress,
    subject,
    html,
    ...(replyTo && { replyTo }),
    ...(bcc && bcc.length > 0 && { bcc }),
    ...(attachments && attachments.length > 0 && { attachments }),
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    const status = err?.response?.statusCode;
    const body = err?.response?.body || {};
    const firstMsg = body?.errors?.[0]?.message;
    console.error("SendGrid error:", status, firstMsg || JSON.stringify(body));
    const hint =
      firstMsg ||
      (status === 401
        ? "SendGrid Unauthorized: Check SENDGRID_API_KEY and SENDGRID_FROM_EMAIL verification."
        : err?.message || String(err));
    const e = new Error(hint);
    e.original = err;
    e.details = body;
    throw e;
  }
};

module.exports = { sendMail };
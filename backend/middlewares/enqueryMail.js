// const multer = require("multer");
// const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
var nodemailer = require('nodemailer');
const { sendMail } = require("./sendgrid");
const { getLogoUrl, getPublicLogoUrl } = require("../utils/url.helper");

// ── Sender addresses by purpose ──────────────────────────────────────────────
// Outbound "updates" (blog posts, new job postings, newsletter subscription).
const FROM_UPDATES = (process.env.MAIL_FROM_UPDATES || process.env.SENDGRID_FROM_EMAIL || "").trim();
// HR-related mail (job application notifications + career/contact form submissions).
const FROM_HR = (process.env.MAIL_FROM_HR || process.env.SENDGRID_FROM_EMAIL || "").trim();

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    // host: process.env.SMTP_HOST,
    // port: Number(process.env.SMTP_PORT) || 587,
    // secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

const enqueryPropertyMail = async (req, res) => {
  const { firstName, lastName, email, phone, budget, message, propertyname, buildername, builderemail } = req.body;

  try {
    // 1. Create transporter
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail', // or use host, port for custom SMTP
    //   auth: {
    //     user: 'devakoode@gmail.com',
    //     pass: '<SMTP_PASSWORD>',
    //   },
    // });
    // const transporter = nodemailer.createTransport({
    //       service: 'gmail',
    //       auth: {
    //         user: process.env.SMTP_EMAIL,
    //         pass: process.env.SMTP_PASSWORD,
    //       },
    //     });
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,            // use SSL
    //   auth: {
    //     user: process.env.SMTP_EMAIL,
    //     pass: process.env.SMTP_PASSWORD,
    //   },
    //   logger: true,            // log to console
    //   debug: true,             // include SMTP traffic in logs
    // });
    const transporter = createTransporter();
    let messagehtml = `<head>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<style>
    *{ margin: 0; padding: 0;}
   
.coin-bal-table th, .coin-bal-table td{
    text-align: left;
    font-size: 14px;
    padding: 10px;
}
</style>
</head>
<body>
    <table width="100%" bgcolor="#fefefe" align="center" style=" background: #fefefe; width: 100%; text-align: center; font-size: 10pt; font-family: Arial, Helvetica, sans-serif;" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table width="1000" cellspacing="10" cellpaddig="0" style="border: 1px solid #eee">
                   <tr>
                    <td colspan="3" height="20">&nbsp;</td>
                   </tr>
                    <tr>
                        <td width="25%" style="width: 250px;">
                            &nbsp;
                        </td>
                        <td width="50%" style="width: 80px;" align="center">
                            <a href="${process.env.SITE_URL}" target="_blank">
                                <img src="${process.env.SITE_URL}/images/logo.svg" alt="Akoode Technologies" style="max-width: 100%;height: auto;display: block;">
                            </a>
                        </td>
                        <td width="25%" style="width: 250px;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table width="1000" cellspacing="10" cellpaddig="0" style="background: #000000; height: 60px;border: 1px solid #eee">
                    <tr>
                        <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
                            &nbsp;
                        </td>
                        <td align="right" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td height="25">&nbsp;</td>
        </tr>
        
        <tr>
            <td align="center">
                <table width="1000" cellspacing="15" cellpaddig="0">
                    <tr>
                        <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 20px; font-weight: 700;">
                            Dear Akoode Technologies
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center">
                            <table width="100%" cellspacing="0" cellpadding="2" border="1" style="border-color: #ccc;" class="coin-bal-table">
                                <tr>
                                    <th>Name</th>
                                    <td>${firstName} ${lastName}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>${email}</td>
                                </tr>
<tr>
                                    <th>Phone</th>
                                    <td>${phone}</td>
                                </tr>
<tr>
                                    <th>Budget</th>
                                    <td>${budget}</td>
                                </tr>
                                <tr>
                                    <th>Property Name</th>
                                    <td>${propertyname}</td>
                                </tr>
                                 <tr>
                                    <th>Saller Name</th>
                                    <td>${buildername}</td>
                                </tr>

                                
                                 <tr>
                                    <th>Message</th>
                                    <td>${message}
                                    </td>
                                </tr>
                               

                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="15">&nbsp;</td>
                    </tr>
                   
                    
                   
                    <tr>
                        <td height="15">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 28px; font-weight: 700;">
                         Buying a property is more than a transaction
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`
    // 2. Setup email data
    // const mailOptions = {
    //   from: `"${firstName} ${lastName}" <${email}>`,
    //   to: 'eati@akoode.in', // Your business or support email
    //   subject: 'New Enquiry Form Submission',
    //   html: `
    //     <h3>New Enquiry</h3>
    //     <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // };
    const mailOptions = {
      from: `"${firstName} ${lastName}" <${email}>`,
      to: 'eati@akoode.in', // Your business or support email
      subject: 'New Enquiry Form property',
      html: `${messagehtml}`,
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);
    console.log('Enquiry sent successfully!')

    res.status(200).json({ success: true, message: 'Enquiry sent successfully!' });
  } catch (error) {
    console.error('Error sending enquiry email:', error);
    res.status(500).json({ success: false, message: 'Failed to send enquiry.' });
  }

};
const enqueryPropertyMailSeller = async (req, res) => {
  const { firstName, lastName, email, phone, budget, message, propertyname, buildername, builderemail } = req.body;

  try {
    // 1. Create transporter
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail', // or use host, port for custom SMTP
    //   auth: {
    //     user: 'devakoode@gmail.com',
    //     pass: '<SMTP_PASSWORD>',
    //   },
    // });
    const transporter = createTransporter();

    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,            // use SSL
    //   auth: {
    //     user: process.env.SMTP_EMAIL,
    //     pass: process.env.SMTP_PASSWORD,
    //   },
    //   logger: true,            // log to console
    //   debug: true,             // include SMTP traffic in logs
    // });
    let messagehtml = `<head>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<style>
    *{ margin: 0; padding: 0;}
   
.coin-bal-table th, .coin-bal-table td{
    text-align: left;
    font-size: 14px;
    padding: 10px;
}
</style>
</head>
<body>
    <table width="100%" bgcolor="#fefefe" align="center" style=" background: #fefefe; width: 100%; text-align: center; font-size: 10pt; font-family: Arial, Helvetica, sans-serif;" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table width="1000" cellspacing="10" cellpaddig="0" style="border: 1px solid #eee">
                   <tr>
                    <td colspan="3" height="20">&nbsp;</td>
                   </tr>
                    <tr>
                        <td width="25%" style="width: 250px;">
                            &nbsp;
                        </td>
                        <td width="50%" style="width: 80px;" align="center">
                            <a href="${process.env.SITE_URL}" target="_blank">
                                <img src="${process.env.SITE_URL}/images/logo.svg" alt="Akoode Technologies" style="max-width: 100%;height: auto;display: block;">
                            </a>
                        </td>
                        <td width="25%" style="width: 250px;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table width="1000" cellspacing="10" cellpaddig="0" style="background: #000000; height: 60px;border: 1px solid #eee">
                    <tr>
                        <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
                            &nbsp;
                        </td>
                        <td align="right" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td height="25">&nbsp;</td>
        </tr>
        
        <tr>
            <td align="center">
                <table width="1000" cellspacing="15" cellpaddig="0">
                    <tr>
                        <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 20px; font-weight: 700;">
                            Dear ${buildername}
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center">
                            <table width="100%" cellspacing="0" cellpadding="2" border="1" style="border-color: #ccc;" class="coin-bal-table">
                                <tr>
                                    <th>Name</th>
                                    <td>${firstName} ${lastName}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>${email}</td>
                                </tr>
<tr>
                                    <th>Phone</th>
                                    <td>${phone}</td>
                                </tr>
<tr>
                                    <th>Budget</th>
                                    <td>${budget}</td>
                                </tr>
                                <tr>
                                    <th>Property Name</th>
                                    <td>${propertyname}</td>
                                </tr>

                                
                                 <tr>
                                    <th>Message</th>
                                    <td>${message}
                                    </td>
                                </tr>
                               

                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="15">&nbsp;</td>
                    </tr>
                   
                    
                   
                    <tr>
                        <td height="15">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 28px; font-weight: 700;">
                         Buying a property is more than a transaction
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`
    // 2. Setup email data
    // const mailOptions = {
    //   from: `"${firstName} ${lastName}" <${email}>`,
    //   to: 'eati@akoode.in', // Your business or support email
    //   subject: 'New Enquiry Form Submission',
    //   html: `
    //     <h3>New Enquiry</h3>
    //     <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // };
    const mailOptions = {
      from: `"${firstName} ${lastName}" <${email}>`,
      to: `${builderemail}`, // Your business or support email
      // to: `eati@akoode.in`, // Your business or support email
      subject: 'New Enquiry Form akoode INFRAVENTURES property',
      html: `${messagehtml}`,
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);
    console.log('Enquiry sent successfully!')

    res.status(200).json({ success: true, message: 'Enquiry sent successfully!' });
  } catch (error) {
    console.error('Error sending enquiry email:', error);
    res.status(500).json({ success: false, message: 'Failed to send enquiry.' });
  }

};
// const enqueryContactMail = async (req, res) => {
//   console.log("📧 Enquiry mail triggered");

//   const { firstName , lastName, email, phone, message, serviceType } = req.body;
//   console.log("Received Enquiry:", { firstName , lastName, email, phone, message, serviceType });

//   try {
//     // 1. Setup transporter
//     // const transporter = nodemailer.createTransport({
//     //   service: 'gmail',
//     //   auth: {
//     //     user: process.env.SMTP_EMAIL,
//     //     pass: process.env.SMTP_PASSWORD,
//     //   },
//     // });
//     const transporter = createTransporter();

//     // 2. Prepare email content
//     // const mailOptions = {
//     //   from: `"${firstName} ${lastName}" <${email}>`,
//     //   to: 'eati@akoode.in',
//     //   subject: 'New Enquiry Form Submission',
//     //   html: `
//     //     <h3>New Enquiry</h3>
//     //     <p><strong>Name:</strong> ${firstName} ${lastName}</p>
//     //     <p><strong>Email:</strong> ${email}</p>
//     //     <p><strong>Phone:</strong> ${phone}</p>
//     //     <p><strong>Meeting Date:</strong> ${date}</p>
//     //     <p><strong>Message:</strong></p>
//     //     <p>${message}</p>
//     //   `,
//     // };

//     let messagehtml =`<head>
// <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
// <style>
//     *{ margin: 0; padding: 0;}

// .coin-bal-table th, .coin-bal-table td{
//     text-align: left;
//     font-size: 14px;
//     padding: 10px;
// }
// </style>
// </head>
// <body>
//     <table width="100%" bgcolor="#fefefe" align="center" style=" background: #fefefe; width: 100%; text-align: center; font-size: 10pt; font-family: Arial, Helvetica, sans-serif;" cellpadding="0" cellspacing="0">
//         <tr>
//             <td align="center">
//                 <table width="1000" cellspacing="10" cellpaddig="0" style="border: 1px solid #eee">
//                    <tr>
//                     <td colspan="3" height="20">&nbsp;</td>
//                    </tr>
//                     <tr>
//                         <td width="25%" style="width: 250px;">
//                             &nbsp;
//                         </td>
//                         <td width="50%" style="width: 80px;" align="center">
//                             <a href="${process.env.SITE_URL}" target="_blank">
//                                 <img src="${process.env.SITE_URL}/images/logo.svg" alt="Akoode Technologies" style="max-width: 100%;height: auto;display: block;">
//                             </a>
//                         </td>
//                         <td width="25%" style="width: 250px;">
//                             &nbsp;
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//         <tr>
//             <td align="center">
//                 <table width="1000" cellspacing="10" cellpaddig="0" style="background: #000000; height: 60px;border: 1px solid #eee">
//                     <tr>
//                         <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
//                             &nbsp;
//                         </td>
//                         <td align="right" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
//                             &nbsp;
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//         <tr>
//             <td height="25">&nbsp;</td>
//         </tr>

//         <tr>
//             <td align="center">
//                 <table width="1000" cellspacing="15" cellpaddig="0">
//                     <tr>
//                         <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 20px; font-weight: 700;">
//                             Dear Akoode Technologies
//                         </td>
//                     </tr>

//                     <tr>
//                         <td align="center">
//                             <table width="100%" cellspacing="0" cellpadding="2" border="1" style="border-color: #ccc;" class="coin-bal-table">
//                                 <tr>
//                                     <th>Name</th>
//                                     <td>${firstName} ${lastName}
//                                     </td>
//                                 </tr>
//                                 <tr>
//                                     <th>Email</th>
//                                     <td>${email}</td>
//                                 </tr>
// <tr>
//                                     <th>Phone</th>
//                                     <td>${phone}</td>
//                                 </tr>
// <tr>
//                                     <th>Service Type</th>
//                                     <td>${serviceType}</td>
//                                 </tr>


//                                  <tr>
//                                     <th>Message</th>
//                                     <td>${message}
//                                     </td>
//                                 </tr>


//                             </table>
//                         </td>
//                     </tr>
//                     <tr>
//                         <td height="15">&nbsp;</td>
//                     </tr>



//                     <tr>
//                         <td height="15">&nbsp;</td>
//                     </tr>
//                     <tr>
//                         <td align="center" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 28px; font-weight: 700;">
//                          Thank you for reaching out to Akoode Technologies
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//     </table>
// </body>`

//     const mailOptions = {
//       from: `"${firstName} ${lastName}" <${email}>`,
//       to: 'info@akoode.com',
//       subject: 'New Enquiry Form Submission',
//       html: `${messagehtml}`,
//     };
//     // 3. Send email - don't send HTTP response, just return result
//     await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent successfully");
//     return { success: true, message: 'Email sent successfully' };

//   } catch (error) {
//     console.error("❌ Error sending email:", error);
//     // Don't throw - let controller handle the response
//     return { success: false, message: 'Failed to send email', error: error.message };
//   }
// };

const enqueryContactMail = async (req) => {
  const body = req?.body || {};
  const { fullName, email, phone, message, service, budget } = body;

  const name = (fullName && String(fullName).trim()) || "N/A";
  const userEmail = (email && String(email).trim()) || "";
  const selectedService = (service && String(service).trim()) || "N/A";
  const selectedBudget = (budget && String(budget).trim()) || "N/A";
  const userMessage = (message && String(message).trim()) || "-";

  try {
    const logoUrl = getPublicLogoUrl() || getLogoUrl(req) || "";

    const adminTo = (process.env.ADMIN_NOTIFICATION_EMAIL || process.env.HR_NOTIFICATION_EMAIL || "").trim();
    if (!adminTo) {
      throw new Error("ADMIN_NOTIFICATION_EMAIL or HR_NOTIFICATION_EMAIL is missing");
    }

    /* ================= ADMIN EMAIL ================= */

    const adminHtml = `
      <body style="font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <h2>New Enquiry Received from Contact Form</h2>
            </td>
          </tr>

          <tr>
            <td align="center">
              <table width="600" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <th align="left">Name</th>
                  <td>${name}</td>
                </tr>
                <tr>
                  <th align="left">Email</th>
                  <td>${userEmail || "-"}</td>
                </tr>
                <tr>
                  <th align="left">Phone</th>
                  <td>${phone || "-"}</td>
                </tr>
                <tr>
                  <th align="left">Service Interested In</th>
                  <td>${selectedService}</td>
                </tr>
                <tr>
                  <th align="left">Budget</th>
                  <td>${selectedBudget}</td>
                </tr>
                <tr>
                  <th align="left">Message</th>
                  <td>${userMessage}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px;color:#555;">
              Submitted via 
              <a href="${process.env.SITE_URL}" target="_blank">
                ${process.env.SITE_URL}
              </a>
            </td>
          </tr>
        </table>
      </body>
    `;

    await sendMail({
      to: adminTo,
      subject: "New Enquiry Form Submission from Contact Form/Post Requirement.",
      html: adminHtml,
      ...(userEmail ? { replyTo: userEmail } : {}),
    });

    /* ================= USER CONFIRMATION EMAIL ================= */
    if (!userEmail) {
      console.warn("Enquiry: skipping user confirmation (no email provided)");
      return { success: true };
    }

    const userHtml = `
      <body style="font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <img 
                src="${logoUrl}" 
                alt="Akoode Technologies" 
                style="max-width:160px;margin:24px 0;" 
              />
            </td>
          </tr>

          <tr>
            <td align="center">
              <h2>Hi ${name},</h2>
            </td>
          </tr>

          <tr>
            <td align="center" style="max-width:600px;margin:auto;color:#444;">
              <p>
                Thank you for contacting Akoode Technologies.
              </p>
              <p>
                We’ve received your enquiry regarding 
                <strong>${selectedService}</strong>. Our team will review
                your request and get back to you shortly.
              </p>
              <p>
                We appreciate your interest and look forward to assisting you.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:24px;color:#777;">
              Warm regards,<br/>
              <strong>Team Akoode Technologies</strong>
            </td>
          </tr>
        </table>
      </body>
    `;

    await sendMail({
      to: userEmail,
      subject: "We’ve received your enquiry – Akoode Technologies",
      html: userHtml,
    });

    console.log("Enquiry emails sent (admin + user)");
    return { success: true };

  } catch (error) {
    console.error("Enquiry mail error:", error?.message || error);
    return { success: false, error: error?.message || String(error) };
  }
};

const jobApplicationMail = async (req) => {
  console.log("Job Application mail triggered");

  const { name, email, phone, message, jobTitle } = req.body;
  const job = jobTitle || "N/A";

  const logoUrl = getPublicLogoUrl() || getLogoUrl(req) || "";

  try {

    //   ADMIN EMAIL (HR)

    const adminHtml = `
      <body style="font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center"><h2>New Job Application</h2></td>
          </tr>

          <tr>
            <td align="center">
              <table width="600" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
                <tr><th align="left">Name</th><td>${name}</td></tr>
                <tr><th align="left">Email</th><td>${email}</td></tr>
                <tr><th align="left">Phone</th><td>${phone}</td></tr>
                <tr><th align="left">Applied For</th><td>${job}</td></tr>
                <tr><th align="left">Message</th><td>${message || "-"}</td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px;color:#555;">
              Submitted via <a href="${process.env.SITE_URL}" target="_blank">${process.env.SITE_URL}</a>
            </td>
          </tr>
        </table>
      </body>
    `;

    // Attach resume to HR email when present (job application form)
    let jobAdminAttachments = [];
    if (req.file && req.file.path) {
      try {
        const absolutePath = path.isAbsolute(req.file.path) ? req.file.path : path.join(process.cwd(), req.file.path);
        if (fs.existsSync(absolutePath)) {
          const buffer = fs.readFileSync(absolutePath);
          const base64 = buffer.toString("base64");
          const ext = path.extname(req.file.originalname || req.file.path).toLowerCase();
          const mimeMap = { ".pdf": "application/pdf", ".doc": "application/msword", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
          const contentType = req.file.mimetype || mimeMap[ext] || "application/octet-stream";
          const filename = req.file.originalname || `resume${ext}` || "resume.pdf";
          jobAdminAttachments.push({ content: base64, filename, type: contentType, disposition: "attachment" });
        }
      } catch (attachErr) {
        console.warn("Could not attach resume to job application HR email:", attachErr?.message || attachErr);
      }
    }

    const adminToJob = (process.env.HR_NOTIFICATION_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || "").trim();
    if (!adminToJob) throw new Error("HR_NOTIFICATION_EMAIL or ADMIN_NOTIFICATION_EMAIL is missing");
    await sendMail({
      to: adminToJob,
      from: FROM_HR,
      subject: "Job Application – Thank You Email",
      html: adminHtml,
      replyTo: email,
      ...(jobAdminAttachments.length > 0 && { attachments: jobAdminAttachments }),
    });

    //   USER CONFIRMATION EMAIL

    const userHtml = `
      <body style="font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <img src="${logoUrl}" alt="Akoode Technologies" style="max-width:160px;margin:24px 0;" />
            </td>
          </tr>

          <tr>
            <td align="center">
              <h2>Hi ${name}, </h2>
            </td>
          </tr>

          <tr>
            <td align="center" style="max-width:600px;margin:auto;color:#444;">
            <p>Thank you for applying to Akoode Technologies
            </p>
              <p>We’ve received your application and appreciate your interest in being part of our team. Our hiring team will review your profile, and if there’s a potential fit, we’ll be in touch with you soon.
              </p>
              <p>

We respect the time and effort it takes to apply and wish you the very best in your professional journey.

              </p>


              
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:24px;color:#777;">
              Sincerely,<br/>
              <strong>Team Akoode Technologies</strong>
            </td>
          </tr>
        </table>
      </body>
    `;

    await sendMail({
      to: email,
      from: FROM_HR,
      subject: "Your job application has been received – Akoode Technologies",
      html: userHtml,
    });

    console.log("Admin + User emails sent");
    return { success: true };
  } catch (error) {
    console.error("SendGrid Error:", error);
    return { success: false, error: error.message };
  }
};


const generalEnquiryMail = async (req) => {
  const body = req?.body || {};
  const {
    fullName,
    email,
    phone,
    message,
    jobTitle,
    noticePeriod,
    currentCTC,
  } = body;

  const name = (fullName && String(fullName).trim()) || "N/A";
  const job = (jobTitle && String(jobTitle).trim()) || "N/A";
  const userEmail = (email && String(email).trim()) || "";

  console.log("Received General Enquiry:", {
    name,
    email: userEmail || "(missing)",
    phone,
    job,
    noticePeriod,
    currentCTC,
  });

  try {
    const logoUrl = getPublicLogoUrl() || getLogoUrl(req) || "";

    const adminTo = (process.env.HR_NOTIFICATION_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || "").trim();
    if (!adminTo) {
      throw new Error("HR_NOTIFICATION_EMAIL or ADMIN_NOTIFICATION_EMAIL is missing");
    }

    //    ADMIN EMAIL (HR – resume / career form)

    const adminHtml = `
      <body style="font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <h2>General Enquiry Submission from career form</h2>
            </td>
          </tr>

          <tr>
            <td align="center">
              <table width="700" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
                <tr><th align="left">Name</th><td>${name}</td></tr>
                <tr><th align="left">Email</th><td>${userEmail || "-"}</td></tr>
                <tr><th align="left">Phone</th><td>${phone || "-"}</td></tr>
                <tr><th align="left">Applied For</th><td>${job}</td></tr>
                <tr><th align="left">Notice Period</th><td>${noticePeriod || "-"}</td></tr>
                <tr><th align="left">Current CTC</th><td>${currentCTC || "-"}</td></tr>
                <tr><th align="left">Message</th><td>${message || "-"}</td></tr>
              </table>
            </td>
          </tr>

          <!-- <tr>
            <td align="center" style="padding:24px;color:#555;">
              Submitted via <a href="${process.env.SITE_URL}" target="_blank">${process.env.SITE_URL}</a>
            </td>
          </tr> -->
          <tr>
            <td align="center" style="padding:20px;">
              <a href="${process.env.SITE_URL}" target="_blank">${process.env.SITE_URL}</a>
                <img src="${logoUrl}" alt="Akoode Technologies" style="max-width:180px;" />
              </a>
            </td>
          </tr>
        </table>
      </body>
    `;

    // Attach resume file to HR email when present (Submit Resume form)
    let adminAttachments = [];
    if (req.file && req.file.path) {
      try {
        const absolutePath = path.isAbsolute(req.file.path) ? req.file.path : path.join(process.cwd(), req.file.path);
        if (fs.existsSync(absolutePath)) {
          const buffer = fs.readFileSync(absolutePath);
          const base64 = buffer.toString("base64");
          const ext = path.extname(req.file.originalname || req.file.path).toLowerCase();
          const mimeMap = { ".pdf": "application/pdf", ".doc": "application/msword", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
          const contentType = req.file.mimetype || mimeMap[ext] || "application/octet-stream";
          const filename = req.file.originalname || `resume${ext}` || "resume.pdf";
          adminAttachments.push({
            content: base64,
            filename,
            type: contentType,
            disposition: "attachment",
          });
        }
      } catch (attachErr) {
        console.warn("Could not attach resume to HR email:", attachErr?.message || attachErr);
      }
    }

    await sendMail({
      to: adminTo,
      from: FROM_HR,
      subject: "General Enquiry Form Submission",
      html: adminHtml,
      ...(userEmail ? { replyTo: userEmail } : {}),
      ...(adminAttachments.length > 0 && { attachments: adminAttachments }),
    });

    //    USER CONFIRMATION EMAIL (only if we have a valid user email)
    if (!userEmail) {
      console.warn("General enquiry: skipping user confirmation email (no email provided)");
      return { success: true };
    }

    const userHtml = `
      <body style="font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:24px;">
              <img src="${logoUrl}" alt="Akoode Technologies" style="max-width:160px;" />
            </td>
          </tr>

          <tr>
            <td align="center">
              <h2>Thank you for submitting your profile, ${name}</h2>
            </td>
          </tr>

          <tr>
            <td align="center" style="max-width:600px;margin:auto;color:#444;">
              <p>
                We appreciate your interest in Akoode Technologies.
              </p>

              <p>
                We will be in touch if a suitable opportunity becomes available that matches your experience.
              </p>

              <p>
                Meanwhile, feel free to explore more about us:
                <br/>
                <a href="${process.env.SITE_URL}" target="_blank">${process.env.SITE_URL}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:24px;color:#777;">
              Warm regards,<br/>
              <strong>Akoode Technologies</strong>
            </td>
          </tr>
        </table>
      </body>
    `;

    await sendMail({
      to: userEmail,
      from: FROM_HR,
      subject: "We’ve received your enquiry – Akoode Technologies",
      html: userHtml,
    });

    console.log("General enquiry emails sent (HR + User)");
    return { success: true };
  } catch (error) {
    console.error("General enquiry SendGrid Error:", error?.message || error);
    return { success: false, error: error?.message || String(error) };
  }
};


const enqueryBrochureMail = async (req, res) => {

  const { firstName, lastName, phone, propertyname } = req.body;

  try {
    // 1. Setup transporter
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.SMTP_EMAIL,
    //     pass: process.env.SMTP_PASSWORD,
    //   },
    // });
    const transporter = createTransporter();
    // let transporter = nodemailer.createTransport({
    //     host: "smtp.mailgun.org",
    //     port: 2525,
    //     secure: false, // TLS will be used automatically
    //     auth: {
    //       user: "smtp@akoodeinfraventures.com",
    //       pass: "DXK!s+c",
    //     }
    //   });

    // 2. Prepare email content
    // const mailOptions = {
    //   from: `"${firstName} ${lastName}" <${email}>`,
    //   to: 'eati@akoode.in',
    //   subject: 'New Enquiry Form Submission',
    //   html: `
    //     <h3>New Enquiry</h3>
    //     <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone}</p>
    //     <p><strong>Meeting Date:</strong> ${date}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // };

    let messagehtml = `<head>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<style>
    *{ margin: 0; padding: 0;}
   
.coin-bal-table th, .coin-bal-table td{
    text-align: left;
    font-size: 14px;
    padding: 10px;
}
</style>
</head>
<body>
    <table width="100%" bgcolor="#fefefe" align="center" style=" background: #fefefe; width: 100%; text-align: center; font-size: 10pt; font-family: Arial, Helvetica, sans-serif;" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table width="1000" cellspacing="10" cellpaddig="0" style="border: 1px solid #eee">
                   <tr>
                    <td colspan="3" height="20">&nbsp;</td>
                   </tr>
                    <tr>
                        <td width="25%" style="width: 250px;">
                            &nbsp;
                        </td>
                        <td width="50%" style="width: 80px;" align="center">
                            <a href="${process.env.SITE_URL}" target="_blank">
                                <img src="${process.env.SITE_URL}/images/logo.svg" alt="Akoode Technologies" style="max-width: 100%;height: auto;display: block;">
                            </a>
                        </td>
                        <td width="25%" style="width: 250px;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table width="1000" cellspacing="10" cellpaddig="0" style="background: #000000; height: 60px;border: 1px solid #eee">
                    <tr>
                        <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
                            &nbsp;
                        </td>
                        <td align="right" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td height="25">&nbsp;</td>
        </tr>
        
        <tr>
            <td align="center">
                <table width="1000" cellspacing="15" cellpaddig="0">
                    <tr>
                        <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 20px; font-weight: 700;">
                            Dear Akoode Technologies
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center">
                            <table width="100%" cellspacing="0" cellpadding="2" border="1" style="border-color: #ccc;" class="coin-bal-table">
                                <tr>
                                    <th>Name</th>
                                    <td>${firstName} ${lastName}
                                    </td>
                                </tr>
                               
<tr>
                                    <th>Phone</th>
                                    <td>${phone}</td>
                                </tr>
<tr>
                                    <th>Property</th>
                                    <td>${propertyname}</td>
                                </tr>

                               

                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="15">&nbsp;</td>
                    </tr>
                   
                    
                   
                    <tr>
                        <td height="15">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 28px; font-weight: 700;">
                         Buying a property is more than a transaction
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`

    const mailOptions = {
      from: `"${firstName} ${lastName}" <${email}>`,
      to: 'eati@akoode.in',
      subject: 'New Enquiry Form Submission',
      html: `${messagehtml}`,
    };
    // 3. Send email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Enquiry sent successfully!' });

  } catch (error) {
    console.error("❌ Error sending email:", error);
    return res.status(500).json({ success: false, message: 'Failed to send enquiry. Please try again later.' });
  }
};


const enquerySubscribeMail = async (req) => {

  const email = String(req.body.email || "").toLowerCase().trim();

  try {
    const transporter = createTransporter();

    let messagehtml = `<head>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<style>
    *{ margin: 0; padding: 0;}
   
.coin-bal-table th, .coin-bal-table td{
    text-align: left;
    font-size: 14px;
    padding: 10px;
}
</style>
</head>
<body>
    <table width="100%" bgcolor="#fefefe" align="center" style=" background: #fefefe; width: 100%; text-align: center; font-size: 10pt; font-family: Arial, Helvetica, sans-serif;" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table width="1000" cellspacing="10" cellpaddig="0" style="border: 1px solid #eee">
                   <tr>
                    <td colspan="3" height="20">&nbsp;</td>
                   </tr>
                    <tr>
                        <td width="25%" style="width: 250px;">
                            &nbsp;
                        </td>
                        <td width="50%" style="width: 80px;" align="center">
                            <a href="${process.env.SITE_URL}" target="_blank">
                                <img src="${process.env.SITE_URL}/images/logo.svg" alt="Akoode Technologies" style="max-width: 100%;height: auto;display: block;">
                            </a>
                        </td>
                        <td width="25%" style="width: 250px;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table width="1000" cellspacing="10" cellpaddig="0" style="background: #000000; height: 60px;border: 1px solid #eee">
                    <tr>
                        <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
                            &nbsp;
                        </td>
                        <td align="right" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td height="25">&nbsp;</td>
        </tr>
        
        <tr>
            <td align="center">
                <table width="1000" cellspacing="15" cellpaddig="0">
                    <tr>
                        <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 20px; font-weight: 700;">
                            Dear Akoode Technologies
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center">
                            <table width="100%" cellspacing="0" cellpadding="2" border="1" style="border-color: #ccc;" class="coin-bal-table">
                               
                               
<tr>
                                    <th>Email</th>
                                    <td>${email}</td>
                                </tr>

                               

                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="15">&nbsp;</td>
                    </tr>
                   
                    
                   
                    <tr>
                        <td height="15">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 28px; font-weight: 700;">
                         Buying a property is more than a transaction
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`

    const mailOptions = {
      from: `akoode <${email}>`,
      to: 'eati@akoode.in',
      subject: 'New Enquiry Form subscribe',
      html: `${messagehtml}`,
    };
    // 3. Send email
    await transporter.sendMail(mailOptions);
    return { success: true };

  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
};
const enqueryLandingMail = async (req, res) => {

  const { firstName, lastName, phone, pagename } = req.body;

  try {
    // 1. Setup transporter
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.SMTP_EMAIL,
    //     pass: process.env.SMTP_PASSWORD,
    //   },
    // });
    const transporter = createTransporter();

    let messagehtml = `<head>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<style>
    *{ margin: 0; padding: 0;}
   
.coin-bal-table th, .coin-bal-table td{
    text-align: left;
    font-size: 14px;
    padding: 10px;
}
</style>
</head>
<body>
    <table width="100%" bgcolor="#fefefe" align="center" style=" background: #fefefe; width: 100%; text-align: center; font-size: 10pt; font-family: Arial, Helvetica, sans-serif;" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table width="1000" cellspacing="10" cellpaddig="0" style="border: 1px solid #eee">
                   <tr>
                    <td colspan="3" height="20">&nbsp;</td>
                   </tr>
                    <tr>
                        <td width="25%" style="width: 250px;">
                            &nbsp;
                        </td>
                        <td width="50%" style="width: 80px;" align="center">
                            <a href="${process.env.SITE_URL}" target="_blank">
                                <img src="${process.env.SITE_URL}/images/logo.svg" alt="Akoode Technologies" style="max-width: 100%;height: auto;display: block;">
                            </a>
                        </td>
                        <td width="25%" style="width: 250px;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table width="1000" cellspacing="10" cellpaddig="0" style="background: #000000; height: 60px;border: 1px solid #eee">
                    <tr>
                        <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
                            &nbsp;
                        </td>
                        <td align="right" style=" text-transform: uppercase; font-family:verdana; color: #fff; font-size: 15px; font-weight: 500;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td height="25">&nbsp;</td>
        </tr>
        
        <tr>
            <td align="center">
                <table width="1000" cellspacing="15" cellpaddig="0">
                    <tr>
                        <td align="left" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 20px; font-weight: 700;">
                            Dear Akoode Technologies
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center">
                            <table width="100%" cellspacing="0" cellpadding="2" border="1" style="border-color: #ccc;" class="coin-bal-table">
                                <tr>
                                    <th>Name</th>
                                    <td>${firstName} ${lastName}
                                    </td>
                                </tr>
                               
<tr>
                                    <th>Phone</th>
                                    <td>${phone}</td>
                                </tr>
<tr>
                                    <th>Page</th>
                                    <td>${pagename}</td>
                                </tr>

                               

                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="15">&nbsp;</td>
                    </tr>
                   
                    
                   
                    <tr>
                        <td height="15">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" style=" text-transform: uppercase; font-family:verdana; color: #5b5b5b; font-size: 28px; font-weight: 700;">
                         Buying a property is more than a transaction
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`

    const mailOptions = {
      from: `"${firstName} ${lastName}" <${email}>`,
      to: 'eati@akoode.in',
      subject: 'New Enquiry Form Submission',
      html: `${messagehtml}`,
    };
    // 3. Send email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Enquiry sent successfully!' });

  } catch (error) {
    console.error("❌ Error sending email:", error);
    return res.status(500).json({ success: false, message: 'Failed to send enquiry. Please try again later.' });
  }
};
const enqueryWelcomeSubscriberMail = async (req) => {
  const email = String(req.body.email || "").toLowerCase().trim();

  if (!email) {
    return { success: false, error: "Email is required" };
  }

  const logoUrl = getPublicLogoUrl() || getLogoUrl(req) || "";

  try {
    const subject = "Welcome to the Akoode Newsletter";
    const userHtml = `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">

    <p>Hello,</p>

    <p>
      Thank you for subscribing to <strong>Akoode’s newsletter</strong>.
    </p>

    <p>
      You’re now part of our update list, where we share thoughtful insights on
      <strong>AI, digital innovation</strong>, and how intelligent systems can create
      real business value.
    </p>

    <p>
      We keep it purposeful, relevant, and worth your time.
    </p>

    <p>
      You’ll hear from us soon.
    </p>

    <p style="margin-top: 32px;">
      Warm regards,<br />
      <strong>Team Akoode Technologies</strong>
    </p>

    <p style="margin-top: 16px;">
      <a href="${process.env.SITE_URL}" target="_blank">${process.env.SITE_URL}</a>
    </p>

  </div>
`;
    await sendMail({
      to: email,
      from: FROM_UPDATES,
      subject: "Welcome to the Akoode Newsletter",
      html: userHtml,
    });

    console.log("Welcome subscriber email sent:", email);

    return { success: true };
  } catch (error) {
    console.error("SendGrid Welcome Mail Error:", error);
    return { success: false, error: error.message };
  }
};

const jobNotificationSubscriberMail = async ({ job, subscribers }) => {
  const siteUrl = process.env.SITE_URL || "https://akoode.com";
  const careerUrl = `${siteUrl}/career`;

  if (!job || !subscribers || subscribers.length === 0) {
    return { success: false, error: "Invalid job or subscribers list" };
  }

  try {
    const deadlineStr = job.deadline
      ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : null;

    const buildDetailRow = (icon, label, value) =>
      value
        ? `<tr>
            <td width="36" style="padding:10px 0;vertical-align:middle;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;height:36px;background:#eeeef8;border-radius:8px;text-align:center;vertical-align:middle;font-size:17px;">
                    ${icon}
                  </td>
                </tr>
              </table>
            </td>
            <td style="padding:10px 0 10px 14px;vertical-align:middle;border-bottom:1px solid #f0f0f8;">
              <span style="display:block;font-size:11px;font-weight:700;color:#9898b8;text-transform:uppercase;letter-spacing:0.8px;font-family:Arial,sans-serif;">${label}</span>
              <span style="display:block;font-size:15px;font-weight:600;color:#1a1c3a;font-family:Arial,sans-serif;margin-top:2px;">${value}</span>
            </td>
          </tr>`
        : "";

    const detailRows = [
      buildDetailRow("💼", "Job Type", job.tag),
      buildDetailRow("📍", "Location", job.location),
      buildDetailRow("🎯", "Experience", job.experience),
      buildDetailRow("💰", "Salary", job.salary),
      buildDetailRow("📅", "Apply Before", deadlineStr),
    ].filter(Boolean).join("");

    const shortDescHtml = job.shortDescription
      ? `<p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.75;font-family:Arial,sans-serif;border-left:3px solid #474972;padding-left:14px;">${job.shortDescription}</p>`
      : "";

    const jobHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>New Job Opening – Akoode Technologies</title>
</head>
<body style="margin:0;padding:0;background-color:#ECEDF5;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ECEDF5;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- ── LOGO PRE-HEADER ── -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:22px;font-weight:900;color:#1a1c3a;letter-spacing:-0.5px;font-family:Arial,sans-serif;">
                akoode<span style="color:#474972;">°</span>
              </span>
            </td>
          </tr>

          <!-- ── MAIN CARD ── -->
          <tr>
            <td style="background:#1a1c3a;border-radius:16px 16px 0 0;padding:40px 40px 36px;text-align:center;">

              <!-- HIRING TAG -->
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="background:#474972;border-radius:30px;padding:5px 18px;margin-bottom:18px;">
                    <span style="font-size:11px;font-weight:700;color:#c8caff;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">
                      &#9733; &nbsp;We're Hiring&nbsp; &#9733;
                    </span>
                  </td>
                </tr>
              </table>

              <!-- JOB TITLE -->
              <h1 style="margin:20px 0 10px;font-size:32px;font-weight:900;color:#ffffff;line-height:1.25;font-family:Arial,sans-serif;letter-spacing:-0.5px;">
                ${job.title}
              </h1>


            </td>
          </tr>

          <!-- ── ACCENT BAR ── -->
          <tr>
            <td height="5" style="background:#474972;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- ── WHITE BODY ── -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px 32px;">

              <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#1a1c3a;font-family:Arial,sans-serif;">Hello there,</p>
              <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.75;font-family:Arial,sans-serif;">
                We have an exciting new opening and thought you'd want to know about it first.
              </p>

              ${shortDescHtml}

              <!-- JOB DETAILS CARD -->
              ${detailRows ? `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f8fc;border-radius:12px;padding:4px 20px;margin-bottom:32px;">
                <tr><td>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${detailRows}
                  </table>
                </td></tr>
              </table>` : ""}

              <!-- CTA BUTTON — table-based for Outlook compatibility -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="#474972" style="border-radius:10px;padding:0;">
                          <a href="${careerUrl}" target="_blank"
                            style="display:inline-block;background-color:#474972;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 44px;border-radius:10px;font-family:Arial,sans-serif;letter-spacing:0.3px;">
                            View All Open Positions &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#999;line-height:1.7;text-align:center;font-family:Arial,sans-serif;">
                If this role sounds like the right fit, we'd love to hear from you.<br/>
                Feel free to apply or share with someone who might be interested.
              </p>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#13142e;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:15px;font-weight:800;color:#ffffff;font-family:Arial,sans-serif;">
                Akoode Technologies
              </p>
              <p style="margin:0 0 14px;font-size:12px;color:#6668a0;font-family:Arial,sans-serif;letter-spacing:0.5px;">
                Code the Future, Today
              </p>
              <a href="${siteUrl}" target="_blank"
                style="font-size:12px;color:#8888cc;text-decoration:none;font-family:Arial,sans-serif;">
                ${siteUrl}
              </a>
              <p style="margin:18px 0 0;font-size:11px;color:#3d3f6a;font-family:Arial,sans-serif;">
                You're receiving this because you subscribed to the Akoode newsletter.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

    const validSubscribers = subscribers.filter((s) => s && s.email);
    for (const subscriber of validSubscribers) {
      await sendMail({
        to: subscriber.email,
        from: FROM_UPDATES,
        subject: `New Opening at Akoode: ${job.title}`,
        html: jobHtml,
      });
    }

    console.log("Job notification sent via SendGrid to", validSubscribers.length, "subscriber(s):", job.title);

    return { success: true };
  } catch (error) {
    console.error("SendGrid Job Mail Error:", error);
    return { success: false, error: error.message };
  }
};

const blogNotificationSubscriberMail = async ({ blog, subscribers, req }) => {
  const siteUrl = process.env.SITE_URL || "https://akoode.com";
  const blogUrl = `${siteUrl}/blog/${blog.slug}`;

  if (!blog || !subscribers || subscribers.length === 0) {
    return { success: false, error: "Invalid blog or subscribers list" };
  }

  try {
    const subject = `New Blog on Akoode`;

    const blogHtml = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
    
      <p>Hello there,</p>
    
      <p>
        We’ve just published a new piece on our website and thought you might find it valuable.
      </p>
    
      <h2 style="margin-top: 8px;">
        ${blog.title}
      </h2>
    
      <p>
        ${blog.description
        ? blog.description.substring(0, 200) + "…"
        : "This article explores practical insights, emerging trends, and actionable ideas that can help you stay ahead in today’s fast-evolving technology landscape."
      }
      </p>
    
      <p>
        This article explores practical insights, emerging trends, and actionable ideas that can help you stay ahead in today’s fast-evolving technology landscape.
      </p>
    
      <p style="margin-top: 20px;">
        👉 <strong>Read the full article:</strong><br/>
        <a href="${blogUrl}" target="_blank" style="color: #474972; font-weight: bold; text-decoration: none;">
          ${blogUrl}
        </a>
      </p>
    
      <p style="margin-top: 24px;">
        If you enjoy the read, feel free to share it with your team or connect with us for deeper conversations around AI, software development, and digital innovation.
      </p>
    
      <p>
        More insights are coming soon — stay tuned.
      </p>
    
      <p style="margin-top: 30px;">
        Best regards,<br/>
        <strong>Team Akoode Technologies</strong><br/>
        <span style="color:#777;">Code the Future, Today</span>
      </p>
    
    </div>
    `;

    // Send one email per subscriber so each recipient sees only their own address in "To:".
    // Per-recipient try/catch so a single bad/bounced address does not abort the rest.
    const validSubscribers = subscribers.filter((s) => s && s.email);
    let sent = 0;
    let failed = 0;
    for (const subscriber of validSubscribers) {
      try {
        await sendMail({
          to: subscriber.email,
          from: FROM_UPDATES,
          subject: `New on Akoode: ${blog.title}`,
          html: blogHtml,
        });
        sent++;
      } catch (perRecipientErr) {
        failed++;
        console.error("Blog mail failed for", subscriber.email, "-", perRecipientErr?.message || perRecipientErr);
      }
    }

    console.log(`Blog notification: ${sent} sent, ${failed} failed (of ${validSubscribers.length}) for "${blog.title}"`);

    // success = we attempted the whole list (at least one delivered). The caller uses
    // this to flip notifiedSubscribers so the list isn't re-emailed on future edits.
    return { success: sent > 0, sent, failed };
  } catch (error) {
    console.error("SendGrid Blog Mail Error:", error);
    return { success: false, error: error.message };
  }
};


module.exports = {
  enqueryPropertyMail,
  enqueryContactMail,
  jobApplicationMail,
  generalEnquiryMail,
  enqueryPropertyMailSeller,
  enqueryBrochureMail,
  enquerySubscribeMail,
  enqueryLandingMail,
  enqueryWelcomeSubscriberMail,
  blogNotificationSubscriberMail,
  jobNotificationSubscriberMail,
};

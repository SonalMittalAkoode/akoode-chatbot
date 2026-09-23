// controllers/jobApplication.controller.js
const JobApplication = require('../../models/jobApplication');
const { jobApplicationMail } = require('../../middlewares/enqueryMail');

const submitJobApplication = async (req, res) => {
  try {
    // Extract only the fields we need and convert consent to boolean
    const { name, email, phone, message, jobId, jobTitle, consent, linkedin, source, referralName, referralDepartment } = req.body;

    const application = await JobApplication.create({
      name,
      email,
      phone,
      message: message || "",
      jobId,
      resume: req.file?.path,
      linkedin: linkedin || "",
      source: source || "",
      referralName: source === "Employee Referral" ? (referralName || "") : "",
      referralDepartment: source === "Employee Referral" ? (referralDepartment || "") : "",
      consent: consent === "true" || consent === true
    });
    const emailResult = await jobApplicationMail(req, res);
    if (!emailResult.success) {
      console.error("Email sending failed, but enquiry saved:", emailResult.message);
    }
    

    res.status(201).json({
      success: true,
      data: application,
      message: "Application submitted successfully!"
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { submitJobApplication };

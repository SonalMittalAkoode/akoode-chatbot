"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { submitJobApplication } from "@/api/jobApplication";
import { Upload } from "lucide-react";
import { isValidEmail, isValidPhone, normalizeEmail, sanitizePhone } from "@/utils/formValidation";

const JobApplicationModal = () => {
  const formRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("No file chosen");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFileName(file?.name || "No file chosen");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = formRef.current ?? event.currentTarget;
    if (!formElement) return;

    const email = (formElement.querySelector('[name="email"]')?.value || "").trim();
    const phone = (formElement.querySelector('[name="phone"]')?.value || "").trim();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsSubmitting(true);
    toast.dismiss();

    try {
      const formData = new FormData(formElement);
      formData.set("email", normalizeEmail(email));
      formData.set("phone", sanitizePhone(phone));
      const result = await submitJobApplication(formData);

      toast.success(result?.message || "Application submitted successfully!");

      // Reset form
      formElement.reset();
      setSelectedFileName("No file chosen");

      // Redirect to thank you page
      if (router) {
        router.push("/thank-you?type=job-application");
      }
    } catch (error) {
      toast.error(
        error?.message ||
        "Something went wrong when submitting your application."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="jobModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title w-100 text-center mt-2">
              <small className="text-uppercase d-block">Apply for Job:</small>
              <span className="text-primary fw-bold" id="modalJobTitle">
                Selected role
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body p-6 md:p-8">
            <form
              ref={formRef}
              id="contactForm"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="jobTitle" id="appliedJobTitle" />
              <input type="hidden" name="jobId" id="appliedJobId" />

              <div className="mb-4">
                <label className="form-label text-sm font-semibold mb-1 block text-[#1e1e1e]">
                  Your name <span className="text-danger" >*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="form-control" // Bootstrap class retained for base check
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-sm font-semibold mb-1 block text-[#1e1e1e]">
                  Your email address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="form-control"
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-sm font-semibold mb-1 block text-[#1e1e1e]">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{7,15}"
                  minLength={7}
                  maxLength={15}
                  className="form-control"
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-sm font-semibold mb-1 block text-[#1e1e1e]">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>

              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors mb-4 group" id="uploadBox">
                <input
                  type="file"
                  id="resumeInput"
                  name="resume"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                  onChange={handleFileChange}
                />

                <div id="uploadDefault" className="text-center pointer-events-none">
                  <Upload className="mb-2 text-[#474972] group-hover:scale-110 transition-transform" size={32} />
                  <p className="m-0 text-muted text-sm">
                    Please Upload Your CV / Resume
                  </p>
                </div>

                <div id="uploadFileName" className="text-center pointer-events-none mt-2">
                  {selectedFileName !== "No file chosen" && <i className="bi bi-file-earmark-check fs-3 mb-2 text-success block"></i>}
                  <p className="m-0 fw-semibold text-sm text-[#474972]" id="selectedFileText">
                    {selectedFileName}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-sm font-semibold mb-1 block text-[#1e1e1e]">LinkedIn Profile</label>
                <input
                  type="text"
                  name="linkedin"
                  className="form-control"
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-sm font-semibold mb-1 block text-[#1e1e1e]">
                  How did you find out about us?
                </label>
                <select name="source" aria-label="How did you find out about us?" className="form-select">
                  <option value="" disabled>
                    Choose one
                  </option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Company Website">Company Website</option>
                  <option value="Employee Referral">Employee Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input mt-3"
                  type="checkbox"
                  id="consentCheck"
                  name="consent"
                  value="true"
                />
                <label className="form-check-label mt-3" htmlFor="consentCheck">
                  I consent to receiving information about new job offers,
                  events, and trainings.
                </label>
              </div>

              <p>
                If you are unable to submit your details, then please share your
                recently updated resume at <strong>hr@akoode.in</strong>.
              </p>

              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-[#474972] text-white font-semibold rounded-lg hover:bg-[#2a2b44] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;

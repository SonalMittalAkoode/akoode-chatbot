"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { sendJobEnquiry } from "@/api/frontend/enquiry";
import Button from "../../../components/Button";
import { CloudUpload, X, RotateCcw } from "lucide-react";
import { isValidEmail, isValidPhone, normalizeEmail, sanitizePhone } from "@/utils/formValidation";

const generateMathCaptcha = () => {
  if (Math.random() > 0.5) {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return { question: `${a} + ${b}`, answer: a + b };
  }
  const lo = Math.floor(Math.random() * 8) + 1;
  const hi = lo + Math.floor(Math.random() * 8) + 1;
  return { question: `${hi} − ${lo}`, answer: hi - lo };
};

export default function SubmitResumeForm() {
  const router = useRouter();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("No file chosen");
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [captchaInput, setCaptchaInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateMathCaptcha());
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    setCaptcha(generateMathCaptcha());
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName("No file chosen");
    }
    setFieldErrors((e) => ({ ...e, resume: undefined }));
  };

  const handleRemoveFile = (e) => {
    if (e) e.preventDefault();
    setSelectedFileName("No file chosen");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = formRef.current ?? event.currentTarget;
    if (!formElement) {
      return;
    }

    const fullName = (formElement.querySelector('[name="fullName"]')?.value || "").trim();
    const email = (formElement.querySelector('[name="email"]')?.value || "").trim();
    const phone = (formElement.querySelector('[name="phone"]')?.value || "").trim();
    const jobTitle = (formElement.querySelector('[name="jobTitle"]')?.value || "").trim();
    const noticePeriod = formElement.querySelector('[name="noticePeriod"]')?.value;
    const currentCTC = (formElement.querySelector('[name="currentCTC"]')?.value || "").trim();
    const resumeEl = formElement.querySelector('[name="resume"]');
    const hasResume = resumeEl?.files?.length && resumeEl.files[0]?.size > 0;
    const captchaOk = parseInt(captchaInput.trim(), 10) === captcha.answer;

    const errors = {};
    if (!fullName) errors.fullName = "Full name is required.";
    if (!email) errors.email = "Email address is required.";
    if (!isValidEmail(email) && email) errors.email = "Enter a valid email address.";
    if (!phone) errors.phone = "Phone number is required.";
    if (!isValidPhone(phone) && phone) errors.phone = "Enter a valid phone number.";
    if (!hasResume) errors.resume = "Please upload your resume (PDF).";
    if (!jobTitle) errors.jobTitle = "Job title is required.";
    if (noticePeriod === undefined || noticePeriod === null || String(noticePeriod).trim() === "") errors.noticePeriod = "Notice period is required.";
    if (!currentCTC) errors.currentCTC = "Current CTC is required.";
    if (!captchaOk) errors.captcha = "Incorrect answer. Please solve the security check.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please complete all required fields and the captcha.");
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    toast.dismiss();
    console.log("Submitting form...");

    try {
      const formData = new FormData(formElement);
      formData.set("email", normalizeEmail(email));
      formData.set("phone", sanitizePhone(phone));
      const result = await sendJobEnquiry(formData);
      console.log("Submission result:", result);

      if (result.success) {
        const successMessage =
          result.message || "Thank you! Your resume has been submitted.";

        toast.success(successMessage);
        setStatus({
          type: "success",
          message: successMessage,
        });
        formElement.reset();
        setSelectedFileName("No file chosen");
        setFieldErrors({});
        refreshCaptcha();
        setTimeout(() => {
          router.push("/thank-you?type=job-application");
        }, 600);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const failureMessage =
        error?.message ||
        "Something went wrong while sending your resume. Please try again.";
      setStatus({
        type: "error",
        message: failureMessage,
      });
      toast.error(failureMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 md:py-8 font-figtree rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-gray-100 max-w-[1000px] mx-auto">
      <h3 className="text-2xl font-semibold  text-[#1e1e1e] mb-6">Submit Resume</h3>

      {status && (
        <div
          className={`p-4 rounded-lg mb-6 text-sm ${status.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
            }`}
          role="alert"
        >
          {status.message}
        </div>
      )}

      <form
        ref={formRef}
        id="submitResumeForm"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <input type="hidden" name="subject" value="Career - Contact Form" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name*"
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#474972]/20 transition-all ${fieldErrors.fullName
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-[#474972]"
                } text-[#1e1e1e] placeholder:text-gray-400 text-sm`}
              aria-invalid={!!fieldErrors.fullName}
              onChange={() => setFieldErrors((e) => ({ ...e, fullName: undefined }))}
            />
            {fieldErrors.fullName && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#474972]/20 transition-all ${fieldErrors.email
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-[#474972]"
                } text-[#1e1e1e] placeholder:text-gray-400 text-sm`}
              aria-invalid={!!fieldErrors.email}
              autoComplete="email"
              onChange={() => setFieldErrors((e) => ({ ...e, email: undefined }))}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number*"
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#474972]/20 transition-all ${fieldErrors.phone
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-[#474972]"
                } text-[#1e1e1e] placeholder:text-gray-400 text-sm`}
              aria-invalid={!!fieldErrors.phone}
              inputMode="numeric"
              pattern="[0-9]{7,15}"
              maxLength={15}
              minLength={7}
              onChange={() => setFieldErrors((e) => ({ ...e, phone: undefined }))}
            />
            {fieldErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-1">
            <div
              className={`flex items-center p-1.5 rounded-lg border bg-white transition-all ${fieldErrors.resume
                ? "border-red-300 ring-1 ring-red-100"
                : "border-gray-200 focus-within:border-[#474972] focus-within:ring-2 focus-within:ring-[#474972]/20"
                }`}
            >
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 bg-[#474972] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#3a3c5e] transition-colors text-sm font-medium whitespace-nowrap"
              >
                <CloudUpload size={16} className="inline-block mr-2" /> Choose File
              </label>
              <input
                id="file-upload"
                type="file"
                name="resume"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              <div className="flex-1 min-w-0 px-3 flex items-center justify-between">
                <span className="text-sm text-gray-500 truncate block">
                  {selectedFileName}
                </span>
                {selectedFileName !== "No file chosen" && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove file"
                  >
                    <X className="text-red-500" size={16} />
                  </button>
                )}
              </div>
            </div>
            {fieldErrors.resume && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.resume}</p>
            )}
          </div>

          {/* Job Title */}
          <div className="space-y-1">
            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title*"
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#474972]/20 transition-all ${fieldErrors.jobTitle
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-[#474972]"
                } text-[#1e1e1e] placeholder:text-gray-400 text-sm`}
              aria-invalid={!!fieldErrors.jobTitle}
              onChange={() => setFieldErrors((e) => ({ ...e, jobTitle: undefined }))}
            />
            {fieldErrors.jobTitle && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.jobTitle}</p>
            )}
          </div>

          {/* Notice Period */}
          <div className="space-y-1">
            <input
              type="number"
              name="noticePeriod"
              placeholder="Notice Period (Days)"
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#474972]/20 transition-all ${fieldErrors.noticePeriod
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-[#474972]"
                } text-[#1e1e1e] placeholder:text-gray-400 text-sm`}
              aria-invalid={!!fieldErrors.noticePeriod}
              onChange={() => setFieldErrors((e) => ({ ...e, noticePeriod: undefined }))}
            />
            {fieldErrors.noticePeriod && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.noticePeriod}</p>
            )}
          </div>

          {/* Current CTC */}
          <div className="space-y-1">
            <input
              type="text"
              name="currentCTC"
              placeholder="Current CTC (In Lakhs)"
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#474972]/20 transition-all ${fieldErrors.currentCTC
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-[#474972]"
                } text-[#1e1e1e] placeholder:text-gray-400 text-sm`}
              aria-invalid={!!fieldErrors.currentCTC}
              onChange={() => setFieldErrors((e) => ({ ...e, currentCTC: undefined }))}
            />
            {fieldErrors.currentCTC && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.currentCTC}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#474972] focus:ring-2 focus:ring-[#474972]/20 transition-all text-[#1e1e1e] placeholder:text-gray-400 text-sm resize-y min-h-[120px]"
          ></textarea>
        </div>

        {/* Captcha */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-xs font-bold text-gray-700">
            Security check<span className="text-red-500 ml-0.5">*</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="bg-gray-100 border border-gray-200 rounded px-4 py-2 text-[#474972] font-bold font-mono select-none text-sm">
              {captcha.question} = ?
            </span>

            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              onClick={refreshCaptcha}
              title="New question"
            >
              <RotateCcw size={16} />
            </button>

            <input
              type="number"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-24 px-3 py-2 rounded border border-gray-200 focus:outline-none focus:border-[#474972] text-sm text-black text-center"
              autoComplete="off"
              placeholder="Answer"
            />
          </div>
        </div>

        {fieldErrors.captcha && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.captcha}</p>
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <Button
            text={isSubmitting ? "Submitting..." : "Submit"}
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-12 py-3"
          />
        </div>
      </form>
    </div>
  );
}

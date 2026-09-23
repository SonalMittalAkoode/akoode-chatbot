"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { submitJobApplication } from "@/api/jobApplication";
import NavBar from "@/components/NavBarClient";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { isValidEmail, isValidPhone, normalizeEmail, sanitizePhone } from "@/utils/formValidation";
import { stripBareTldAutolinks, normalizeAnchorHrefs } from "@/utils/safeRichText";
import {
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  ChevronDown,
  ArrowUpFromLine,
  CheckCircle2,
  RotateCcw
} from "lucide-react";

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

const formatDeadline = (deadline) => {
  if (!deadline) return "-";
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// A role stops accepting applications after the end of its deadline day.
const isDeadlinePassed = (deadline) => {
  if (!deadline) return false;
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return false;
  date.setHours(23, 59, 59, 999);
  return date.getTime() < Date.now();
};

export default function JobApplicationPageContent({ job }) {
  const formRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("No file chosen");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [captchaInput, setCaptchaInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState("");
  const [referralName, setReferralName] = useState("");
  const [referralDepartment, setReferralDepartment] = useState("");
  const router = useRouter();

  const applicationsClosed = isDeadlinePassed(job?.deadline);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateMathCaptcha());
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    setCaptcha(generateMathCaptcha());

    const handleClickOutside = (event) => {
      const container = document.getElementById("sourceDropdownContainer");
      if (container && !container.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFileName(file?.name || "No file chosen");
    setFieldErrors((e) => ({ ...e, resume: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (applicationsClosed) return;
    const formElement = formRef.current ?? event.currentTarget;
    if (!formElement) return;

    const name = (formElement.querySelector('[name="name"]')?.value || "").trim();
    const email = (formElement.querySelector('[name="email"]')?.value || "").trim();
    const phone = (formElement.querySelector('[name="phone"]')?.value || "").trim();
    const resumeEl = formElement.querySelector('[name="resume"]');
    const hasResume = resumeEl?.files?.length && resumeEl.files[0]?.size > 0;
    const captchaOk = parseInt(captchaInput.trim(), 10) === captcha.answer;

    const errors = {};
    if (!name) errors.name = "Your name is required.";
    if (!email) errors.email = "Your email address is required.";
    if (!isValidEmail(email) && email) errors.email = "Enter a valid email address.";
    if (!phone) errors.phone = "Phone number is required.";
    if (!isValidPhone(phone) && phone) errors.phone = "Enter a valid phone number.";
    if (!hasResume) errors.resume = "Please upload your resume (PDF, DOC, or DOCX).";
    if (!captchaOk) errors.captcha = "Incorrect answer. Please solve the security check.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please complete all required fields and the captcha.");
      return;
    }

    setIsSubmitting(true);
    toast.dismiss();

    try {
      const formData = new FormData(formElement);
      formData.set("email", normalizeEmail(email));
      formData.set("phone", sanitizePhone(phone));
      if (selectedSource === "Employee Referral") {
        formData.set("referralName", referralName.trim());
        formData.set("referralDepartment", referralDepartment.trim());
      }
      const result = await submitJobApplication(formData);

      toast.success(result?.message || "Application submitted successfully!");

      setTimeout(() => {
        router.push("/thank-you?type=job-application");
      }, 600);
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
    <>
      <NavBar />
      <div className="pt-[120px] pb-[60px] md:pt-32 md:pb-20 bg-center bg-no-repeat bg-cover bg-[url('/inner-bg.webp')]">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-3xl text-center">
              <h1 className="text-2xl md:text-[42px] font-semibold mb-4 md:mb-8 font-sans text-white">
                {job?.title?.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#2A2B44_0%,#4A5175_25%,#00F6FF_50%,#4A5175_75%,#2A2B44_100%)] bg-[length:200%_auto] animate-text-shine">
                  {job?.title?.split(" ").slice(-1)}
                </span>
              </h1>
              <div className="h-7"></div>
            </div>
          </div>
        </div>
      </div>
      <section className="py-[60px] md:py-[70px] bg-[#f8f9fa] font-figtree">
        <div className="max-w-[1160px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT SECTION */}
            <div className="w-full lg:w-[41.6%]">
              <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#e5e7eb]">
                <div className="mb-8">
                  <h3 className="font-bold font-figtree mb-2 text-[#1e1e1e] text-2xl">
                    {job?.title || "AI Research Engineers"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="text-[#4b5563] text-[13px] font-normal flex items-center">
                      <MapPin className="mr-1" size={14} />
                      <span>{job?.location || "Gurgaon"}</span>
                    </div>
                    <div className="text-[#4b5563] text-[13px] font-normal flex items-center">
                      <Briefcase className="mr-1" size={14} />
                      <span>{job?.tag || "Full Time"}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="h-full">
                        <p className="text-black text-xs uppercase mb-2 font-bold tracking-wider">
                          Experienced
                        </p>
                        <div className="flex items-center">
                          <Clock className="mr-1 text-[#64748B]" size={14} />
                          <span className="font-semibold text-[14px] text-[#64748B]">
                            {job?.experience || "5 Year"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="h-full">
                        <p className="text-black text-xs uppercase mb-2 font-bold tracking-wider">
                          Deadline
                        </p>
                        <div className="flex items-center">
                          <Calendar className="mr-1 text-[#64748B]" size={14} />
                          <span className="font-semibold text-[14px] text-[#64748B]">
                            {formatDeadline(job?.deadline) || "3 Jan 2026"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3 text-[#1e1e1e] text-xl">About the Role</h4>
                  {job?.description ? (
                    <div
                      className="text-[#64748B] text-[15px] leading-relaxed space-y-3
                        [&_h1]:text-[22px] [&_h1]:font-bold [&_h1]:text-[#1e1e1e] [&_h1]:mt-5 [&_h1]:mb-2
                        [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:text-[#1e1e1e] [&_h2]:mt-5 [&_h2]:mb-2
                        [&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:text-[#1e1e1e] [&_h3]:mt-4 [&_h3]:mb-1
                        [&_h4]:text-[16px] [&_h4]:font-bold [&_h4]:text-[#1e1e1e] [&_h4]:mt-3 [&_h4]:mb-1
                        [&_strong]:font-bold [&_strong]:text-[#1e1e1e]
                        [&_b]:font-bold [&_b]:text-[#1e1e1e]
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1
                        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mt-1
                        [&_li]:mb-1 [&_li]:text-[14px]
                        [&_p]:mb-2
                        [&_a]:text-[#474972] [&_a]:underline [&_a]:underline-offset-2"
                      dangerouslySetInnerHTML={{ __html: normalizeAnchorHrefs(stripBareTldAutolinks(job.description)) }}
                    />
                  ) : (
                    <p className="text-[#64748B] text-[15px] leading-relaxed">
                      The role of an AI Research Engineer focuses on advancing
                      artificial intelligence by designing, experimenting with,
                      and improving cutting-edge algorithms and models.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full lg:w-[58.4%] lg:sticky lg:top-[100px] self-start">
              <div className="relative bg-white p-6 md:p-10 rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#e5e7eb]">
                <div
                  className={`transition-opacity duration-300 ${applicationsClosed ? "opacity-75 pointer-events-none select-none" : ""}`}
                  inert={applicationsClosed}
                >
                <div className="mb-4 font-figtree">
                  <h2 className="font-bold mb-2 text-[#1e1e1e] text-2xl">Apply for this position</h2>
                  <p className="text-[#64748B] text-[15px]">
                    Submit your application and we'll be in touch shortly.
                  </p>
                </div>

                <form
                  ref={formRef}
                  id="contactForm"
                  encType="multipart/form-data"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="hidden"
                    name="jobTitle"
                    value={job?.title || ""}
                  />
                  <input type="hidden" name="jobId" value={job?._id || ""} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                      <label className="block text-[15px] font-bold mb-2 text-[#1e1e1e]">
                        Your name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all duration-200 bg-[#F9FAFB]"
                        aria-invalid={!!fieldErrors.name}
                        onChange={() => setFieldErrors((prev) => ({ ...prev, name: undefined }))}
                      />
                      {fieldErrors.name && (
                        <p className="text-red-600 text-sm mt-1 mb-0">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-[15px] font-bold mb-2 text-[#1e1e1e]">
                        Your email address{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all duration-200 bg-[#F9FAFB]"
                        aria-invalid={!!fieldErrors.email}
                        autoComplete="email"
                        onChange={() => setFieldErrors((prev) => ({ ...prev, email: undefined }))}
                      />
                      {fieldErrors.email && (
                        <p className="text-red-600 text-sm mt-1 mb-0">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                      <label className="block text-[15px] font-bold mb-2 text-[#1e1e1e]">
                        Phone <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all duration-200 bg-[#F9FAFB]"
                        aria-invalid={!!fieldErrors.phone}
                        inputMode="numeric"
                        pattern="[0-9]{7,15}"
                        maxLength={15}
                        minLength={7}
                        onChange={() => setFieldErrors((prev) => ({ ...prev, phone: undefined }))}
                      />
                      {fieldErrors.phone && (
                        <p className="text-red-600 text-sm mt-1 mb-0">{fieldErrors.phone}</p>
                      )}
                    </div>

                    <div className="relative mb-4" id="sourceDropdownContainer">
                      <label className="block text-[15px] font-bold mb-2 text-[#1e1e1e]">
                        How did you find out about us?
                      </label>
                      <input type="hidden" name="source" value={selectedSource} />
                      <button
                        type="button"
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-[#474972] focus:ring-2 focus:ring-[#474972]/20 outline-none transition-all duration-200 bg-[#F9FAFB] text-left flex justify-between items-center"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className={selectedSource ? "text-black" : "text-gray-400"}>
                          {selectedSource || "Choose one"}
                        </span>
                        <ChevronDown className={`text-xs transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} size={14} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden font-figtree animate-in fade-in slide-in-from-top-2 duration-200">
                          {["LinkedIn", "Indeed", "Google/Bing", "Company Website", "Employee Referral", "Social Media", "Other"].map((option) => (
                            <div
                              key={option}
                              className="px-4 py-2 cursor-pointer transition-colors text-[#1e1e1e] hover:bg-[#474972] hover:text-white"
                              onClick={() => {
                                setSelectedSource(option);
                                if (option !== "Employee Referral") {
                                  setReferralName("");
                                  setReferralDepartment("");
                                }
                                setIsDropdownOpen(false);
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedSource === "Employee Referral" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                      <div className="mb-4">
                        <label className="block text-[15px] font-bold mb-2 text-[#1e1e1e]">
                          Employee Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={referralName}
                          onChange={(e) => setReferralName(e.target.value)}
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all duration-200 bg-[#F9FAFB]"
                          placeholder="Who referred you?"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-[15px] font-bold mb-2 text-[#1e1e1e]">
                          Department <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={referralDepartment}
                          onChange={(e) => setReferralDepartment(e.target.value)}
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all duration-200 bg-[#F9FAFB]"
                          placeholder="Their department"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2 text-[#1e1e1e]">Message</label>
                    <textarea
                      name="message"
                      className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all duration-200 bg-[#F9FAFB]"
                      rows="4"
                    // placeholder="Tell us a bit about why you're interested in this role..."
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2 text-[#1e1e1e]">
                      Resume / CV <span className="text-red-600">*</span>
                    </label>
                    <div
                      className="border-2 border-dashed border-[#E5E7EB] rounded-[12px] p-[30px] text-center cursor-pointer transition-all duration-300 hover:border-[#474972] hover:bg-[#F9FAFB] group"
                      onClick={() =>
                        document.getElementById("resumeInput").click()
                      }
                    >
                      <input
                        type="file"
                        id="resumeInput"
                        name="resume"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                          <ArrowUpFromLine className="text-xl text-[#474972]" size={24} />
                        </div>
                        <p className="m-0 font-semibold text-gray-900 text-[15px]">
                          Click to upload your resume
                        </p>
                        <p className="m-0 text-[#64748B] text-sm">
                          PDF, DOC, or DOCX (Max 10MB)
                        </p>
                        {selectedFileName !== "No file chosen" && (
                          <p className="mt-2 text-green-600 text-sm font-bold">
                            <CheckCircle2 className="inline-block mr-1" size={14} />{" "}
                            {selectedFileName}
                          </p>
                        )}
                      </div>
                    </div>
                    {fieldErrors.resume && (
                      <p className="text-red-600 text-sm mt-1 mb-0">{fieldErrors.resume}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2 text-[#1e1e1e]">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      // placeholder="https://linkedin.com/in/username"
                      className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all duration-200 bg-[#F9FAFB]"
                    />
                  </div>

                  {/* <div className="career-source-consent-section mb-4 rounded-4 no-nice-select">
                    <div className="mb-3">
                      <label className="career-form-label mb-2">
                        How did you find out about us?
                      </label>
                      <select name="source" className="form-select">
                        <option value="" disabled selected>
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
                    </div> */}

                  <div className="flex items-start gap-3 mb-4 select-none group">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="consentCheck"
                        name="consent"
                        value="true"
                        className="w-4 h-4 rounded border-gray-300 text-[#474972] focus:ring-[#474972] cursor-pointer transition-colors"
                      />
                    </div>
                    <label
                      className="text-[#64748B] text-sm leading-tight cursor-pointer"
                      htmlFor="consentCheck"
                    >
                      I consent to receiving information about new job offers,
                      events, and trainings.
                    </label>
                  </div>

                  <div className="form-info-box p-3 mb-4 rounded-3">
                    <p className="m-0 text-sm text-[#64748B]">
                      If you are unable to submit your details, then please
                      share your recently updated resume at{" "}
                      <a
                        href="mailto:hr@akoode.in"
                        className="text-[#474972] font-bold"
                      >
                        hr@akoode.in
                      </a>
                      .
                    </p>
                  </div>

                  <div className="mb-4 font-figtree">
                    <label className="block text-[15px] font-bold mb-2 text-[#1e1e1e]">Security check <span className="text-red-600">*</span></label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="border rounded px-3 py-2 bg-gray-50 text-gray-900 font-bold font-mono h-[44px] flex items-center justify-center min-w-[100px]"
                          aria-label="Math question"
                        >
                          {captcha.question} = ?
                        </span>
                        <button
                          type="button"
                          className="w-10 h-[44px] flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-[#474972] transition-colors border border-gray-200"
                          onClick={refreshCaptcha}
                          title="New question"
                          aria-label="New question"
                        >
                          <RotateCcw size={18} aria-hidden />
                        </button>
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={captchaInput}
                          onChange={(ev) => {
                            setCaptchaInput(ev.target.value);
                            setFieldErrors((prev) => ({ ...prev, captcha: undefined }));
                          }}
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-[#474972] focus:ring-2 focus:ring-[#474972]/20 outline-none transition-all duration-200 bg-[#F9FAFB] h-[44px]"
                          autoComplete="off"
                          aria-invalid={!!fieldErrors.captcha}
                          placeholder="Your answer"
                        />
                      </div>
                    </div>
                    {fieldErrors.captcha && (
                      <p className="text-red-600 text-sm mt-1 mb-0">{fieldErrors.captcha}</p>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-8 py-3 bg-[#474972] text-white font-semibold rounded-lg hover:bg-[#2a2b44] transition-colors duration-300 w-full md:w-auto min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                      disabled={isSubmitting || applicationsClosed}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </div>
                      ) : "Submit Application"}
                    </button>
                  </div>
                </form>
                </div>

                {applicationsClosed && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6">
                    <div className="text-center max-w-md rounded-2xl border border-[#e5e7eb] bg-white/90 backdrop-blur-[2px] px-6 py-8 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                      <p className="font-figtree font-bold text-[#1e1e1e] leading-[1.1] text-[26px] sm:text-[34px] md:text-[40px]">
                        No Longer Accepting Applications
                      </p>
                      <p className="mt-3 text-[#64748B] text-[15px] md:text-base">
                        The deadline for this role has passed. Thank you for your interest.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

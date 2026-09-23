"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { X, Star, Clock, ChevronDown, RotateCcw, MessageSquare } from "lucide-react";
import { addEnquiryAPI } from "@/api/frontend/enquiry";
import { getTestimonialTableData } from "@/api/frontend/testimonial";
import { countryCodes } from "@/utils/countryCodes";
import { isValidEmail, isValidPhone, normalizeEmail, sanitizePhone } from "@/utils/formValidation";
import { useLeadSource } from "@/hooks/useLeadSource";
import resolveImageUrl from "@/utils/resolveImageUrl";

const TESTIMONIAL_ROTATION_KEY = "akoode_blog_popup_testimonial_index";

const FALLBACK_TESTIMONIAL = {
  quote:
    "From the first call, we were very impressed with Akoode's professionalism and expertise in delivering top-notch results.",
  name: "Filippo Quattrocchi",
  designation: "Owner, CEO",
  logoimage: "",
};

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "A";

// Same press logos + seamless marquee technique as the homepage's MediaStrip —
// duplicated set, track animates translateX(0) -> translateX(-50%) via the
// globally-defined .animate-marquee keyframe (see globals.css).
const FEATURED_LOGOS = [
  { src: "/strip/strip1.svg", alt: "Business Standard", width: 80, height: 20 },
  { src: "/strip/yourstory.svg", alt: "yourstory", width: 80, height: 20 },
  { src: "/strip/forbes.svg", alt: "Forbes", width: 80, height: 20 },
  { src: "/strip/mid-day.svg", alt: "Mid-Day", width: 80, height: 20 },
  { src: "/strip/republic.svg", alt: "Republic Logo", width: 80, height: 20 },
  { src: "/strip/business_world.svg", alt: "Business World", width: 120, height: 100 },
  { src: "/strip/pti_logo.svg", alt: "PTI Logo", width: 80, height: 80 },
  { src: "/strip/zbusiness.webp", alt: "Zee Business", width: 120, height: 80 },
  { src: "/strip/abp.svg", alt: "ABP Live", width: 80, height: 20 },
  { src: "/strip/ani_news.svg", alt: "ANI News", width: 80, height: 80 },
];
const DUPLICATED_FEATURED_LOGOS = [...FEATURED_LOGOS, ...FEATURED_LOGOS];

// Matches the footer's canonical service list, so the dropdown stays consistent
// with the rest of the site instead of inventing a separate taxonomy.
const SERVICE_OPTIONS = [
  "Artificial Intelligence",
  "Software Development",
  "Web Development",
  "IOT Development",
  "Cloud and DevOps",
  "Staff Augmentation Services",
  "Digital Transformation",
  "Mobile App Development",
  "eCommerce Solution",
  "BigData & Data Analytics",
  "Blockchain Development",
  "360 Digital Marketing",
];

const darkInput =
  "h-[52px] w-full rounded-xl border border-white/15 bg-white/5 px-4 text-[14px] font-medium text-white placeholder:text-white/55 focus:outline-none focus:ring-1 focus:ring-[#8B9FE8] focus:border-[#8B9FE8] transition-colors";

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

// Appears 10s after a visitor lands on any blog page — every fresh page visit
// re-triggers it (leaving and coming back shows it again), then submits
// through the same /frontend/api/enquiry endpoint as the Contact Us form.
export default function BlogEnquiryPopup() {
  const router = useRouter();
  const source = useLeadSource({ pageType: "blog-popup" });
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    countryCode: "+91",
    email: "",
    serviceType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [captchaInput, setCaptchaInput] = useState("");
  const [testimonial, setTestimonial] = useState(FALLBACK_TESTIMONIAL);
  const [avatarError, setAvatarError] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateMathCaptcha());
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    const delay = 20000; // 20s
    const timer = setTimeout(() => {
      setCaptcha(generateMathCaptcha());
      setOpen(true);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getTestimonialTableData().then((data) => {
      if (cancelled) return;
      const list = (Array.isArray(data) ? data : []).filter((t) => t?.description && t?.title);
      if (!list.length) return;
      const lastIndex = parseInt(localStorage.getItem(TESTIMONIAL_ROTATION_KEY) || "-1", 10);
      const nextIndex = (Number.isFinite(lastIndex) ? lastIndex + 1 : 0) % list.length;
      localStorage.setItem(TESTIMONIAL_ROTATION_KEY, String(nextIndex));
      const pick = list[nextIndex];
      setAvatarError(false);
      setTestimonial({
        quote: pick.description,
        name: pick.title,
        designation: pick.designation || "",
        logoimage: pick.logoimage || "",
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? sanitizePhone(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.email) {
      toast.error("Please fill in all required fields (Name, Phone, Email)");
      return;
    }
    if (parseInt(captchaInput.trim(), 10) !== captcha.answer) {
      toast.error("Incorrect answer. Please solve the security check.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!isValidPhone(formData.phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsSubmitting(true);
    try {

      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out. Please check your connection and try again.")), 15000)
      );
      const result = await Promise.race([
        addEnquiryAPI({
          fullName: formData.fullName,
          phone: `${formData.countryCode} ${sanitizePhone(formData.phone)}`,
          email: normalizeEmail(formData.email),
          service: formData.serviceType,
          message: formData.message,
          source,
        }),
        timeout,
      ]);

      if (result.status === "success") {
        toast.success(result.message || "Thank you for your message. It has been sent.");
        setOpen(false);
        setTimeout(() => {
          router.push("/thank-you?type=general-enquiry");
        }, 600);
      } else {
        toast.error(result.message || "Failed to send enquiry. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2.5 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div className="relative w-full max-w-[900px] rounded-[20px] border border-white/15 bg-white/5 p-1.5 shadow-2xl sm:rounded-[28px] sm:p-2">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-5 sm:top-5 sm:h-9 sm:w-9"
        >
          <X size={16} />
        </button>

        <div className="grid max-h-[94vh] grid-cols-1 overflow-y-auto rounded-[16px] sm:max-h-[92vh] sm:rounded-[22px] md:grid-cols-2">
          {/* ── Trust panel ── */}
          <div className="bg-[#383b5a] p-5 sm:p-8 md:p-10">
            <p className="text-[13px] font-medium text-white/70">Still exploring?</p>
            <h3 className="mt-1 text-[24px] font-semibold leading-[1.2] text-white sm:text-[28px]">
              Here&apos;s why businesses trust Akoode Technologies
            </h3>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-opacity duration-500">
              <p className="text-[14px] italic leading-relaxed text-white/85">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                {testimonial.logoimage && !avatarError ? (
                  <Image
                    src={resolveImageUrl(testimonial.logoimage)}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    unoptimized
                    onError={() => setAvatarError(true)}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6679E4] text-[13px] font-bold text-white">
                    {initials(testimonial.name)}
                  </div>
                )}
                <div>
                  <div className="text-[14px] font-semibold text-white">{testimonial.name}</div>
                  {testimonial.designation && (
                    <div className="text-[12px] text-white/70">{testimonial.designation}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 leading-none">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[#6679E4] text-[#6679E4]" />
                ))}
              </div>
              <span className="text-[14px] font-bold text-white">5.0</span>
              <span className="flex items-center gap-1 text-[13px] text-white/70">
                from
                <Image
                  src="/reviews/clutch.svg"
                  alt="Clutch"
                  width={44}
                  height={13}
                  className="h-[13px] w-auto object-contain brightness-0 invert opacity-70"
                />
              </span>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98AAEC]">
                Featured In
              </p>
              <div className="relative mt-3 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 z-10 w-10 pointer-events-none"
                  style={{ background: "linear-gradient(to right, #383b5a 30%, transparent 100%)" }}
                />
                <div
                  className="absolute inset-y-0 right-0 z-10 w-10 pointer-events-none"
                  style={{ background: "linear-gradient(to left, #383b5a 30%, transparent 100%)" }}
                />
                <div className="flex w-max items-center gap-10 animate-marquee will-change-transform">
                  {DUPLICATED_FEATURED_LOGOS.map((logo, index) => (
                    <div
                      key={index}
                      className="flex shrink-0 items-center justify-center opacity-60 grayscale brightness-0 invert transition-opacity hover:opacity-90"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width}
                        height={logo.height}
                        className="h-5 w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Form panel ── */}
          <div className="bg-[#383b5a] p-5 sm:p-8 md:p-10">
            <h3 className="text-[24px] font-bold leading-tight text-white sm:text-[26px]">
              Have a project in mind?
            </h3>
            <p className="mt-1 text-[13px] text-white/70">
              Free consultation. No commitment required.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className={darkInput}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={darkInput}
                />
              </div>

              <div className="flex h-[52px] gap-2">
                <select
                  name="countryCode"
                  aria-label="Country calling code"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-[92px] shrink-0 rounded-xl border border-white/15 bg-white/5 px-2 text-[13px] font-medium text-white/70 focus:outline-none focus:ring-1 focus:ring-[#8B9FE8]"
                >
                  {countryCodes.map((country) => (
                    <option key={`${country.iso}-${country.code}`} value={country.code} className="text-black">
                      {country.iso} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={15}
                  minLength={7}
                  pattern="[0-9]{7,15}"
                  required
                  autoComplete="tel-national"
                  className={`${darkInput} flex-1`}
                />
              </div>

              <div className="relative">
                <select
                  name="serviceType"
                  aria-label="Which service are you interested in?"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className={`${darkInput} appearance-none pr-10 ${formData.serviceType ? "" : "text-white/55"}`}
                >
                  <option value="" className="text-black">Which service are you interested in?</option>
                  {SERVICE_OPTIONS.map((label) => (
                    <option key={label} value={label} className="text-black">
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                />
              </div>

              <textarea
                name="message"
                placeholder="Tell us briefly about your project"
                value={formData.message}
                onChange={handleChange}
                className="h-[90px] w-full resize-none rounded-xl border border-white/15 bg-white/5 p-4 text-[14px] font-medium text-white placeholder:text-white/55 focus:outline-none focus:ring-1 focus:ring-[#8B9FE8] focus:border-[#8B9FE8]"
              />

              <div className="pt-1">
                <span className="flex items-center gap-1.5 text-[12px] text-white/70">
                  <Clock size={13} />
                  We respond within 3 hours
                </span>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-nowrap sm:items-center">
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="shrink-0 text-[12px] font-bold text-white/90">Security check:</span>
                    <span className="shrink-0 font-mono text-[12px] font-semibold text-white/80">
                      {captcha.question} = ?
                    </span>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="flex h-7 w-7 shrink-0 items-center justify-center text-[#8B9FE8] transition-transform duration-500 hover:rotate-180"
                      title="New question"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                  <input
                    type="number"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Your answer"
                    autoComplete="off"
                    inputMode="numeric"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 h-[40px] w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 text-[14px] font-medium text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#8B9FE8] sm:h-[36px] sm:w-[100px] sm:flex-none sm:text-[13px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex h-[54px] w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  background: "linear-gradient(180deg, #7784C5 0%, #495074 50%, #4F5581 100%)",
                }}
              >
                {isSubmitting ? "Sending..." : "Start the conversation"}
                <MessageSquare size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

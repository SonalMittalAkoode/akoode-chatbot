"use client";

// Global "Start your project" contact-form CTA — the design/structure used by
// the AI-development page (via MadFinalCTA / SdCTA), now shared across every
// page family instead of being hand-copied per page. Each caller supplies its
// own heading/subtitle/service via `data` + `service`, and picks a `variant`
// ("light" | "dark") to match its surrounding section's theme; the trust-badge
// strip, form fields, captcha, and submit logic are identical everywhere.
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { RotateCcw } from "lucide-react";
import { addEnquiryAPI } from "@/api/frontend/enquiry";
import { countryCodes, getDialCodeByIso } from "@/utils/countryCodes";
import { FiArrowRight, FiClock, FiShield, FiAward } from "react-icons/fi";
import { useLeadSource } from "@/hooks/useLeadSource";

const generateMathCaptcha = () => {
  if (Math.random() > 0.5) {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return { question: `${a} + ${b}`, answer: a + b };
  } else {
    const lo = Math.floor(Math.random() * 8) + 1;
    const hi = lo + Math.floor(Math.random() * 8) + 1;
    return { question: `${hi} − ${lo}`, answer: hi - lo };
  }
};

const BUDGETS = ["Still Evaluating", "Less than $50K", "$50K - $100K", "$100K - $250K", "More than $250K"];

const inputCls =
  "w-full h-12 px-[14px] rounded-[10px] border border-[rgba(119,132,197,0.25)] text-[14px] sm:text-[15px] text-[#14153d] bg-[#edeaf8] outline-none block placeholder:text-[#7779a0] focus:border-[#7784C5] transition-colors duration-200";

const TRUST_BADGES = [
  { Icon: FiClock, label: "Reply Time", value: "< 30 working minutes" },
  { Icon: FiShield, label: "NDA-Friendly", value: "Signed before kickoff" },
  { Icon: FiAward, label: "IP Ownership", value: "100% yours from day one" },
];

function EnquiryForm({ service, pageContext, defaultCountryIso }) {
  const router = useRouter();
  const source = useLeadSource({ ...pageContext, service });

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    countryIso: defaultCountryIso,
    email: "",
    budget: "",
    message: "",
  });
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [captchaInput, setCaptchaInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateMathCaptcha());
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    setCaptcha(generateMathCaptcha());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName?.trim() || !formData.phone?.trim() || !formData.email?.trim() || !formData.budget) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (parseInt(captchaInput.trim(), 10) !== captcha.answer) {
      toast.error("Incorrect answer. Please solve the security check.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: `${getDialCodeByIso(formData.countryIso)} ${formData.phone.trim()}`,
        email: formData.email.trim(),
        service,
        budget: formData.budget,
        message: formData.message.trim(),
        source,
      };
      const result = await addEnquiryAPI(payload);
      if (result.status === "success") {
        toast.success(result.message || "Thank you for your message. It has been sent.");
        setFormData({ fullName: "", phone: "", countryIso: defaultCountryIso, email: "", budget: "", message: "" });
        setCaptchaInput("");
        setCaptcha(generateMathCaptcha());
        const q = new URLSearchParams({ type: "contact" });
        if (source?.market) q.set("market", source.market);
        if (source?.slug) q.set("page", source.slug);
        setTimeout(() => router.push(`/thank-you?${q}`), 600);
      } else {
        toast.error(result.message || "Failed to send enquiry. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to send enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-[18px]" noValidate>
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[12px] sm:text-[13px] lg:text-[14px] font-medium text-[#14153d]">Full name</span>
          <input type="text" name="fullName" required placeholder="Your name" value={formData.fullName} onChange={handleChange} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[12px] sm:text-[13px] lg:text-[14px] font-medium text-[#14153d]">Email</span>
          <input type="email" name="email" required placeholder="you@company.com" value={formData.email} onChange={handleChange} className={inputCls} />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
        <label className="block">
          <span className="mb-2 block text-[12px] sm:text-[13px] lg:text-[14px] font-medium text-[#14153d]">Phone number</span>
          <div className="flex h-12 overflow-hidden rounded-[10px] border bg-[#edeaf8] focus-within:border-[#7784C5] transition-colors duration-200" style={{ borderColor: "rgba(119,132,197,0.25)" }}>
            <select
              name="countryIso"
              aria-label="Country calling code"
              value={formData.countryIso}
              onChange={handleChange}
              className="h-full shrink-0 cursor-pointer border-0 border-r border-[rgba(119,132,197,0.25)] bg-transparent pl-2 pr-1 text-[12px] sm:text-[13px] text-[#14153d] outline-none"
              style={{ minWidth: 78 }}
            >
              {countryCodes.map((c) => (
                <option key={c.iso} value={c.iso}>
                  {c.iso} ({c.code})
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phone"
              required
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={15}
              minLength={7}
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-[14px] sm:text-[15px] text-[#14153d] outline-none placeholder:text-[#7779a0]"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-[12px] sm:text-[13px] lg:text-[14px] font-medium text-[#14153d]">
            Project budget <span className="text-red-500">*</span>
          </span>
          <select name="budget" required value={formData.budget} onChange={handleChange} className={`${inputCls} cursor-pointer`}>
            <option value="">Select budget range</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-[12px] sm:text-[13px] lg:text-[14px] font-medium text-[#14153d]">Message</span>
        <textarea
          name="message"
          rows={3}
          placeholder="Tell us about your project…"
          value={formData.message}
          onChange={handleChange}
          className={`${inputCls} resize-none py-3 leading-[1.5] h-auto`}
        />
      </label>

      <div>
        <span className="mb-2 block text-[12px] sm:text-[13px] lg:text-[14px] font-medium text-[#14153d]">
          Security check <span className="text-red-500">*</span>
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="flex h-12 shrink-0 items-center justify-center rounded-[10px] border px-5 font-mono text-[16px] font-bold text-[#14153d]"
            style={{ background: "rgba(119,132,197,0.12)", borderColor: "rgba(119,132,197,0.25)" }}
            aria-label="Math question"
          >
            {captcha.question} = ?
          </span>
          <button
            type="button"
            onClick={refreshCaptcha}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 hover:rotate-180"
            style={{ borderColor: "rgba(119,132,197,0.35)", color: "#7784C5" }}
            title="New question"
          >
            <RotateCcw size={18} />
          </button>
          <input
            type="number"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="Your answer"
            autoComplete="off"
            className={`${inputCls} flex-1 min-w-[120px] sm:min-w-0`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group mt-2 flex h-[56px] w-full items-center justify-center gap-2 rounded-full text-[14px] sm:text-[15px] lg:text-[16px] font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: "linear-gradient(90deg, #7784C5 0%, #4F60B5 50%, #4F5581 100%)", outline: "1.5px solid #889AF5" }}
      >
        {isSubmitting ? (
          "Sending…"
        ) : (
          <>
            Send message
            <FiArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}

const THEME = {
  light: {
    background: "linear-gradient(150deg, #f4f6ff 0%, #eef0fa 40%, #f5f3ff 70%, #f8f9ff 100%)",
    eyebrowBg: "rgba(119,132,197,0.12)",
    eyebrowBorder: "rgba(119,132,197,0.35)",
    heading: "#191a2e",
    subtitle: "rgba(25,26,46,0.7)",
    badgeBg: "rgba(119,132,197,0.1)",
    badgeBorder: "1px solid rgba(119,132,197,0.3)",
    badgeIconBg: "rgba(119,132,197,0.18)",
    badgeLabel: "#5b6ba8",
    badgeValue: "#191a2e",
  },
  dark: {
    background: "linear-gradient(150deg, #0f1124 0%, #1D1F4B 40%, #151740 70%, #0f1130 100%)",
    eyebrowBg: "rgba(136,154,245,0.1)",
    eyebrowBorder: "rgba(136,154,245,0.3)",
    heading: "#ffffff",
    subtitle: "rgba(221,223,238,0.85)",
    badgeBg: "rgba(136,154,245,0.07)",
    badgeBorder: "1px solid rgba(136,154,245,0.18)",
    badgeIconBg: "rgba(136,154,245,0.15)",
    badgeLabel: "#889AF5",
    badgeValue: "#ffffff",
  },
};

export default function FinalCTA({ data, pageContext = {}, service, variant = "light", defaultCountryIso = "IN" }) {
  const t = THEME[variant] || THEME.light;

  const eyebrow = data?.eyebrow;
  const heading = data?.heading || "Start Your Project";
  const headingAccent = data?.headingAccent ?? "";
  const headingTailRaw = data?.headingTail ?? "";
  // CMS content sometimes already bakes the tail word into headingAccent
  // itself (e.g. accent: "Mobile App Development Project", tail: "Project").
  // Drop the tail when it would just repeat the end of the accent so pages
  // don't end up rendering "...Project Project".
  const headingTail =
    headingTailRaw && headingAccent.trim().toLowerCase().endsWith(headingTailRaw.trim().toLowerCase())
      ? ""
      : headingTailRaw;
  const subtitle =
    data?.body ||
    data?.subtitle ||
    "Send your brief and someone from Akoode will respond within one business day. No pitch deck, no pressure.";
  const resolvedService = service || data?.service || headingAccent || heading;

  return (
    <section
      id="contact"
      className="relative py-16 sm:py-20 lg:py-24 px-6 md:px-16 lg:px-24 overflow-hidden font-figtree"
      style={{ background: t.background }}
    >
      {/* Glow blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full blur-[120px] z-0" style={{ background: "radial-gradient(circle, rgba(119,132,197,0.22) 0%, transparent 65%)", opacity: 0.08 }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full blur-[120px] z-0" style={{ background: "radial-gradient(circle, rgba(79,96,181,0.2) 0%, transparent 65%)", opacity: 0.08 }} />
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px] z-0" style={{ background: "radial-gradient(ellipse, rgba(136,154,245,0.08) 0%, transparent 70%)" }} />

      <div className="relative z-[2] mx-auto max-w-[1240px] grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
        {/* Left: text */}
        <div className="flex w-full flex-col items-start text-left">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6" style={{ background: t.eyebrowBg, borderColor: t.eyebrowBorder }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#889AF5]" />
              <span className="text-[#889AF5] text-sm font-medium tracking-wide">{eyebrow}</span>
            </div>
          )}

          <h2 className="text-[24px] sm:text-[28px] font-bold leading-tight sm:leading-8 mb-6 max-w-[440px]" style={{ color: t.heading }}>
            {heading}
            {headingAccent ? (
              <>
                {" "}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #7784C5 0%, #889AF5 100%)" }}>
                  {headingAccent}
                </span>
              </>
            ) : null}
            {headingTail ? <>{" "}{headingTail}</> : null}
          </h2>

          <div
            className="text-sm sm:text-base leading-relaxed max-w-[440px] [&_p]:m-0 [&_*]:!text-inherit"
            style={{ color: t.subtitle }}
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />

          <div className="mt-12 flex flex-wrap gap-3 sm:gap-4">
            {TRUST_BADGES.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-[14px]" style={{ background: t.badgeBg, border: t.badgeBorder }}>
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: t.badgeIconBg }}>
                  <Icon size={16} color="#889AF5" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.14em] uppercase font-semibold leading-none mb-1" style={{ color: t.badgeLabel }}>
                    {label}
                  </div>
                  <div className="font-semibold text-[13px] sm:text-[14px] leading-tight" style={{ color: t.badgeValue }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form card — always the light card regardless of section variant */}
        <div className="rounded-[24px] p-5 sm:p-8 md:p-10" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f6f4ff 100%)", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.45), 0 0 0 1px rgba(136,154,245,0.18)" }}>
          <EnquiryForm service={resolvedService} pageContext={pageContext} defaultCountryIso={defaultCountryIso} />
        </div>
      </div>
    </section>
  );
}

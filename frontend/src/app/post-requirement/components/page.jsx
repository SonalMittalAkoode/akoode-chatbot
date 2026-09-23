"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLeadSource } from "@/hooks/useLeadSource";
import { m } from "framer-motion";
import { toast } from "react-toastify";
import { RotateCcw, ArrowRight } from "lucide-react";
import { addEnquiryAPI } from "@/api/frontend/enquiry";
import { countryCodes } from "@/utils/countryCodes";
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

// Fetch services from public API
const fetchServices = async () => {
    try {
        const apiBase =
            process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
            process.env.NEXT_PUBLIC_API_URL ||
            "http://localhost:5000";

        const url = `${apiBase.replace(/\/$/, "")}/api/service/list`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) return [];

        const data = await response.json();
        const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];

        return items
            .map((item) => {
                const title = item.title || "";
                const cleanTitle = title.replace(/<[^>]*>/g, "").trim();
                return {
                    id: item._id || item.id || item.slug || cleanTitle,
                    title: cleanTitle,
                };
            })
            .filter((item) => item.title && item.title.length > 0)
            .sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
};

export default function PostRequirementInnerArea() {
    const router = useRouter();
    const source = useLeadSource({ pageType: "post-requirement" });
    const [servicesList, setServicesList] = useState([]);
    const [isServicesLoading, setIsServicesLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        countryCode: "+91",
        email: "",
        service: "",
        budget: "",
        details: "",
    });
    const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
    const [captchaInput, setCaptchaInput] = useState("");

    const refreshCaptcha = useCallback(() => {
        setCaptcha(generateMathCaptcha());
        setCaptchaInput("");
    }, []);

    useEffect(() => {
        const loadServices = async () => {
            try {
                setIsServicesLoading(true);
                const services = await fetchServices();
                setServicesList(services);
            } catch (error) {
                setServicesList([]);
            } finally {
                setIsServicesLoading(false);
            }
        };
        loadServices();
        setCaptcha(generateMathCaptcha());
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "phone" ? sanitizePhone(value) : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.phone || !formData.email || !formData.service || !formData.budget || !formData.details) {
            toast.error("Please fill in all required fields");
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
            const payload = {
                fullName: formData.fullName,
                phone: `${formData.countryCode} ${sanitizePhone(formData.phone)}`,
                email: normalizeEmail(formData.email),
                service: formData.service,
                budget: formData.budget,
                message: formData.details,
                source,
            };

            const result = await addEnquiryAPI(payload);

            if (result.status === "success") {
                toast.success(result.message || "Thank you for your message. It has been sent.");
                setFormData({
                    fullName: "",
                    phone: "",
                    countryCode: "+91",
                    email: "",
                    service: "",
                    budget: "",
                    details: "",
                });
                refreshCaptcha();
                setTimeout(() => {
                    router.push("/thank-you?type=post-requirement");
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

    const StaggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const FadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const inputClasses = "w-full bg-[#f8faff] border border-gray-100 rounded-xl px-5 py-3.5 text-[#010225] outline-none transition-all focus:border-[#474972] focus:bg-white focus:shadow-sm placeholder:text-gray-400";
    const labelClasses = "block text-sm font-semibold text-[#1a1b2e] mb-2";

    return (
        <section className="py-20 bg-white font-figtree">
            <div className="container mx-auto px-4 md:px-[70px]">
                <div className="max-w-4xl mx-auto">
                    {/* Header Info */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[#010225] mb-6">Share Your Project Requirements</h2>
                        <div className="max-w-2xl mx-auto text-[#505169]/90 text-lg leading-relaxed">
                            <p>
                                <strong className="text-[#010225]">Tell us what you’re building, what you need, and where you want to go.</strong>
                            </p>
                            <p className="mt-2 text-base">
                                Share a few details and our team will review your requirements and connect you with the right experts.
                            </p>
                        </div>
                    </m.div>

                    {/* Form Card */}
                    <m.div
                        variants={StaggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_10px_50px_rgba(0,0,0,0.06)] border border-gray-50 relative overflow-hidden"
                    >
                        {/* Form Decorative Element */}
                        {/* <div className="absolute top-0 right-0 w-32 h-32 bg-[linear-gradient(135deg,#474972_0%,#585c9c_100%)] opacity-[0.03] rounded-bl-[100px] -z-0" /> */}

                        <form onSubmit={handleFormSubmit} className="relative z-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Full Name */}
                                <m.div variants={FadeUp}>
                                    <label className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className={inputClasses}
                                        placeholder="e.g. John Doe"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </m.div>

                                {/* Phone Number */}
                                <m.div variants={FadeUp}>
                                    <label className={labelClasses}>Phone Number <span className="text-red-500">*</span></label>
                                    <div className="flex gap-3">
                                        <select
                                            name="countryCode"
                                            aria-label="Country calling code"
                                            value={formData.countryCode}
                                            onChange={handleChange}
                                            className="w-24 bg-[#f8faff] border border-gray-100 rounded-xl px-2 py-3.5 text-[#010225] outline-none transition-all focus:border-[#474972] focus:bg-white text-sm"
                                        >
                                            {countryCodes.map((country) => (
                                                <option key={`${country.iso}-${country.code}`} value={country.code}>
                                                    {country.iso} ({country.code})
                                                </option>
                                            ) || <option value="+91">IN (+91)</option>)}
                                        </select>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className={`${inputClasses} flex-1`}
                                            placeholder="Phone Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            inputMode="numeric"
                                            maxLength={15}
                                            minLength={7}
                                            pattern="[0-9]{7,15}"
                                            required
                                        />
                                    </div>
                                </m.div>

                                {/* Email */}
                                <m.div variants={FadeUp}>
                                    <label className={labelClasses}>Email Address <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={inputClasses}
                                        placeholder="john@example.com"
                                        required
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </m.div>

                                {/* Budget */}
                                <m.div variants={FadeUp}>
                                    <label className={labelClasses}>Project Budget <span className="text-red-500">*</span></label>
                                    <select
                                        name="budget"
                                        aria-label="Project budget"
                                        required
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className={inputClasses}
                                    >
                                        <option value="">Select Budget Range</option>
                                        <option value="Still Evaluating">Still Evaluating</option>
                                        <option value="Less than $50K">Less than $50K</option>
                                        <option value="$50K - $100K">$50K - $100K</option>
                                        <option value="$100K - $250K">$100K - $250K</option>
                                        <option value="More than $250K">More than $250K</option>
                                    </select>
                                </m.div>

                                {/* Service */}
                                <m.div variants={FadeUp} className="md:col-span-2">
                                    <label className={labelClasses}>Service Interested In <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="service"
                                        className={inputClasses}
                                        placeholder="e.g. Custom AI Solution Development"
                                        required
                                        value={formData.service}
                                        onChange={handleChange}
                                    />
                                </m.div>

                                {/* Details */}
                                <m.div variants={FadeUp} className="md:col-span-2">
                                    <label className={labelClasses}>Project Details <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="details"
                                        className={`${inputClasses} min-h-[120px] resize-y`}
                                        placeholder="Please describe your project goals, scope and any specific requirements..."
                                        required
                                        value={formData.details}
                                        onChange={handleChange}
                                    />
                                </m.div>

                                {/* Captcha */}
                                <m.div variants={FadeUp} className="md:col-span-2">
                                    <label className={labelClasses}>Security Verification <span className="text-red-500">*</span></label>
                                    <div className="flex flex-wrap items-center gap-4 bg-[#f8faff] p-5 rounded-xl border border-gray-50">
                                        <span className="bg-white border-2 border-dashed border-[#474972]/20 px-6 py-2.5 rounded-lg text-[#010225] font-mono font-bold text-xl select-none shadow-sm whitespace-nowrap">
                                            {captcha.question} = ?
                                        </span>
                                        <button
                                            type="button"
                                            onClick={refreshCaptcha}
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-[#474972] hover:bg-[#474972] hover:text-white transition-all active:scale-95"
                                            title="New question"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                        <input
                                            type="number"
                                            value={captchaInput}
                                            onChange={(e) => setCaptchaInput(e.target.value)}
                                            className="flex-1 min-w-[120px] bg-white border border-gray-100 rounded-lg px-4 py-2.5 outline-none focus:border-[#474972] transition-colors text-[#010225] placeholder:text-gray-400 caret-[#010225] font-medium"
                                            placeholder="Your answer"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                </m.div>

                                {/* Submit */}
                                <m.div variants={FadeUp} className="md:col-span-2 flex justify-center mt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="group relative inline-flex items-center justify-center gap-3 px-12 py-4 bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(71,73,114,0.3)] hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                                    >
                                        <span className="relative z-10">
                                            {isSubmitting ? "Processing..." : "Submit Requirements"}
                                        </span>
                                        {!isSubmitting && (
                                            <ArrowRight className="relative z-10 transition-transform group-hover:translate-x-1" size={20} />
                                        )}
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                    </button>
                                </m.div>
                            </div>
                        </form>
                    </m.div>
                </div>

                {/* Highlight Section */}
                <m.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 border-l-4 border-[#474972] pl-8 max-w-4xl mx-auto"
                >
                    <h5 className="text-[#505169]/80 text-lg mb-2">Every project starts with a simple question:</h5>
                    <h5 className="text-2xl md:text-3xl font-bold text-[#010225] leading-snug">
                        How can technology solve this better?
                        <span className="block mt-3 text-lg font-medium text-[#505169]/90">
                            At Akoode Technologies, we turn ideas into practical, scalable solutions—built with purpose.
                        </span>
                    </h5>
                </m.div>
            </div>
        </section>
    );
}

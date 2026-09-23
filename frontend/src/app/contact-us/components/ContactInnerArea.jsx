"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLeadSource } from "@/hooks/useLeadSource";
import Image from 'next/image';
import { m } from "framer-motion";
import { toast } from "react-toastify";
import SectionBadge from "../../../components/SectionBadge";
import Button from "../../../components/Button";
import { RotateCcw } from "lucide-react";
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

// Animation variants for staggered heading
const headingVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.02,
        },
    },
};

const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
    },
};

export default function ContactInnerArea() {
    const router = useRouter();
    const source = useLeadSource({ pageType: "contact" });
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

    const refreshCaptcha = useCallback(() => {
        setCaptcha(generateMathCaptcha());
        setCaptchaInput("");
    }, []);

    useEffect(() => {
        setCaptcha(generateMathCaptcha());
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "phone" ? sanitizePhone(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.fullName ||
            !formData.phone ||
            !formData.email
        ) {
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
            const payload = {
                fullName: formData.fullName,
                phone: `${formData.countryCode} ${sanitizePhone(formData.phone)}`,
                email: normalizeEmail(formData.email),
                service: formData.serviceType,
                message: formData.message,
                source,
            };

            const result = await addEnquiryAPI(payload);

            if (result.status === "success") {
                toast.success(
                    result.message || "Thank you for your message. It has been sent."
                );
                setFormData({
                    fullName: "",
                    phone: "",
                    countryCode: "+91",
                    email: "",
                    serviceType: "",
                    message: "",
                });
                setCaptchaInput("");
                setCaptcha(generateMathCaptcha());
                setTimeout(() => {
                    router.push("/thank-you?type=contact");
                }, 600);
            } else {
                toast.error(
                    result.message || "Failed to send enquiry. Please try again."
                );
            }
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            toast.error(error.message || "An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative py-[70px] bg-[#FFFFFF]">
            <div className="mx-auto w-full max-w-[960px] px-[2rem] md:px-4">
                <div className="flex flex-col">
                    <div className="w-full max-w-[1100px] mx-auto">
                        {/* Heading Section */}
                        <div className="text-center mb-[40px] space-y-4">
                            <SectionBadge text="HAVE ANY QUESTIONS? REACH OUT!" variant="service" />
                            <m.h2
                                variants={headingVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-3xl md:text-[32px] font-bold font-figtree text-[#2a2b44] leading-tight"
                            >
                                {"Let's Discuss Your IT Needs".split("").map((char, index) => (
                                    <m.span key={index} variants={letterVariants}>
                                        {char}
                                    </m.span>
                                ))}
                            </m.h2>
                        </div>

                        {/* Contact Widgets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-[40px]">
                            <div className="relative overflow-hidden bg-[#EFF1FF] p-6 rounded-[8px] transition-all duration-300 group flex items-center gap-6 z-0">
                                {/* Expanding Background Animation */}
                                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[10px] group-hover:w-full bg-[#474972] transition-all duration-500 -z-10 opacity-0 group-hover:opacity-100 invisible group-hover:visible" />

                                <div className="w-14 h-14 bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] rounded-full flex items-center justify-center shrink-0">
                                    <Image
                                        src="/email-white.svg"
                                        alt="Email"
                                        width={32}
                                        height={32}
                                        className="w-8 h-8"
                                    />                                 </div>
                                <div className="content">
                                    <h4 className="text-lg font-bold text-[#2a2b44] group-hover:text-white transition-all duration-400 mb-1">Our Email</h4>
                                    <a href="mailto:info@akoode.com" className="text-slate-600 group-hover:text-white transition-all duration-400">info@akoode.com</a>
                                </div>
                            </div>

                            <div className="relative overflow-hidden bg-[#EFF1FF] p-6 rounded-[8px] transition-all duration-300 group flex items-center gap-6 z-0">
                                {/* Expanding Background Animation */}
                                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[10px] group-hover:w-full bg-[#474972] transition-all duration-500 -z-10 opacity-0 group-hover:opacity-100 invisible group-hover:visible" />

                                <div className="w-14 h-14 bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] rounded-full flex items-center justify-center shrink-0">
                                    <Image
                                        src="/phone.svg"
                                        alt="Phone"
                                        width={32}
                                        height={32}
                                        unoptimized
                                        className="w-8 h-8"
                                    />                                </div>

                                <div className="content">
                                    <h4 className="text-lg font-bold text-[#2a2b44] group-hover:text-white transition-all duration-400 mb-1">Phone</h4>
                                    <a href="tel:+919899300017" className="text-slate-600 group-hover:text-white transition-all duration-400">+91-9899300017</a>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="hidden lg:block">
                                <Image
                                    src="/contactus.png"
                                    alt="Contact Us"
                                    width={500}
                                    height={600}
                                    className="w-full h-full object-cover rounded-[10px] shadow-sm"
                                />
                            </div>

                            <div className="bg-[#EFF1FF] p-[25px] rounded-[8px]">
                                <h3 className="text-[24px] leading-[24px] font-semibold font-sans text-[#2a2b44] mb-4">Get In Touch Now</h3>

                                <form onSubmit={handleSubmit} className="space-y-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Full Name*"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="bg-white border border-[#e8e8e8] rounded-[4px] h-[46px] text-[16px] font-medium px-4 w-full focus:outline-none focus:ring-1 text-[#2a2b44] focus:ring-indigo-500"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address*"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            autoComplete="email"
                                            className="bg-white border border-[#e8e8e8] rounded-[4px] h-[46px] text-[16px] font-medium px-4 w-full focus:outline-none focus:ring-1 text-[#2a2b44] focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div className="flex gap-0 h-[46px]">
                                        <select
                                            name="countryCode"
                                            aria-label="Country calling code"
                                            value={formData.countryCode}
                                            onChange={handleChange}
                                            className="bg-white border border-[#e8e8e8] border-r-0 rounded-l-[4px] px-2 text-[14px] font-medium text-gray-400 focus:outline-none"
                                        >
                                            {countryCodes.map((country) => (
                                                <option key={`${country.iso}-${country.code}`} value={country.code}>
                                                    {country.iso} ({country.code})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number*"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            inputMode="numeric"
                                            maxLength={15}
                                            minLength={7}
                                            pattern="[0-9]{7,15}"
                                            required
                                            className="bg-white border border-[#e8e8e8] rounded-r-[4px] text-[16px] font-medium px-4 w-full focus:outline-none focus:ring-1 text-[#2a2b44] focus:ring-indigo-500"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        name="serviceType"
                                        placeholder="Service Interested In"
                                        value={formData.serviceType}
                                        onChange={handleChange}
                                        className="bg-white border border-[#e8e8e8] rounded-[4px] h-[46px] text-[16px] font-medium px-4 w-full focus:outline-none focus:ring-1 text-[#2a2b44] focus:ring-indigo-500"
                                    />

                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="bg-white border border-[#e8e8e8] rounded-[4px] h-[140px] text-[16px] font-medium p-4 w-full focus:outline-none focus:ring-1 text-[#2a2b44] focus:ring-indigo-500 "
                                    ></textarea>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-slate-700">Security check <span className="text-danger">*</span></label>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-white text-[#2a2b44] border border-[#e8e8e8] rounded-[4px] px-4 h-[46px] flex items-center justify-center font-bold font-mono whitespace-nowrap">
                                                {captcha.question} = ?
                                            </span>
                                            <button
                                                type="button"
                                                onClick={refreshCaptcha}
                                                className="w-10 h-10 flex items-center justify-center text-indigo-600 hover:rotate-180 transition-transform duration-500"
                                                title="New question"
                                            >
                                                <RotateCcw size={18} />
                                            </button>
                                            <input
                                                type="number"
                                                value={captchaInput}
                                                onChange={(e) => setCaptchaInput(e.target.value)}
                                                placeholder="Your answer"
                                                className="bg-white border border-[#e8e8e8] rounded-[4px] h-[46px] text-[16px] font-medium px-4 w-full focus:outline-none focus:ring-1 text-[#2a2b44] focus:ring-indigo-500"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            text={isSubmitting ? "Sending..." : "Get Started Now"}
                                            className="w-full h-[56px] rounded-[4px]"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="mt-20">
                <div className="mx-auto w-full max-w-[1100px] px-[2rem] md:px-4">
                    <div className="text-center mb-10 flex flex-col items-center">
                        <SectionBadge text="FIND US ON GOOGLE MAPS" variant="service" />
                        <m.h2
                            variants={headingVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-3xl md:text-[32px] font-bold font-figtree text-[#2a2b44] leading-tight mt-[18px]"
                        >
                            {"Our Global Presence".split("").map((char, index) => (
                                <m.span key={index} variants={letterVariants}>
                                    {char}
                                </m.span>
                            ))}
                        </m.h2>
                    </div>

                    <div className="rounded-[15px] overflow-hidden  ">
                        <h4 className="text-center text-[20px] font-sans font-bold text-[#2a2b44] mb-3 p-4 ">
                            India Office
                        </h4>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.2177452809556!2d77.04128017474747!3d28.412685875785538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d183d8ffffffd%3A0xbbe3233b2d9e6363!2sAkoode%20Technologies%20-%20An%20AI%20Powered%20Corporation!5e0!3m2!1sen!2sin!4v1766401408514!5m2!1sen!2sin"
                            width="100%"
                            height="400"
                            className="border border-slate-100 rounded-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}

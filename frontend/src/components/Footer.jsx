"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Mail,
    Phone
} from "lucide-react";
import { getServiceFilterData } from "@/api/frontend/services";
import { getCachedFooterServices, getCachedFooterServicesStale, setCachedFooterServices, isFooterServicesCacheStale } from "@/utils/footerServicesCache";

const FOOTER_SERVICE_LABELS = [
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

// Canonical slug for every footer label. Used as the link source-of-truth so
// the footer is correct even when the API is unreachable, slow, or returns
// titles that don't match (prod sometimes has variants like
// "Custom Software Development" that wouldn't startsWith the label).
const FOOTER_SLUG_FALLBACK = {
    "Artificial Intelligence": "artificial-intelligence",
    "Software Development": "software-development",
    "Web Development": "web-development",
    "IOT Development": "iot",
    "Cloud and DevOps": "cloud-and-devops-solutions",
    "Staff Augmentation Services": "staff-augmentation",
    "Digital Transformation": "digital-transformation",
    "Mobile App Development": "mobile-app-development",
    "eCommerce Solution": "ecommerce-development",
    "BigData & Data Analytics": "big-data",
    "Blockchain Development": "blockchain-development",
    "360 Digital Marketing": "360-digital-marketing",
};

const stripHtml = (value) => {
    if (!value) return "";
    return String(value).replace(/<[^>]*>/g, "").trim();
};

const normalizeTitle = (t) => (t || "").trim().toLowerCase().replace(/\s+/g, " ");

export default function Footer() {
    const [footerServices, setFooterServices] = useState(() =>
        FOOTER_SERVICE_LABELS.map((label) => ({
            label,
            slug: FOOTER_SLUG_FALLBACK[label] || null,
        }))
    );

    useEffect(() => {
        let cancelled = false;
        const applyRaw = (raw) => {
            const items = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.items)
                    ? raw.items
                    : Array.isArray(raw?.data)
                        ? raw.data
                        : [];
            const slugByExactTitle = {};
            const servicesWithSlug = [];
            items.forEach((s) => {
                const slug = s?.slug;
                const title = stripHtml(s?.title || "");
                if (slug && title) {
                    const key = normalizeTitle(title);
                    if (!slugByExactTitle[key]) slugByExactTitle[key] = slug;
                    const keyAlt = key.replace(/\s*&\s*/g, " and ");
                    if (!slugByExactTitle[keyAlt]) slugByExactTitle[keyAlt] = slug;
                    servicesWithSlug.push({ normalizedTitle: key, normalizedTitleAlt: keyAlt, slug });
                }
            });
            const resolveSlugForLabel = (label) => {
                const key = normalizeTitle(label);
                const keyAlt = key.replace(/\s*&\s*/g, " and ");
                const exact = slugByExactTitle[key] || slugByExactTitle[keyAlt];
                if (exact) return exact;
                const keyLen = key.length;
                const match = servicesWithSlug.find(
                    (s) =>
                        s.normalizedTitle === key ||
                        s.normalizedTitleAlt === key ||
                        (keyLen > 0 && s.normalizedTitle.startsWith(key)) ||
                        (keyLen > 0 && s.normalizedTitleAlt.startsWith(key)) ||
                        (keyLen > 0 && s.normalizedTitle.includes(key)) ||
                        (keyLen > 0 && s.normalizedTitleAlt.includes(key))
                );
                return match ? match.slug : null;
            };
            return FOOTER_SERVICE_LABELS.map((label) => ({
                label,
                slug: resolveSlugForLabel(label) || FOOTER_SLUG_FALLBACK[label] || null,
            }));
        };

        const cached = getCachedFooterServices() ?? getCachedFooterServicesStale();
        if (cached !== null && cached !== undefined) {
            setFooterServices(applyRaw(cached));
        }

        if (!isFooterServicesCacheStale()) return;

        (async () => {
            try {
                const raw = await getServiceFilterData({ limit: 200, page: 0 });
                if (cancelled) return;
                setCachedFooterServices(raw);
                setFooterServices(applyRaw(raw));
            } catch (e) {
                if (!cancelled) {
                    setFooterServices(
                        FOOTER_SERVICE_LABELS.map((label) => ({
                            label,
                            slug: FOOTER_SLUG_FALLBACK[label] || null,
                        }))
                    );
                }
            }
        })();
        return () => { cancelled = true; };
    }, []);
    return (
        <footer className="relative bg-[#111827] text-white pt-8 pb-6 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* Top Contact Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 " >
                    <p className="text-gray-400 text-sm text-white md:text-base text-center md:text-left">
                        For jobs email at <a href="mailto:hr@akoode.in">hr@akoode.in</a> or call <a href="tel:+91-124-4197516">+91-124-4197516</a>
                    </p>
                    <div className="flex items-center gap-1 bg-gradient-to-r from-[#474972] to-[#585c9c] rounded-lg px-4 py-1">
                        <div className="w-16 h-16 flex items-center justify-center shrink-0">
                            {/* Clutch/GoodFirms badge icon */}
                            <Image src="/footer/goodfirms.png" alt="Badge" width={74} height={74} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xs md:text-base font-medium text-white">Top Artificial Intelligence Companies in India 2026 - Goodfirms</span>
                    </div>
                </div>

                {/* Office Location Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {/* India Office */}
                    <div className="bg-black backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/20">
                        <h3 className="text-xl font-bold mb-6 text-[#7683c5]">India Office -</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <span className="w-10 h-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#02050a]">
                                    <MapPin size={18} />
                                </span>
                                <p className="text-sm text-gray-300 leading-relaxed pt-1">
                                    Tower B4, Spaze iTech Park, UN 616, Sohna - Gurgaon Rd, Block S, Sector 49, Gurugram, Haryana 122018
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-10 h-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#02050a]">
                                    <Mail size={18} />
                                </span>
                                <a href="mailto:info@akoode.com" className="text-sm text-gray-300 hover:text-white transition">info@akoode.com</a>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-10 h-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#02050a]">
                                    <Phone size={18} />
                                </span>
                                <a href="tel:+919899300017" className="text-sm text-gray-300 hover:text-white transition font-medium">+91-9899300017</a>
                            </div>
                        </div>
                    </div>

                    {/* USA Office */}
                    <div className="bg-black backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/20">
                        <h3 className="text-xl font-bold mb-6 text-[#7683c5]">USA Office -</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="w-10 h-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#02050a]">
                                    <MapPin size={18} />
                                </span>
                                <p className="text-sm text-gray-300 leading-relaxed pt-1">
                                    10816 South Olmsted St W Jenks, OK 74037, USA
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-10 h-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#02050a]">
                                    <Mail size={18} />
                                </span>
                                <a href="mailto:info@akoode.com" className="text-sm text-gray-300 hover:text-white transition">info@akoode.com</a>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-10 h-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#02050a]">
                                    <Phone size={18} />
                                </span>
                                <a href="tel:+17122141784" className="text-sm text-gray-300 hover:text-white transition font-medium">1-712 214 1784</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand & Bio */}
                    <div className="lg:col-span-5">
                        <Link href="/" aria-label="Akoode home" className="inline-block mb-6">
                            <Image src="/logo.svg" alt="Akoode Logo" width={160} height={50} className="w-auto h-12" />
                        </Link>
                        <p className="text-white text-sm leading-relaxed mb-8 max-w-sm">
                            Akoode Technologies is a leading software development company based in Gurgaon, India, and the USA, recognized for its excellence and reliability. We specialize in providing cutting-edge solutions, including AI-enabled mobile apps, websites, custom software, e-commerce platforms, blockchain development, IoT solutions, deep learning, data science, computer vision, integrated intelligence, and comprehensive 360-degree digital marketing services.
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="https://www.facebook.com/akoodetechnologies" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#02050a] transition hover:scale-110 p-2">
                                <Image src="/footer/facebook-app-symbol.svg" alt="Facebook" width={18} height={18} />
                            </a>
                            <a href="https://www.linkedin.com/company/akoode-technologies/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#02050a] transition hover:scale-110 p-1">
                                <Image src="/footer/linkedin (1).svg" alt="Linkedin" width={18} height={18} />
                            </a>
                            <a href="https://www.instagram.com/akoodetechnologies/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#02050a] transition hover:scale-110 p-1">
                                <Image src="/footer/instagram (1).svg" alt="Instagram" width={18} height={18} />
                            </a>
                            <a href="https://www.youtube.com/@akoodetechnologies" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#02050a] transition hover:scale-110 p-1">
                                <Image src="/footer/youtube.svg" alt="Youtube" width={18} height={18} />
                            </a>
                            <a href="https://x.com/akoodetech" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#02050a] transition hover:scale-110 p-3">
                                <Image src="/footer/twitter (1).svg" alt="Twitter" width={18} height={18} />
                            </a>

                        </div>
                    </div>

                    {/* Links and Services Wrapper */}
                    <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-12">
                        {/* Quick Links */}
                        <div className="lg:col-span-2 col-span-1">
                            <h4 className="text-lg font-bold mb-8">Quick Links</h4>
                            <ul className="space-y-4">
                                <li><Link href="/about-us" className="text-[#ffffff] text-sm hover:text-[#7683c5] transition-colors duration-300">About Us</Link></li>
                                <li><Link href="/case-studies" className="text-[#ffffff] text-sm hover:text-[#7683c5] transition-colors duration-300">Case Studies</Link></li>
                                <li><Link href="/blog" className="text-[#ffffff] text-sm hover:text-[#7683c5] transition-colors duration-300">Blogs</Link></li>
                                <li><Link href="/career" className="text-[#ffffff] text-sm hover:text-[#7683c5] transition-colors duration-300">Career</Link></li>
                                <li><Link href="/contact-us" className="text-[#ffffff] text-sm hover:text-[#7683c5] transition-colors duration-300">Contact Us</Link></li>
                                {/* <li><Link href="/ai-usage-policy" className="text-[#ffffff] text-sm hover:text-[#7683c5] transition-colors duration-300">AI Usage Policy</Link></li> */}
                                <li><Link href="/sitemap" className="text-[#ffffff] text-sm hover:text-[#7683c5] transition-colors duration-300">Sitemap</Link></li>
                            </ul>
                        </div>

                        {/* Our Services - same 12 as list, links match service list page slugs */}
                        <div className="lg:col-span-5 col-span-1">
                            <h4 className="text-lg font-bold mb-8">Our Services</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                                <ul className="space-y-4">
                                    {footerServices.slice(0, 6).map(({ label, slug }) => (
                                        <li key={label}>
                                            <Link
                                                href={slug ? `/services/${slug}` : "/services"}
                                                className="text-[#ffffff] text-sm hover:text-[#7683c5] transition-colors duration-300"
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="space-y-4">
                                    {footerServices.slice(6, 12).map(({ label, slug }) => (
                                        <li key={label}>
                                            <Link
                                                href={slug ? `/services/${slug}` : "/services"}
                                                className="text-[#ffffff] text-sm hover:text-[#7683c5] transition-colors duration-300"
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-5 border-t border-white text-center">
                    <p className="text-sm text-white">
                        &copy; Copyright 2026 | Akoode Technologies Private Limited. All Right Reserved | <a href="/privacy-policy" className="hover:text-[#7683c5] transition-colors duration-300">Privacy Policy</a> | <a href="/ai-usage-policy" className="hover:text-[#7683c5] transition-colors duration-300">AI  Usage Policy</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

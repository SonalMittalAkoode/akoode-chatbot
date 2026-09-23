"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { m, AnimatePresence } from 'framer-motion';
import { getCachedServices, getCachedServicesStale, setCachedServices, isCacheStale } from '@/utils/servicesCache';
import { getIndustryIcon } from '@/utils/industryIcons';
import {
    ChevronDown,
    Brain,
    LineChart,
    Code,
    Smartphone,
    Globe,
    ShoppingCart,
    Cpu,
    Link as LinkIcon,
    Users,
    TrendingUp,
    Database,
    Cloud,
    ArrowRight,
    Menu,
    X,
    Phone,
    Mail,
} from 'lucide-react';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About us', href: '/about-us' },
    { name: 'Services', href: '/services', hasDropdown: true, dropdownKey: 'Services' },
    { name: 'Industries', href: '/industries', hasDropdown: true, dropdownKey: 'Industries' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Career', href: '/career' },
    { name: 'Blogs', href: '/blog' },
    { name: 'Contact us', href: '/contact-us' },
];

// slug → icon map — matches on substring so real DB slugs work regardless of exact wording
const SERVICE_ICON_MAP = [
    { keywords: ['artificial-intelligence', 'ai-services', '/ai'], icon: Brain },
    { keywords: ['digital-transform'], icon: LineChart },
    { keywords: ['software-dev', 'software-development'], icon: Code },
    { keywords: ['mobile-app', 'mobile-application'], icon: Smartphone },
    { keywords: ['web-dev', 'web-developement', 'website-dev'], icon: Globe },
    { keywords: ['ecommerce', 'e-commerce', 'shopify', 'magento', 'woo'], icon: ShoppingCart },
    { keywords: ['iot', 'internet-of-things'], icon: Cpu },
    { keywords: ['blockchain', 'crypto'], icon: LinkIcon },
    { keywords: ['staff-augmentation', 'it-staff'], icon: Users },
    { keywords: ['digital-marketing', '360'], icon: TrendingUp },
    { keywords: ['big-data', 'data-analytics', 'data-science'], icon: Database },
    { keywords: ['cloud', 'devops'], icon: Cloud },
];

// Nav "call us" number per market. The market is the first path segment on every
// /<market>/<slug> and /<market>/<city>/<slug> page, so country and city pages
// resolve identically. Keys are lowercase and cover the market spellings used
// elsewhere in the app (see MARKET_ISO in ServiceByCountryClient).
//
// This replaces `pathParts[0] === 'us'`: no market is served at /us/ — the live
// segment is /usa/ (and next.config.mjs 301s /us/* to /usa/*) — so that check
// never matched and every market fell through to the India number.
const INDIA_PHONE = '+919899300017';
const MARKET_PHONE = {
    usa: '+17122141784',
    us: '+17122141784',
};

const stripHtml = (html) => (html ?? '').replace(/<[^>]*>/g, '').trim();
/** Mega-menu / mobile services list: show admin "Services Tag" (`project`) when set, else `title`. */
const serviceNavLabel = (item) => stripHtml(item?.project || item?.title || '');
const getIcon = (slug = '') => {
    const s = slug.toLowerCase();
    const match = SERVICE_ICON_MAP.find(({ keywords }) => keywords.some((k) => s.includes(k)));
    return match?.icon ?? Globe;
};



export default function NavBarClient({ initialServicesData = [], initialIndustriesData = [], forceTransparent = false }) {
    const pathname = usePathname();
    const router = useRouter();
    const isHomePage = pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
    const KNOWN_ROUTES = new Set(['about-us', 'services', 'case-study', 'case-studies', 'career', 'blog', 'author', 'contact-us', 'country', 'thebusinesshub', 'post-requirement', 'privacy-policy', 'thank-you', 'sitemap', 'ai-usage-policy', 'sitemaps']);
    const pathParts = pathname.split('/').filter(Boolean);
    const navPhone = MARKET_PHONE[(pathParts[0] || '').toLowerCase()] || INDIA_PHONE;
    const isCountryPage = (pathParts.length === 2 || pathParts.length === 3) && !KNOWN_ROUTES.has(pathParts[0]);
    const isIndustriesPage = pathname.startsWith('/industries');
    const isServicesV2Page = pathname === '/services-v2';
    const isServicesPage = pathname === '/services';
    const isTransparentNav = (isHomePage || isCountryPage || isIndustriesPage || isServicesV2Page || isServicesPage || forceTransparent) && !isScrolled;
    const [mobileExpandedService, setMobileExpandedService] = useState(null);
    // Seed from server-fetched prop so SSR/first-paint already has service links.
    // Falls back to client-side fetch when used without server wrapper.
    const [servicesData, setServicesData] = useState(initialServicesData);
    const [industriesData, setIndustriesData] = useState(initialIndustriesData);
    const dropdownCloseTimeoutRef = React.useRef(null);

    const clearDropdownCloseTimeout = () => {
        if (dropdownCloseTimeoutRef.current) {
            clearTimeout(dropdownCloseTimeoutRef.current);
            dropdownCloseTimeoutRef.current = null;
        }
    };

    const scheduleDropdownClose = () => {
        clearDropdownCloseTimeout();
        dropdownCloseTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 180);
    };

    const openDropdown = (key) => {
        clearDropdownCloseTimeout();
        setActiveDropdown(key);
        if (key === 'Services') {
            servicesData.forEach((s) => {
                if (s.slug) router.prefetch(`/services/${s.slug}`);
                if (Array.isArray(s.children)) {
                    s.children.forEach((c) => { if (c.slug) router.prefetch(`/services/${c.slug}`); });
                }
            });
        }
    };

    useEffect(() => {
        // If server already seeded data, prime the in-memory cache and skip fetch.
        if (initialServicesData.length > 0) {
            setCachedServices(initialServicesData);
            return;
        }

        // Fallback: client-side fetch when no server prop (e.g. direct use without wrapper).
        const cached = getCachedServices() ?? getCachedServicesStale();
        if (cached?.length) setServicesData(cached);

        if (!isCacheStale()) return;

        const fetchServices = async () => {
            try {
                const BASE_URL = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? '').replace(/\/$/, '');
                const res = await fetch(`${BASE_URL}/api/services`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setCachedServices(data);
                        setServicesData(data);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch services:', err);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        if (initialIndustriesData.length > 0) return;
        const fetchIndustries = async () => {
            try {
                const SERVER_BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? '').replace(/\/$/, '').replace(/\/admin$/, '');
                const res = await fetch(`${SERVER_BASE}/frontend/api/industry/list`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data?.items)) {
                        const slim = data.items
                            .map((i) => ({ _id: i._id, slug: i.slug, name: i.name }))
                            .sort((a, b) => (a._id < b._id ? -1 : 1));
                        setIndustriesData(slim);
                    }
                }
            } catch { /* silently fail */ }
        };
        fetchIndustries();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    useEffect(() => () => clearDropdownCloseTimeout(), []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 py-3 px-4 md:px-4 font-figtree ${isTransparentNav
                ? 'bg-transparent backdrop-blur-none shadow-none'
                : 'bg-[#383b5a]/90 backdrop-blur-md shadow-none'
            }`}
            style={{
                borderBottom: 'none'
            }}
        >
            <div className="relative max-w-[1400px] mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link href="/" aria-label="Akoode home" className="flex-shrink-0 transition-transform hover:scale-105">
                    <Image
                        src="/logo.svg"
                        alt="Akoode Logo"
                        width={140}
                        height={44}
                        className="h-8 md:h-10 w-auto"
                        priority
                    />
                </Link>

                {/* Desktop Nav Links — inline flex, no absolute positioning */}
                <div
                    className="hidden lg:flex items-center gap-8 xl:gap-7"
                    onMouseLeave={scheduleDropdownClose}
                >
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative group whitespace-nowrap"
                            onMouseEnter={() => {
                                if (link.hasDropdown) openDropdown(link.dropdownKey);
                                else {
                                    clearDropdownCloseTimeout();
                                    setActiveDropdown(null);
                                    router.prefetch(link.href);
                                }
                            }}
                        >
                            <Link
                                href={link.href ?? '#'}
                                className="text-[15px] font-medium text-white/90 hover:text-white transition-colors flex items-center gap-1.5"
                                onClick={(e) => link.hasDropdown && link.name !== 'Services' && link.name !== 'Industries' && e.preventDefault()}
                            >
                                {link.name}
                                {link.hasDropdown && (
                                    <ChevronDown className={`text-[12px] transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} size={14} />
                                )}
                            </Link>

                            {/* Hover underline indicator */}
                            <m.div
                                className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#7C86FF] origin-left"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    ))}
                </div>

                {/* Mega Menu — anchored to nav container, NOT inside nav-links wrapper */}
                <AnimatePresence>
                    {activeDropdown === 'Services' && (
                        <m.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.22 }}
                            onMouseEnter={() => openDropdown('Services')}
                            onMouseLeave={scheduleDropdownClose}
                            className="absolute left-0 right-0 top-[calc(100%+6px)] mx-auto w-full max-w-[1200px] bg-[#fcfcfc] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[998]"
                        >
                            <div className="relative">
                                <div className="grid grid-cols-4 gap-x-8 gap-y-10">
                                    {servicesData.map((service) => {
                                        const Icon = getIcon(service.slug);
                                        const hasChildren = service.children?.length > 0;
                                        return (
                                            <div key={service._id} className="group/card relative flex flex-col">

                                                {/* Parent row — always visible */}
                                                <Link
                                                    href={`/services/${service.slug}`}
                                                    className="flex items-center gap-4 hover:translate-x-1 transition-transform duration-300"
                                                    onClick={() => setActiveDropdown(null)}
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-black/10 flex items-center justify-center text-black/60 group-hover/card:text-[#7C86FF] group-hover/card:border-[#7C86FF]/50 transition-colors shrink-0">
                                                        <Icon size={20} />
                                                    </div>
                                                    <span className="text-[14px] font-medium text-[#474972] group-hover/card:text-black transition-colors leading-tight flex-1 min-w-0 truncate">
                                                        {serviceNavLabel(service)}
                                                    </span>
                                                    {hasChildren && (
                                                        <ChevronDown
                                                            size={12}
                                                            className="shrink-0 text-black/90 group-hover/card:text-black/70 group-hover/card:rotate-180 transition-all duration-300"
                                                        />
                                                    )}
                                                </Link>

                                                {/* Children — absolute overlay, does NOT push grid rows */}
                                                {hasChildren && (
                                                    <div className="pointer-events-none group-hover/card:pointer-events-auto absolute left-0 top-full z-[50] w-56 pt-2">
                                                        <div className="opacity-0 group-hover/card:opacity-100 translate-y-1 group-hover/card:translate-y-0 transition-all duration-300 delay-75 bg-[#fcfcfc] border border-white/10 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-3 flex flex-col gap-1">
                                                            {service.children.map((child) => (
                                                                <Link
                                                                    key={child._id}
                                                                    href={`/services/${child.slug}`}
                                                                    className="text-[13px] text-[#474972] hover:text-black hover:bg-black/5 transition-all duration-200 leading-snug rounded-lg px-2 py-1"
                                                                    onClick={() => setActiveDropdown(null)}
                                                                >
                                                                    {serviceNavLabel(child)}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Decorative gradient */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#7C86FF]/10 blur-[60px] rounded-full pointer-events-none" />
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>

                {/* Industries Mega Menu */}
                <AnimatePresence>
                    {activeDropdown === 'Industries' && (
                        <m.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.22 }}
                            onMouseEnter={() => openDropdown('Industries')}
                            onMouseLeave={scheduleDropdownClose}
                            className="absolute left-0 right-0 top-[calc(100%+6px)] mx-auto w-full max-w-[1200px] bg-[#fcfcfc] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[998]"
                        >
                            <div className="relative">
                                <div className="grid grid-cols-5 gap-x-6 gap-y-6">
                                    {industriesData.map((industry) => {
                                        const Icon = getIndustryIcon(industry.slug);
                                        return (
                                            <Link
                                                key={industry._id ?? industry.slug}
                                                href={`/industries/${industry.slug}`}
                                                className="group/card flex items-center gap-3 hover:translate-x-1 transition-transform duration-300"
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-black/10 flex items-center justify-center text-black/60 group-hover/card:text-[#7C86FF] group-hover/card:border-[#7C86FF]/50 transition-colors shrink-0">
                                                    <Icon size={20} />
                                                </div>
                                                <span className="text-[13px] font-medium text-[#474972] group-hover/card:text-black transition-colors leading-tight">
                                                    {industry.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#7C86FF]/10 blur-[60px] rounded-full pointer-events-none" />
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Phone Button */}
                    <button
                        className="hidden cursor-pointer border-[1.5px] border-[#7683C5] lg:flex w-10 h-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                        style={{
                            background: 'linear-gradient(180deg, #7784C5 0%, #495074 50%, #4F5581 100%)',
                            borderTop: '0.8px solid #FFFFFF33'
                        }}
                        onClick={() => { window.location.href = `tel:${navPhone}`; }}
                        aria-label={`Call ${navPhone}`}
                        title="Call us"
                    >
                        <Image
                            src="/Vector.svg"
                            alt="Phone"
                            width={18}
                            height={18}
                            className="w-[18px] h-[18px]"
                            aria-hidden
                        />
                    </button>

                    {/* Post Requirement Button */}
                    <button
                        className="hidden cursor-pointer lg:flex relative group px-4 py-2 rounded-full font-bold text-[13px] text-white transition-all duration-300 flex items-center gap-2 border-[1.5px] border-[#7683C5]"
                        style={{
                            background: 'linear-gradient(180deg, #7784C5 0%, #495074 50%, #4F5581 100%)',
                            boxShadow: '0px 0px 30px 0px #A855F766'
                        }}
                        onClick={() => router.push('/post-requirement')}
                    >
                        <span className="relative z-10">Post Requirement</span>
                        <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Mobile: phone & email icons in circular bg, then hamburger */}
                    <a
                        href={`tel:${navPhone}`}
                        className="lg:hidden w-9 h-9 rounded-full bg-[#2d3142] flex items-center justify-center text-white hover:bg-[#3d4152] transition-colors"
                        aria-label={`Call ${navPhone}`}
                    >
                        <Phone size={18} strokeWidth={2} />
                    </a>
                    <a
                        href="mailto:info@akoode.com"
                        className="lg:hidden w-9 h-9 rounded-full bg-[#2d3142] flex items-center justify-center text-white hover:bg-[#3d4152] transition-colors"
                        aria-label="Email"
                    >
                        <Mail size={18} strokeWidth={2} />
                    </a>
                    <button
                        className="lg:hidden w-9 h-9 flex items-center justify-center text-white/90"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-[100%] left-0 right-0 bg-[#1e2235] border-b border-white/10 py-8 px-6 backdrop-blur-xl max-h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <div key={link.name} className="flex flex-col">
                                    <div
                                        className="text-lg font-medium text-white/80 hover:text-white flex items-center justify-between cursor-pointer py-2"
                                        onClick={() => {
                                            if (link.hasDropdown) {
                                                setMobileOpenDropdown(mobileOpenDropdown === link.dropdownKey ? null : link.dropdownKey);
                                            } else {
                                                setMobileMenuOpen(false);
                                            }
                                        }}
                                    >
                                        <Link
                                            href={link.href ?? '#'}
                                            onClick={(e) => link.hasDropdown && link.name !== 'Services' && link.name !== 'Industries' && e.preventDefault()}
                                        >
                                            {link.name}
                                        </Link>
                                        {link.hasDropdown && (
                                            <ChevronDown className={`text-xs transition-transform duration-300 ${mobileOpenDropdown === link.dropdownKey ? 'rotate-180' : ''}`} size={16} />
                                        )}
                                    </div>

                                    {/* Mobile Services Submenu */}
                                    <AnimatePresence>
                                        {link.dropdownKey === 'Services' && mobileOpenDropdown === 'Services' && (
                                            <m.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-white/5 rounded-xl mt-2"
                                            >
                                                <div className="flex flex-col p-2 gap-1">
                                                    {servicesData.map((service) => {
                                                        const Icon = getIcon(service.slug);
                                                        const hasChildren = service.children?.length > 0;
                                                        const isExpanded = mobileExpandedService === service._id;
                                                        const parentHref = service.slug ? `/services/${service.slug}` : '/services';
                                                        return (
                                                            <div key={service._id} className="flex flex-col">
                                                                <div className="flex items-center gap-3 w-full text-left px-2 py-2 rounded-lg hover:bg-white/5">
                                                                    <Link
                                                                        href={parentHref}
                                                                        className="flex items-center gap-3 flex-1 min-w-0 text-white/70 hover:text-white transition-colors"
                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                    >
                                                                        <Icon size={14} className="w-5 flex-shrink-0 text-[#7C86FF]" />
                                                                        <span className="text-[13px]">{serviceNavLabel(service)}</span>
                                                                    </Link>
                                                                    {hasChildren && (
                                                                        <button
                                                                            type="button"
                                                                            className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors touch-manipulation"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                setMobileExpandedService(isExpanded ? null : service._id);
                                                                            }}
                                                                            aria-label={isExpanded ? 'Collapse submenu' : 'Expand submenu'}
                                                                        >
                                                                            <ChevronDown
                                                                                size={13}
                                                                                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                                            />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <AnimatePresence initial={false}>
                                                                    {hasChildren && isExpanded && (
                                                                        <m.div
                                                                            key="children"
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.3 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="flex flex-col gap-0.5 pl-8 py-1 border-l border-white/10 ml-4 mb-1">
                                                                                {service.children.map((child) => (
                                                                                    <Link
                                                                                        key={child._id}
                                                                                        href={`/services/${child.slug}`}
                                                                                        className="text-[12px] text-white/50 hover:text-white transition-colors py-1 px-2 rounded-md hover:bg-white/5"
                                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                                    >
                                                                                        {serviceNavLabel(child)}
                                                                                    </Link>
                                                                                ))}
                                                                            </div>
                                                                        </m.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </m.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Mobile Industries Submenu */}
                                    <AnimatePresence>
                                        {link.dropdownKey === 'Industries' && mobileOpenDropdown === 'Industries' && (
                                            <m.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-white/5 rounded-xl mt-2"
                                            >
                                                <div className="flex flex-col p-2 gap-1">
                                                    {industriesData.map((industry) => {
                                                        const Icon = getIndustryIcon(industry.slug);
                                                        return (
                                                            <Link
                                                                key={industry._id ?? industry.slug}
                                                                href={`/industries/${industry.slug}`}
                                                                className="flex items-center gap-3 px-2 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                                onClick={() => setMobileMenuOpen(false)}
                                                            >
                                                                <Icon size={14} className="w-5 flex-shrink-0 text-[#7C86FF]" />
                                                                <span className="text-[13px]">{industry.name}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </m.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                            <div className="pt-4 flex items-center gap-4">
                                <button
                                    className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300"
                                    style={{
                                        background: '#FFFFFF1A',
                                        borderTop: '0.8px solid #FFFFFF33'
                                    }}
                                    onClick={() => { window.location.href = `tel:${navPhone}`; }}
                                    aria-label={`Call ${navPhone}`}
                                >
                                    <Image
                                        src="/Vector.svg"
                                        alt="Phone"
                                        width={24}
                                        height={24}
                                        className="w-6 h-6"
                                        aria-hidden
                                    />
                                </button>
                                <button
                                    className="flex-1 py-4 rounded-full font-bold text-white text-center border-[1.5px] border-[#7683C5]"
                                    style={{
                                        background: 'linear-gradient(180deg, #7784C5 0%, #495074 50%, #4F5581 100%)',
                                        boxShadow: '0px 0px 30px 0px #A855F766'
                                    }}
                                    onClick={() => {
                                        router.push('/post-requirement');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Post Requirement
                                </button>
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

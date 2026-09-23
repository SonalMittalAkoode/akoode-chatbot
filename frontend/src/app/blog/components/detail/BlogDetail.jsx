'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import resolveImageUrl from '@/utils/resolveImageUrl';
import { addEnquiryAPI } from '@/api/frontend/enquiry';
import { trackBlogView } from '@/api/frontend/blog';
import { countryCodes } from '@/utils/countryCodes';
import { isValidEmail, isValidPhone, normalizeEmail, sanitizePhone } from '@/utils/formValidation';
import { processHtmlLinks } from '@/utils/processHtmlLinks';
import { ArrowRight, RotateCcw } from "lucide-react";
import Image from 'next/image';
import TableOfContents from './TableOfContents';
import AiSummarize from './AiSummarize';
import GooglePreferredSource from './GooglePreferredSource';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractAndEnrichH2s(html) {
  if (!html) return { enrichedHtml: html || '', headings: [] };
  const headings = [];
  const usedIds = new Set();
  const enrichedHtml = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, content) => {
    if (/\bid\s*=/.test(attrs)) return match;
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (!text) return match;
    let id = slugify(text) || `section-${headings.length}`;
    if (usedIds.has(id)) id = `${id}-${headings.length}`;
    usedIds.add(id);
    headings.push({ id, text });
    return `<h2${attrs} id="${id}">${content}</h2>`;
  });
  return { enrichedHtml, headings };
}

const formatBlogDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return 'Recent';
  return parsed.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const asHtml = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join('');
  if (typeof value === 'object') return JSON.stringify(value);
  return null;
};

/* Shared input class for all form fields */
const inputClass =
  'w-full bg-white border border-gray-200 rounded-[4px] px-4 py-3 text-[14px] text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#474972] transition-colors duration-200 mb-4';

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

export default function BlogDetailSection({ blog, relatedBlogs = [], pageUrl: pageUrlProp }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    countryCode: '+91',
    phone: '',
    email: '',
    serviceType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({ question: '', answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateMathCaptcha());
    setCaptchaInput('');
  }, []);

  useEffect(() => {
    setCaptcha(generateMathCaptcha());
  }, []);

  // Count this as a real view once per mount — feeds /blog's live Trending ranking.
  useEffect(() => {
    if (blog?.slug) trackBlogView(blog.slug);
  }, [blog?.slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'phone' ? sanitizePhone(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.serviceType || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (parseInt(captchaInput.trim(), 10) !== captcha.answer) {
      toast.error('Incorrect answer. Please solve the security check.');
      refreshCaptcha();
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!isValidPhone(formData.phone)) {
      toast.error('Please enter a valid phone number.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await addEnquiryAPI({
        fullName: formData.fullName,
        phone: `${formData.countryCode} ${sanitizePhone(formData.phone)}`,
        email: normalizeEmail(formData.email),
        service: formData.serviceType,
        message: formData.message,
      });
      if (result.status === 'success') {
        toast.success(result.message || 'Thank you for your message. It has been sent.');
        setFormData({ fullName: '', countryCode: '+91', phone: '', email: '', serviceType: '', message: '' });
        refreshCaptcha();
        setTimeout(() => {
          router.push('/thank-you?type=general-enquiry');
        }, 600);
      } else {
        toast.error(result.message || 'Failed to send enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error(error.message || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Not found state ── */
  if (!blog) {
    return (
      /* .vl-blog-details-section .sp1 */
      <div className="relative z-[1] py-[70px]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Blog not found</h3>
            <p className="text-gray-500">The blog you are looking for might have been removed or is temporarily unavailable.</p>
          </div>
        </div>
      </div>
    );
  }

  const primaryImage =
    blog.logoimage ||
    (Array.isArray(blog.images) && blog.images.length > 0 && blog.images[0]) ||
    (typeof blog.image === 'string' ? blog.image : null) ||
    '/images/blog/blog1.webp';

  const imageUrl = resolveImageUrl(primaryImage) || '/images/blog/blog1.webp';
  const formattedDate = formatBlogDate(blog.date || blog.publishedOn || blog.createdAt);
  const categoryTitle =
    (blog.blogcategory && (blog.blogcategory.title || blog.blogcategory.name)) || 'BestTechSolution';
  const authorName =
    (blog.author && (typeof blog.author === 'object' ? blog.author.name : null)) ||
    blog.authorName ||
    null;

  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  const pageUrl = pageUrlProp || '';
  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareTitle = encodeURIComponent(blog.title || '');
  const introHeading = blog.introheading;
  const introHtml = processHtmlLinks(asHtml(blog.introcontent));
  const rawBodyHtml =
    processHtmlLinks(asHtml(blog.body)) ||
    processHtmlLinks(asHtml(blog.richdescription)) ||
    processHtmlLinks(asHtml(blog.description));
  const { enrichedHtml: bodyHtml, headings: tocHeadings } = extractAndEnrichH2s(rawBodyHtml);
  const hasToc = tocHeadings.length > 0;
  const galleryImages = (Array.isArray(blog.gallery) ? blog.gallery : []).filter(Boolean);
  if (galleryImages.length === 0 && Array.isArray(blog.images)) {
    galleryImages.push(...blog.images.filter((img) => img && img !== primaryImage));
  }

  const displayRelatedBlogs = Array.isArray(relatedBlogs) ? relatedBlogs.slice(0, 3) : [];

  const formatRelatedBlogDate = (value) => {
    const parsed = value ? new Date(value) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) return 'Recent';
    return parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    /* .vl-blog-details-section .sp1 — relative, z-1, py-70px */
    <div className="relative z-[1] py-10 md:py-[70px] bg-white">
      <div className="w-full font-figtree px-4 md:px-6 lg:px-10">

        {/* .row → 12-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* ── TOC column (left, desktop only) ── */}
          {hasToc && (
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-[65px] z-[10] flex flex-col gap-6">
                <TableOfContents headings={tocHeadings} />
                <AiSummarize url={pageUrl} />
                <GooglePreferredSource />
              </div>
            </div>
          )}

          {/* ── Center column: image + content ── */}
          <div className={hasToc ? 'lg:col-span-6' : 'lg:col-span-9'}>

            {/* blog content wrapper */}
            <div className="relative z-[1]">

              {/* .img1 img — w-full, object-cover, rounded-[8px] */}
              <div className="relative">
                <Image
                  src={imageUrl}
                  alt={blog.title || "image"}
                  width={800}
                  height={450}
                  sizes="(max-width:768px) 100vw, 800px"
                  className="w-full h-auto object-cover rounded-[8px]"
                />
                {/* Floating share icon — bottom-right of image on all screen sizes */}
                <button
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-black/45 backdrop-blur-sm text-white border border-white/25 hover:bg-[#474972]/85 transition-all duration-200 cursor-pointer"
                  aria-label="Share"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>

              {/* space32 */}
              <div className="h-4 md:h-8" />

              {/* .list-author
                  li:nth-child(1) a → bg-[#474972] text-white p-[10px] rounded-[4px]
                  other li a       → text-[#1a1a1a] text-[16px] */}
              <ul className="flex flex-wrap items-center gap-2 md:gap-3 w-full">
                <li>
                  <a
                    href="#"
                    className="bg-[#474972] text-white text-[13px] md:text-[14px] font-medium px-[8px] md:px-[10px] py-[6px] md:py-[8px] rounded-[4px] hover:bg-[#3a3c63] transition-colors"
                  >
                    #{categoryTitle}
                  </a>
                </li>
                <li>
                  <a href="#" className="inline-flex items-center gap-1 text-[#1a1a1a] text-[13px] md:text-[16px] hover:text-[#474972] transition-colors">
                    <Image
                      src="/calendar.svg"
                      alt="Calendar"
                      width={16}
                      height={16}
                      unoptimized
                      className="w-3.5 h-3.5 md:w-4 md:h-4"
                    />
                    {formattedDate}
                    <span className="text-gray-400 mx-1">|</span>
                  </a>
                </li>
                {authorName && (
                  <li>
                    <a href="#" className="text-[#1a1a1a] text-[13px] md:text-[16px] hover:text-[#474972] transition-colors">
                      {authorName}
                    </a>
                  </li>
                )}

              </ul>

              {/* ── Share popup modal ── */}
              {shareOpen && (
                <div
                  className="fixed inset-0 z-[9999] flex items-center justify-center"
                  onClick={() => setShareOpen(false)}
                >
                  {/* backdrop */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                  {/* card */}
                  <div
                    className="relative bg-white rounded-[12px] shadow-2xl w-[92vw] max-w-[380px] p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* header */}
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-[16px] font-semibold text-[#1a1a1a]">Share this article</h3>
                      <button
                        type="button"
                        onClick={() => setShareOpen(false)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f4f4f8] hover:bg-[#474972] text-[#666] hover:text-white transition-colors cursor-pointer"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* social grid */}
                    <div className="grid grid-cols-3 gap-3 mb-5">

                      {/* X / Twitter */}
                      <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 py-3 rounded-[8px] bg-[#f9f9fb] hover:bg-[#000] text-[#1a1a1a] hover:text-white transition-colors duration-200 group"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.737-8.845L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span className="text-[11px] font-medium">X (Twitter)</span>
                      </a>

                      {/* Facebook */}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 py-3 rounded-[8px] bg-[#f9f9fb] hover:bg-[#1877f2] text-[#1a1a1a] hover:text-white transition-colors duration-200"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                        </svg>
                        <span className="text-[11px] font-medium">Facebook</span>
                      </a>

                      {/* LinkedIn */}
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 py-3 rounded-[8px] bg-[#f9f9fb] hover:bg-[#0a66c2] text-[#1a1a1a] hover:text-white transition-colors duration-200"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <span className="text-[11px] font-medium">LinkedIn</span>
                      </a>

                      {/* Instagram (profile link — no direct share API) */}
                      <a
                        href="https://www.instagram.com"
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 py-3 rounded-[8px] bg-[#f9f9fb] hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:via-[#dc2743] hover:via-[#cc2366] hover:to-[#bc1888] text-[#1a1a1a] hover:text-white transition-all duration-200"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                        <span className="text-[11px] font-medium">Instagram</span>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 py-3 rounded-[8px] bg-[#f9f9fb] hover:bg-[#25d366] text-[#1a1a1a] hover:text-white transition-colors duration-200"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="text-[11px] font-medium">WhatsApp</span>
                      </a>

                      {/* Pinterest */}
                      <a
                        href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTitle}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 py-3 rounded-[8px] bg-[#f9f9fb] hover:bg-[#e60023] text-[#1a1a1a] hover:text-white transition-colors duration-200"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                        </svg>
                        <span className="text-[11px] font-medium">Pinterest</span>
                      </a>
                    </div>

                    {/* copy link row */}
                    <div className="flex items-center gap-2 p-3 rounded-[8px] bg-[#f4f4f8] border border-[#e8e8f0]">
                      <span className="flex-1 text-[12px] text-[#666] truncate">
                        {typeof window !== 'undefined' ? window.location.href : ''}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-[5px] bg-[#474972] hover:bg-[#3a3c63] text-white text-[12px] font-medium transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                            </svg>
                            Copy link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* space24 */}
              <div className="h-4 md:h-6" />
              <div className="h-3 md:h-5" />

              {introHeading && (
                <h5 className="text-[18px] font-semibold text-[#1a1a1a] mb-2">{introHeading}</h5>
              )}

              {introHtml ? (
                <div
                  className="blog-intro"
                  dangerouslySetInnerHTML={{ __html: introHtml }}
                />
              ) : blog.shortdescription ? (
                <p className="text-[#444] leading-relaxed">{blog.shortdescription}</p>
              ) : null}

              {bodyHtml && (
                <div
                  className="blog-body mt-4"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              )}

              {/* Gallery images */}
              {galleryImages.length > 0 && (
                <>
                  <div className="h-[18px]" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-5 md:mt-[30px]">
                    {galleryImages.slice(0, 2).map((img, index) => (
                      <div key={`${img}-${index}`} className="overflow-hidden rounded-[8px] group">
                        <Image
                          src={resolveImageUrl(img) || "/images/blog/blog1.webp"}
                          alt="image"
                          width={800}
                          height={450}
                          sizes="(max-width:768px) 100vw, 800px"
                          className="w-full h-auto object-cover rounded-[8px] transition-all duration-[400ms] group-hover:scale-110 group-hover:-rotate-[4deg] group-hover:grayscale"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Blog Tags ── */}
              {Array.isArray(blog.tags) && blog.tags.filter(Boolean).length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#e8eaf5]">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#474972" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#474972]">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eff1ff] border border-[#d0d3ee] text-[#474972] text-[12.5px] font-medium transition-all duration-200 hover:bg-[#474972] hover:text-white hover:border-[#474972] cursor-default select-none"
                      >
                        <span className="opacity-50 text-[11px]">#</span>{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right sidebar column ── */}
          <div className="lg:col-span-3">

            {/* .blog-sticky-form-wrapper — sticky on desktop only */}
            <div className="lg:sticky lg:top-[65px] lg:z-[10]">

              {/* .contact-boxarea */}
              <div className="bg-[#EFF1FF] px-7 py-6 rounded-[8px]">
                <h3 className="text-[22px] font-bold text-[#1a1a1a]">Get In Touch Now</h3>
                <div className="h-2" />
                <form onSubmit={handleSubmit} className="mt-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name*"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                  <div className="mb-4 flex h-[50px] gap-0">
                    <select
                      name="countryCode"
                      aria-label="Country calling code"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="min-w-[96px] rounded-l-[4px] border border-gray-200 border-r-0 bg-white px-2 text-[14px] text-[#99a1b4] focus:outline-none focus:border-[#474972]"
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
                      className="mb-0 w-full rounded-r-[4px] border border-gray-200 bg-white px-4 py-3 text-[14px] text-[#1a1a1a] placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:border-[#474972]"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                  <input
                    type="text"
                    name="serviceType"
                    placeholder="Service Interested In*"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={1}
                    className={`${inputClass} resize-none`}
                  />

                  <div className="mb-4">
                    <label className="mb-2 block text-[13px] font-semibold text-[#1a1a1a]">
                      Captcha*
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="flex h-[46px] w-auto shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] border border-gray-200 bg-white px-4 font-mono text-[16px] font-bold text-[#474972]">
                          {captcha.question} = ?
                        </span>
                        <button
                          type="button"
                          onClick={refreshCaptcha}
                          className="flex h-10 w-10 shrink-0 items-center justify-center text-[#474972] transition-transform duration-500 hover:rotate-180"
                          title="Refresh captcha"
                          aria-label="Refresh captcha"
                        >
                          <RotateCcw size={18} />
                        </button>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="Answer"
                        autoComplete="off"
                        required
                        className="mb-0 min-w-0 flex-1 bg-white border border-gray-200 rounded-[4px] px-4 py-3 text-[14px] text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#474972] transition-colors duration-200"
                      />
                    </div>
                  </div>

                  {/* space32 */}
                  <div className="h-8" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2
                      bg-[#474972] text-white font-semibold text-[15px]
                      px-6 py-3 rounded-[4px]
                      hover:bg-[#3a3c63] disabled:opacity-60
                      transition-colors duration-200"
                  >
                    {isSubmitting ? 'Sending…' : 'Get Started Now'}
                    <ArrowRight className="inline-block" size={13} />
                  </button>
                </form>
              </div>

              {/* .blog-related-sidebar — sits directly below the form, no separate sticky */}
              {displayRelatedBlogs.length > 0 && (
                <div className="bg-[#EFF1FF] px-7 py-6 rounded-[8px] mt-8">
                  <h3 className="text-[20px] font-bold text-[#1a1a1a]">View More Our Blog</h3>

                  {/* space24 */}
                  <div className="h-6" />

                  {/* .blog-related-item — flex flex-col gap-4 */}
                  <div className="flex flex-col gap-4">
                    {displayRelatedBlogs.map((relatedBlog) => {
                      const relatedImage =
                        relatedBlog.logoimage ||
                        (Array.isArray(relatedBlog.images) && relatedBlog.images.length > 0 && relatedBlog.images[0]) ||
                        (typeof relatedBlog.image === 'string' ? relatedBlog.image : null);
                      const relatedImageUrl = resolveImageUrl(relatedImage) || '/images/blog/blog1.webp';
                      const relatedSlug = relatedBlog.slug || relatedBlog._id || '#';
                      const relatedFormattedDate = formatRelatedBlogDate(
                        relatedBlog.date || relatedBlog.publishedOn || relatedBlog.createdAt
                      );

                      return (
                        <div
                          key={relatedBlog._id ?? relatedBlog.slug ?? relatedBlog.id}
                          className="flex flex-col gap-[16px]"
                        >
                          {/* Thumbnail — w-full, object-cover, rounded-[8px] */}
                          <Link href={`/blog/${relatedSlug}`} className="overflow-hidden rounded-[8px] block">
                            <Image
                              src={relatedImageUrl}
                              alt={relatedBlog.title || "Blog image"}
                              width={400}
                              height={140}
                              sizes="(max-width:768px) 100vw, 400px"
                              className="w-full h-[140px] object-cover rounded-[8px] hover:scale-105 transition-transform duration-300"
                            />
                          </Link>

                          <div>
                            {/* Date */}
                            <span className="inline-flex items-center gap-1 text-[13px] text-[#474972] font-medium">
                              <Image
                                src="/calendar.svg"
                                alt="Calendar icon"
                                width={13}
                                height={13}
                                unoptimized
                                className="w-[13px] h-[13px]"
                              />
                              {relatedFormattedDate}
                            </span>

                            {/* space12 */}
                            <div className="h-3" />

                            <h4 className="text-[15px] font-semibold text-[#1a1a1a] leading-[22px] line-clamp-2">
                              <Link href={`/blog/${relatedSlug}`} className="hover:text-[#474972] transition-colors duration-300">
                                {relatedBlog.title || 'Blog Title'}
                              </Link>
                            </h4>

                            {/* space16 */}
                            <div className="h-4" />

                            {/* .readmore */}
                            <Link
                              href={`/blog/${relatedSlug}`}
                              className="inline-flex items-center gap-[5px] text-[13px] font-semibold
                                text-[#1a1a1a] hover:text-[#474972] transition-colors duration-300"
                            >
                              Learn More <span className="sr-only">about {relatedBlog.title || 'this post'}</span>
                              <ArrowRight className="-rotate-45" size={11} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

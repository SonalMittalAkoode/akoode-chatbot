"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowRight } from 'lucide-react';
import { subscribeNewsletterAPI } from '@/api/newsletter';
import { isValidEmail, normalizeEmail } from '@/utils/formValidation';

const AVATAR_COLORS = ['#7C3AED', '#D97706', '#059669', '#2563EB'];
const AVATAR_INITIALS = ['P', 'J', 'S', 'A'];

const SubscribeForm2 = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: null, text: '' });
    const [showThankYouModal, setShowThankYouModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = normalizeEmail(email);
        if (!trimmedEmail) {
            setMessage({ type: 'error', text: 'Please enter your email address.' });
            toast.error('Please enter your email address.');
            return;
        }
        if (!isValidEmail(trimmedEmail)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            toast.error('Please enter a valid email address.');
            return;
        }
        setMessage({ type: null, text: '' });
        setLoading(true);
        try {
            const result = await subscribeNewsletterAPI(trimmedEmail);
            if (result?.status === 'success') {
                setMessage({ type: 'success', text: 'Thank you! You’re subscribed. Check your inbox for a welcome email.' });
                setEmail('');
                toast.success("You're subscribed! Check your inbox for a welcome email.");
                setShowThankYouModal(true);
            } else {
                const errMsg = result?.message || 'Subscription failed. Please try again.';
                setMessage({ type: 'error', text: errMsg });
                toast.error(errMsg);
            }
        } catch (err) {
            const msg = err?.message || err?.response?.data?.message || 'Something went wrong. Please try again later.';
            setMessage({ type: 'error', text: msg });
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="relative overflow-hidden bg-gradient-to-b from-[#1F2336] to-[#130F25] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                {/* Glow blobs — matches Figma's two blurred ellipses */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-24 top-10 h-[280px] w-[380px] rounded-full bg-[#6374D2] opacity-70 blur-[120px] sm:h-[340px] sm:w-[480px] lg:h-[432px] lg:w-[608px]"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -left-24 -top-10 h-[180px] w-[200px] rounded-full bg-[#6374D2] opacity-60 blur-[100px] sm:h-[240px] sm:w-[260px] lg:h-[320px] lg:w-[329px]"
                />

                <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                    {/* Heading + subtitle */}
                    <div className="flex max-w-[857px] flex-col gap-3 sm:gap-4">
                        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[32px]">
                            Stay Informed With{' '}
                            <span className="text-[#7784C5]">Thoughtful Innovation</span>
                        </h2>
                        <p className="text-sm leading-relaxed text-white/80 md:text-[15px]">
                            Subscribe To The Akoode Newsletter For Carefully Curated Insights On AI,
                            Digital Intelligence, And Real-World Innovation.
                        </p>
                    </div>

                    {/* Form + trust row */}
                    <div className="flex w-full flex-col gap-5 lg:w-auto lg:max-w-[500px]">
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="flex items-center gap-2 rounded-full border border-white/20 py-1.5 pl-6 pr-1.5">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    required
                                    className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-white placeholder:text-white/60 outline-none disabled:opacity-70 sm:text-[18px]"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-[#889AF5] bg-gradient-to-r from-[#7784C5] via-[#4F60B5] to-[#4F5581] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.30)] transition-opacity disabled:opacity-70 sm:text-[18px]"
                                >
                                    {loading ? 'Subscribing…' : 'Subscribe'}
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                                </button>
                            </div>
                            {message.text && (
                                <p className={`mt-3 text-sm ${message.type === 'success' ? 'text-white/95' : 'text-red-300'}`}>
                                    {message.text}
                                </p>
                            )}
                        </form>

                        {/* Avatars + trust row */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center">
                                {AVATAR_INITIALS.map((initial, i) => (
                                    <div
                                        key={initial}
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#39374A] text-[13px] font-bold text-white${i > 0 ? ' -ml-3' : ''}`}
                                        style={{ background: AVATAR_COLORS[i] }}
                                    >
                                        {initial}
                                    </div>
                                ))}
                            </div>
                            <span className="text-[18px] font-medium text-white">110+</span>
                            <span className="text-[14px] text-white">Happy Clients Trusted By Akoode</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Thank you modal */}
            {showThankYouModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowThankYouModal(false)}
                        aria-hidden="true"
                    />
                    <div
                        className="relative w-full max-w-md rounded-[16px] md:rounded-[24px] overflow-hidden shadow-2xl bg-gradient-to-b from-[#1F2336] to-[#130F25] text-white p-8 md:p-10 text-center"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="thank-you-title-2"
                    >
                        <button
                            type="button"
                            onClick={() => setShowThankYouModal(false)}
                            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="mb-6 flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h3 id="thank-you-title-2" className="text-2xl md:text-[28px] font-semibold tracking-tight mb-3">
                            Thank you!
                        </h3>
                        <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6">
                            You're subscribed to the Akoode newsletter. Check your inbox for a welcome email from us.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowThankYouModal(false)}
                            className="w-full md:w-auto bg-white text-[#2D2D5A] font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm md:text-base"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default SubscribeForm2;

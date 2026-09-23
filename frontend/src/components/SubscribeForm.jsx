"use client";

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { subscribeNewsletterAPI } from '@/api/newsletter';
import { isValidEmail, normalizeEmail } from '@/utils/formValidation';

const SubscribeForm = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: null, text: '' });
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

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
            <section ref={sectionRef} className="py-10 md:py-16 px-4 md:px-8 bg-[#fcfdfc]">
            <div className="max-w-6xl mx-auto">
                <div className="bg-gradient-to-r from-[#474972] to-[#585c9c] rounded-[20px] md:rounded-[40px] p-6 md:p-12 text-center text-white relative overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
                    {/* Background Glow/Gradient Effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-black/10 pointer-events-none"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>

                    <div className="relative z-10">
                        <h2 className={`text-2xl md:text-[32px] font-semibold mb-4 md:mb-[15px] tracking-tight text-white leading-tight transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            Stay Informed with Thoughtful Innovation
                        </h2>
                        <p className={`text-[rgba(255,255,255,0.8)] text-sm md:text-[15px] max-w-[800px] mx-auto mb-8 md:mb-[40px] leading-relaxed px-2 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            Subscribe to the Akoode newsletter for carefully curated insights on AI, digital intelligence, and real-world innovation. Just perspectives that help you think, plan, and build better.
                        </p>

                        <form onSubmit={handleSubmit} className={`max-w-2xl mx-auto transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="relative flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-2xl md:rounded-full p-2 md:p-1.5 focus-within:border-white/40 focus-within:bg-white/15 transition-all duration-300">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="w-full md:flex-grow bg-transparent text-white placeholder:text-gray-300 px-6 py-2 md:py-3 outline-none text-sm md:text-base cursor-text disabled:opacity-70"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group w-full md:w-auto bg-white text-[#2D2D5A] font-bold px-8 py-2 md:py-3 rounded-xl md:rounded-full hover:bg-gray-100 hover:shadow-xl active:scale-95 transition-all duration-300 text-sm md:text-base whitespace-nowrap shadow-lg mt-2 md:mt-0 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Subscribing…' : 'Subscribe Now'}
                                    <svg
                                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                            {message.text && (
                                <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-white/95' : 'text-red-200'}`}>
                                    {message.text}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>

            {/* Thank you modal – matches form theme */}
            {showThankYouModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowThankYouModal(false)}
                        aria-hidden="true"
                    />
                    <div
                        className="relative w-full max-w-md rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl bg-gradient-to-r from-[#474972] to-[#585c9c] text-white p-8 md:p-10 text-center"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="thank-you-title"
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
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h3 id="thank-you-title" className="text-2xl md:text-[28px] font-semibold tracking-tight mb-3">
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

export default SubscribeForm;

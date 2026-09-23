// "use client";

// import { useState, useEffect } from "react";

// export function CookieConsent() {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Check if user has already made a choice
//     const consent = localStorage.getItem("akoode-cookie-consent");
//     if (!consent) {
//       // Delay showing the banner for a better UX
//       const timer = setTimeout(() => setIsVisible(true), 800);
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const handleChoice = (choice) => {
//     localStorage.setItem("akoode-cookie-consent", choice);

//     // Dispatch event so ScriptsManager knows to load scripts
//     window.dispatchEvent(new CustomEvent("akoode-consent-updated", { detail: choice }));

//     setIsVisible(false);
//   };

//   if (!isVisible) return null;

//   return (
//     <div className="fixed bottom-6 left-6 md:left-auto md:right-6 z-[9999] w-[calc(100%-48px)] max-w-[380px] animate-fade-in-up">
//       <div className="bg-[#eef2ff] rounded-[10px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-blue-100/50 overflow-hidden relative">
//         {/* Subtle background glow */}
//         <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#7784C5]/5 rounded-full blur-3xl pointer-events-none" />

//         <h3 className="text-[24px] font-bold text-slate-900 mb-4 tracking-tight">
//           We value your privacy
//         </h3>

//         <p className="text-[15px] leading-relaxed text-slate-600 mb-6">
//           We use cookies to improve website performance, analyze traffic, and personalize content. You can accept all cookies, reject non-essential cookies, or customize your preferences.{" "}
//           <a href="/privacy-policy" className="text-slate-900 font-semibold underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 transition-all">
//             Learn more
//           </a>
//         </p>

//         <div className="flex flex-col gap-3">
//           <button
//             onClick={() => handleChoice("all")}
//             className="w-full bg-[#111827] text-white font-bold py-4 rounded-full hover:bg-black transition-all active:scale-[0.98] text-[15px]"
//           >
//             Accept All
//           </button>

//           <button
//             onClick={() => handleChoice("essential")}
//             className="w-full bg-[#f0f2ff] text-[#111] font-bold py-4 rounded-full border border-slate-200/50 hover:bg-[#111827] hover:text-white transition-all active:scale-[0.98] text-[15px]"
//           >
//             Reject All
//           </button>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
//         .animate-fade-in-up {
//           animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//         }
//       `}</style>
//     </div>
//   );
// }

// Cookie consent is temporarily disabled — re-enable by uncommenting above
export function CookieConsent() { return null; }

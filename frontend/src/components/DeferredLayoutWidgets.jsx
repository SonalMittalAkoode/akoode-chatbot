"use client";

import dynamic from "next/dynamic";

// code done by sonal: lazy-load the sales chatbot only on public pages.
const ChatbotWidget = dynamic(() => import("@/components/chatbot/ChatbotWidget"), { ssr: false });

const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

const WhatsApp = dynamic(() => import("@/components/Whatsapp"), {
  ssr: false,
});

// const CookieConsent = dynamic(
//   () => import("@/components/CookieConsent").then((m) => ({ default: m.CookieConsent })),
//   { ssr: false }
// );

export default function DeferredLayoutWidgets({ showWhatsApp = true }) {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        theme="light"
      />
      {showWhatsApp && <WhatsApp />}
      {/* code done by sonal: preserve the existing WhatsApp widget and admin visibility. */}
      {showWhatsApp && <ChatbotWidget />}
      {/* Cookie consent temporarily disabled */}
      {/* {showWhatsApp && <CookieConsent />} */}
    </>
  );
}

'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const THANK_YOU_MESSAGES = {
  contact: {
    title: 'Thank you for reaching out',
    subtitle: "We've received your message and appreciate you taking the time to connect with us.",
    body: "Our team is reviewing your inquiry and will get back to you shortly with the next steps or relevant details.",
    footnote: "We value thoughtful conversations and look forward to continuing this one.",
  },
  'post-requirement': {
    title: 'Thank you!',
    subtitle: 'Your requirement has been submitted successfully.',
    body: 'Our team will review your details and get back to you with a tailored solution.',
    footnote: 'We appreciate you considering Akoode for your project.',
  },
  'job-application': {
    title: 'Application received',
    subtitle: 'Thank you for applying. We have received your application.',
    body: 'Our HR team will review your profile and reach out if there is a match with current openings.',
    footnote: 'We wish you the best in your job search.',
  },
  'general-enquiry': {
    title: 'Thank you!',
    subtitle: 'Your submission has been received successfully.',
    body: 'Our team will review and get back to you as soon as possible.',
    footnote: 'We appreciate you getting in touch.',
  },
};

const DEFAULT_MESSAGE = {
  title: 'Thank you!',
  subtitle: 'Your submission has been received successfully.',
  body: 'Our team will review and get back to you as soon as possible.',
  footnote: 'We appreciate you getting in touch.',
};

export default function ThankyouInnerContent({ type }) {
  const message = (type && THANK_YOU_MESSAGES[type]) ? THANK_YOU_MESSAGES[type] : DEFAULT_MESSAGE;

  return (
    <section className="thankyou-page py-5 bg-[#fcfdfc]">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-[66.666%] min-[992px]:max-w-none min-[992px]:w-2/3">
            <div className="thankyou-card text-center p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-sm">
              <div className="mb-4">
                <div className="thankyou-icon mb-3 flex justify-center">
                  <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-green-500 flex-shrink-0" aria-hidden />
                </div>
                <h1 className="font-bold text-[#1e1e1e] mb-2 text-xl sm:text-2xl">{message.title}</h1>
                <p className="text-[#374151] mb-0 text-base leading-relaxed">{message.subtitle}</p>
              </div>

              <div className="mb-4">
                <p className="text-[#374151] text-base leading-relaxed">{message.body}</p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center mt-4">
                {/* <a href={message.primaryHref} className="vl-btn2">
                  {message.primaryLabel}
                </a> */}
                <Link
                  href="/"
                  className="relative inline-block py-[18px] px-[18px] rounded-lg text-white bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] z-[1] font-figtree text-[20px] leading-5 font-bold transition-all duration-400 hover:text-white hover:-translate-y-[5px] after:content-[''] after:absolute after:inset-y-0 after:left-1/2 after:-translate-x-1/2 after:h-full after:w-[10px] after:rounded-lg after:bg-[linear-gradient(90deg,#585c9c_0%,#474972_100%)] after:transition-all after:duration-[1.5s] after:-z-10 after:invisible after:opacity-0 hover:after:visible hover:after:opacity-100 hover:after:w-full hover:after:left-0 hover:after:translate-x-0"
                >
                  Go to Homepage
                </Link>
              </div>

              <div className="mt-4">
                <p className="text-sm text-[#505169] mb-0">{message.footnote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

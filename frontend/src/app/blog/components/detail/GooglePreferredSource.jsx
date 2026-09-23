import { normalizedSiteUrl } from '@/utils/seo';

const GOOGLE_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0012 23z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.05H2.18a11 11 0 000 9.9l3.66-2.85z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a10.99 10.99 0 00-9.82 6.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z" />
  </svg>
);

export default function GooglePreferredSource() {
  const domain = normalizedSiteUrl.replace(/^https?:\/\/(www\.)?/, '');
  const preferredSourceUrl = `https://google.com/preferences/source?q=${encodeURIComponent(domain)}`;

  return (
    <a
      href={preferredSourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full max-w-full items-center justify-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 font-figtree font-medium text-[12px] sm:text-[13px] leading-5 whitespace-nowrap bg-[#eff1ff] border border-[#d0d3ee] text-[#474972] transition-colors duration-200 hover:bg-[#474972] hover:text-white hover:border-[#474972]"
    >
      {GOOGLE_ICON}
      <span className="truncate">Add us as a preferred source on Google</span>
    </a>
  );
}

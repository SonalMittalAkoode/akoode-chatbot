"use client";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type LeadCtx = {
  pageType?: string;
  market?: string;
  slug?: string;
  country?: string;
  service?: string;
};

export function useLeadSource(ctx: LeadCtx = {}) {
  const pathname = usePathname();
  return useMemo(() => {
    const p = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    let referrer = "";
    try {
      if (document.referrer) referrer = new URL(document.referrer).hostname;
    } catch {}
    return {
      pageUrl:     pathname,
      utmSource:   p.get("utm_source")   || "",
      utmMedium:   p.get("utm_medium")   || "",
      utmCampaign: p.get("utm_campaign") || "",
      referrer,
      ...ctx,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
}

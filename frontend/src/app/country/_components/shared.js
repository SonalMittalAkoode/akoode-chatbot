import {
  FiTrendingUp, FiEye, FiLink2, FiAward, FiCheckCircle, FiMessageCircle,
  FiShield, FiZap, FiUsers, FiUser, FiClock, FiStar, FiHeart, FiThumbsUp,
  FiLayers, FiBriefcase, FiCode, FiCpu, FiGlobe, FiMonitor, FiSmartphone,
  FiSettings, FiLock, FiKey, FiFlag, FiBarChart2, FiActivity, FiArrowRight,
  FiCheckSquare, FiPackage, FiBox, FiDatabase, FiServer, FiCloud, FiMail,
  FiPhone, FiHome, FiGrid, FiTool, FiTarget, FiRefreshCw, FiRepeat,
  FiToggleRight, FiSliders, FiShare2, FiInfo, FiAlertCircle, FiPieChart,
  FiHeadphones, FiLifeBuoy, FiSend, FiMap, FiCompass, FiBookOpen, FiBook,
  FiFileText, FiClipboard, FiEdit3, FiPenTool, FiImage, FiCamera,
  FiVideo, FiMic, FiMusic, FiRadio, FiRss, FiBell, FiTag, FiGift,
  FiDollarSign, FiCreditCard, FiTruck, FiNavigation, FiMaximize, FiMinimize,
  FiLayout, FiSidebar, FiColumns, FiFilter, FiSearch, FiDownload, FiUpload,
} from "react-icons/fi";
import { LuHandshake, LuRocket, LuTarget, LuBrain, LuBadgeCheck, LuNetwork } from "react-icons/lu";

export const ICON_MAP = {
  FiTrendingUp, FiEye, FiLink2, FiAward, FiCheckCircle, FiMessageCircle,
  FiShield, FiZap, FiUsers, FiUser, FiClock, FiStar, FiHeart, FiThumbsUp,
  FiLayers, FiBriefcase, FiCode, FiCpu, FiGlobe, FiMonitor, FiSmartphone,
  FiSettings, FiLock, FiKey, FiFlag, FiBarChart2, FiActivity, FiArrowRight,
  FiCheckSquare, FiPackage, FiBox, FiDatabase, FiServer, FiCloud, FiMail,
  FiPhone, FiHome, FiGrid, FiTool, FiTarget, FiRefreshCw, FiRepeat,
  FiToggleRight, FiSliders, FiShare2, FiInfo, FiAlertCircle, FiPieChart,
  FiHeadphones, FiLifeBuoy, FiSend, FiMap, FiCompass, FiBookOpen, FiBook,
  FiFileText, FiClipboard, FiEdit3, FiPenTool, FiImage, FiCamera,
  FiVideo, FiMic, FiMusic, FiRadio, FiRss, FiBell, FiTag, FiGift,
  FiDollarSign, FiCreditCard, FiTruck, FiNavigation, FiMaximize, FiMinimize,
  FiLayout, FiSidebar, FiColumns, FiFilter, FiSearch, FiDownload, FiUpload,
  LuHandshake, LuRocket, LuTarget, LuBrain, LuBadgeCheck, LuNetwork,
};

export const resolveIcon = (name, Fallback = FiZap) => {
  if (!name) return Fallback;
  return ICON_MAP[name] || Fallback;
};

// Shared style constants for service-by-country components

export const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = (process.env.NEXT_PUBLIC_ADMIN_API_URL || "").replace(/\/admin\/?$/, "");
  let p = path.replace(/^\//, "");
  if (!p.startsWith("public/")) {
    p = `public/${p}`;
  }
  return `${base}/${p}`;
};

export const TAG_WRAP =
  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#5a3ec8] border border-[rgba(108,80,220,0.45)] bg-[rgba(108,80,220,0.10)] mb-5";

export const TAG_DOT =
  "w-1.5 h-1.5 rounded-full bg-[#9d8ff5] flex-shrink-0";

/** Section h2 — same scale as /services CustomSoftware / CRM headings */
export const STITLE = "sbc-h1 mb-8 text-[#18193e]";

/** Lead paragraph — /services body band (~14–16px) */
export const SSUB = "sbc-body text-[#2a2d52] leading-[1.8]";

// Returns an inline style object for scroll-reveal animations.
// Visibility is driven by the page-level IntersectionObserver (useReveal hook).
// Here we just set the transition so the observer can apply it.
export const rv = (delay = 0) => ({
  transitionDelay: `${delay}s`,
});

/**
 * Splits a heading into a main part and an accent part.
 * 1. Respects <span> tags if present.
 * 2. Otherwise splits by the last sentence (period followed by space).
 * 3. Fallback: splits at the last 2-3 words.
 */
export const splitTitle = (heading) => {
  if (!heading) return { main: "", accent: "", suffix: "" };

  const h = heading.trim();

  // 1. Manual <span>: "Before <span>Accent</span> After"
  if (h.includes("<span>") && h.includes("</span>")) {
    const startIdx = h.indexOf("<span>");
    const endIdx = h.indexOf("</span>");
    const main = h.slice(0, startIdx);
    const accent = h.slice(startIdx + 6, endIdx);
    const suffix = h.slice(endIdx + 7);
    return { main, accent, suffix };
  }

  // 2. Split by last sentence boundary (e.g. ". ")
  const lastDotSpace = h.lastIndexOf(". ");
  if (lastDotSpace !== -1 && lastDotSpace < h.length - 2) {
    return {
      main: h.slice(0, lastDotSpace + 1),
      accent: h.slice(lastDotSpace + 2),
      suffix: "",
    };
  }

  // 3. Fallback: Last 2 words
  const words = h.split(/\s+/);
  if (words.length > 3) {
    const accent = words.slice(-2).join(" ");
    const main = words.slice(0, -2).join(" ");
    return { main, accent, suffix: "" };
  }

  return { main: h, accent: "", suffix: "" };
};

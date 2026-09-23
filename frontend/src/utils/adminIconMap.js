// Shared admin icon set — the source of truth for the icon names the IconPicker
// offers and the frontend templates resolve, kept in one module so both stay in
// sync without bundling the admin component into public pages.

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
  FiAward, FiStar, FiCheckCircle, FiCheckSquare, FiShield, FiThumbsUp, FiHeart,
  LuBadgeCheck, LuHandshake,
  FiUsers, FiUser, FiMessageCircle, FiMail, FiPhone, FiHeadphones, FiLifeBuoy,
  FiTrendingUp, FiActivity, FiBarChart2, FiPieChart, FiZap, LuRocket, LuTarget,
  FiClock, FiRefreshCw, FiRepeat, FiToggleRight, FiSliders,
  FiCode, FiCpu, FiServer, FiDatabase, FiCloud, FiMonitor, FiSmartphone, FiGlobe,
  LuBrain, LuNetwork,
  FiLayers, FiLink2, FiEye, FiGrid, FiLayout, FiSidebar, FiColumns, FiPackage, FiBox,
  FiBriefcase, FiDollarSign, FiCreditCard, FiTag, FiGift, FiTruck, FiFlag, FiSend,
  FiSettings, FiTool, FiKey, FiLock, FiFilter, FiSearch, FiTarget,
  FiFileText, FiClipboard, FiEdit3, FiPenTool, FiBookOpen, FiBook,
  FiImage, FiCamera, FiVideo, FiMic, FiRss, FiBell,
  FiHome, FiMap, FiCompass, FiNavigation, FiArrowRight,
  FiInfo, FiAlertCircle, FiDownload, FiUpload, FiShare2,
  FiMaximize, FiMinimize,
};

Object.keys(ICON_MAP).forEach((k) => { if (!ICON_MAP[k]) delete ICON_MAP[k]; });

export const isIconImagePath = (v) => !!v && (v.startsWith("/") || v.startsWith("http"));

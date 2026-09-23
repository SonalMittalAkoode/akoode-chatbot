"use client";

import { useState, useRef } from "react";
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
  // Trust & quality
  FiAward, FiStar, FiCheckCircle, FiCheckSquare, FiShield, FiThumbsUp, FiHeart,
  LuBadgeCheck, LuHandshake,
  // People & collaboration
  FiUsers, FiUser, FiMessageCircle, FiMail, FiPhone, FiHeadphones, FiLifeBuoy,
  // Performance & growth
  FiTrendingUp, FiActivity, FiBarChart2, FiPieChart, FiZap, LuRocket, LuTarget,
  // Time & process
  FiClock, FiRefreshCw, FiRepeat, FiToggleRight, FiSliders,
  // Tech & dev
  FiCode, FiCpu, FiServer, FiDatabase, FiCloud, FiMonitor, FiSmartphone, FiGlobe,
  LuBrain, LuNetwork,
  // Structure
  FiLayers, FiLink2, FiEye, FiGrid, FiLayout, FiSidebar, FiColumns, FiPackage, FiBox,
  // Business
  FiBriefcase, FiDollarSign, FiCreditCard, FiTag, FiGift, FiTruck, FiFlag, FiSend,
  // Settings & tools
  FiSettings, FiTool, FiKey, FiLock, FiFilter, FiSearch, FiTarget,
  // Content
  FiFileText, FiClipboard, FiEdit3, FiPenTool, FiBookOpen, FiBook,
  FiImage, FiCamera, FiVideo, FiMic, FiRss, FiBell,
  // Navigation
  FiHome, FiMap, FiCompass, FiNavigation, FiArrowRight,
  // Info
  FiInfo, FiAlertCircle, FiDownload, FiUpload, FiShare2,
  // Layout
  FiMaximize, FiMinimize,
};

// Remove undefined entries
Object.keys(ICON_MAP).forEach(k => { if (!ICON_MAP[k]) delete ICON_MAP[k]; });

const isImageValue = (v) => v && (v.startsWith("/") || v.startsWith("http"));

const resolvePreviewUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  return base + (path.startsWith("/") ? path : "/" + path);
};

export default function IconPicker({ value, onChange, label = "Icon" }) {
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const filtered = Object.keys(ICON_MAP).filter(name =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const storedUser = sessionStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser)?.token : "";
      const fd = new FormData();
      fd.append("images", file);
      const BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "") + "/";
      const res = await fetch(`${BASE}api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const urls = await res.json();
      if (Array.isArray(urls) && urls[0]) onChange(urls[0]);
    } catch (err) {
      alert("Upload failed: " + (err?.message || "Unknown error"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const isImage = isImageValue(value);

  return (
    <div>
      <label style={{ fontWeight: 600, fontSize: 12, color: "#484848", display: "block", marginBottom: 4 }}>
        {label}
      </label>

      {/* Search */}
      <input
        type="text"
        className="form-control"
        style={{ marginBottom: 6, fontSize: 12 }}
        placeholder="Search icons…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Icon grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 4,
        maxHeight: 180,
        overflowY: "auto",
        border: "1px solid #e4e4f0",
        borderRadius: 6,
        padding: 6,
        background: "#fafafa",
      }}>
        {filtered.map(name => {
          const Icon = ICON_MAP[name];
          const selected = value === name;
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onChange(selected ? "" : name)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 4px",
                borderRadius: 6,
                border: selected ? "2px solid #474972" : "1px solid #e4e4f0",
                background: selected ? "#edeafd" : "#fff",
                cursor: "pointer",
                gap: 3,
                transition: "all 0.13s",
              }}
              onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "#f4f3fb"; }}
              onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "#fff"; }}
            >
              <Icon size={18} color={selected ? "#474972" : "#555"} />
              <span style={{
                fontSize: 8,
                color: selected ? "#474972" : "#888",
                lineHeight: 1.1,
                textAlign: "center",
                wordBreak: "break-all",
              }}>
                {name.replace(/^Fi|^Lu/, "")}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", fontSize: 12, color: "#aaa", padding: "12px 0" }}>
            No icons found
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
        <div style={{ flex: 1, height: 1, background: "#e4e4f0" }} />
        <span style={{ fontSize: 11, color: "#aaa", whiteSpace: "nowrap" }}>or upload custom icon</span>
        <div style={{ flex: 1, height: 1, background: "#e4e4f0" }} />
      </div>

      {/* Upload button */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        <button
          type="button"
          className="btn btn2"
          style={{ padding: "4px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <FiUpload size={13} />
          {uploading ? "Uploading…" : "Upload Image"}
        </button>
        {isImage && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <img
              src={resolvePreviewUrl(value)}
              alt="custom icon"
              style={{ width: 32, height: 32, objectFit: "contain", border: "1px solid #e4e4f0", borderRadius: 6, background: "#fafafa", padding: 2 }}
            />
            <button
              type="button"
              onClick={() => onChange("")}
              style={{ fontSize: 11, color: "#c44", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              ✕ Remove
            </button>
          </div>
        )}
      </div>

      {/* Selected react-icon label */}
      {value && !isImage && (
        <div style={{ marginTop: 5, fontSize: 11, color: "#474972", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          {(() => { const I = ICON_MAP[value]; return I ? <I size={14} /> : null; })()}
          {value}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";

const ALLOWED_EDIT_PREFIXES = [
  "/thebusinesshub/service-by-country/edit/",
  "/thebusinesshub/service-by-city/edit/",
  "/thebusinesshub/industries/edit/",
];

const safeEditPath = (value = "") => {
  const decoded = String(value || "").trim();
  return ALLOWED_EDIT_PREFIXES.some((p) => decoded.startsWith(p)) ? decoded : "";
};

export default function PreviewEditLink({ editPath = "" }) {
  const href = safeEditPath(editPath);

  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 1000,
        display: "flex",
        gap: 8,
        alignItems: "center",
        padding: "10px 14px",
        borderRadius: 999,
        background: "#2c2e50",
        boxShadow: "0 12px 30px rgba(44,46,80,0.22)",
      }}
    >
      <span style={{ color: "#eef1ff", fontSize: 13 }}>Preview mode</span>
      {href && (
        <Link
          href={href}
          style={{
            color: "#2c2e50",
            background: "#fff",
            borderRadius: 999,
            padding: "6px 12px",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to editing
        </Link>
      )}
      <Link
        href={`/api/preview/disable${href ? `?back=${encodeURIComponent(href)}` : ""}`}
        style={{
          color: "#fff",
          background: "rgba(255,255,255,0.15)",
          borderRadius: 999,
          padding: "6px 12px",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Exit preview
      </Link>
    </div>
  );
}

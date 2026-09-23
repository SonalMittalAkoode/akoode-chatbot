"use client";
import { useState } from "react";

/**
 * SectionCard – collapsible, toggleable section card for the service admin forms.
 *
 * Props:
 *   id          – HTML id used as anchor target for the section navigator
 *   title       – Section heading text
 *   accentColor – Left-border accent colour (theme purple-scale hex)
 *   badge       – Optional item count shown in header (pass 0 to hide)
 *   // Toggle props (omit both to hide the toggle entirely)
 *   toggleId    – id for the hidden <input type="checkbox">
 *   toggleName  – name for the hidden <input type="checkbox">
 *   enabled     – Controlled checked value
 *   onToggle    – onChange handler  (receives the native event)
 *   children    – Section body content
 */
export default function SectionCard({
  id,
  title,
  accentColor = "#4b4d7c",
  badge,
  toggleId,
  toggleName,
  enabled,
  onToggle,
  children,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasToggle = !!onToggle;

  return (
    <div
      id={id}
      style={{
        width: "100%",
        background: "#fff",
        border: "1px solid #e4e4f0",
        borderRadius: "8px",
        marginTop: "20px",
        marginBottom: "4px",
        boxShadow: "0 2px 10px rgba(75,77,124,0.07)",
        overflow: "visible",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        style={{
          borderLeft: `4px solid ${accentColor}`,
          padding: "13px 20px",
          background: "#f8f8fd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: isOpen ? "1px solid #e8e8f4" : "none",
        }}
      >
        {/* Left: title + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: "14px",
              color: "#2c2e50",
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </span>
          {typeof badge === "number" && badge > 0 && (
            <span
              style={{
                background: accentColor,
                color: "#fff",
                borderRadius: "12px",
                padding: "2px 9px",
                fontSize: "11px",
                fontWeight: 600,
                lineHeight: "1.6",
              }}
            >
              {badge} {badge === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {/* Right: toggle switch + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {hasToggle && (
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                cursor: "pointer",
                margin: 0,
                userSelect: "none",
              }}
              title={enabled ? "Disable this section" : "Enable this section"}
            >
              {/* Hidden native checkbox – keeps name/id wiring intact */}
              <input
                type="checkbox"
                id={toggleId}
                name={toggleName}
                checked={!!enabled}
                onChange={onToggle}
                style={{
                  position: "absolute",
                  opacity: 0,
                  width: 0,
                  height: 0,
                  pointerEvents: "none",
                }}
              />
              {/* Visual pill */}
              <span
                style={{
                  display: "inline-block",
                  width: "40px",
                  height: "22px",
                  background: enabled ? "#A3B18A" : "#ccc",
                  borderRadius: "11px",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: enabled ? "21px" : "3px",
                    width: "16px",
                    height: "16px",
                    background: "#fff",
                    borderRadius: "50%",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: enabled ? "#A3B18A" : "#b3b3b3",
                  fontWeight: 600,
                  minWidth: "22px",
                }}
              >
                {enabled ? "ON" : "OFF"}
              </span>
            </label>
          )}

          {/* Collapse / expand chevron */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#666894",
              fontSize: "18px",
              lineHeight: 1,
              padding: "0 4px",
              margin: 0,
              display: "flex",
              alignItems: "center",
            }}
            title={isOpen ? "Collapse section" : "Expand section"}
          >
            {isOpen ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────── */}
      {isOpen && (
        <div style={{ padding: "20px 20px 8px" }}>
          <div className="row">{children}</div>
        </div>
      )}
    </div>
  );
}

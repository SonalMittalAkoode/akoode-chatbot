"use client";

/**
 * CaseStudyPicker – slot-based case study selector for the SBC (country/city)
 * admin forms' Case Studies section.
 *
 * Three slots map 1:1 to the cards rendered on the public page:
 *   Slot 1 → the big featured spotlight card
 *   Slots 2 & 3 → the two supporting cards
 *
 * A case study picked in one slot is hidden from the other slots' dropdowns
 * (the featured pick can never repeat as a supporting card). Any slot left on
 * "Auto" is filled on the public page with the most recently published case
 * study not already used by another slot.
 *
 * Props:
 *   featured        – selected case study id for the featured slot ("" = auto)
 *   others          – [id, id] for the two supporting slots ("" = auto)
 *   onFeaturedChange(id)
 *   onOthersChange([id, id])
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { getCSLTableData } from "@/api/caseStudyLatest";
import resolveImageUrl from "@/utils/resolveImageUrl";

const ACCENT = "#4b4d7c";
const INK = "#2c2e50";
const MUTED = "#8a8cb0";
const BORDER = "#e4e4f0";

const StarIcon = ({ size = 13, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M12 2l2.92 6.26 6.87.83-5.07 4.7 1.34 6.78L12 17.27l-6.06 3.3 1.34-6.78-5.07-4.7 6.87-.83L12 2z" />
  </svg>
);

const stripHtml = (s) => String(s || "").replace(/<[^>]*>/g, "").trim();

const chipValue = (doc, label) =>
  (doc?.hero?.metaChips || []).find((c) => c.label === label)?.value || "";

function Thumb({ study, size = 44 }) {
  const src = resolveImageUrl(study?.hero?.heroImage);
  return (
    <span
      style={{
        width: size + 14,
        height: size,
        borderRadius: 8,
        overflow: "hidden",
        flexShrink: 0,
        background: "linear-gradient(135deg, #ebe9f8 0%, #dddfee 100%)",
        border: `1px solid ${BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <span style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}>CS</span>
      )}
    </span>
  );
}

function StatusDot({ live }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: live ? "#5b8a4e" : "#b0731f",
        background: live ? "rgba(163,177,138,0.18)" : "rgba(222,170,80,0.16)",
        border: `1px solid ${live ? "rgba(163,177,138,0.5)" : "rgba(222,170,80,0.5)"}`,
        borderRadius: 20,
        padding: "2px 8px",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: live ? "#7da35f" : "#dea14f",
        }}
      />
      {live ? "Live" : "Hidden"}
    </span>
  );
}

function SlotDropdown({ slotKey, study, options, isOpen, onOpen, onClose, onSelect, onClear, isFeatured, loading }) {
  const [query, setQuery] = useState("");
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!isOpen) { setQuery(""); return; }
    const t = setTimeout(() => searchRef.current?.focus(), 30);
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      [o.title, o.slug, chipValue(o, "Industry")].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [options, query]);

  return (
    <div ref={isOpen ? panelRef : null} style={{ position: "relative" }}>
      {/* ── Trigger ── */}
      <button
        type="button"
        className="csp-trigger"
        onClick={() => (isOpen ? onClose() : onOpen())}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: study ? "10px 12px" : "13px 12px",
          background: study ? "#fff" : "#fbfbfe",
          borderWidth: study ? "1px" : "1.5px",
          borderStyle: study ? "solid" : "dashed",
          borderColor: isOpen ? ACCENT : (study ? BORDER : "#cfd1e6"),
          borderRadius: 10,
          cursor: "pointer",
          transition: "border-color .15s, box-shadow .15s",
          minHeight: 64,
          ...(isOpen ? { boxShadow: "0 0 0 3px rgba(75,77,124,0.12)" } : {}),
        }}
      >
        {study ? (
          <>
            <Thumb study={study} />
            <span style={{ minWidth: 0, flex: 1 }}>
              <span
                style={{
                  display: "block", fontSize: 13.5, fontWeight: 600, color: INK,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}
              >
                {study.title || "Untitled case study"}
              </span>
              <span style={{ display: "block", fontSize: 11.5, color: MUTED, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                /{study.slug || "—"}{chipValue(study, "Industry") ? ` · ${chipValue(study, "Industry")}` : ""}
              </span>
            </span>
            <StatusDot live={study.status === true} />
          </>
        ) : (
          <>
            <span
              style={{
                width: 58, height: 44, borderRadius: 8, flexShrink: 0,
                border: `1.5px dashed #cfd1e6`, background: "#f4f4fa",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#a0a2c4", fontSize: 17, fontWeight: 300,
              }}
            >
              +
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#5a5c85" }}>
                {loading ? "Loading case studies…" : "Auto · latest published"}
              </span>
              <span style={{ display: "block", fontSize: 11.5, color: MUTED, marginTop: 2 }}>
                Click to pick a specific case study
              </span>
            </span>
          </>
        )}
        <span style={{ marginLeft: "auto", color: MUTED, fontSize: 11, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>▼</span>
      </button>

      {/* ── Clear pill ── */}
      {study && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          title="Reset this slot to automatic selection"
          style={{
            position: "absolute", top: -9, right: -7,
            width: 20, height: 20, borderRadius: "50%",
            background: INK, color: "#fff", border: "2px solid #fff",
            fontSize: 10, lineHeight: 1, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 6px rgba(44,46,80,0.35)",
          }}
        >
          ✕
        </button>
      )}

      {/* ── Panel ── */}
      {isOpen && (
        <div
          style={{
            position: "absolute", zIndex: 40, top: "calc(100% + 6px)", left: 0, right: 0,
            background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12,
            boxShadow: "0 16px 40px -12px rgba(44,46,80,0.28)", overflow: "hidden",
          }}
        >
          <div style={{ padding: 10, borderBottom: `1px solid #eeeef6`, background: "#fbfbfe" }}>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, slug or industry…"
              style={{
                width: "100%", padding: "8px 12px", fontSize: 13,
                border: `1px solid ${BORDER}`, borderRadius: 8, outline: "none", color: INK,
                background: "#fff",
              }}
            />
          </div>
          <div style={{ maxHeight: 264, overflowY: "auto" }}>
            {study && (
              <button
                type="button"
                className="csp-option"
                onClick={() => { onClear(); onClose(); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", background: "transparent", border: "none",
                  borderBottom: `1px solid #f1f1f8`, cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ width: 58, height: 40, borderRadius: 8, flexShrink: 0, border: `1.5px dashed #cfd1e6`, background: "#f4f4fa", display: "flex", alignItems: "center", justifyContent: "center", color: "#a0a2c4", fontSize: 15 }}>↺</span>
                <span>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#5a5c85" }}>Auto · latest published</span>
                  <span style={{ display: "block", fontSize: 11.5, color: MUTED, marginTop: 1 }}>Let the site pick this slot automatically</span>
                </span>
              </button>
            )}
            {filtered.length === 0 && (
              <div style={{ padding: "18px 14px", fontSize: 12.5, color: MUTED, textAlign: "center" }}>
                {loading ? "Loading case studies…" : query ? "No case studies match your search." : "No case studies available for this slot."}
              </div>
            )}
            {filtered.map((o) => {
              const selected = study && String(study._id) === String(o._id);
              return (
                <button
                  key={o._id}
                  type="button"
                  className="csp-option"
                  onClick={() => { onSelect(String(o._id)); onClose(); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", border: "none", textAlign: "left", cursor: "pointer",
                    background: selected ? "rgba(75,77,124,0.08)" : "transparent",
                    borderLeft: selected ? `3px solid ${ACCENT}` : "3px solid transparent",
                  }}
                >
                  <Thumb study={o} size={40} />
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {o.title || "Untitled case study"}
                    </span>
                    <span style={{ display: "block", fontSize: 11.5, color: MUTED, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      /{o.slug || "—"}{chipValue(o, "Industry") ? ` · ${chipValue(o, "Industry")}` : ""}
                    </span>
                  </span>
                  <StatusDot live={o.status === true} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CaseStudyPicker({ featured = "", others = ["", ""], onFeaturedChange, onOthersChange }) {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSlot, setOpenSlot] = useState(null); // "featured" | "other-0" | "other-1" | null

  useEffect(() => {
    let alive = true;
    (async () => {
      const { items } = await getCSLTableData({ limit: 200, page: 1 });
      if (alive) { setStudies(items || []); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const byId = useMemo(() => new Map(studies.map((s) => [String(s._id), s])), [studies]);
  const other0 = others?.[0] || "";
  const other1 = others?.[1] || "";

  const featuredStudy = featured ? byId.get(String(featured)) : null;
  const other0Study = other0 ? byId.get(String(other0)) : null;
  const other1Study = other1 ? byId.get(String(other1)) : null;

  // Each slot's dropdown excludes what the other slots already claimed —
  // the featured pick can never repeat as a supporting card and vice versa.
  const optionsFor = (excludeIds) =>
    studies.filter((s) => !excludeIds.filter(Boolean).map(String).includes(String(s._id)));

  const setOther = (idx, id) => {
    const next = [other0, other1];
    next[idx] = id;
    onOthersChange(next);
  };

  const hiddenPick = [featuredStudy, other0Study, other1Study].some((s) => s && s.status !== true);

  const slotLabel = (label, sub, featuredSlot = false) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <span
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 22, height: 22, borderRadius: 7, flexShrink: 0,
          background: featuredSlot ? "linear-gradient(135deg, #666894 0%, #3c3e66 100%)" : "#eceafd",
          color: featuredSlot ? "#fff" : ACCENT,
          fontSize: 11, fontWeight: 700,
        }}
      >
        {featuredSlot ? <StarIcon size={11} /> : sub}
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: INK, letterSpacing: "0.02em" }}>{label}</span>
      {featuredSlot && (
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#666894", background: "#eceafd", borderRadius: 20, padding: "2px 9px" }}>
          Spotlight
        </span>
      )}
    </div>
  );

  return (
    <div className="csp-root" style={{ marginTop: 4 }}>
      <div
        style={{
          border: `1px solid ${BORDER}`, borderRadius: 14, background: "#fdfdff",
          padding: "16px 16px 14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>
            Cards shown on this page
          </div>
          <div style={{ fontSize: 11.5, color: MUTED }}>
            Slots left on <b style={{ color: "#5a5c85" }}>Auto</b> use the latest published case studies
          </div>
        </div>

        {/* Featured slot */}
        <div
          style={{
            borderRadius: 12, padding: "12px 12px 14px", marginBottom: 12,
            background: "linear-gradient(135deg, rgba(102,104,148,0.07) 0%, rgba(60,62,102,0.04) 100%)",
            border: "1px solid rgba(102,104,148,0.25)",
          }}
        >
          {slotLabel("Featured case study", "1", true)}
          <SlotDropdown
            slotKey="featured"
            study={featuredStudy}
            options={optionsFor([other0, other1])}
            isOpen={openSlot === "featured"}
            onOpen={() => setOpenSlot("featured")}
            onClose={() => setOpenSlot(null)}
            onSelect={(id) => onFeaturedChange(id)}
            onClear={() => onFeaturedChange("")}
            isFeatured
            loading={loading}
          />
        </div>

        {/* Supporting slots */}
        <div className="csp-others" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {[
            { idx: 0, study: other0Study, value: other0, exclude: [featured, other1] },
            { idx: 1, study: other1Study, value: other1, exclude: [featured, other0] },
          ].map(({ idx, study, exclude }) => (
            <div key={idx} style={{ borderRadius: 12, padding: "12px 12px 14px", background: "#fff", border: `1px solid ${BORDER}` }}>
              {slotLabel(`Supporting card ${idx + 2}`, String(idx + 2))}
              <SlotDropdown
                slotKey={`other-${idx}`}
                study={study}
                options={optionsFor(exclude)}
                isOpen={openSlot === `other-${idx}`}
                onOpen={() => setOpenSlot(`other-${idx}`)}
                onClose={() => setOpenSlot(null)}
                onSelect={(id) => setOther(idx, id)}
                onClear={() => setOther(idx, "")}
                loading={loading}
              />
            </div>
          ))}
        </div>

        {hiddenPick && (
          <div
            style={{
              marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start",
              fontSize: 12, color: "#8a6a2a", background: "rgba(222,170,80,0.12)",
              border: "1px solid rgba(222,170,80,0.4)", borderRadius: 10, padding: "9px 12px",
            }}
          >
            <span aria-hidden="true">⚠</span>
            <span>
              One of your picks is currently <b>hidden</b> (unpublished). Hidden case studies never render on the
              live page — that slot falls back to the latest published case study until the pick goes live.
            </span>
          </div>
        )}
      </div>

      <style jsx global>{`
        .csp-root .csp-trigger:hover { border-color: #b9bbdb !important; }
        .csp-root .csp-option:hover { background: rgba(75, 77, 124, 0.06) !important; }
      `}</style>
    </div>
  );
}

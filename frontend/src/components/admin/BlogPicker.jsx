"use client";

/**
 * BlogPicker – slot-based blog selector for the SBC (country/city) admin
 * forms' Blog section. Mirrors CaseStudyPicker.
 *
 * Three equal slots map 1:1 to the blog cards rendered on the public page.
 * A blog picked in one slot is hidden from the other slots' dropdowns. Any
 * slot left on "Auto" is filled on the public page with the most recently
 * published blog not already used by another slot.
 *
 * Props:
 *   selected           – [id, id, id] ("" = auto)
 *   onChange([id, id, id])
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { getBlogTableData } from "@/api/blog";
import resolveImageUrl from "@/utils/resolveImageUrl";

const ACCENT = "#4b4d7c";
const INK = "#2c2e50";
const MUTED = "#8a8cb0";
const BORDER = "#e4e4f0";

const firstTag = (blog) => {
  const t = blog?.tags;
  if (Array.isArray(t)) return t[0] || "";
  return String(t || "").split(",")[0]?.trim() || "";
};

function Thumb({ blog, size = 44 }) {
  const src = resolveImageUrl(blog?.logoimage);
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
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <span style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: "0.08em" }}>BLOG</span>
      )}
    </span>
  );
}

function StatusDot({ live }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
        color: live ? "#5b8a4e" : "#b0731f",
        background: live ? "rgba(163,177,138,0.18)" : "rgba(222,170,80,0.16)",
        border: `1px solid ${live ? "rgba(163,177,138,0.5)" : "rgba(222,170,80,0.5)"}`,
        borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: live ? "#7da35f" : "#dea14f" }} />
      {live ? "Live" : "Hidden"}
    </span>
  );
}

function SlotDropdown({ blog, options, isOpen, onOpen, onClose, onSelect, onClear, loading }) {
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
      [o.title, o.slug, firstTag(o)].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [options, query]);

  return (
    <div ref={isOpen ? panelRef : null} style={{ position: "relative" }}>
      <button
        type="button"
        className="csp-trigger"
        onClick={() => (isOpen ? onClose() : onOpen())}
        aria-expanded={isOpen}
        style={{
          width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12,
          padding: blog ? "10px 12px" : "13px 12px",
          background: blog ? "#fff" : "#fbfbfe",
          borderWidth: blog ? "1px" : "1.5px",
          borderStyle: blog ? "solid" : "dashed",
          borderColor: isOpen ? ACCENT : (blog ? BORDER : "#cfd1e6"),
          borderRadius: 10, cursor: "pointer",
          transition: "border-color .15s, box-shadow .15s", minHeight: 64,
          ...(isOpen ? { boxShadow: "0 0 0 3px rgba(75,77,124,0.12)" } : {}),
        }}
      >
        {blog ? (
          <>
            <Thumb blog={blog} />
            <span style={{ minWidth: 0, flex: 1 }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {blog.title || "Untitled blog"}
              </span>
              <span style={{ display: "block", fontSize: 11.5, color: MUTED, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                /{blog.slug || "—"}{firstTag(blog) ? ` · ${firstTag(blog)}` : ""}
              </span>
            </span>
            <StatusDot live={blog.status === true} />
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
                {loading ? "Loading blogs…" : "Auto · latest published"}
              </span>
              <span style={{ display: "block", fontSize: 11.5, color: MUTED, marginTop: 2 }}>
                Click to pick a specific blog post
              </span>
            </span>
          </>
        )}
        <span style={{ marginLeft: "auto", color: MUTED, fontSize: 11, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>▼</span>
      </button>

      {blog && (
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
              placeholder="Search by title, slug or tag…"
              style={{
                width: "100%", padding: "8px 12px", fontSize: 13,
                border: `1px solid ${BORDER}`, borderRadius: 8, outline: "none", color: INK, background: "#fff",
              }}
            />
          </div>
          <div style={{ maxHeight: 264, overflowY: "auto" }}>
            {blog && (
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
                {loading ? "Loading blogs…" : query ? "No blogs match your search." : "No blogs available for this slot."}
              </div>
            )}
            {filtered.map((o) => {
              const selected = blog && String(blog._id) === String(o._id);
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
                  <Thumb blog={o} size={40} />
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {o.title || "Untitled blog"}
                    </span>
                    <span style={{ display: "block", fontSize: 11.5, color: MUTED, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      /{o.slug || "—"}{firstTag(o) ? ` · ${firstTag(o)}` : ""}
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

export default function BlogPicker({ selected = ["", "", ""], onChange }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSlot, setOpenSlot] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { items } = await getBlogTableData({ limit: 200, page: 1 });
      if (alive) { setBlogs(items || []); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const byId = useMemo(() => new Map(blogs.map((b) => [String(b._id), b])), [blogs]);
  const slots = [selected?.[0] || "", selected?.[1] || "", selected?.[2] || ""];
  const slotBlogs = slots.map((id) => (id ? byId.get(String(id)) : null));

  // Each slot's dropdown offers published blogs only (hidden ones can never
  // render on the live page) and excludes what the other slots already
  // claimed. A previously saved pick that has since been hidden still shows
  // in its slot trigger via byId, with the warning below.
  const optionsFor = (slotIdx) =>
    blogs.filter((b) =>
      b.status === true &&
      !slots.filter((id, i) => id && i !== slotIdx).map(String).includes(String(b._id))
    );

  const setSlot = (idx, id) => {
    const next = [...slots];
    next[idx] = id;
    onChange(next);
  };

  const hiddenPick = slotBlogs.some((b) => b && b.status !== true);

  return (
    <div className="csp-root" style={{ marginTop: 4 }}>
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 14, background: "#fdfdff", padding: "16px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>
            Blog cards shown on this page
          </div>
          <div style={{ fontSize: 11.5, color: MUTED }}>
            Slots left on <b style={{ color: "#5a5c85" }}>Auto</b> use the latest published blogs
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {slots.map((id, idx) => (
            <div key={idx} style={{ borderRadius: 12, padding: "12px 12px 14px", background: "#fff", border: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                    background: "#eceafd", color: ACCENT, fontSize: 11, fontWeight: 700,
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: INK, letterSpacing: "0.02em" }}>
                  Blog card {idx + 1}
                </span>
              </div>
              <SlotDropdown
                blog={slotBlogs[idx]}
                options={optionsFor(idx)}
                isOpen={openSlot === idx}
                onOpen={() => setOpenSlot(idx)}
                onClose={() => setOpenSlot(null)}
                onSelect={(bId) => setSlot(idx, bId)}
                onClear={() => setSlot(idx, "")}
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
              One of your picks is currently <b>hidden</b> (unpublished). Hidden blogs never render on the
              live page — that slot falls back to the latest published blog until the pick goes live.
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

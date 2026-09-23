"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  addIndustryAPI,
  updateIndustryAPI,
  getIndustryById,
} from "@/api/industry";
import { getTestimonialTableData } from "@/api/testimonial";
import { getCasestudyList } from "@/api/frontend/casestudy";
import { getCaseStudyLatestList } from "@/api/caseStudyLatest";
import { getBlogTableData as getFrontendBlogList } from "@/api/frontend/blog";
import SectionCard from "../../services/_components/SectionCard";
import HtmlEditor from "@/components/HtmlEditor";
import IconPicker from "@/components/admin/IconPicker";

// ─── Section definitions ────────────────────────────────────────────────────
// Each entry produces one accordion in the form. `ctas` controls how many CTA
// label/link pairs render. The frontend slug page reads `enabled` to decide
// whether to mount the matching section component.
const SECTION_DEFS = [
  { key: "hero",             label: "Hero Section",                          accent: "#3c3e66", ctas: 2 },
  { key: "why",              label: "Pain Points / Problem Section",          accent: "#666894", ctas: 0 },
  { key: "akoodeAdvantage",  label: "Why Choose Us / Differentiators Section",accent: "#2c2e50", ctas: 1 },
  { key: "whatWeBuild",      label: "Services Section",                       accent: "#4b4d7c", ctas: 0 },
  { key: "experties",        label: "Platform Types Section",                 accent: "#3c3e66", ctas: 0 },
  { key: "capabilities",     label: "Delivery Framework / Tech Layers Section",accent: "#666894", ctas: 0 },
  { key: "caseStudy",        label: "Case Studies / Outcomes Section",        accent: "#4b4d7c", ctas: 0, caseStudyPicker: true },
  { key: "testimonial",      label: "Testimonials Section",                   accent: "#666894", ctas: 0, featured: "testimonial" },
  { key: "advantage",        label: "Revenue Impact Section",                 accent: "#2c2e50", ctas: 0 },
  { key: "techStack",        label: "Technology Stack Section",               accent: "#3c3e66", ctas: 0 },
  { key: "whatsChanging",    label: "What's Changing / Trends Section",        accent: "#666894", ctas: 0 },
  { key: "whyChooseAkoode",  label: "Talk to Founder / CTA Section",          accent: "#3c3e66", ctas: 0 },
  { key: "howWeWork",        label: "Development Process Section",            accent: "#2c2e50", ctas: 1 },
  { key: "faq",              label: "FAQ Section",                            accent: "#4b4d7c", ctas: 0 },
  { key: "finalCta",         label: "Contact / Lead Form Section",            accent: "#2c2e50", ctas: 0 },
];

const SECTION_NAV = [
  { id: "sec-core", label: "Core Info" },
  ...SECTION_DEFS.map((s) => ({ id: `sec-${s.key}`, label: s.label.replace(/ Section$/, "") })),
  { id: "sec-meta", label: "SEO Meta" },
];

// ─── Item field definitions per section ────────────────────────────────────
// Each entry is an array of field descriptors for items in that section.
// type: "text" | "html" | "list" (newline-separated list stored as array)
const SECTION_ITEM_FIELDS = {
  why: [
    { key: "icon",        label: "Icon",             type: "icon" },
    { key: "title",       label: "Pain Point Title",  type: "text" },
    { key: "description", label: "Description",       type: "html" },
  ],
  akoodeAdvantage: [
    { key: "icon",        label: "Icon",        type: "icon" },
    { key: "title",       label: "Title",       type: "text" },
    { key: "description", label: "Description", type: "html" },
  ],
  whatWeBuild: [
    { key: "icon",        label: "Icon",          type: "icon" },
    { key: "title",       label: "Service Title", type: "text" },
    { key: "description", label: "Description",   type: "html" },
  ],
  experties: [
    { key: "icon",     label: "Icon",                                              type: "icon" },
    { key: "title",    label: "Platform Title",                                    type: "text" },
    { key: "subtitle", label: "Subtitle / Category",                               type: "text" },
    { key: "features", label: "Features (one per line)",                           type: "list" },
  ],
  capabilities: [
    { key: "title",       label: "Capability Title", type: "text" },
    { key: "description", label: "Description",      type: "html" },
  ],
  advantage: [
    { key: "icon",        label: "Icon",         type: "icon" },
    { key: "title",       label: "Impact Title", type: "text" },
    { key: "description", label: "Description",  type: "html" },
  ],
  whatsChanging: [
    { key: "icon",        label: "Icon",          type: "icon" },
    { key: "title",       label: "Trend Title",   type: "text" },
    { key: "description", label: "Description",   type: "html" },
  ],
  whyChooseAkoode: [
    { key: "icon",        label: "Icon",          type: "icon" },
    { key: "title",       label: "Feature Title", type: "text" },
    { key: "description", label: "Description",   type: "html" },
  ],
  howWeWork: [
    { key: "title",       label: "Step Title",   type: "text" },
    { key: "description", label: "Description",  type: "html" },
  ],
  faq: [
    { key: "question", label: "Question", type: "text" },
    { key: "answer",   label: "Answer",   type: "html" },
  ],
};

const emptySection = (enabled = false) => ({
  eyebrow: "",
  heading: "",
  subtitle: "",
  cta1Label: "",
  cta1Link: "",
  cta2Label: "",
  cta2Link: "",
  enabled,
  featuredId: "",
  featuredIds: [],
  items: [],
  image: "",
  imageAlt: "",
  floatingCards: [],
});

const buildEmpty = () => {
  const sections = {};
  SECTION_DEFS.forEach((s) => (sections[s.key] = emptySection(s.key === "hero")));
  return {
    name: "",
    slug: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ...sections,
  };
};

const slugify = (v) =>
  String(v || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ─── Reusable dynamic item list editor ──────────────────────────────────────
function ItemListEditor({ sectionKey, items, onChange }) {
  const fields = SECTION_ITEM_FIELDS[sectionKey];
  if (!fields) return null;

  const hasIconField = fields.some((f) => f.type === "icon");

  const colClass = (f) => {
    if (f.type === "icon") return "col-lg-3";
    if (f.type === "html") return hasIconField ? "col-lg-5" : "col-lg-12";
    // text / list
    return hasIconField ? "col-lg-4" : "col-lg-6";
  };

  const emptyItem = () => Object.fromEntries(fields.map((f) => [f.key, ""]));

  const updateItem = (idx, field, val) => {
    const next = items.map((it, i) => (i === idx ? { ...it, [field]: val } : it));
    onChange(next);
  };

  const addItem = () => onChange([...items, emptyItem()]);

  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));

  const moveItem = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div className="col-lg-12">
      <div className="form-group" style={{ marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <label style={{ margin: 0 }}>Content Items <span style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>— these replace the default hardcoded content on the page</span></label>
          <button
            type="button"
            onClick={addItem}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 22px",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(135deg, #4b4d7c 0%, #3c3e66 100%)",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(75,77,124,0.35)",
              letterSpacing: "0.02em",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 5px 16px rgba(75,77,124,0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 3px 10px rgba(75,77,124,0.35)"; }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Item
          </button>
        </div>

        {items.length === 0 && (
          <div style={{ padding: "16px 18px", background: "#f4f5fa", border: "2px dashed #c9cbe0", borderRadius: 8, fontSize: 13, color: "#666", textAlign: "center" }}>
            No items added yet — click <strong style={{ color: "#4b4d7c" }}>+ Add Item</strong> above to start adding content. The page will show default hardcoded content until you add items here.
          </div>
        )}

        {items.map((item, idx) => (
          <div
            key={idx}
            style={{ border: "1px solid #d8dbf0", borderRadius: 8, padding: "12px 14px", marginBottom: 10, background: "#fff" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#666" }}>Item #{idx + 1}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => moveItem(idx, -1)} disabled={idx === 0}
                  style={{ border: "1px solid #ccd", background: "#f7f8fc", padding: "2px 8px", borderRadius: 4, fontSize: 12, cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.35 : 1 }}>↑</button>
                <button type="button" onClick={() => moveItem(idx, +1)} disabled={idx === items.length - 1}
                  style={{ border: "1px solid #ccd", background: "#f7f8fc", padding: "2px 8px", borderRadius: 4, fontSize: 12, cursor: idx === items.length - 1 ? "not-allowed" : "pointer", opacity: idx === items.length - 1 ? 0.35 : 1 }}>↓</button>
                <button type="button" onClick={() => removeItem(idx)}
                  style={{ border: "1px solid #f0c0c0", background: "#fff5f5", color: "#c44", padding: "2px 8px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>✕</button>
              </div>
            </div>
            <div className="row">
              {fields.map((f) => (
                <div key={f.key} className={colClass(f)}>
                  <div className="my_profile_setting_input form-group">
                    {f.type !== "icon" && <label style={{ fontSize: 12 }}>{f.label}</label>}
                    {f.type === "icon" && (
                      <IconPicker
                        label={f.label}
                        value={item[f.key] || ""}
                        onChange={(v) => updateItem(idx, f.key, v)}
                      />
                    )}
                    {f.type === "text" && (
                      <input
                        type="text"
                        className="form-control"
                        value={item[f.key] || ""}
                        onChange={(e) => updateItem(idx, f.key, e.target.value)}
                      />
                    )}
                    {f.type === "html" && (
                      <HtmlEditor
                        value={item[f.key] || ""}
                        onChange={(v) => updateItem(idx, f.key, v)}
                      />
                    )}
                    {f.type === "list" && (
                      <textarea
                        className="form-control"
                        rows={4}
                        value={Array.isArray(item[f.key]) ? item[f.key].join("\n") : (item[f.key] || "")}
                        onChange={(e) => updateItem(idx, f.key, e.target.value.split("\n"))}
                        placeholder="One item per line"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Per-section body (heading / subtitle / CTAs) ───────────────────────────
function SectionFields({ def, value, onChange, blogOptions = [] }) {
  const update = (field, val) => onChange({ ...value, [field]: val });
  const updateItems = (items) => onChange({ ...value, items });

  // Blog multi-select helpers (used by whatsChanging)
  const blogIds = Array.isArray(value.featuredIds) ? value.featuredIds : [];
  const addBlogId = (id) => {
    if (!id || blogIds.includes(id) || blogIds.length >= 5) return;
    update("featuredIds", [...blogIds, id]);
  };
  const removeBlogId = (id) => update("featuredIds", blogIds.filter((x) => x !== id));
  const moveBlogId = (id, dir) => {
    const i = blogIds.indexOf(id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= blogIds.length) return;
    const next = blogIds.slice();
    [next[i], next[j]] = [next[j], next[i]];
    update("featuredIds", next);
  };
  const selectedBlogs = blogIds
    .map((id) => blogOptions.find((b) => b._id === id))
    .filter(Boolean);
  const unselectedBlogs = blogOptions.filter((b) => !blogIds.includes(b._id));

  const uploadSectionImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const storedUser = sessionStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser)?.token : "";
      const fd = new FormData();
      fd.append("images", file);
      const BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "";
      const res = await fetch(`${BASE}api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const urls = await res.json();
      if (Array.isArray(urls) && urls[0]) {
        const autoAlt = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        onChange({ ...value, image: urls[0], imageAlt: value.imageAlt || autoAlt });
      }
    } catch (err) {
      alert("Image upload failed: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <>
      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label>Heading</label>
          <input
            type="text"
            className="form-control"
            value={value.heading}
            onChange={(e) => update("heading", e.target.value)}
            placeholder="Section heading"
          />
        </div>
      </div>
      <div className="col-lg-6">
        <div className="my_profile_setting_textarea form-group">
          <label>Subtitle / Description</label>
          <HtmlEditor
            value={value.subtitle}
            onChange={(v) => update("subtitle", v)}
            placeholder="Section subtitle or supporting copy"
          />
        </div>
      </div>
      {def.ctas >= 1 && (
        <>
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label>CTA 1 Label</label>
              <input
                type="text"
                className="form-control"
                value={value.cta1Label}
                onChange={(e) => update("cta1Label", e.target.value)}
                placeholder="e.g. Talk to us"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label>CTA 1 Link</label>
              <input
                type="text"
                className="form-control"
                value={value.cta1Link}
                onChange={(e) => update("cta1Link", e.target.value)}
                placeholder="#contact or /contact-us"
              />
            </div>
          </div>
        </>
      )}
      {def.ctas >= 2 && (
        <>
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label>CTA 2 Label</label>
              <input
                type="text"
                className="form-control"
                value={value.cta2Label}
                onChange={(e) => update("cta2Label", e.target.value)}
                placeholder="e.g. See our work"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label>CTA 2 Link</label>
              <input
                type="text"
                className="form-control"
                value={value.cta2Link}
                onChange={(e) => update("cta2Link", e.target.value)}
                placeholder="/case-study"
              />
            </div>
          </div>
        </>
      )}
      {def.key === "whatsChanging" && (
        <div className="col-lg-12">
          <div className="my_profile_setting_input form-group" style={{ marginTop: 8 }}>
            <label>Section Image <span style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>— shown on the left side of the section</span></label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="wrap-custom-file height-150" style={{ flexShrink: 0 }}>
                <input
                  type="file"
                  id="whatsChangingImage"
                  accept="image/*"
                  onChange={uploadSectionImage}
                />
                <label
                  htmlFor="whatsChangingImage"
                  style={value.image ? { backgroundImage: `url(${(process.env.NEXT_PUBLIC_API_URL || "") + value.image.replace(/^\//, "")})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                >
                  <span><i className="flaticon-download"></i> {value.image ? "Change Image" : "Upload Image"}</span>
                </label>
              </div>
              <div style={{ flex: 1, maxWidth: 300 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#484848", marginBottom: 4 }}>
                  Image Alt Text
                </div>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: 13 }}
                  value={value.imageAlt || ""}
                  onChange={(e) => update("imageAlt", e.target.value)}
                  placeholder="Describe the image for accessibility & SEO"
                />
                {value.image && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...value, image: "", imageAlt: "" })}
                    style={{ marginTop: 8, border: "1px solid #f0c0c0", background: "#fff5f5", color: "#c44", padding: "3px 10px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero section: image upload + top-right card fields */}
      {def.key === "hero" && (
        <>
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group" style={{ marginTop: 8 }}>
              <label>Hero Background Image <span style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>— building/property photo in the right column</span></label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="wrap-custom-file height-150" style={{ flexShrink: 0 }}>
                  <input type="file" id="heroBgImage" accept="image/*" onChange={uploadSectionImage} />
                  <label
                    htmlFor="heroBgImage"
                    style={value.image ? { backgroundImage: `url(${(process.env.NEXT_PUBLIC_API_URL || "") + value.image.replace(/^\//, "")})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                  >
                    <span><i className="flaticon-download"></i> {value.image ? "Change Image" : "Upload Image"}</span>
                  </label>
                </div>
                <div style={{ flex: 1, maxWidth: 300 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#484848", marginBottom: 4 }}>Image Alt Text</div>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: 13 }}
                    value={value.imageAlt || ""}
                    onChange={(e) => update("imageAlt", e.target.value)}
                    placeholder="e.g. AI-Powered Real Estate Software"
                  />
                  {value.image && (
                    <button type="button" onClick={() => onChange({ ...value, image: "", imageAlt: "" })}
                      style={{ marginTop: 8, border: "1px solid #f0c0c0", background: "#fff5f5", color: "#c44", padding: "3px 10px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating top-right card */}
          <div className="col-lg-12">
            <div style={{ padding: "14px 16px", background: "rgba(75,77,124,0.06)", border: "1px solid rgba(75,77,124,0.18)", borderRadius: 8, marginTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#3c3e66", marginBottom: 12 }}>
                Top-Right Floating Card <span style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>— shown over the hero building image</span>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="my_profile_setting_input form-group">
                    <label style={{ fontSize: 12 }}>Card Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={(Array.isArray(value.items) && value.items[0]?.cardTitle) || ""}
                      onChange={(e) => {
                        const items = Array.isArray(value.items) ? [...value.items] : [];
                        items[0] = { ...(items[0] || {}), cardTitle: e.target.value };
                        onChange({ ...value, items });
                      }}
                      placeholder="e.g. AI-Powered Solutions"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="my_profile_setting_input form-group">
                    <label style={{ fontSize: 12 }}>Card Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={(Array.isArray(value.items) && value.items[0]?.cardDesc) || ""}
                      onChange={(e) => {
                        const items = Array.isArray(value.items) ? [...value.items] : [];
                        items[0] = { ...(items[0] || {}), cardDesc: e.target.value };
                        onChange({ ...value, items });
                      }}
                      placeholder="e.g. Intelligent, scalable & future-ready software for modern businesses."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Building image + floating cards editor (why section only) */}
      {def.key === "why" && (
        <>
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group" style={{ marginTop: 8 }}>
              <label>Building Background Image <span style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>— shown behind the 4 floating overlay cards on desktop</span></label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="wrap-custom-file height-150" style={{ flexShrink: 0 }}>
                  <input type="file" id="whyBuildingImage" accept="image/*" onChange={uploadSectionImage} />
                  <label
                    htmlFor="whyBuildingImage"
                    style={value.image ? { backgroundImage: `url(${(process.env.NEXT_PUBLIC_API_URL || "") + value.image.replace(/^\//, "")})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                  >
                    <span><i className="flaticon-download"></i> {value.image ? "Change Image" : "Upload Image"}</span>
                  </label>
                </div>
                <div style={{ flex: 1, maxWidth: 300 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#484848", marginBottom: 4 }}>Image Alt Text</div>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: 13 }}
                    value={value.imageAlt || ""}
                    onChange={(e) => update("imageAlt", e.target.value)}
                    placeholder="Describe the image for accessibility & SEO"
                  />
                  {value.image && (
                    <button type="button" onClick={() => onChange({ ...value, image: "", imageAlt: "" })}
                      style={{ marginTop: 8, border: "1px solid #f0c0c0", background: "#fff5f5", color: "#c44", padding: "3px 10px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="form-group" style={{ marginTop: 8 }}>
              <label style={{ marginBottom: 10, display: "block" }}>
                Floating Overlay Cards <span style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>— 4 cards overlaid on the building image (top-left, top-right, bottom-left, bottom-right)</span>
              </label>
              {["Top-Left", "Top-Right", "Bottom-Left", "Bottom-Right"].map((pos, cardIdx) => {
                const cards = Array.isArray(value.floatingCards) ? value.floatingCards : [];
                const card = cards[cardIdx] || { icon: "", title: "", desc: "" };
                const updateCard = (field, val) => {
                  const next = [0,1,2,3].map((i) => {
                    const c = cards[i] || { icon: "", title: "", desc: "" };
                    return i === cardIdx ? { ...c, [field]: val } : c;
                  });
                  onChange({ ...value, floatingCards: next });
                };
                return (
                  <div key={cardIdx} style={{ border: "1px solid #d8dbf0", borderRadius: 8, padding: "12px 14px", marginBottom: 10, background: "#fff" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 10 }}>Card #{cardIdx + 1} — {pos}</div>
                    <div className="row">
                      <div className="col-lg-3">
                        <IconPicker label="Icon" value={card.icon || ""} onChange={(v) => updateCard("icon", v)} />
                      </div>
                      <div className="col-lg-4">
                        <div className="my_profile_setting_input form-group">
                          <label style={{ fontSize: 12 }}>Title</label>
                          <input type="text" className="form-control" value={card.title || ""} onChange={(e) => updateCard("title", e.target.value)} placeholder="e.g. Disconnected Systems" />
                        </div>
                      </div>
                      <div className="col-lg-5">
                        <div className="my_profile_setting_input form-group">
                          <label style={{ fontSize: 12 }}>Description</label>
                          <textarea className="form-control" rows={3} value={card.desc || ""} onChange={(e) => updateCard("desc", e.target.value)} placeholder="Short description for the card" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {SECTION_ITEM_FIELDS[def.key] && (
        <ItemListEditor
          sectionKey={def.key}
          items={Array.isArray(value.items) ? value.items : []}
          onChange={updateItems}
        />
      )}
    </>
  );
}

// ─── Simplified body for Case Study / Testimonial sections ────────────────
function FeaturedSectionFields({ value, onChange, testimonialOptions, casestudyOptions, withMultiSelect, withCasestudy }) {
  const update = (field, val) => onChange({ ...value, [field]: val });
  const ids = Array.isArray(value.featuredIds) ? value.featuredIds : [];

  const moveId = (id, dir) => {
    const i = ids.indexOf(id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    const next = ids.slice();
    [next[i], next[j]] = [next[j], next[i]];
    update("featuredIds", next);
  };

  const addId = (id) => {
    if (!id || ids.includes(id)) return;
    update("featuredIds", [...ids, id]);
  };

  const removeId = (id) => update("featuredIds", ids.filter((x) => x !== id));

  const selected = ids
    .map((id) => (testimonialOptions || []).find((o) => o._id === id))
    .filter(Boolean);
  const unselected = (testimonialOptions || []).filter((o) => !ids.includes(o._id));

  return (
    <>
      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label>Title (Heading)</label>
          <input
            type="text"
            className="form-control"
            value={value.heading}
            onChange={(e) => update("heading", e.target.value)}
            placeholder="Section heading"
          />
        </div>
      </div>
      <div className="col-lg-6">
        <div className="my_profile_setting_textarea form-group">
          <label>Subtext (Subtitle)</label>
          <HtmlEditor
            value={value.subtitle}
            onChange={(v) => update("subtitle", v)}
            placeholder="Section subtitle or supporting copy"
          />
        </div>
      </div>
      {withCasestudy && (
        <>
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label>CTA Label</label>
              <input
                type="text"
                className="form-control"
                value={value.cta1Label}
                onChange={(e) => update("cta1Label", e.target.value)}
                placeholder="e.g. Read Full Case Study"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label>CTA Link</label>
              <input
                type="text"
                className="form-control"
                value={value.cta1Link}
                onChange={(e) => update("cta1Link", e.target.value)}
                placeholder="/case-study/your-slug"
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group">
              <label>Featured Case Study <span style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>— shown as the highlighted card on the section</span></label>
              <select
                className="form-control"
                value={value.featuredId || ""}
                onChange={(e) => update("featuredId", e.target.value)}
              >
                <option value="">— Use default / hardcoded case studies —</option>
                {(casestudyOptions || []).map((cs) => (
                  <option key={cs._id} value={cs._id}>
                    {cs.title || cs.name || cs._id}
                  </option>
                ))}
              </select>
              {value.featuredId && (
                <span style={{ fontSize: 11, color: "#666", marginTop: 4, display: "block" }}>
                  1 case study selected as featured
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {withMultiSelect && (
        <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label>Choose Testimonials</label>

            {/* Dropdown to add */}
            <select
              className="form-control"
              style={{ marginBottom: 10 }}
              value=""
              onChange={(e) => addId(e.target.value)}
            >
              <option value="" disabled>
                {unselected.length === 0
                  ? ids.length === 0
                    ? "No testimonials available"
                    : "All testimonials selected"
                  : `— Add a testimonial (${unselected.length} remaining) —`}
              </option>
              {unselected.map((opt) => (
                <option key={opt._id} value={opt._id}>
                  {opt.title || opt.name || opt._id}
                </option>
              ))}
            </select>

            {/* Ordered selected list */}
            {selected.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {selected.map((opt, i) => (
                  <div
                    key={opt._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      background: "#fff",
                      border: "1px solid #d8dbf0",
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ minWidth: 20, fontSize: 12, color: "#888", fontWeight: 600 }}>
                      #{i + 1}
                    </span>
                    <span style={{ flex: 1, fontSize: 13 }}>
                      {opt.title || opt.name || opt._id}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveId(opt._id, -1)}
                      disabled={i === 0}
                      style={{
                        border: "1px solid #ccd",
                        background: "#f7f8fc",
                        padding: "1px 8px",
                        borderRadius: 4,
                        cursor: i === 0 ? "not-allowed" : "pointer",
                        opacity: i === 0 ? 0.35 : 1,
                        fontSize: 13,
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveId(opt._id, +1)}
                      disabled={i === selected.length - 1}
                      style={{
                        border: "1px solid #ccd",
                        background: "#f7f8fc",
                        padding: "1px 8px",
                        borderRadius: 4,
                        cursor: i === selected.length - 1 ? "not-allowed" : "pointer",
                        opacity: i === selected.length - 1 ? 0.35 : 1,
                        fontSize: 13,
                      }}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeId(opt._id)}
                      style={{
                        border: "1px solid #f0c0c0",
                        background: "#fff5f5",
                        color: "#c44",
                        padding: "1px 8px",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {ids.length > 0 && (
              <span style={{ fontSize: 11, color: "#888", marginTop: 6, display: "block" }}>
                {ids.length} testimonial{ids.length !== 1 ? "s" : ""} selected — shown in order above
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Case study search picker (featured + up to 2 side cards) ───────────────
function CaseStudyFields({ value, onChange, allCases = [] }) {
  const update = (field, val) => onChange({ ...value, [field]: val });

  const [featSearch, setFeatSearch] = useState("");
  const [featOpen, setFeatOpen] = useState(false);
  const [sideSearch, setSideSearch] = useState("");
  const [sideOpen, setSideOpen] = useState(false);

  const featuredId = value.featuredId || "";
  const sideIds = Array.isArray(value.featuredIds) ? value.featuredIds : [];

  const featuredCase = allCases.find((c) => c._id === featuredId) || null;
  const sideCases = sideIds.map((id) => allCases.find((c) => c._id === id)).filter(Boolean);

  const filteredForFeatured = allCases.filter((c) =>
    c.title?.toLowerCase().includes(featSearch.toLowerCase())
  );
  const filteredForSide = allCases
    .filter((c) => c.title?.toLowerCase().includes(sideSearch.toLowerCase()))
    .filter((c) => c._id !== featuredId);

  return (
    <>
      {/* Heading */}
      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label>Section Heading</label>
          <input type="text" className="form-control" value={value.heading || ""} onChange={(e) => update("heading", e.target.value)} placeholder="e.g. Outcomes You Can Take To Your Board Meeting" />
        </div>
      </div>
      <div className="col-lg-6">
        <div className="my_profile_setting_textarea form-group">
          <label>Subtitle / Description</label>
          <HtmlEditor value={value.subtitle || ""} onChange={(v) => update("subtitle", v)} placeholder="Section subtitle" />
        </div>
      </div>

      {/* 1. Featured case study */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group" style={{ background: "rgba(102,104,148,0.05)", padding: 15, borderRadius: 8, border: "1px solid rgba(102,104,148,0.2)" }}>
          <label style={{ fontWeight: 700, color: "#666894", marginBottom: 10, display: "block" }}>1. Featured Case Study (Main Card)</label>
          {featuredCase ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#fff", border: "1px solid #d8dbf0", borderRadius: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2c2e50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>★</div>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{featuredCase.title}</span>
              </div>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => update("featuredId", "")}>Remove</button>
            </div>
          ) : (
            <div style={{ position: "relative" }} onMouseLeave={() => setFeatOpen(false)}>
              <input type="text" className="form-control" placeholder="Search for featured case study…" value={featSearch} onChange={(e) => { setFeatSearch(e.target.value); setFeatOpen(true); }} onFocus={() => setFeatOpen(true)} />
              {(featOpen || featSearch.trim().length > 0) && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #d8dbf0", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxHeight: 200, overflowY: "auto", zIndex: 99 }}>
                  {filteredForFeatured.length === 0 && <div style={{ padding: "8px 12px", fontSize: 13, color: "#888" }}>No case studies found</div>}
                  {filteredForFeatured.map((c) => (
                    <div key={c._id} onClick={() => { update("featuredId", c._id); setFeatSearch(""); setFeatOpen(false); }}
                      style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer", borderBottom: "1px solid #f0f0f5" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f4f5fa")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                    >
                      {c.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Side case studies (max 2) */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label style={{ fontWeight: 600 }}>2. Other Case Studies (Side Cards — Max 2)</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {sideCases.map((c) => (
              <div key={c._id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "#2c2e50", color: "#fff", borderRadius: 20, fontSize: 12 }}>
                {c.title}
                <span onClick={() => update("featuredIds", sideCases.filter((x) => x._id !== c._id).map((x) => x._id))} style={{ cursor: "pointer", fontWeight: 700, marginLeft: 2 }}>×</span>
              </div>
            ))}
            {sideCases.length === 0 && <span style={{ fontSize: 12, color: "#888" }}>No secondary cases selected</span>}
          </div>
          <div style={{ position: "relative" }} onMouseLeave={() => setSideOpen(false)}>
            <input type="text" className="form-control" placeholder="Search for other case studies…" value={sideSearch} onChange={(e) => { setSideSearch(e.target.value); setSideOpen(true); }} onFocus={() => setSideOpen(true)} />
            {(sideOpen || sideSearch.trim().length > 0) && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #d8dbf0", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxHeight: 220, overflowY: "auto", zIndex: 99 }}>
                {filteredForSide.length === 0 && <div style={{ padding: "8px 12px", fontSize: 13, color: "#888" }}>No case studies found</div>}
                {filteredForSide.map((c) => {
                  const isSelected = sideIds.includes(c._id);
                  return (
                    <div key={c._id}
                      onClick={() => {
                        if (isSelected) return;
                        if (sideCases.length >= 2) { toast.warning("Max 2 side cases allowed"); return; }
                        update("featuredIds", [...sideCases.map((x) => x._id), c._id]);
                        setSideSearch(""); setSideOpen(false);
                      }}
                      style={{ padding: "8px 12px", fontSize: 13, cursor: isSelected ? "default" : "pointer", borderBottom: "1px solid #f0f0f5", color: isSelected ? "#aaa" : "#333", background: isSelected ? "#f9f9f9" : "#fff" }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f4f5fa"; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "#fff"; }}
                    >
                      {c.title} {isSelected && "(Selected)"}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>The CTA button on each card links automatically to the selected case study's page.</p>
        </div>
      </div>
    </>
  );
}

// ─── Main create / edit form (mirrors Service-By-Country UI) ────────────────
export default function CreateList({ mode = "add" }) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState(buildEmpty());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(mode === "edit");
  const previewSubmitRef = useRef(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [savedId, setSavedId] = useState(id || null);
  const [testimonialOptions, setTestimonialOptions] = useState([]);
  const [casestudyOptions, setCasestudyOptions] = useState([]);
  const [blogOptions, setBlogOptions] = useState([]);

  // Load testimonials and case studies on mount.
  useEffect(() => {
    (async () => {
      try {
        const res = await getTestimonialTableData();
        const items = Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        setTestimonialOptions(items);
      } catch (_) {
        setTestimonialOptions([]);
      }
    })();
    (async () => {
      try {
        // Pull from both collections so the picker offers the newly-designed
        // case studies (case-study-latest) alongside the legacy ones.
        const [legacyRes, latestRes] = await Promise.all([
          getCasestudyList(1, 100).catch(() => null),
          getCaseStudyLatestList().catch(() => []),
        ]);
        const legacy = Array.isArray(legacyRes?.data) ? legacyRes.data : [];
        const latest = Array.isArray(latestRes) ? latestRes : [];
        // Newest designed first, then legacy; de-dupe by _id.
        const seen = new Set();
        const merged = [...latest, ...legacy].filter((c) => {
          const id = c?._id ? String(c._id) : "";
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        setCasestudyOptions(merged);
      } catch (_) {
        setCasestudyOptions([]);
      }
    })();
    (async () => {
      try {
        const res = await getFrontendBlogList(1, 100);
        setBlogOptions(Array.isArray(res?.blogs) ? res.blogs : []);
      } catch (_) {
        setBlogOptions([]);
      }
    })();
  }, []);

  // ── Load on edit ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "edit" || !id) return;
    (async () => {
      try {
        const res = await getIndustryById(id);
        const data = res?.data || {};
        const next = buildEmpty();
        next.name = data.name || "";
        next.slug = data.slug || "";
        next.status = data.status || "draft";
        next.metaTitle = data.metaTitle || "";
        next.metaDescription = data.metaDescription || "";
        next.metaKeywords = data.metaKeywords || "";
        SECTION_DEFS.forEach((s) => {
          const src = data[s.key] || {};
          next[s.key] = {
            eyebrow: src.eyebrow || "",
            heading: src.heading || "",
            subtitle: src.subtitle || "",
            cta1Label: src.cta1Label || "",
            cta1Link: src.cta1Link || "",
            cta2Label: src.cta2Label || "",
            cta2Link: src.cta2Link || "",
            // Existing records may not have `enabled` — default to true so they
            // continue to render until an editor turns them off.
            enabled: src.enabled !== false,
            // featuredId is a soft pointer (Mongo ObjectId string) to a related
            // record (case study / testimonial). Stored as string in form state.
            featuredId: src.featuredId ? String(src.featuredId) : "",
            featuredIds: Array.isArray(src.featuredIds)
              ? src.featuredIds.map((v) => String(v))
              : [],
            items: Array.isArray(src.items) ? src.items : [],
            image: src.image || "",
            imageAlt: src.imageAlt || "",
            floatingCards: Array.isArray(src.floatingCards) ? src.floatingCards : [],
          };
        });
        setForm(next);
        setSlugTouched(true);
        setSavedId(id);
      } catch (e) {
        toast.error(e.message || "Failed to load industry");
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, id]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const updateField = (field, value) => {
    setForm((p) => {
      const next = { ...p, [field]: value };
      if (field === "name" && !slugTouched) next.slug = slugify(value);
      return next;
    });
  };
  const updateSection = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const toggleSection = (key, enabled) =>
    setForm((p) => ({ ...p, [key]: { ...p[key], enabled } }));

  const handlePasteSlug = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = slugify(text);
      if (!cleaned) {
        toast.info("Clipboard did not contain a usable slug");
        return;
      }
      setSlugTouched(true);
      updateField("slug", cleaned);
      toast.success("Slug pasted from clipboard");
    } catch {
      toast.error("Unable to read clipboard");
    }
  };

  const handleAutoSlug = () => {
    if (!form.name.trim()) {
      toast.info("Enter a name first to generate a slug");
      return;
    }
    setSlugTouched(true);
    updateField("slug", slugify(form.name));
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    else if (!SLUG_REGEX.test(form.slug.trim()))
      errs.slug = "Slug may only contain lowercase letters, numbers and hyphens";
    setError(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit / Save Draft / Preview ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    const shouldPreview = previewSubmitRef.current || isPreviewing;
    setIsSubmitting(true);
    try {
      // Status is preserved as-is. Preview routes through draftMode + the
      // backend preview-bypass query param, so previewing an "active" page
      // does NOT need (and must not) flip it to "draft" — that previously
      // caused live pages to silently disappear from the public site.
      const payload = {
        ...form,
        slug: slugify(form.slug),
        status: form.status,
      };
      const res =
        mode === "edit"
          ? await updateIndustryAPI(id, payload)
          : await addIndustryAPI(payload);
      toast.success(res.message || "Saved");
      const doc = res?.data;
      if (doc?._id) setSavedId(doc._id);

      if (shouldPreview) {
        const secret = process.env.NEXT_PUBLIC_PREVIEW_SECRET || "";
        const editPath = doc?._id
          ? `/thebusinesshub/industries/edit/${doc._id}`
          : (id ? `/thebusinesshub/industries/edit/${id}` : "");
        const redirectTo = `/industries/${payload.slug}`;
        const params = new URLSearchParams({ secret, redirect: redirectTo });
        if (editPath) params.set("edit", editPath);
        window.open(`/api/preview/enable?${params.toString()}`, "_blank", "noopener,noreferrer");
        setIsPreviewing(false);
        previewSubmitRef.current = false;
        if (mode === "add" && doc?._id) {
          router.replace(`/thebusinesshub/industries/edit/${doc._id}`);
        }
      } else {
        setTimeout(() => router.push("/thebusinesshub/industries"), 800);
      }
    } catch (err) {
      toast.error(err.message || "Failed to save");
      setError((e2) => ({ ...e2, general: err.message || "Failed to save" }));
    } finally {
      if (previewSubmitRef.current) previewSubmitRef.current = false;
      setIsPreviewing(false);
      setIsSubmitting(false);
    }
  };

  const triggerSubmitWithStatus = (nextStatus) => {
    setForm((p) => ({ ...p, status: nextStatus }));
    // Defer to let state flush before the native submit fires.
    setTimeout(() => document.querySelector("form.industries-form")?.requestSubmit(), 0);
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <>
      {/* ── Sticky Section Navigator (mirrors SBC) ───────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: "60px",
          zIndex: 49,
          background: "#2c2e50",
          padding: "8px 16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {SECTION_NAV.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#e8ecf4",
              borderRadius: "4px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 500,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(163,177,138,0.35)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            {s.label}
          </a>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="row industries-form">
        {/* ── Core Info ──────────────────────────────────────────────────── */}
        <SectionCard id="sec-core" title="Core Information" accentColor="#4b4d7c">
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label>Industry Name</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Real Estate"
              />
              {error.name && <span className="text-danger">{error.name}</span>}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="my_profile_setting_input form-group">
              <label>
                Slug (URL){" "}
                <span style={{ fontSize: 10, color: "#888", fontWeight: 400 }}>
                  — /industries/{form.slug || "your-slug"}
                </span>
              </label>
              <input
                type="text"
                className="form-control"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  updateField("slug", e.target.value);
                }}
                placeholder="e.g. real-estate"
              />
              {error.slug && <span className="text-danger">{error.slug}</span>}
            </div>
          </div>
        </SectionCard>

        {/* ── Section accordions ─────────────────────────────────────────── */}
        {SECTION_DEFS.map((def) => (
          <SectionCard
            key={def.key}
            id={`sec-${def.key}`}
            title={def.label}
            accentColor={def.accent}
            toggleId={`${def.key}Enabled`}
            toggleName={`${def.key}Enabled`}
            enabled={form[def.key]?.enabled !== false}
            onToggle={(e) => toggleSection(def.key, e.target.checked)}
          >
            {form[def.key]?.enabled === false ? (
              <div
                className="col-lg-12"
                style={{
                  background: "#f4f5fa",
                  border: "1px dashed #c9cbe0",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 6,
                  fontSize: 13,
                  color: "#474972",
                }}
              >
                This section is <strong>OFF</strong> and will be hidden on the public page. Toggle it ON to edit and display the section.
              </div>
            ) : def.caseStudyPicker ? (
              <CaseStudyFields
                value={form[def.key]}
                onChange={(val) => updateSection(def.key, val)}
                allCases={casestudyOptions}
              />
            ) : def.featured ? (
              <FeaturedSectionFields
                value={form[def.key]}
                onChange={(val) => updateSection(def.key, val)}
                testimonialOptions={testimonialOptions}
                casestudyOptions={casestudyOptions}
                withMultiSelect={def.featured === "testimonial"}
                withCasestudy={false}
              />
            ) : (
              <SectionFields
                def={def}
                value={form[def.key]}
                onChange={(val) => updateSection(def.key, val)}
                blogOptions={blogOptions}
              />
            )}
          </SectionCard>
        ))}

        {/* ── SEO Meta ───────────────────────────────────────────────────── */}
        <SectionCard id="sec-meta" title="SEO Meta" accentColor="#A3B18A">
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group">
              <label>Meta Title</label>
              <input
                type="text"
                className="form-control"
                value={form.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="my_profile_setting_textarea form-group">
              <label>Meta Description</label>
              <textarea
                className="form-control"
                rows={4}
                value={form.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Sticky Footer Submit Bar (mirrors SBC) ────────────────────── */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 99,
            background: "#fff",
            borderTop: "1px solid #e4e4f0",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 -2px 10px rgba(75,77,124,0.1)",
            marginTop: "8px",
            width: "100%",
          }}
        >
          <button
            type="button"
            className="btn btn1"
            onClick={() => router.push("/thebusinesshub/industries")}
          >
            ← Back
          </button>
          {error.general && <span className="text-danger">{error.general}</span>}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <select
              className="form-control"
              style={{ width: 140, height: 40 }}
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              type="button"
              className="btn btn1"
              disabled={isSubmitting}
              onClick={() => triggerSubmitWithStatus("draft")}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="btn btn1"
              disabled={isSubmitting}
              onClick={() => {
                previewSubmitRef.current = true;
                setIsPreviewing(true);
                document.querySelector("form.industries-form")?.requestSubmit();
              }}
            >
              {isSubmitting && isPreviewing ? "Preparing Preview..." : "Preview"}
            </button>
            <button type="submit" className="btn btn2" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                ? "Update Industry"
                : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

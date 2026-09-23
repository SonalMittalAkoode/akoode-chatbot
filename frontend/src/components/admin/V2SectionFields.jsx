"use client";

import { useEffect, useState } from "react";
import { getIndustryTableData } from "@/api/industry";
import StepCard from "@/app/thebusinesshub/(authenticated)/services/_components/StepCard";
import IconPicker from "@/components/admin/IconPicker";
import HtmlEditor from "@/components/HtmlEditor";
import TECH_LOGOS from "@/utils/techLogos";
import INDUSTRY_IMAGES from "@/utils/industryImages";
import { findIndustryIcon, findIndustryImage, findIndustryLink, joinHeadingAccent } from "@/utils/industryAutofill";

export const V2_DEFAULT_HERO_STATS = [
  { value: "4.9", label: "Google Rating" },
  { value: "97%", label: "Client Retention" },
  { value: "15+", label: "Industries Served" },
  { value: "Global", label: "Delivery" },
  { value: "5.0", label: "Clutch Rating" },
];

export function V2HeroStatsFields({ stats, updateStat }) {
  return (
    <>
      <div className="col-lg-12" style={{ marginTop: 4 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>
          Hero Stat Cards{" "}
          <span style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>
            — the four cards around the phone
          </span>
        </div>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div className="col-lg-6" key={i}>
          <div style={{ border: "1px solid #e4e4f0", borderRadius: 8, padding: 12, marginBottom: 12, background: "#fff" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8 }}>Card {i + 1}</div>
            <div className="row">
              <div className="col-xl-4">
                <div className="my_profile_setting_input form-group" style={{ marginBottom: 0 }}>
                  <label>Value</label>
                  <input
                    type="text"
                    className="form-control"
                    value={stats[i]?.value ?? ""}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder={V2_DEFAULT_HERO_STATS[i].value}
                  />
                </div>
              </div>
              <div className="col-xl-8">
                <div className="my_profile_setting_input form-group" style={{ marginBottom: 0 }}>
                  <label>Label</label>
                  <input
                    type="text"
                    className="form-control"
                    value={stats[i]?.label ?? ""}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder={V2_DEFAULT_HERO_STATS[i].label}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export const AI_DEFAULT_HERO_BADGES = [
  { value: "4.9",                   label: "Google Rating" },
  { value: "97%",                   label: "Client Retention" },
  { value: "15+",                   label: "Industries Served" },
  { value: "Global",                label: "OutSourcing" },
  { value: "5.0",                   label: "Clutch Rating" },
];

export function seedHeroStats(prev, usesBadges, makeId) {
  const defaults = usesBadges ? AI_DEFAULT_HERO_BADGES : V2_DEFAULT_HERO_STATS;
  const rows = Array.isArray(prev) ? prev : [];

  return defaults.map((fallback, i) => {
    const row = rows[i];
    if (String(row?.value ?? "").trim()) return row;
    return { id: row?.id ?? makeId(), label: "", sub: "", ...fallback };
  });
}

export function V2AiHeroBadgeFields({ stats, updateStat }) {
  return (
    <>
      <div className="col-lg-12" style={{ marginTop: 4 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>
          Hero Stat Cards{" "}
          <span style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>
            — the five items in the bar under the buttons
          </span>
        </div>
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div className="col-lg-6" key={i}>
          <div style={{ border: "1px solid #e4e4f0", borderRadius: 8, padding: 12, marginBottom: 12, background: "#fff" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8 }}>Card {i + 1}</div>
            <div className="row">
              <div className="col-xl-4">
                <div className="my_profile_setting_input form-group" style={{ marginBottom: 0 }}>
                  <label>Value</label>
                  <input
                    type="text"
                    className="form-control"
                    value={stats[i]?.value ?? ""}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder={AI_DEFAULT_HERO_BADGES[i].value}
                  />
                </div>
              </div>
              <div className="col-xl-8">
                <div className="my_profile_setting_input form-group" style={{ marginBottom: 0 }}>
                  <label>Label</label>
                  <input
                    type="text"
                    className="form-control"
                    value={stats[i]?.label || stats[i]?.sub || ""}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder={AI_DEFAULT_HERO_BADGES[i].label || "—"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Industries ─────────────────────────────────────────────────────────── */
export function V2IndustriesFields({
  heading, onHeading,
  headingAccent, onHeadingAccent,
  intro, onIntro,
  industries,
  addIndustry,
  removeIndustry,
  updateIndustry,
}) {
  const [industryOptions, setIndustryOptions] = useState([]);

  useEffect(() => {
    if (!headingAccent) return;
    onHeading(joinHeadingAccent(heading, headingAccent));
    onHeadingAccent("");
    // Runs only while an accent is still present; clearing it stops the loop.
  }, [heading, headingAccent, onHeading, onHeadingAccent]);

  // Published industry pages, for the "Page link" selector.
  useEffect(() => {
    getIndustryTableData({ limit: 200, page: 1 })
      .then(({ items }) => {
        setIndustryOptions(
          (items || [])
            .filter((i) => i.status === "active")
            .map((i) => ({ slug: i.slug, name: String(i.name || i.slug || "").trim() }))
            .filter((o) => o.slug)
        );
      })
      .catch(() => {});
  }, []);

  const imgOf = (c) => (typeof c.iconImg === "string" && c.iconImg ? c.iconImg : c.iconImgExisting || "");

  const handleNameChange = (item, value) => {
    updateIndustry(item.id, "name", value);

    if (!item.ctaLink) {
      const link = findIndustryLink(value, industryOptions);
      if (link) updateIndustry(item.id, "ctaLink", link);
    }
    if (!imgOf(item)) {
      const img = findIndustryImage(value);
      if (img) updateIndustry(item.id, "iconImg", img);
    }
    if (!item.icon) {
      const icon = findIndustryIcon(value);
      if (icon) updateIndustry(item.id, "icon", icon);
    }
  };

  return (
    <>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label>Heading</label>
          <input type="text" className="form-control" value={heading} onChange={(e) => onHeading(e.target.value)} placeholder="We Build Mobile Apps Across 15 Industries" />
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_profile_setting_textarea form-group">
          <label>Intro</label>
          <textarea className="form-control" rows={2} value={intro} onChange={(e) => onIntro(e.target.value)} placeholder="Our extensive experience spans across major industries..." />
        </div>
      </div>

      <div className="col-lg-12">
        <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Industries</div>
        <button type="button" className="btn admore_btn mb20" onClick={addIndustry}>+ Add Industry</button>
      </div>

      {industries.map((c, i) => (
        <div className="col-12" key={c.id}>
          <StepCard index={i} label="Industry" onRemove={() => removeIndustry(c.id)}>
            <div className="col-xl-3">
              <IconPicker value={c.icon || ""} onChange={(v) => updateIndustry(c.id, "icon", v)} />
            </div>
            <div className="col-xl-4">
              <div className="my_profile_setting_input form-group">
                <label>Name <small style={{ color: "#888" }}>(matching a real name auto-fills the link and image)</small></label>
                <input type="text" className="form-control" value={c.name || ""} onChange={(e) => handleNameChange(c, e.target.value)} placeholder="Healthcare & HealthTech" />
              </div>
            </div>
            <div className="col-xl-5">
              <div className="my_profile_setting_input form-group">
                <label>Description</label>
                <HtmlEditor value={c.sub || ""} onChange={(v) => updateIndustry(c.id, "sub", v)} />
              </div>
            </div>
            <div className="col-xl-6">
              <div className="my_profile_setting_input form-group">
                <label>Industry Image <small style={{ color: "#888" }}>(shown in detail panel · alt text auto-filled from name)</small></label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {imgOf(c) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgOf(c).startsWith("/software_development/") ? imgOf(c) : `${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")}/${imgOf(c).replace(/^\//, "")}`}
                      alt={c.name || "industry"}
                      style={{ width: 48, height: 48, objectFit: "contain", flexShrink: 0 }}
                    />
                  ) : (
                    <span style={{ width: 48, height: 48, display: "inline-block", flexShrink: 0 }} />
                  )}
                  <select
                    className="form-control"
                    value={INDUSTRY_IMAGES.some((o) => o.img === imgOf(c)) ? imgOf(c) : ""}
                    onChange={(e) => updateIndustry(c.id, "iconImg", e.target.value)}
                  >
                    <option value="">— Select an image —</option>
                    {INDUSTRY_IMAGES.map((o) => (
                      <option key={o.img} value={o.img}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="my_profile_setting_input form-group">
                <label>Page link <small style={{ color: "#888" }}>(pick a real industry page, or leave blank to auto-generate from name)</small></label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <select
                    className="form-control"
                    value={industryOptions.some((o) => `/industries/${o.slug}` === c.ctaLink) ? c.ctaLink : ""}
                    onChange={(e) => updateIndustry(c.id, "ctaLink", e.target.value)}
                  >
                    <option value="">— Select an industry page —</option>
                    {industryOptions.map((o) => (
                      <option key={o.slug} value={`/industries/${o.slug}`}>{o.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    value={c.ctaLink || ""}
                    onChange={(e) => updateIndustry(c.id, "ctaLink", e.target.value)}
                    placeholder="/industries/healthcare"
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>
            </div>
          </StepCard>
        </div>
      ))}
    </>
  );
}

/* ── Technologies (stored as techStack.cats) ────────────────────────────── */
export function V2TechnologiesFields({
  heading, onHeading,
  intro, onIntro,
  cats,
  addCat,
  removeCat,
  updateCat,
  addLogo,
  removeLogo,
  updateLogo,
}) {
  return (
    <>
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label>Heading</label>
          <input type="text" className="form-control" value={heading} onChange={(e) => onHeading(e.target.value)} placeholder="Technologies We Use For Mobile App Development" />
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_profile_setting_textarea form-group">
          <label>Intro</label>
          <textarea className="form-control" rows={2} value={intro} onChange={(e) => onIntro(e.target.value)} placeholder="Technology choices in mobile development have long-term consequences..." />
        </div>
      </div>

      <div className="col-lg-12">
        <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Category tabs</div>
        <button type="button" className="btn admore_btn mb20" onClick={addCat}>+ Add Tab</button>
      </div>

      {cats.map((t, i) => (
        <div className="col-12" key={t.id}>
          <StepCard index={i} label="Tab" onRemove={() => removeCat(t.id)}>
            <div className="col-xl-12">
              <div className="my_profile_setting_input form-group">
                <label>Tab label</label>
                <input type="text" className="form-control" value={t.title || ""} onChange={(e) => updateCat(t.id, "title", e.target.value)} placeholder="Mobile Frameworks" />
              </div>
            </div>
            <div className="col-12">
              <div style={{ fontWeight: 600, marginBottom: 6, color: "#2c2e50", fontSize: 13 }}>Logos</div>
              {(t.pills || []).map((lg, j) => (
                <div key={j} className="row" style={{ marginBottom: 12, alignItems: "flex-end" }}>
                  <div className="col-xl-1" style={{ display: "flex", alignItems: "flex-end", paddingBottom: 6 }}>
                    {lg.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={lg.img} alt={lg.label || "logo"} style={{ width: 34, height: 34, objectFit: "contain" }} />
                    ) : (
                      <span style={{ width: 34, height: 34, display: "inline-block" }} />
                    )}
                  </div>
                  <div className="col-xl-4">
                    <div className="my_profile_setting_input form-group">
                      <label style={{ fontSize: 13 }}>Logo</label>
                      <select
                        className="form-control"
                        value={lg.img || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const opt = TECH_LOGOS.find((o) => o.img === val);
                          updateLogo(t.id, j, { img: val, label: opt?.label || lg.label || "" });
                        }}
                      >
                        <option value="">— Select a logo —</option>
                        {TECH_LOGOS.map((o) => (
                          <option key={o.img} value={o.img}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="my_profile_setting_input form-group">
                      <label style={{ fontSize: 13 }}>Display label <small style={{ color: "#888" }}>(shown next to the logo)</small></label>
                      <input type="text" className="form-control" value={lg.label || ""} onChange={(e) => updateLogo(t.id, j, { label: e.target.value })} placeholder="Flutter" />
                    </div>
                  </div>
                  <div className="col-xl-1">
                    <button type="button" className="btn" style={{ color: "#ff5a5f", border: "1px solid #ff5a5f", padding: "2px 10px", marginBottom: 6 }} onClick={() => removeLogo(t.id, j)}>×</button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn admore_btn" onClick={() => addLogo(t.id)}>+ Add Logo</button>
            </div>
          </StepCard>
        </div>
      ))}
    </>
  );
}

/* ── Testimonials ───────────────────────────────────────────────────────── */
export function V2TestimonialsFields({
  heading, onHeading,
  items,
  addItem,
  removeItem,
  updateItem,
}) {
  return (
    <>
      <div className="col-lg-12" style={{ background: "#f4f5fa", border: "1px dashed #c9cbe0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#474972" }}>
        Add client testimonials — name, designation, company, and the quote. They render in a carousel on the live page.
      </div>
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label>Section heading</label>
          <input type="text" className="form-control" value={heading} onChange={(e) => onHeading(e.target.value)} placeholder="What Our Client Says" />
        </div>
      </div>
      <div className="col-lg-12">
        <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>Testimonials</div>
        <button type="button" className="btn admore_btn mb20" onClick={addItem}>+ Add Testimonial</button>
      </div>

      {items.map((c, i) => (
        <div className="col-12" key={c.id}>
          <StepCard index={i} label="Testimonial" onRemove={() => removeItem(c.id)}>
            <div className="col-xl-6">
              <div className="my_profile_setting_input form-group">
                <label>Name</label>
                <input type="text" className="form-control" value={c.name || ""} onChange={(e) => updateItem(c.id, "name", e.target.value)} placeholder="Ankit Goyal" />
              </div>
            </div>
            <div className="col-xl-6">
              <div className="my_profile_setting_input form-group">
                <label>Designation</label>
                <input type="text" className="form-control" value={c.designation || ""} onChange={(e) => updateItem(c.id, "designation", e.target.value)} placeholder="Founder & CEO" />
              </div>
            </div>
            <div className="col-xl-6">
              <div className="my_profile_setting_input form-group">
                <label>Company</label>
                <input type="text" className="form-control" value={c.company || ""} onChange={(e) => updateItem(c.id, "company", e.target.value)} placeholder="WeGrow InfraVentures" />
              </div>
            </div>
            <div className="col-xl-12">
              <div className="my_profile_setting_input form-group">
                <label>Quote</label>
                <textarea className="form-control" rows={4} value={c.quote || ""} onChange={(e) => updateItem(c.id, "quote", e.target.value)} placeholder="Akoode Technologies has done a fantastic job…" />
              </div>
            </div>
          </StepCard>
        </div>
      ))}
    </>
  );
}

/* ── Hero CTA Buttons — every v2 template except MAD ───────────── */
export function V2EcomHeroFields({
  cta1Text, onCta1Text,
  cta1Link, onCta1Link,
  cta2Text, onCta2Text,
  cta2Link, onCta2Link,
}) {
  return (
    <>
      <div className="col-lg-12" style={{ marginTop: 4 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: "#2c2e50" }}>
          Hero CTA Buttons
        </div>
      </div>
      <div className="col-lg-3">
        <div className="my_profile_setting_input form-group">
          <label>Primary CTA Text</label>
          <input
            type="text"
            className="form-control"
            value={cta1Text ?? ""}
            onChange={(e) => onCta1Text(e.target.value)}
            placeholder="Talk to an Expert"
          />
        </div>
      </div>
      <div className="col-lg-3">
        <div className="my_profile_setting_input form-group">
          <label>Primary CTA Link</label>
          <input
            type="text"
            className="form-control"
            value={cta1Link ?? ""}
            onChange={(e) => onCta1Link(e.target.value)}
            placeholder="/post-requirement"
          />
        </div>
      </div>
      <div className="col-lg-3">
        <div className="my_profile_setting_input form-group">
          <label>Secondary CTA Text</label>
          <input
            type="text"
            className="form-control"
            value={cta2Text ?? ""}
            onChange={(e) => onCta2Text(e.target.value)}
            placeholder="View our work"
          />
        </div>
      </div>
      <div className="col-lg-3">
        <div className="my_profile_setting_input form-group">
          <label>Secondary CTA Link</label>
          <input
            type="text"
            className="form-control"
            value={cta2Link ?? ""}
            onChange={(e) => onCta2Link(e.target.value)}
            placeholder="/case-studies"
          />
        </div>
      </div>
    </>
  );
}


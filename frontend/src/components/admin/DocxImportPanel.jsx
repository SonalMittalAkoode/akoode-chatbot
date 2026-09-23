"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { PAGE_TEMPLATES } from "@/config/pageTemplates";

// All known sections, in the order shown in the preview checklist. Keep in
// sync with backend/services/docxImporter/index.js ALL_SECTIONS.
const ALL_SECTIONS = [
  "hero", "chooseUs", "whyLocation", "process", "whatWeDo", "techStack",
  "industries", "engagement", "faq", "whyChoose", "finalCta", "meta",
  "caseStudies", "testimonials", "blog",
];

const SECTION_LABELS = {
  hero: "Hero",
  chooseUs: "Choose Us",
  whyLocation: "Why Location",
  process: "Services Offered",
  whatWeDo: "What We Do",
  techStack: "Tech Stack",
  industries: "Industries",
  engagement: "Engagement",
  faq: "FAQ",
  whyChoose: "Why Choose",
  finalCta: "Final CTA",
  meta: "Meta",
  caseStudies: "Case Studies",
  testimonials: "Testimonials",
  blog: "Blog",
};

// `sections` / `sectionLabels` / `requireTemplate` default to the services
// (country + city) configuration, so existing callers are unaffected. The case
// study form passes its own — it has a different section list and no page
// template.
export default function DocxImportPanel({
  importFn,
  onPopulate,
  hasExistingData,
  analyze,
  sections = ALL_SECTIONS,
  sectionLabels = SECTION_LABELS,
  requireTemplate = true,
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [result, setResult] = useState(null); // last import response
  const [fileName, setFileName] = useState("");
  const [confirmingReplace, setConfirmingReplace] = useState(false);
  // Only used when the document names no Page Template — see the selector in
  // the dialog below.
  const [chosenTemplate, setChosenTemplate] = useState("");

  const reset = () => {
    setResult(null);
    setFileName("");
    setConfirmingReplace(false);
    setChosenTemplate("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.docx$/i.test(file.name)) {
      toast.error("Unsupported file type. Please upload a .docx file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFileName(file.name);
    setIsUploading(true);
    try {
      const response = await importFn(file);
      if (response.status === "fail") {
        toast.error(response.message || "Unable to read this document. Please verify that the DOCX file is valid.");
        reset();
        return;
      }
      setResult(response);
    } catch (err) {
      toast.error(err.message || "Failed to import DOCX file");
      reset();
    } finally {
      setIsUploading(false);
    }
  };

  const needsTemplateChoice =
    requireTemplate && Boolean(result?.data) && !result.data.template;

  const handlePopulateClick = async () => {
    if (needsTemplateChoice && !chosenTemplate) {
      toast.error("Select a Page Template for this document before populating the form.");
      return;
    }
    if (hasExistingData && !confirmingReplace) {
      setConfirmingReplace(true);
      return;
    }
    setIsPopulating(true);
    try {
      await onPopulate(
        chosenTemplate ? { ...result.data, template: chosenTemplate } : result.data
      );
      toast.success("Form populated from the imported document. Review every section before saving.");
      reset();
    } catch (err) {
      toast.error(err.message || "Failed to populate the form from this document");
    } finally {
      setIsPopulating(false);
    }
  };

  const foundSet = new Set(result?.sectionsFound || []);

  let templateNotes = [];
  let unusedSections = [];
  if (result?.data && typeof analyze === "function") {
    try {
      // Analyse against the template that will actually be applied, so the
      // notes update as soon as the admin picks one below.
      const analysis =
        analyze(chosenTemplate ? { ...result.data, template: chosenTemplate } : result.data) || {};
      templateNotes = analysis.warnings || [];
      unusedSections = analysis.unusedSections || [];
    } catch {
      templateNotes = [];
      unusedSections = [];
    }
  }
  const unusedSet = new Set(unusedSections);

  return (
    <div className="col-lg-12">
      <div
        style={{
          border: "1px dashed #a3b18a",
          borderRadius: 10,
          padding: 14,
          background: "#f4f8ee",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
        }}
      >
        <strong style={{ color: "#2c2e50" }}>Import from DOCX</strong>
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          disabled={isUploading}
          style={{ fontSize: 12 }}
        />
        {isUploading && <span style={{ fontSize: 12, color: "#666" }}>Parsing {fileName}…</span>}
        <span style={{ fontSize: 12, color: "#666" }}>
          Populates this form from a structured .docx — nothing is saved until you review and click the existing Save button.
        </span>
      </div>

      {result && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              maxWidth: 520,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: 24,
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            }}
          >
            <h4 style={{ marginTop: 0, color: "#2c2e50" }}>DOCX Import {result.status === "needs-review" ? "— Needs Review" : "Complete"}</h4>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>File: <strong>{fileName}</strong></p>

            {needsTemplateChoice && (
              <div style={{ background: "#eef4ff", border: "1px solid #c3d6f5", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <label style={{ fontWeight: 600, color: "#254a86", fontSize: 13, display: "block", marginBottom: 6 }}>
                  Page Template <span style={{ color: "#a12622" }}>*</span>
                </label>
                <select
                  className="form-control"
                  value={chosenTemplate}
                  onChange={(e) => setChosenTemplate(e.target.value)}
                >
                  <option value="">— Select a template —</option>
                  {PAGE_TEMPLATES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <small style={{ color: "#254a86", display: "block", marginTop: 6, fontSize: 12 }}>
                  This document does not name a Page Template. The template decides which sections
                  are rendered and how Industries behave, so choose the one this document was
                  written for before populating.
                </small>
              </div>
            )}

            <ul style={{ listStyle: "none", padding: 0, marginBottom: 12 }}>
              {sections.map((key) => {
                const found = foundSet.has(key);
                // A section the target template never renders is not a gap in
                // the document, so it is not reported as missing content.
                const unused = unusedSet.has(key);
                return (
                  <li key={key} style={{ fontSize: 13, padding: "2px 0", color: found && !unused ? "#2c2e50" : "#999" }}>
                    {unused ? "·" : found ? "✓" : "—"} {sectionLabels[key] || key}
                    {unused && <span style={{ fontStyle: "italic" }}> (not used by this template)</span>}
                    {!unused && !found && <span style={{ fontStyle: "italic" }}> (not found)</span>}
                  </li>
                );
              })}
            </ul>

            {result.errors?.length > 0 && (
              <div style={{ background: "#fdecea", border: "1px solid #f5c2c0", borderRadius: 8, padding: 10, marginBottom: 10 }}>
                <strong style={{ color: "#a12622", fontSize: 13 }}>Errors ({result.errors.length})</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "#a12622" }}>
                  {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            {templateNotes.length > 0 && (
              <div style={{ background: "#eef4ff", border: "1px solid #c3d6f5", borderRadius: 8, padding: 10, marginBottom: 10 }}>
                <strong style={{ color: "#254a86", fontSize: 13 }}>Page Template ({templateNotes.length})</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "#254a86" }}>
                  {templateNotes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            )}

            {result.warnings?.length > 0 && (
              <div style={{ background: "#fff8e5", border: "1px solid #ffe29a", borderRadius: 8, padding: 10, marginBottom: 10 }}>
                <strong style={{ color: "#8a6d00", fontSize: 13 }}>Warnings ({result.warnings.length})</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "#8a6d00" }}>
                  {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            {confirmingReplace && (
              <div style={{ background: "#fdecea", border: "1px solid #f5c2c0", borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 13, color: "#a12622" }}>
                Existing form data will be replaced by the imported document content. This cannot be undone.
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
              <button type="button" className="btn btn1" onClick={reset} disabled={isPopulating}>Cancel</button>
              <button type="button" className="btn btn2" onClick={handlePopulateClick} disabled={isPopulating}>
                {isPopulating ? "Populating…" : confirmingReplace ? "Replace & Populate" : "Populate Form"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

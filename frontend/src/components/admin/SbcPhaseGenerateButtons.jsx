"use client";

import { GROUP_LABELS } from "@/utils/applySbcSeoSuggestion";

/* ------------------------------------------------------------------ *
 *  Per-phase AI generation buttons for the Service-by-City / Country
 *  admin forms.
 *
 *  The backend already generates the page as four independent groups
 *  (separate model calls, validators and retry budgets). These buttons
 *  expose that split so an editor can regenerate ONE section without
 *  touching the rest of the page — previously the only option was
 *  "Generate Everything", which overwrote good copy alongside bad.
 *
 *  Each phase costs roughly a quarter of a full generation. Running all
 *  four back-to-back costs the same as one full run; spreading them over
 *  hours re-pays each group's prompt-cache write, so do a full rebuild in
 *  one sitting and use single phases for targeted repairs.
 * ------------------------------------------------------------------ */
const GROUP_ORDER = ["group1", "group2", "group3", "group4"];

export default function SbcPhaseGenerateButtons({
  onGenerate,
  activeGroup = null,
  lockedLabel = null,
  disabled = false,
  runButtonAction,
}) {
  const trigger = (event, group) => {
    if (typeof runButtonAction === "function") {
      runButtonAction(event, () => onGenerate(group));
      return;
    }
    event?.preventDefault?.();
    event?.stopPropagation?.();
    onGenerate(group);
  };

  return (
    <div
      className="col-lg-12"
      style={{
        border: "1px dashed #dde2f3",
        borderRadius: 10,
        padding: 14,
        background: "#fdfdff",
        marginBottom: 20,
      }}
    >
      <div style={{ fontWeight: 600, color: "#2c2e50", marginBottom: 4 }}>
        Generate one phase at a time
      </div>
      <div style={{ fontSize: 12.5, color: "#6e6f8a", marginBottom: lockedLabel ? 8 : 12 }}>
        Regenerates only that phase&apos;s sections and leaves the rest of the form
        untouched — use this to fix one section without losing copy you want to keep.
      </div>
      {lockedLabel && (
        // Every phase must target the same page. Showing the locked identity makes
        // it obvious when the form has drifted to a different city before the
        // guard rejects the run.
        <div
          style={{
            fontSize: 12,
            color: "#40415D",
            background: "#eef0fb",
            border: "1px solid #dde2f3",
            borderRadius: 6,
            padding: "5px 10px",
            marginBottom: 12,
            display: "inline-block",
          }}
        >
          Phases locked to <strong>{lockedLabel}</strong> — changing the city, slug or
          market blocks further phases until you run a full generation.
        </div>
      )}
      <div className="d-flex flex-wrap gap-2">
        {GROUP_ORDER.map((group, index) => {
          const busy = activeGroup === group;
          return (
            <button
              key={group}
              type="button"
              className="btn btn1"
              style={{ fontSize: 13 }}
              onMouseDown={(event) => trigger(event, group)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") trigger(event, group);
              }}
              disabled={disabled}
              title={GROUP_LABELS[group]}
            >
              {busy ? `Generating Phase ${index + 1}…` : `Phase ${index + 1} · ${GROUP_LABELS[group]}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}

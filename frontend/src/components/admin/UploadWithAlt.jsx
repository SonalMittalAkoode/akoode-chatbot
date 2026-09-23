"use client";
import ImageAltInput from "./ImageAltInput";

export default function UploadWithAlt({
  children,
  note = "*minimum 260px x 260px",
  stacked = false,
  /** Max width (px) for the alt text column — avoids a full-width input on wide rows */
  altMaxWidth = 300,
  hasFile = false,
  onRemove,
  altId,
  altLabel,
  altValue,
  altOnChange,
  altPlaceholder,
}) {
  return (
    <div style={{ display: "flex", flexDirection: stacked ? "column" : "row", gap: stacked ? "8px" : "16px", alignItems: "flex-start" }}>
      {/* Left – upload box */}
      <div style={{ flexShrink: 0, position: "relative" }}>
        {children}

        {/* × overlay button — rendered in a separate stacking context above the label */}
        {hasFile && onRemove && (
          <div
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              zIndex: 99,
              pointerEvents: "auto",
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }}
              title="Remove image"
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "rgba(220,53,69,0.92)",
                border: "2px solid #fff",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                lineHeight: 1,
                padding: 0,
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(185,30,45,0.97)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(220,53,69,0.92)")}
            >
              ×
            </button>
          </div>
        )}

        {note && (
          <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0" }}>
            {note}
          </p>
        )}
      </div>

      {/* Right / bottom – alt text input (capped width; was flex:1 and stretched unnecessarily) */}
      <div
        style={{
          flex: "0 1 auto",
          width: stacked ? "100%" : altMaxWidth,
          maxWidth: stacked ? "100%" : altMaxWidth,
          minWidth: 0,
          paddingTop: stacked ? 0 : "2px",
        }}
      >
        <ImageAltInput
          id={altId}
          label={altLabel}
          value={altValue}
          onChange={altOnChange}
          placeholder={altPlaceholder}
        />
      </div>
    </div>
  );
}

"use client";

/**
 * StepCard – numbered card wrapper for repeatable step rows.
 *
 * Props:
 *   index    – 0-based index (displayed as index + 1)
 *   label    – Prefix text e.g. "Service", "Industry", "Step"
 *   onRemove – onClick handler for the Remove button (pass null to hide it)
 *   children – Row fields (col-* Bootstrap children)
 */
export default function StepCard({
  index,
  label = "Step",
  onRemove,
  onMoveUp,
  onMoveDown,
  children,
  // Optional drag-to-reorder (handle-initiated, so inputs stay interactive)
  draggableHandle = false,
  onHandleDragStart,
  onCardDragOver,
  onCardDrop,
}) {
  return (
    <div
      onDragOver={draggableHandle ? onCardDragOver : undefined}
      onDrop={draggableHandle ? onCardDrop : undefined}
      style={{
        width: "100%",
        background: "#f8f8fd",
        border: "1px solid #e0e0f0",
        borderRadius: "6px",
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      {/* ── Step header ──────────────────────────────────────────── */}
      <div
        style={{
          padding: "8px 16px",
          background: "#f1f1f8",
          borderBottom: "1px solid #e0e0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: "13px",
            color: "#4b4d7c",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              background: "#4b4d7c",
              color: "#fff",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {index + 1}
          </span>
          {label} {index + 1}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Drag Handle — draggable when reorder is enabled */}
          <div
            draggable={draggableHandle}
            onDragStart={draggableHandle ? onHandleDragStart : undefined}
            style={{ cursor: draggableHandle ? "grab" : "default", color: draggableHandle ? "#9a9cc4" : "#ccc", display: "flex", alignItems: "center", padding: "0 4px" }}
            title={draggableHandle ? "Drag to reorder" : undefined}
          >
            <svg width="12" height="18" viewBox="0 0 12 18">
              <circle cx="2" cy="3" r="1.5" fill="currentColor" />
              <circle cx="2" cy="9" r="1.5" fill="currentColor" />
              <circle cx="2" cy="15" r="1.5" fill="currentColor" />
              <circle cx="10" cy="3" r="1.5" fill="currentColor" />
              <circle cx="10" cy="9" r="1.5" fill="currentColor" />
              <circle cx="10" cy="15" r="1.5" fill="currentColor" />
            </svg>
          </div>

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              style={{
                background: "none",
                border: "1px solid #ff5a5f",
                borderRadius: "4px",
                cursor: "pointer",
                color: "#ff5a5f",
                fontSize: "12px",
                fontWeight: 600,
                padding: "3px 10px",
                lineHeight: 1.4,
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ff5a5f";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "#ff5a5f";
              }}
            >
              × Remove
            </button>
          )}
        </div>
      </div>

      {/* ── Step body ────────────────────────────────────────────── */}
      <div style={{ padding: "24px" }}>
        <div className="row">{children}</div>
      </div>
    </div>
  );
}

"use client";

export default function ImageAltInput({
  id,
  label = "Image Alt Text",
  value,
  onChange,
  placeholder = "Enter image alt text",
}) {
  return (
    <div style={{ marginTop: "6px" }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: 600,
          color: "#666894",
          marginBottom: "3px",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <input
        type="text"
        className="form-control form-control-sm"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          fontSize: "12px",
          padding: "4px 8px",
          height: "30px",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

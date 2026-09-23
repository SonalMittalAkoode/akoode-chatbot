"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { generateSBCSeoFieldSuggestionAPI } from "@/api/serviceByCountry";
import { generateSBCCitySeoFieldSuggestionAPI } from "@/api/serviceByCity";

const textControlSelector = 'input[type="text"], input:not([type]), textarea';

const getFieldLabel = (field) => {
  const group = field?.closest?.(".form-group") || field?.parentElement;
  return group?.querySelector?.("label")?.innerText?.trim() || field?.placeholder || "Focused field";
};

const getSectionLabel = (field, fallback = "Service By Country") =>
  field?.closest?.("[id^='sec-']")?.querySelector?.(".section-title, h3, h4")?.innerText?.trim() ||
  field?.closest?.("[id^='sec-']")?.id?.replace(/^sec-/, "") ||
  fallback;

const setNativeValue = (field, value) => {
  const proto = field.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(field, value);
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
};

export function useSbcFieldAiTools({ disabled = false, buildPayload, mode = "country" }) {
  const fieldApi = mode === "city" ? generateSBCCitySeoFieldSuggestionAPI : generateSBCSeoFieldSuggestionAPI;
  const activeFieldRef = useRef(null);
  const [activeMeta, setActiveMeta] = useState(null);
  const [restoreMap, setRestoreMap] = useState({});
  const [isRegenerating, setIsRegenerating] = useState(false);

  const getActiveField = () => {
    const focused = typeof document !== "undefined" ? document.activeElement : null;
    if (
      focused?.matches?.(textControlSelector) &&
      !focused.readOnly &&
      !focused.disabled
    ) {
      activeFieldRef.current = focused;
      return focused;
    }
    const current = activeFieldRef.current;
    if (current?.isConnected) return current;
    if (!activeMeta?.key || typeof document === "undefined") return null;
    const escapedKey = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(activeMeta.key) : activeMeta.key.replace(/"/g, '\\"');
    const fallback = document.querySelector(`[data-ai-field-key="${escapedKey}"]`);
    if (fallback) activeFieldRef.current = fallback;
    return fallback;
  };

  const handleFocusCapture = (event) => {
    const field = event.target?.matches?.(textControlSelector) ? event.target : null;
    if (!field || field.readOnly || field.disabled) return;
    const key = field.dataset.aiFieldKey || `${getSectionLabel(field, mode === "city" ? "Service By City" : "Service By Country")}:${getFieldLabel(field)}:${field.placeholder || ""}`;
    field.dataset.aiFieldKey = key;
    activeFieldRef.current = field;
    setActiveMeta({ key, label: getFieldLabel(field), section: getSectionLabel(field, mode === "city" ? "Service By City" : "Service By Country") });
  };

  const handleRegenerate = async () => {
    const activeField = getActiveField();
    if (!activeField || !activeMeta || disabled || isRegenerating) return;
    const previousValue = activeField.value || "";
    setIsRegenerating(true);
    try {
      const payload = {
        ...(buildPayload?.() || {}),
        fieldLabel: activeMeta.label,
        sectionLabel: activeMeta.section,
        currentValue: previousValue,
      };
      const response = await fieldApi(payload);
      const nextValue = response?.data?.value || "";
      if (!nextValue) throw new Error("AI returned an empty field value");
      setRestoreMap((map) => ({ ...map, [activeMeta.key]: previousValue }));
      setNativeValue(activeField, nextValue);
      activeField.focus();
      toast.success(`Regenerated ${activeMeta.label}`);
    } catch (error) {
      toast.error(error.message || "Failed to regenerate this field");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRestore = () => {
    const activeField = getActiveField();
    if (!activeField || !activeMeta) return;
    const oldValue = restoreMap[activeMeta.key];
    if (oldValue === undefined) return;
    setNativeValue(activeField, oldValue);
    activeField.focus();
    setRestoreMap((map) => {
      const next = { ...map };
      delete next[activeMeta.key];
      return next;
    });
    toast.info(`Restored ${activeMeta.label}`);
  };

  return {
    onFocusCapture: handleFocusCapture,
    toolbar: activeMeta ? (
      <div
        style={{
          position: "sticky",
          top: 104,
          zIndex: 48,
          display: "flex",
          justifyContent: "flex-end",
          margin: "0 0 8px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 10,
            background: "#f8f9ff",
            border: "1px solid #dfe4f5",
            boxShadow: "0 8px 22px rgba(44,46,80,0.12)",
          }}
        >
          <span style={{ fontSize: 12, color: "#4b4d7c", maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Field: <strong>{activeMeta.label}</strong>
          </span>
          <button type="button" className="btn btn2 btn-sm" onClick={handleRegenerate} disabled={disabled || isRegenerating}>
            {isRegenerating ? "Regenerating..." : "Regenerate Field"}
          </button>
          <button type="button" className="btn btn1 btn-sm" onClick={handleRestore} disabled={disabled || restoreMap[activeMeta.key] === undefined}>
            Restore Field
          </button>
        </div>
      </div>
    ) : null,
  };
}

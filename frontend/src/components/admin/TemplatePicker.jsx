"use client";

import { PAGE_TEMPLATES } from "@/config/pageTemplates";

// Shared "Page Template" dropdown for the service-by-country and
// service-by-city admin forms. Options come from config/pageTemplates.js so
// all four forms (country add/edit, city add/edit) stay in step with the
// Mongoose enum that validates the saved value.
export default function TemplatePicker({ value, onChange }) {
  return (
    <div className="col-lg-4">
      <div className="my_profile_setting_input form-group">
        <label>
          Page Template{" "}
          <span style={{ fontSize: 10, color: "#888", fontWeight: 400 }}>
            — which front-end layout this page renders
          </span>
        </label>
        <select
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {PAGE_TEMPLATES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

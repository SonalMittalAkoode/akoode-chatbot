"use client";

import {
  emptyWhyChooseUsShowcase,
  mergeWhyChooseUsShowcase,
  WHY_CHOOSE_US_ICON_OPTIONS,
} from "@/utils/whyChooseUsShowcase";

const panelStyle = {
  border: "1px solid #e6e8f0",
  borderRadius: 12,
  padding: "18px 16px 22px",
  background: "#fafbff",
  marginBottom: 20,
};

/**
 * Controlled form for the public "Why choose us" showcase (before Results & Impact).
 * Value shape matches mergeWhyChooseUsShowcase / API `whychooseus`.
 */
export default function WhyChooseUsShowcaseForm({ value, onChange }) {
  const w = mergeWhyChooseUsShowcase(value);

  const patch = (partial) => onChange({ ...w, ...partial });

  const setFeature = (index, field, fieldValue) => {
    const next = [...w.features];
    next[index] = { ...next[index], [field]: fieldValue };
    patch({ features: next });
  };

  const addFeature = () => {
    patch({
      features: [
        ...w.features,
        { icon: "sparkles", title: "", description: "" },
      ],
    });
  };

  const removeFeature = (index) => {
    patch({ features: w.features.filter((_, i) => i !== index) });
  };

  const setFooter = (index, field, fieldValue) => {
    const next = [...w.footer];
    next[index] = { ...next[index], [field]: fieldValue };
    patch({ footer: next });
  };

  const addFooter = () => {
    patch({
      footer: [...w.footer, { label: "", sublabel: "" }],
    });
  };

  const removeFooter = (index) => {
    patch({ footer: w.footer.filter((_, i) => i !== index) });
  };

  const clearAll = () => {
    onChange(emptyWhyChooseUsShowcase());
  };

  return (
    <div className="col-lg-12">
      <div className="mb20 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <p className="text-muted mb0" style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 720 }}>
          This block appears on the case study page before <strong>Results &amp; Impact</strong>. Leave
          empty to hide it. Use the lists below for the four cards and footer row.
        </p>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearAll}>
          Clear showcase
        </button>
      </div>

      <div style={panelStyle}>
        <h4 className="mb15" style={{ fontWeight: 600, color: "#2f3150", fontSize: 15 }}>
          Header
        </h4>
        <div className="row">
          <div className="col-md-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_badge">Badge label</label>
              <input
                id="wcu_badge"
                type="text"
                className="form-control"
                value={w.badge}
                onChange={(e) => patch({ badge: e.target.value })}
                placeholder="e.g. Why choose us"
              />
            </div>
          </div>
          <div className="col-md-8">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_title">Main title</label>
              <input
                id="wcu_title"
                type="text"
                className="form-control"
                value={w.title}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder="e.g. Partnership built for outcomes"
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_subtitle">Subtitle</label>
              <textarea
                id="wcu_subtitle"
                className="form-control"
                rows={3}
                value={w.subtitle}
                onChange={(e) => patch({ subtitle: e.target.value })}
                placeholder="Short paragraph under the title"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={panelStyle}>
        <h4 className="mb15" style={{ fontWeight: 600, color: "#2f3150", fontSize: 15 }}>
          Left card — “Delivery pulse”
        </h4>
        <div className="row">
          <div className="col-md-6">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_pulse_cap">Top-right caption</label>
              <input
                id="wcu_pulse_cap"
                type="text"
                className="form-control"
                value={w.pulseCaption}
                onChange={(e) => patch({ pulseCaption: e.target.value })}
                placeholder="e.g. Delivery pulse"
              />
            </div>
          </div>
        </div>
        <p className="text-muted mt10 mb10" style={{ fontSize: 12 }}>
          Stat 1 (left tile)
        </p>
        <div className="row">
          <div className="col-md-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_s1l">Label</label>
              <input
                id="wcu_s1l"
                type="text"
                className="form-control"
                value={w.pulseStat1Label}
                onChange={(e) => patch({ pulseStat1Label: e.target.value })}
                placeholder="On-time"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_s1v">Value</label>
              <input
                id="wcu_s1v"
                type="text"
                className="form-control"
                value={w.pulseStat1Value}
                onChange={(e) => patch({ pulseStat1Value: e.target.value })}
                placeholder="98%"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_s1s">Sub label</label>
              <input
                id="wcu_s1s"
                type="text"
                className="form-control"
                value={w.pulseStat1Sub}
                onChange={(e) => patch({ pulseStat1Sub: e.target.value })}
                placeholder="avg. sprint close"
              />
            </div>
          </div>
        </div>
        <p className="text-muted mt15 mb10" style={{ fontSize: 12 }}>
          Stat 2 (right tile)
        </p>
        <div className="row">
          <div className="col-md-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_s2l">Label</label>
              <input
                id="wcu_s2l"
                type="text"
                className="form-control"
                value={w.pulseStat2Label}
                onChange={(e) => patch({ pulseStat2Label: e.target.value })}
                placeholder="Visibility"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_s2v">Value</label>
              <input
                id="wcu_s2v"
                type="text"
                className="form-control"
                value={w.pulseStat2Value}
                onChange={(e) => patch({ pulseStat2Value: e.target.value })}
                placeholder="360°"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_s2s">Sub label</label>
              <input
                id="wcu_s2s"
                type="text"
                className="form-control"
                value={w.pulseStat2Sub}
                onChange={(e) => patch({ pulseStat2Sub: e.target.value })}
                placeholder="roadmap & demos"
              />
            </div>
          </div>
        </div>
        <p className="text-muted mt15 mb10" style={{ fontSize: 12 }}>
          Bottom quality strip
        </p>
        <div className="row">
          <div className="col-md-6">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_qt">Title</label>
              <input
                id="wcu_qt"
                type="text"
                className="form-control"
                value={w.pulseQualityTitle}
                onChange={(e) => patch({ pulseQualityTitle: e.target.value })}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="wcu_qs">Subtitle</label>
              <input
                id="wcu_qs"
                type="text"
                className="form-control"
                value={w.pulseQualitySubtitle}
                onChange={(e) => patch({ pulseQualitySubtitle: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={panelStyle}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb15">
          <h4 className="mb0" style={{ fontWeight: 600, color: "#2f3150", fontSize: 15 }}>
            Feature cards (grid)
          </h4>
          <button type="button" className="btn admore_btn btn-sm" onClick={addFeature}>
            Add card
          </button>
        </div>
        {w.features.length === 0 && (
          <p className="text-muted mb0" style={{ fontSize: 13 }}>
            No cards yet. Click <strong>Add card</strong> (typically four).
          </p>
        )}
        {w.features.map((row, index) => (
          <div
            key={index}
            className="row mb20 pb20"
            style={{ borderBottom: "1px solid #eceef5" }}
          >
            <div className="col-12 d-flex justify-content-between align-items-center mb10">
              <span style={{ fontWeight: 600, color: "#4b4e6a", fontSize: 13 }}>
                Card {index + 1}
              </span>
              <button
                type="button"
                className="btn btn2 btn-sm"
                onClick={() => removeFeature(index)}
              >
                Remove
              </button>
            </div>
            <div className="col-md-3">
              <div className="my_profile_setting_input form-group">
                <label htmlFor={`wcu_feat_icon_${index}`}>Icon</label>
                <select
                  id={`wcu_feat_icon_${index}`}
                  className="form-control"
                  value={row.icon || "sparkles"}
                  onChange={(e) => setFeature(index, "icon", e.target.value)}
                >
                  {WHY_CHOOSE_US_ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-9">
              <div className="my_profile_setting_input form-group">
                <label htmlFor={`wcu_feat_title_${index}`}>Title</label>
                <input
                  id={`wcu_feat_title_${index}`}
                  type="text"
                  className="form-control"
                  value={row.title}
                  onChange={(e) => setFeature(index, "title", e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-12">
              <div className="my_profile_setting_input form-group">
                <label htmlFor={`wcu_feat_desc_${index}`}>Description</label>
                <textarea
                  id={`wcu_feat_desc_${index}`}
                  className="form-control"
                  rows={3}
                  value={row.description}
                  onChange={(e) => setFeature(index, "description", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...panelStyle, marginBottom: 0 }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb15">
          <h4 className="mb0" style={{ fontWeight: 600, color: "#2f3150", fontSize: 15 }}>
            Footer row (checklist)
          </h4>
          <button
            type="button"
            className="btn admore_btn btn-sm"
            onClick={addFooter}
            disabled={w.footer.length >= 6}
          >
            Add row
          </button>
        </div>
        {w.footer.map((row, index) => (
          <div
            key={index}
            className="row mb15 align-items-end"
            style={{ borderBottom: index < w.footer.length - 1 ? "1px solid #eceef5" : undefined }}
          >
            <div className="col-md-5">
              <div className="my_profile_setting_input form-group">
                <label htmlFor={`wcu_ft_lab_${index}`}>Label</label>
                <input
                  id={`wcu_ft_lab_${index}`}
                  type="text"
                  className="form-control"
                  value={row.label}
                  onChange={(e) => setFooter(index, "label", e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="my_profile_setting_input form-group">
                <label htmlFor={`wcu_ft_sub_${index}`}>Sub label</label>
                <input
                  id={`wcu_ft_sub_${index}`}
                  type="text"
                  className="form-control"
                  value={row.sublabel}
                  onChange={(e) => setFooter(index, "sublabel", e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-1">
              <button
                type="button"
                className="btn btn2 btn-sm w-100"
                onClick={() => removeFooter(index)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {w.footer.length === 0 && (
          <p className="text-muted mb0" style={{ fontSize: 13 }}>
            Optional. Add up to six short rows (typically three).
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { stripBareTldAutolinks, normalizeAnchorHrefs } from "@/utils/safeRichText";

const looksLikeHtml = (value) => {
  if (!value) return false;
  return /<\/?[a-z][\s\S]*?>/i.test(String(value));
};

export default function RichText({ as, html = "", className = "", ...rest }) {
  if (!html) return null;
  if (looksLikeHtml(html)) {
    // CMS-authored content often already wraps itself in block tags (<p>, <ul>, ...).
    // Defaulting to <p> here would nest a <p> inside a <p> — invalid HTML that the
    // browser silently restructures on parse, causing a hydration mismatch (React's
    // tree still expects the original single-<p> shape). <div> can legally contain
    // any of that content, so it's the safe default unless the caller opts into `as`.
    const Tag = as || "div";
    const merged = className ? `sbc-rich ${className}` : "sbc-rich";
    return (
      <Tag
        {...rest}
        className={merged}
        dangerouslySetInnerHTML={{ __html: normalizeAnchorHrefs(stripBareTldAutolinks(html)) }}
      />
    );
  }
  const Tag = as || "p";
  return (
    <Tag {...rest} className={className}>
      {html}
    </Tag>
  );
}

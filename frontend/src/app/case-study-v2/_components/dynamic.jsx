import { resolveIcon, buildAssetUrl } from "@/app/country/_components/shared";

export { buildAssetUrl };

/* ------------------------------------------------------------------ *
 *  Dynamic-content helpers shared by the section components.
 *
 *  The page renders from hardcoded DEFAULTS unless a DB record is
 *  passed in. To keep the design identical either way:
 *   - renderIcon handles BOTH a default lucide component (function) and
 *     a DB icon value (a react-icons name string, or an uploaded image
 *     path). Same size/className props apply in every case.
 *   - RichText renders HtmlEditor output (or a plain default string) into
 *     a div, so the existing typography classes still drive the styling.
 * ------------------------------------------------------------------ */

export function renderIcon(icon, props = {}) {
  if (!icon) return null;

  // DB value (string): image path or a react-icons name
  if (typeof icon === "string") {
    const isImage =
      icon.startsWith("/") || icon.startsWith("http") || icon.startsWith("public/");
    if (isImage) {
      const { size = 22, className = "" } = props;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={buildAssetUrl(icon)}
          alt=""
          className={className}
          style={{ width: size, height: size, objectFit: "contain" }}
        />
      );
    }
    const Cmp = resolveIcon(icon);
    return <Cmp {...props} />;
  }

  // Default value: an already-imported icon component
  const Cmp = icon;
  return <Cmp {...props} />;
}

export function RichText({ html, className = "" }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html ?? "" }} />;
}

// Pick DB value when the record is present, else fall back to the default.
export const pick = (value, fallback) =>
  value === undefined || value === null || value === "" ? fallback : value;

// Use DB list only when it has items, else the hardcoded default list.
export const pickList = (list, fallback) =>
  Array.isArray(list) && list.length ? list : fallback;

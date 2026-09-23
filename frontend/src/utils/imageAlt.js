export function resolveImageAlt(value, fallback = "Image") {
  const primary = String(value || "").trim();
  if (primary) return primary;

  const backup = String(fallback || "").trim();
  return backup || "Image";
}

/**
 * Derives a human-readable alt text from a file name or URL path.
 * e.g. "/uploads/cloud-devops-hero.jpg" → "cloud devops hero"
 */
export function fileNameToAlt(filename) {
  if (!filename) return '';
  const base = String(filename).split(/[/\\]/).pop() || '';
  const withoutExt = base.replace(/\.[^.]+$/, '');
  return withoutExt
    .replace(/[-_.+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

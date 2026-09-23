import resolveImageUrl from './resolveImageUrl';

/**
 * Extract text from first matching HTML tag (e.g. first <h4>, first <p>).
 * @param {string} html
 * @param {string} tag - e.g. 'h4', 'p', 'h5'
 * @returns {string}
 */
function extractFirstTagText(html, tag) {
  if (!html || typeof html !== 'string') return '';
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = html.match(regex);
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : '';
}

/**
 * Extract paragraph text that appears after a specific heading (e.g. after <h5>Client Overview</h5>).
 * @param {string} html
 * @param {string} afterHeading - e.g. 'Client Overview'
 * @returns {string}
 */
function extractTextAfterHeading(html, afterHeading) {
  if (!html || typeof html !== 'string') return '';
  const normalized = html.replace(/\s+/g, ' ');
  const h5Regex = new RegExp(`<h5[^>]*>\\s*${afterHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*</h5>\\s*<p[^>]*>([\\s\\S]*?)</p>`, 'i');
  const match = normalized.match(h5Regex);
  if (match) return match[1].replace(/<[^>]+>/g, '').trim();
  // Fallback: take first <p> after any <h5>
  const afterH5 = normalized.split(/<\/h5>/i)[1];
  if (afterH5) {
    const pMatch = afterH5.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    return pMatch ? pMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  }
  return '';
}

/**
 * Parse shortdescription like "Product Type: <span>Enterprise AI Desktop Solution</span>"
 * or "Company Highlight - 75+ Years" into label and transformText.
 * @param {string} shortDesc
 * @returns {{ label: string, transformText: string }}
 */
function parseShortDescription(shortDesc) {
  let label = '';
  let transformText = '';
  if (!shortDesc || typeof shortDesc !== 'string') return { label, transformText };
  const stripped = shortDesc.replace(/\s+/g, ' ').trim();
  const spanMatch = stripped.match(/^(.+?):\s*<span[^>]*>([\s\S]*?)<\/span>/i);
  if (spanMatch) {
    label = spanMatch[1].trim();
    if (!label.endsWith(':')) label += ':';
    transformText = spanMatch[2].replace(/<[^>]+>/g, '').trim();
    return { label, transformText };
  }
  const colonIndex = stripped.indexOf(':');
  if (colonIndex > 0) {
    label = stripped.slice(0, colonIndex + 1).trim();
    transformText = stripped.slice(colonIndex + 1).replace(/<[^>]+>/g, '').trim();
    return { label, transformText };
  }
  transformText = stripped.replace(/<[^>]+>/g, '').trim();
  return { label: 'Product Type:', transformText: transformText || '' };
}

/**
 * Normalize an API casestudy list item into the shape used by the CaseStudies slider.
 * @param {object} item - Raw item from getCasestudyList / API
 * @returns {object} { id, title, highlight, overview, label, transformText, logo, link }
 */
export function normalizeCasestudyForSlider(item) {
  if (!item) return null;
  const id = item._id || item.id || '';
  const slug = item.slug || id;
  const link = slug ? `/case-studies/${slug}` : '/case-studies';

  const description = item.description || '';
  const title =
    extractFirstTagText(description, 'h4') ||
    item.project ||
    item.title ||
    'Case Study';
  const highlight = extractFirstTagText(description, 'p') || '';
  let overview = extractTextAfterHeading(description, 'Client Overview');
  if (!overview && description) {
    const allPs = description.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    if (allPs && allPs.length >= 2) {
      overview = allPs[1].replace(/<[^>]+>/g, '').trim();
    }
  }

  const { label, transformText } = parseShortDescription(item.shortdescription || '');

  const logoRaw = item.casestudylogo ?? item.casestudyimage ?? item.logoimage ?? item.logo;
  const logo = logoRaw ? resolveImageUrl(logoRaw) : '';

  return {
    id: String(id),
    title,
    highlight,
    overview,
    label: label || 'Product Type:',
    transformText: transformText || title,
    logo,
    link,
  };
}

/**
 * Normalize an array of API casestudy items for the slider.
 * @param {object[]} items
 * @returns {object[]}
 */
export function normalizeCasestudyListForSlider(items) {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeCasestudyForSlider).filter(Boolean);
}

/**
 * Normalize a single item from the new caseStudyLatest schema into the
 * same slider shape. The new schema is fully structured (no raw HTML blobs)
 * so the field mapping is straightforward.
 *
 * Slider shape: { id, title, highlight, overview, label, transformText, logo, link }
 *
 * @param {object} item - Raw item from getCaseStudyLatestList
 * @returns {object|null}
 */
export function normalizeLatestCasestudyForSlider(item) {
  if (!item) return null;

  const id = item._id || item.id || '';
  const slug = item.slug || id;
  const link = slug ? `/case-studies/${slug}` : '/case-studies';

  const title = item.title || item.hero?.heading || 'Case Study';

  // Client overview: prefer hero body, fall back to rethinking body
  const stripTags = (v) => String(v || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const overview = stripTags(item.hero?.body || item.rethinking?.body || '');

  // label / transformText: use first metaChip if present, else headingAccent
  const firstChip = Array.isArray(item.hero?.metaChips) ? item.hero.metaChips[0] : null;
  const label = firstChip?.label ? `${firstChip.label}:` : 'Product Type:';
  const transformText =
    firstChip?.value ||
    stripTags(item.hero?.headingAccent || '') ||
    title;

  const logoRaw = item.hero?.listingImage || item.hero?.heroImage || item.casestudylogo || item.logo;
  const logo = logoRaw ? resolveImageUrl(logoRaw) : '';

  return {
    id: String(id),
    title,
    highlight: stripTags(item.hero?.headingAccent || ''),
    overview,
    label,
    transformText,
    logo,
    link,
  };
}

/**
 * Normalize an array of caseStudyLatest items for the slider.
 * @param {object[]} items
 * @returns {object[]}
 */
export function normalizeLatestCasestudyListForSlider(items) {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeLatestCasestudyForSlider).filter(Boolean);
}

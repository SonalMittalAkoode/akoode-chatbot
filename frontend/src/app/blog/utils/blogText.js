const stripHtml = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

/** ~200 wpm estimate, matching the "X min read" convention used across the blog. */
export const estimateReadTime = (html) => {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

/** post.description is the full rich-text article body, not a short excerpt — cap it
 * before rendering so cards don't ship the entire article into the DOM. */
export const excerptWords = (html, maxWords = 32) => {
  const clean = stripHtml(html);
  if (!clean) return '';
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return clean;
  return words.slice(0, maxWords).join(' ') + '…';
};

export { stripHtml };

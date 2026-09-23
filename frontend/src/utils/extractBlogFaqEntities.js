// Extract FAQ entities (FAQPage JSON-LD) from a blog's HTML description.
// This is intentionally dependency-free and safe for server-side rendering.

const htmlToPlainText = (html) => {
  if (!html) return "";
  return String(html)
    // Remove scripts/styles to avoid irrelevant text.
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    // Preserve some block boundaries as new lines.
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|ul|ol|h[1-6]|section|article|tr)>/gi, "\n")
    // Drop the remaining tags.
    .replace(/<[^>]*>/g, " ")
    // Basic entity decoding.
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    // Normalize whitespace.
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const collapseWhitespace = (value) =>
  String(value || "")
    .replace(/[ \t\r\n]+/g, " ")
    .trim();

const stripQuestionPrefix = (line) => {
  // Numbered: "1. Question ..." / "2) Question ..." / "3 - Question ..." (some editors use dash)
  const numbered = line.match(/^\s*(\d+)[\.\)]\s+(.+?)\s*$/);
  if (numbered) return numbered[2];

  const numberedDash = line.match(/^\s*(\d+)\s*[-:.)]\s+(.+?)\s*$/);
  if (numberedDash) return numberedDash[2];

  // Q format: "Q: Question ..." / "Question - ..." / "Question: ..."
  const qFormat = line.match(/^(?:q|question)\s*[:\-\.\)]\s+(.+?)\s*$/i);
  if (qFormat) return qFormat[1];

  const qFormatAlt = line.match(/^(?:q|question)\s*[:\-]\s*(.+?)\s*$/i);
  if (qFormatAlt) return qFormatAlt[1];

  return null;
};

const extractFaqEntitiesFromBlogText = (faqText) => {
  const lines = faqText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const entities = [];
  const seenQuestions = new Set();
  const MAX_FAQS = 10;

  for (let i = 0; i < lines.length && entities.length < MAX_FAQS; i += 1) {
    const q = stripQuestionPrefix(lines[i]);
    if (!q) continue;

    const question = collapseWhitespace(q);
    if (question.length < 5) continue;
    const key = question.toLowerCase();
    if (seenQuestions.has(key)) continue;

    const answerParts = [];
    i += 1;

    while (i < lines.length) {
      const nextQ = stripQuestionPrefix(lines[i]);
      if (nextQ) {
        i -= 1; // step back so outer loop can reprocess this question
        break;
      }
      answerParts.push(lines[i]);
      i += 1;
    }

    const answer = collapseWhitespace(answerParts.join(" "));
    if (answer.length >= 10) {
      seenQuestions.add(key);
      entities.push({
        question,
        answer: answer.slice(0, 1500),
      });
    }
  }

  return entities;
};

// Public helper: takes blog HTML and returns FAQPage entities.
export const extractFaqEntitiesFromBlogHtml = (html) => {
  const text = htmlToPlainText(html);
  if (!text) return [];

  // Marker: try common headings first.
  const markerRe =
    /(frequently\s+asked\s+questions|(^|\n)\s*faqs\s*$|(^|\n)\s*faq\s*:?\s*)/i;
  const markerMatch = markerRe.exec(text);
  if (!markerMatch) return [];

  const faqText = text.slice(markerMatch.index);
  return extractFaqEntitiesFromBlogText(faqText);
};


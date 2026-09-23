const mammoth = require("mammoth");
const cheerio = require("cheerio");

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// A paragraph whose ENTIRE text is bold. The source documents use bold for
// structure — field labels ("Bullet Points") and entry titles ("Real Estate",
// "Feature Card 1") — and plain weight for the values underneath. That signal
// is what tells an entry title apart from the body paragraph that follows it,
// so it is carried through to sectionParser.js. Partially bold prose (a bold
// phrase inside a sentence) is deliberately NOT bold here.
function isFullyBold($, $el) {
  const text = $el.text().replace(/\s+/g, " ").trim();
  if (!text) return false;
  const boldText = $el
    .find("strong,b")
    .map((_, node) => $(node).text())
    .get()
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  return boldText.length > 0 && boldText === text;
}

async function parseDocxToBlocks(buffer) {
  const { value: html } = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Subtitle'] => h2:fresh",
      ],
    }
  );

  const $ = cheerio.load(html, { decodeEntities: true });
  const blocks = [];

  $("body")
    .children()
    .each((_, el) => {
      const tag = el.tagName ? el.tagName.toLowerCase() : "";
      const $el = $(el);

      if (HEADING_TAGS.includes(tag)) {
        const text = $el.text().trim();
        if (text) blocks.push({ type: "heading", level: Number(tag[1]), text });
        return;
      }

      if (tag === "ul" || tag === "ol") {
        const items = $el
          .children("li")
          .map((__, li) => $(li).text().trim())
          .get()
          .filter(Boolean);
        if (items.length) blocks.push({ type: "list", ordered: tag === "ol", items });
        return;
      }

      if (tag === "table") {
        const rows = $el
          .find("tr")
          .map((__, tr) =>
            $(tr)
              .find("td,th")
              .map((___, cell) => $(cell).text().trim())
              .get()
          )
          .get();
        if (rows.length) blocks.push({ type: "table", rows });
        return;
      }

      if (tag === "p" || tag === "" ) {
        const text = $el.text().trim();
        if (!text) return; 
        blocks.push({ type: "paragraph", text, html: $el.html() || text, bold: isFullyBold($, $el) });
        return;
      }

    });

  return blocks;
}

module.exports = { parseDocxToBlocks };

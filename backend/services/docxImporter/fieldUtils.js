const cheerio = require("cheerio");

const ALLOWED_TAGS = new Set(["p", "strong", "b", "em", "i", "ul", "ol", "li", "a", "br"]);

function sanitizeRichText(html) {
  if (!html) return "";
  const $ = cheerio.load(`<div id="root">${html}</div>`, { decodeEntities: true });
  const clean = (node) => {
    $(node)
      .contents()
      .each((_, child) => {
        if (child.type === "tag") {
          const tag = child.tagName.toLowerCase();
          if (!ALLOWED_TAGS.has(tag)) {
            $(child).replaceWith($(child).html() || $(child).text());
            return;
          }

          if (tag === "a") {
            const href = $(child).attr("href") || "";
            const safe = /^(https?:)?\/\//i.test(href) || href.startsWith("/");
            $(child).removeAttr("target").removeAttr("onclick").removeAttr("style").removeAttr("class");
            if (safe) $(child).attr("href", href);
            else $(child).removeAttr("href");
          } else {
            [...(child.attribs ? Object.keys(child.attribs) : [])].forEach((attr) => $(child).removeAttr(attr));
          }
          clean(child);
        }
      });
  };
  clean("#root");
  return $("#root").html().trim();
}

function pickField(fields, keys) {
  for (const key of keys) {
    if (fields[key] !== undefined) return fields[key];
  }
  return undefined;
}

function pickText(fields, aliases, fallback = "") {
  const value = pickField(fields, aliases);
  if (value === undefined) return fallback;
  if (Array.isArray(value)) return value.join(", ");
  return String(value).trim();
}

function pickList(fields, aliases, fallback = []) {
  const value = pickField(fields, aliases);
  if (value === undefined) return fallback;
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function joinHeadingAccent(lead, accent) {
  const leadText = String(lead || "").trim();
  const accentText = String(accent || "").trim();
  if (!accentText) return leadText;
  if (!leadText) return accentText;

  const leadWords = new Set(leadText.toLowerCase().match(/[a-z0-9]+/g) || []);
  const accentWords = (accentText.toLowerCase().match(/[a-z0-9]+/g) || []).filter(
    (w) => w.length > 3
  );
  const addsSomething =
    accentWords.length === 0
      ? false
      : accentWords.some((w) => !leadWords.has(w));

  return addsSomething ? `${leadText} ${accentText}` : leadText;
}

module.exports = { sanitizeRichText, pickField, pickText, pickList, joinHeadingAccent };

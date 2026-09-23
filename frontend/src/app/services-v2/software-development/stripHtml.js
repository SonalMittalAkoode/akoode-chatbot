const ENTITIES = [
  [/&nbsp;/g, " "],
  [/&amp;/g, "&"],
  [/&lt;/g, "<"],
  [/&gt;/g, ">"],
  [/&quot;/g, '"'],
  [/&#39;/g, "'"],
  [/&apos;/g, "'"],
];

export function stripHtml(value) {
  if (!value) return "";
  let s = String(value).replace(/<[^>]*>/g, " ");
  for (const [pat, rep] of ENTITIES) s = s.replace(pat, rep);
  return s.replace(/\s+/g, " ").trim();
}

const LEAD_WORDS = 3;

export default function withLineBreak(text) {
  const value = String(text || "");
  if (value.includes("\n")) return value;

  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length < 3) return value;

  const at = Math.min(LEAD_WORDS, words.length - 1);
  return `${words.slice(0, at).join(" ")}\n${words.slice(at).join(" ")}`;
}

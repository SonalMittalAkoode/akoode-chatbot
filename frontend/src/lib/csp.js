export const CSP_NONCE_HEADER = "x-nonce";
export const PATHNAME_HEADER = "x-pathname";

const DEFAULT_SCRIPT_SRC = [
  "'self'",
  "https://www.googletagmanager.com",
  "https://tagassistant.google.com",
  "https://www.google-analytics.com",
  "https://*.clarity.ms",
];
const DEFAULT_STYLE_SRC = ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"];
const DEFAULT_CONNECT_SRC = [
  "'self'",
  "https://api.akoode.com",
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:5000"] : []),

  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://region1.google-analytics.com",
  "https://analytics.google.com",
  "https://tagassistant.google.com",

  "https://stats.g.doubleclick.net",

  "https://*.clarity.ms",
];
const DEFAULT_IMG_SRC = [
  "'self'",
  "data:",
  "blob:",
  "https://api.akoode.com",
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:5000"] : []),

  // Google (analytics + ads audience/remarketing pixels). The remarketing
  // pixel fires from the visitor's country-TLD Google host (google.co.in,
  // google.co.uk, ...) — CSP has no TLD wildcard, so list the markets
  // Akoode serves (US, UK, India, UAE) explicitly and add more as needed.
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://stats.g.doubleclick.net",
  "https://www.google.com",
  "https://www.google.co.in",
  "https://www.google.co.uk",
  "https://www.google.ae",

  "https://*.clarity.ms",
  "https://c.bing.com",
];
const DEFAULT_FONT_SRC = ["'self'", "data:"];
const DEFAULT_FRAME_SRC = [
  "'self'",
  "https://www.googletagmanager.com",
  "https://www.google.com",
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
];
const DEFAULT_MEDIA_SRC = [
  "'self'",
  "blob:",
  "data:",
  "https://api.akoode.com",
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:5000"] : []),
];

function splitSources(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

export function generateNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

export function buildCspHeader({ nonce, isDev = false } = {}) {
  const scriptSrc = uniq([
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    ...DEFAULT_SCRIPT_SRC,
    ...splitSources(process.env.CSP_SCRIPT_SRC),
  ]);

  const directives = {
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'self'"],
    "object-src": ["'none'"],
    "script-src": scriptSrc,
    "style-src": uniq([...DEFAULT_STYLE_SRC, ...splitSources(process.env.CSP_STYLE_SRC)]),
    "img-src": uniq([...DEFAULT_IMG_SRC, ...splitSources(process.env.CSP_IMG_SRC)]),
    "font-src": uniq([...DEFAULT_FONT_SRC, ...splitSources(process.env.CSP_FONT_SRC)]),
    "connect-src": uniq([
      ...DEFAULT_CONNECT_SRC,
      ...splitSources(process.env.CSP_CONNECT_SRC),
    ]),
    "media-src": uniq([...DEFAULT_MEDIA_SRC, ...splitSources(process.env.CSP_MEDIA_SRC)]),
    "frame-src": uniq([...DEFAULT_FRAME_SRC, ...splitSources(process.env.CSP_FRAME_SRC)]),
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
  };

  const policy = Object.entries(directives)
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");

  return isDev ? policy : `${policy}; upgrade-insecure-requests`;
}

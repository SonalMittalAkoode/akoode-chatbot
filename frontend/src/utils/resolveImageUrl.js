const ensureLeadingSlash = (value = '') =>
  value.startsWith('/') ? value : `/${value}`;

const buildUrl = (base, relativePath) => {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const safeRelative = relativePath.startsWith('/')
    ? relativePath.slice(1)
    : relativePath;
  return new URL(safeRelative, normalizedBase).href;
};

const resolveImageUrl = (inputPath) => {
  if (!inputPath) return null;

  if (/^https?:\/\//i.test(inputPath)) {
    return inputPath;
  }

  const explicitAssetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  if (explicitAssetBase) {
    try {
      return buildUrl(explicitAssetBase, ensureLeadingSlash(inputPath));
    } catch {
      // ignore and continue
    }
  }

  const fallbackBase =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_FRONTEND_API_URL;

  if (fallbackBase) {
    try {
      const parsed = new URL(fallbackBase);
      return buildUrl(parsed.origin, ensureLeadingSlash(inputPath));
    } catch {
      try {
        return buildUrl(`http://${fallbackBase}`, ensureLeadingSlash(inputPath));
      } catch {
        // ignore and continue
      }
    }
  }

  return ensureLeadingSlash(inputPath);
};

export default resolveImageUrl;


const apiDefaults = {
  NEXT_PUBLIC_API_URL: 'https://api.akoode.com/',
  NEXT_PUBLIC_FRONTEND_API_URL: 'https://api.akoode.com/frontend/',
  NEXT_PUBLIC_ADMIN_API_URL: 'https://api.akoode.com/admin/',
};

export function deploymentConfig(env = process.env) {
  if (env.VERCEL !== '1') return {};
  const result = {};
  for (const [key, fallback] of Object.entries(apiDefaults)) {
    const value = env[key]?.trim() || fallback;
    const url = new URL(value);
    if (url.protocol !== 'https:' || /^(localhost|127\.|\[::1\])/.test(url.hostname) || url.username || url.password) {
      throw new Error(`${key} must be a public HTTPS backend URL for Vercel deployment; localhost is not reachable by visitors.`);
    }
    result[key] = value.replace(/\/+$/, '') + '/';
  }
  return result;
}

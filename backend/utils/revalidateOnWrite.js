const revalidateFrontend = require("./revalidateFrontend");

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Express middleware that invalidates the frontend cache for a content type
 * after a successful create/update/delete on the route it is mounted on.
 *
 * Used for "shared" content — testimonials, videos, FAQs, ratings, employees,
 * blog categories — which has no public detail URL of its own but is rendered
 * across many pages. The frontend purges these by cache tag rather than by
 * path (see frontend/src/lib/cacheTags.js), so the type alone is enough and no
 * slug is required.
 *
 * Mounting this once per router avoids editing every handler in these
 * controllers, and it fires strictly on a 2xx response — a validation failure
 * or a thrown error never triggers an invalidation.
 *
 * Content types that DO have a public URL (blog, case study, service, industry,
 * job, service-by-country/city) call revalidateFrontend() directly from their
 * controllers instead, because those need the slug and the previous slug.
 */
function revalidateOnWrite(type) {
  return function revalidateOnWriteMiddleware(req, res, next) {
    if (!MUTATING_METHODS.has(req.method)) return next();

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        revalidateFrontend({ type }).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  };
}

module.exports = revalidateOnWrite;

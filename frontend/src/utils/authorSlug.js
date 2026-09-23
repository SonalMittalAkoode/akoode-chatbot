/**
 * Author page URLs are derived from the employee name rather than a stored slug.
 * Keep in sync with toAuthorSlug in backend/controller/frontend/employeeCtrl.js.
 */
export const authorSlug = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default authorSlug;

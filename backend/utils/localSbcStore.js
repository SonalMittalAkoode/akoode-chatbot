const mongoose = require('mongoose');

const docs = new Map();

const enabled = () => process.env.ALLOW_DB_FAILURE === 'true' && mongoose.connection.readyState !== 1;
const clone = (value) => JSON.parse(JSON.stringify(value));
const makeId = () => new mongoose.Types.ObjectId().toString();

function create(doc) {
  const now = new Date().toISOString();
  const saved = { ...clone(doc), _id: makeId(), createdAt: now, updatedAt: now };
  docs.set(String(saved._id), saved);
  return clone(saved);
}

function update(id, doc) {
  const prev = docs.get(String(id));
  if (!prev) return null;
  const saved = { ...prev, ...clone(doc), _id: String(id), updatedAt: new Date().toISOString() };
  docs.set(String(id), saved);
  return clone(saved);
}

function remove(id) {
  return docs.delete(String(id));
}

function get(id) {
  const doc = docs.get(String(id));
  return doc ? clone(doc) : null;
}

function list({ q = '', limit = 20, page = 1, activeOnly = false } = {}) {
  const lowerQ = String(q || '').toLowerCase();
  const all = [...docs.values()]
    .filter((doc) => !activeOnly || doc.status === true)
    .filter((doc) => !lowerQ || String(doc.title || '').toLowerCase().includes(lowerQ))
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  const start = (Number(page) - 1) * Number(limit);
  return { items: clone(all.slice(start, start + Number(limit))), totalCount: all.length };
}

function findBySlug(slug, { market = '', preview = false } = {}) {
  const lowerSlug = String(slug || '').toLowerCase();
  const expectedMarket = String(market || '').toLowerCase();
  const doc = [...docs.values()].find((item) => {
    if (String(item.slug || '').toLowerCase() !== lowerSlug) return false;
    if (!preview && item.status !== true) return false;
    if (expectedMarket) {
      const itemMarket = String(item.market || item.country || '').toLowerCase();
      if (itemMarket !== expectedMarket) return false;
    }
    return true;
  });
  return doc ? clone(doc) : null;
}

module.exports = { enabled, create, update, remove, get, list, findBySlug };

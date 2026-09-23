// code done by sonal: sitemap + link crawl with same-site boundaries and atomic index publication.
const cheerio = require('cheerio');
const crypto = require('crypto');
const { Chunk, State } = require('./models');
function normalize(value, base) {
  try {
    const url = new URL(value, base); const site = new URL(base);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.origin !== site.origin) return null;
    if (/\/(?:api|admin|thebusinesshub|akoodeadmin|login|preview)(?:\/|$)/i.test(url.pathname)) return null;
    if (/\.(?:png|jpe?g|gif|svg|webp|avif|pdf|zip|mp4|css|js|xml|woff2?|ico)$/i.test(url.pathname)) return null;
    if (url.search) return null;
    url.hash = ''; url.pathname = url.pathname.replace(/\/$/, '') || '/';
    return url.href;
  } catch { return null; }
}
function extract(html, url) {
  const $ = cheerio.load(html);
  if (/noindex/i.test($('meta[name="robots"]').attr('content') || '')) return null;
  const links = $('a[href]').map((_, node) => $(node).attr('href')).get();
  $('script,style,noscript,nav,footer,header,form,button,svg,[aria-hidden="true"]').remove();
  const main = $('main').length ? $('main') : $('body');
  const text = main.text().replace(/\s+/g, ' ').trim();
  const title = $('title').text().trim();
  const chunks = [];
  for (let i = 0; i < text.length; i += 1300) {
    const part = text.slice(i, i + 1600);
    if (part.length >= 60) chunks.push({ url, title, text: part });
  }
  return { chunks, links };
}
function robotRules(text) {
  const groups = []; let current = null;
  for (const line of text.split(/\r?\n/)) {
    const match = line.replace(/#.*/, '').trim().match(/^([^:]+):\s*(.*)$/); if (!match) continue;
    const key = match[1].toLowerCase(); const value = match[2].trim();
    if (key === 'user-agent') {
      if (!current || current.rules.length) { current = { agents: [], rules: [] }; groups.push(current); }
      current.agents.push(value.toLowerCase());
    } else if (current && ['allow', 'disallow'].includes(key) && value) current.rules.push({ allow: key === 'allow', path: value });
  }
  const specific = groups.filter(g => g.agents.includes('akoodeknowledgebot'));
  const rules = (specific.length ? specific : groups.filter(g => g.agents.includes('*'))).flatMap(g => g.rules);
  return path => {
    const matches = rules.filter(r => new RegExp('^' + r.path.split('*').map(p => p.replace(/[.+?^{}()|[\]\\]/g, '\\$&')).join('.*')).test(path));
    matches.sort((a, b) => b.path.length - a.path.length || Number(b.allow) - Number(a.allow));
    return !matches.length || matches[0].allow;
  };
}
async function refreshKnowledge() {
  const base = new URL(process.env.CHATBOT_SITE_URL || 'https://www.akoode.com').origin;
  if (!['https://www.akoode.com', 'https://akoode.com'].includes(base)) throw new Error('CHATBOT_SITE_URL must be the public Akoode website origin.');
  await State.updateOne({ _id: 'knowledge' }, { $setOnInsert: { pages: 0 } }, { upsert: true });
  const lock = await State.findOneAndUpdate({ _id: 'knowledge', $or: [{ lockedUntil: { $exists: false } }, { lockedUntil: { $lt: new Date() } }] }, { $set: { lockedUntil: new Date(Date.now() + 120000) } });
  if (!lock) throw new Error('Another knowledge refresh is running.');
  const generation = crypto.randomUUID(); let published = false;
  async function download(url, optional = false, redirects = 0) {
    if (new URL(url).origin !== base || redirects > 5) throw new Error('Unsafe crawl redirect.');
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'AkoodeKnowledgeBot/1.0' } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const target = new URL(response.headers.get('location'), url);
      if (target.origin !== base || /\/(api|admin|thebusinesshub|akoodeadmin|login|preview)(\/|$)/i.test(target.pathname) || target.search) throw new Error('Unsafe crawl redirect.');
      return download(target.href, optional, redirects + 1);
    }
    if (optional && response.status === 404) return '';
    if (!response.ok) throw new Error(`Crawl failed (${response.status}): ${url}`);
    const reader = response.body.getReader(); const parts = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length;
      if (size > 5 * 1024 * 1024) { await reader.cancel(); throw new Error(`Page exceeds 5MB: ${url}`); }
      parts.push(Buffer.from(value));
    }
    return Buffer.concat(parts).toString('utf8');
  }
  try {
    await Chunk.init();
    const robots = await download(`${base}/robots.txt`, true); const allowed = robotRules(robots);
    const queue = new Set([`${base}/`]); const maps = new Set([`${base}/sitemap.xml`]);
    for (const match of robots.matchAll(/^sitemap:\s*(.+)$/gim)) if (new URL(match[1].trim(), base).origin === base) maps.add(match[1].trim());
    for (const map of maps) {
      if (maps.size > 500) throw new Error('Sitemap limit reached; review website sitemap structure.');
      await State.updateOne({ _id: 'knowledge' }, { $set: { lockedUntil: new Date(Date.now() + 120000) } });
      const xml = await download(map, true); const $ = cheerio.load(xml, { xmlMode: true });
      $('loc').each((_, node) => {
        const location = $(node).text().trim();
        if ($(node).parent().is('sitemap')) { if (new URL(location, base).origin === base) maps.add(location); }
        else { const clean = normalize(location, base); if (clean) queue.add(clean); }
      });
    }
    let pages = 0; let chunks = 0; let skipped = 0;
    const maximum = Number(process.env.CHATBOT_CRAWL_MAX_PAGES) || 10000;
    for (const url of queue) {
      if (queue.size > maximum) throw new Error(`Crawl exceeds ${maximum} pages; increase CHATBOT_CRAWL_MAX_PAGES. Existing index kept.`);
      if (!allowed(new URL(url).pathname)) { skipped++; continue; }
      await State.updateOne({ _id: 'knowledge' }, { $set: { lockedUntil: new Date(Date.now() + 120000) } });
      const result = extract(await download(url), url);
      if (!result) { skipped++; continue; }
      for (const link of result.links) { const clean = normalize(link, base); if (clean) queue.add(clean); }
      if (result.chunks.length) { await Chunk.insertMany(result.chunks.map(c => ({ ...c, generation }))); chunks += result.chunks.length; }
      pages++;
      if (pages % 25 === 0) console.log(`Chatbot crawl: ${pages} pages, ${chunks} chunks, ${queue.size} discovered URLs.`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    if (!chunks) throw new Error('No public website content found; existing index kept.');
    await State.updateOne({ _id: 'knowledge' }, { $set: { generation, pages, chunks, refreshedAt: new Date() } });
    published = true;
    // Keep the immediately previous generation for in-flight retrievals; remove older generations.
    await Chunk.deleteMany({ generation: { $nin: [generation, lock.generation].filter(Boolean) } });
    return { pages, chunks, skipped, generation };
  } finally {
    if (!published) await Chunk.deleteMany({ generation });
    await State.updateOne({ _id: 'knowledge' }, { $unset: { lockedUntil: 1 } });
  }
}
module.exports = { normalize, extract, robotRules, refreshKnowledge };

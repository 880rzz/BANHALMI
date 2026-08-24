import fs from 'node:fs';

const BASE = 'https://blog.banhalmi.art';
const ROOTS = [
  { lang: 'hu', url: `${BASE}/` },
  { lang: 'en', url: `${BASE}/en` },
  { lang: 'de', url: `${BASE}/de` },
];
const SITEMAPS = [
  `${BASE}/blog-posts-sitemap.xml`,
  `${BASE}/blog-categories-sitemap.xml`,
];
const failures = [];
const warnings = [];
const pages = [];
const internalLinks = new Set();
const timeoutMs = 25000;

function decodeXml(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m => decodeXml(m[1].trim()));
}
function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return m?.[1] || '';
}
function canonical(html) {
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const rel = attr(tag, 'rel').toLowerCase().split(/\s+/);
    if (rel.includes('canonical')) return attr(tag, 'href');
  }
  return '';
}
function hreflangs(html) {
  const out = [];
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const rel = attr(tag, 'rel').toLowerCase().split(/\s+/);
    const lang = attr(tag, 'hreflang');
    const href = attr(tag, 'href');
    if (rel.includes('alternate') && lang && href) out.push({ lang: lang.toLowerCase(), href });
  }
  return out;
}
function htmlLang(html) {
  return html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1]?.toLowerCase() || '';
}
function normalizeBlogUrl(raw, base) {
  try {
    const u = new URL(decodeXml(raw), base);
    if (u.hostname !== 'blog.banhalmi.art') return null;
    if (!['http:', 'https:'].includes(u.protocol)) return null;
    u.hash = '';
    for (const key of [...u.searchParams.keys()]) {
      if (key.startsWith('utm_') || ['fbclid','gclid'].includes(key)) u.searchParams.delete(key);
    }
    if (/\.(?:avif|css|gif|ico|jpe?g|js|json|mp4|pdf|png|svg|webm|webp|xml)$/i.test(u.pathname)) return null;
    return u.href;
  } catch { return null; }
}
function extractInternalLinks(html, base) {
  const links = [];
  for (const m of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    const href = m[1];
    if (/^(?:mailto:|tel:|javascript:|#)/i.test(href)) continue;
    const normalized = normalizeBlogUrl(href, base);
    if (normalized) links.push(normalized);
  }
  return links;
}
function ecosystemCounts(html) {
  return {
    commercial: (html.match(/https:\/\/(?:www\.)?norbertbanhalmi\.com\//gi) || []).length,
    archive: (html.match(/https:\/\/(?:www\.)?banhalmi\.art\//gi) || []).length,
  };
}
async function get(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; BANHALMI-LiveBlogAudit/1.0)',
        'cache-control': 'no-cache',
      },
    });
    const body = await res.text();
    return { status: res.status, finalUrl: res.url, body, contentType: res.headers.get('content-type') || '' };
  } catch (error) {
    return { status: 0, finalUrl: url, body: '', error: error.name === 'AbortError' ? 'timeout' : error.message, contentType: '' };
  } finally {
    clearTimeout(timer);
  }
}
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length || 1) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}
function expectedLangForUrl(url) {
  const p = new URL(url).pathname;
  if (p === '/en' || p.startsWith('/en/')) return 'en';
  if (p === '/de' || p.startsWith('/de/')) return 'de';
  return 'hu';
}
function sameCanonical(a, b) {
  try {
    const A = new URL(a); const B = new URL(b);
    const clean = u => `${u.origin}${u.pathname.replace(/\/$/, '') || '/'}${u.search}`;
    return clean(A) === clean(B);
  } catch { return false; }
}

console.log('=== BANHALMI live blog ecosystem audit ===');
console.log(`Started: ${new Date().toISOString()}`);

for (const root of ROOTS) {
  const r = await get(root.url);
  console.log(`ROOT ${root.lang}: ${root.url} -> ${r.status} ${r.finalUrl}`);
  if (r.status < 200 || r.status >= 400) failures.push(`Root ${root.lang} unreachable: ${root.url} (${r.status || r.error})`);
  if (r.body) {
    const lang = htmlLang(r.body);
    console.log(`ROOT_LANG ${root.lang}: html[lang]=${lang || 'missing'}`);
    if (!lang.startsWith(root.lang)) warnings.push(`Root ${root.lang} has html lang=${lang || 'missing'}`);
  }
}

const sitemapUrls = [];
for (const sitemap of SITEMAPS) {
  const r = await get(sitemap);
  console.log(`SITEMAP ${sitemap}: ${r.status}, ${r.body.length} bytes`);
  if (r.status < 200 || r.status >= 400) {
    failures.push(`Sitemap unreachable: ${sitemap} (${r.status || r.error})`);
    continue;
  }
  const locs = extractLocs(r.body);
  console.log(`SITEMAP_LOCS ${sitemap}: ${locs.length}`);
  if (!locs.length) failures.push(`Sitemap has no <loc>: ${sitemap}`);
  sitemapUrls.push(...locs.map(url => ({ url, source: sitemap })));
}

const uniqueSitemap = [...new Map(sitemapUrls.map(x => [x.url, x])).values()];
console.log(`UNIQUE_SITEMAP_URLS=${uniqueSitemap.length}`);

await mapLimit(uniqueSitemap, 10, async item => {
  const r = await get(item.url);
  const lang = expectedLangForUrl(item.url);
  const row = { url: item.url, source: item.source, status: r.status, finalUrl: r.finalUrl, lang };
  if (r.status < 200 || r.status >= 400) {
    failures.push(`Sitemap URL failed: ${item.url} (${r.status || r.error})`);
    pages.push(row);
    return;
  }
  const can = canonical(r.body);
  const alts = hreflangs(r.body);
  const hlang = htmlLang(r.body);
  const eco = ecosystemCounts(r.body);
  row.canonical = can;
  row.hreflangs = alts;
  row.htmlLang = hlang;
  row.ecosystem = eco;
  row.internalLinkCount = extractInternalLinks(r.body, r.finalUrl).length;
  pages.push(row);

  if (!can) failures.push(`Missing canonical: ${item.url}`);
  else if (!sameCanonical(can, r.finalUrl) && !sameCanonical(can, item.url)) failures.push(`Canonical mismatch: ${item.url} -> ${can}`);
  if (hlang && !hlang.startsWith(lang)) warnings.push(`Language mismatch: ${item.url} expected ${lang}, html lang=${hlang}`);
  const langs = alts.map(x => x.lang);
  if (new Set(langs).size !== langs.length) failures.push(`Duplicate hreflang on ${item.url}: ${langs.join(',')}`);
  if (!alts.length) warnings.push(`No hreflang links on ${item.url}`);
  for (const link of extractInternalLinks(r.body, r.finalUrl)) internalLinks.add(link);
});

const uniqueInternal = [...internalLinks];
console.log(`UNIQUE_INTERNAL_LINKS=${uniqueInternal.length}`);
const internalResults = await mapLimit(uniqueInternal, 12, async url => {
  const r = await get(url);
  if (r.status < 200 || r.status >= 400) failures.push(`Broken internal blog link: ${url} (${r.status || r.error})`);
  return { url, status: r.status, finalUrl: r.finalUrl, error: r.error || null };
});

const byLang = { hu: 0, en: 0, de: 0 };
const withCommercial = { hu: 0, en: 0, de: 0 };
const withArchive = { hu: 0, en: 0, de: 0 };
const hreflangCoverage = { hu: 0, en: 0, de: 0 };
for (const p of pages) {
  byLang[p.lang] = (byLang[p.lang] || 0) + 1;
  if (p.ecosystem?.commercial) withCommercial[p.lang] = (withCommercial[p.lang] || 0) + 1;
  if (p.ecosystem?.archive) withArchive[p.lang] = (withArchive[p.lang] || 0) + 1;
  if (p.hreflangs?.length) hreflangCoverage[p.lang] = (hreflangCoverage[p.lang] || 0) + 1;
}

const report = {
  generatedAt: new Date().toISOString(),
  roots: ROOTS,
  sitemapCount: uniqueSitemap.length,
  sitemapLanguageCounts: byLang,
  internalLinkCount: uniqueInternal.length,
  ecosystemCoverage: { commercial: withCommercial, archive: withArchive },
  hreflangCoverage,
  failures,
  warnings,
  pages,
  internalResults,
};
fs.writeFileSync('live-blog-audit-report.json', JSON.stringify(report, null, 2) + '\n');

console.log('\n=== SUMMARY ===');
console.log(`Sitemap pages: ${uniqueSitemap.length}`);
console.log(`By language: HU=${byLang.hu || 0} EN=${byLang.en || 0} DE=${byLang.de || 0}`);
console.log(`Internal URLs checked: ${uniqueInternal.length}`);
console.log(`Pages linking to norbertbanhalmi.com: HU=${withCommercial.hu || 0} EN=${withCommercial.en || 0} DE=${withCommercial.de || 0}`);
console.log(`Pages linking to banhalmi.art: HU=${withArchive.hu || 0} EN=${withArchive.en || 0} DE=${withArchive.de || 0}`);
console.log(`Pages with hreflang: HU=${hreflangCoverage.hu || 0} EN=${hreflangCoverage.en || 0} DE=${hreflangCoverage.de || 0}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Failures: ${failures.length}`);
for (const w of warnings.slice(0, 40)) console.warn(`WARN ${w}`);
if (warnings.length > 40) console.warn(`WARN ... ${warnings.length - 40} more warnings in artifact`);
for (const f of failures) console.error(`FAIL ${f}`);
if (failures.length) process.exitCode = 1;

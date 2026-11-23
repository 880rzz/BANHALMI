/**
 * Read-only production reverse audit. It never submits forms, changes consent,
 * touches Wix APIs or writes to production. Public GET plus screenshot only.
 *
 * Run: node tools/audit-three-site-live-matrix.mjs
 * Evidence: artifacts/three-site-live-matrix/* (CI artifact; not published).
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium, devices } from 'playwright';

const dir = 'artifacts/three-site-live-matrix';
fs.mkdirSync(dir, { recursive: true });
const failures = [];
const warnings = [];
const rows = [];
const audits = [
  { key: 'professional', base: 'https://www.banhalmiphotography.com/', expected: 58, html: 57 },
  { key: 'art', base: 'https://www.banhalmi.art/', expected: 93, html: 93 }
];
const hrefs = (html) => Array.from(html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi), m => m[1]);
const tagAttrs = (tag) => {
  const attrs = {};
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)) attrs[m[1].toLowerCase()] = m[3];
  return attrs;
};
const headLinks = (html) => Array.from((html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '').matchAll(/<link\b[^>]*>/gi), m => tagAttrs(m[0]));
const cleanUrl = (u) => String(u).split('#')[0];
const expectedLocale = (url) => url.includes('/de-at/') ? 'de' : url.includes('/hu/') ? 'hu' : 'en';
const blogHome = (locale) => locale === 'de' ? 'https://blog.banhalmi.art/de/' : locale === 'hu' ? 'https://blog.banhalmi.art/' : 'https://blog.banhalmi.art/en/';
const proBase = 'https://www.banhalmiphotography.com/';
const artBase = 'https://www.banhalmi.art/';

async function getText(url, timeout = 24000) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'BANHALMI-ReadOnly-Release-Audit/1.0', Accept: 'text/html, application/xml, text/plain' }
      });
      // A short-lived CDN/upstream 502/503/504 is retryable, but a persistent
      // server fault must still fail the full production audit.
      if ([502, 503, 504].includes(response.status) && attempt < 2) {
        await response.arrayBuffer().catch(() => {});
        await new Promise(resolve => setTimeout(resolve, 750 * (attempt + 1)));
        continue;
      }
      return { status: response.status, url: response.url, body: await response.text() };
    } catch (e) {
      last = String(e?.message || e);
    } finally { clearTimeout(timer); }
  }
  return { status: 0, url, body: '', error: last };
}

const deployment = {};
for (const site of audits) {
  const marker = await getText(site.base + 'deployment-sha.txt');
  const sha = marker.status === 200 ? marker.body.trim() : null;
  deployment[site.key] = { sha, status: marker.status };
  if (!sha || !/^[a-f0-9]{40}$/i.test(sha)) failures.push(site.key + ' deployment SHA marker unavailable or malformed');
  const expect = site.key === 'professional' ? process.env.EXPECT_PRO_SHA : process.env.EXPECT_ART_SHA;
  if (expect && sha && sha !== expect) failures.push(site.key + ' custom-domain SHA mismatch: expected=' + expect + ' live=' + sha);
  const sitemap = await getText(site.base + 'sitemap.xml');
  if (sitemap.status !== 200) { failures.push(site.key + ' sitemap HTTP ' + sitemap.status); continue; }
  const urls = Array.from(sitemap.body.matchAll(/<loc>\s*(https:\/\/[^<]+)\s*<\/loc>/g), m => m[1].trim())
    .filter(u => u.startsWith(site.base) && !/\.(?:png|jpe?g|webp|avif|svg|gif)$/i.test(u));
  const list = [...new Set(urls)];
  if (list.length !== site.expected) failures.push(site.key + ' sitemap expected ' + site.expected + ' URLs, found ' + list.length);
  const htmlUrls = list.filter(u => !/\.pdf(?:$|\?)/i.test(u));
  if (htmlUrls.length !== site.html) failures.push(site.key + ' expected ' + site.html + ' HTML URLs, found ' + htmlUrls.length);
  const pending = [...htmlUrls];
  async function worker() {
    while (pending.length) {
      const u = pending.shift();
      const page = await getText(u);
      const rec = { site: site.key, url: u, status: page.status, finalUrl: page.url, canonical: null, hreflangCount: 0, jsonldCount: 0, malformedJsonld: 0, blogLinks: 0, partnerLinks: 0, issues: [] };
      if (page.status !== 200) rec.issues.push('HTTP ' + page.status + (page.error ? ' ' + page.error : ''));
      if (cleanUrl(page.url).replace(/\/$/, '') !== cleanUrl(u).replace(/\/$/, '')) rec.issues.push('Unexpected final URL ' + page.url);
      if (page.status === 200) {
        const head = page.body.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
        const links = headLinks(page.body);
        rec.canonical = links.find(x => String(x.rel || '').toLowerCase().split(/\s+/).includes('canonical'))?.href || null;
        rec.hreflangCount = links.filter(x => x.hreflang && x.href && String(x.rel || '').includes('alternate')).length;
        if (rec.canonical !== u) rec.issues.push('Canonical mismatch: ' + rec.canonical);
        if (!/<title\b[^>]*>[^<]+<\/title>/i.test(head)) rec.issues.push('Missing title');
        if (!/<h1\b/i.test(page.body)) rec.issues.push('Missing H1');
        if (rec.hreflangCount < 3) rec.issues.push('Missing trilingual hreflang');
        const pageLocale = page.body.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)/i)?.[1] || '';
        if (!pageLocale.toLowerCase().startsWith(expectedLocale(u))) rec.issues.push('Wrong HTML lang: ' + pageLocale);
        if (/www\.norbertbanhalmi\.com/i.test(page.body)) rec.issues.push('Legacy commercial domain in current HTML');
        if (/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*\bnoindex/i.test(head)) rec.issues.push('Noindex on sitemap URL');
        for (const script of page.body.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
          rec.jsonldCount++;
          try { JSON.parse(script[1]); } catch { rec.malformedJsonld++; }
        }
        if (rec.malformedJsonld) rec.issues.push('Malformed JSON-LD: ' + rec.malformedJsonld);
        const linksToOther = hrefs(page.body);
        rec.blogLinks = linksToOther.filter(x => x.startsWith('https://blog.banhalmi.art/')).length;
        rec.partnerLinks = linksToOther.filter(x => x.startsWith(site.key === 'art' ? proBase : artBase)).length;
        if (!rec.blogLinks) rec.issues.push('No link to editorial website');
        if (!rec.partnerLinks) rec.issues.push('No link to partner website');
        if (site.key === 'art' && !linksToOther.includes(blogHome(expectedLocale(u))))
          rec.issues.push('ART missing same-language editorial footer link');
      }
      rows.push(rec);
      if (rec.issues.length) failures.push(site.key + ' ' + u + ': ' + rec.issues.join('; '));
    }
  }
  await Promise.all(Array.from({ length: 5 }, () => worker()));
}

const wixSamples = [
  {
    "lang": "hu",
    "type": "home",
    "url": "https://blog.banhalmi.art/"
  },
  {
    "lang": "en",
    "type": "home",
    "url": "https://blog.banhalmi.art/en/"
  },
  {
    "lang": "de",
    "type": "home",
    "url": "https://blog.banhalmi.art/de/"
  },
  {
    "lang": "hu",
    "type": "category",
    "url": "https://blog.banhalmi.art/blog/categories/vipach-fotografiai-kozosseg"
  },
  {
    "lang": "hu",
    "type": "category",
    "url": "https://blog.banhalmi.art/blog/categories/noi-tortenetek"
  },
  {
    "lang": "hu",
    "type": "category",
    "url": "https://blog.banhalmi.art/blog/categories/lifestyle-es-portfoliofotozas"
  },
  {
    "lang": "hu",
    "type": "category",
    "url": "https://blog.banhalmi.art/blog/categories/no-filter-oszinte-tortenetek"
  },
  {
    "lang": "hu",
    "type": "category",
    "url": "https://blog.banhalmi.art/blog/categories/aktfotozas-muveszi-szemmel"
  },
  {
    "lang": "hu",
    "type": "category",
    "url": "https://blog.banhalmi.art/blog/categories/portre-es-headshotfotozas"
  },
  {
    "lang": "hu",
    "type": "category",
    "url": "https://blog.banhalmi.art/blog/categories/fototortenelem"
  },
  {
    "lang": "en",
    "type": "category",
    "url": "https://blog.banhalmi.art/en/blog/categories/vipach-photography-community"
  },
  {
    "lang": "en",
    "type": "category",
    "url": "https://blog.banhalmi.art/en/blog/categories/womens-stories"
  },
  {
    "lang": "en",
    "type": "category",
    "url": "https://blog.banhalmi.art/en/blog/categories/portrait-portfolio-photography"
  },
  {
    "lang": "en",
    "type": "category",
    "url": "https://blog.banhalmi.art/en/blog/categories/no-filter-honest-stories"
  },
  {
    "lang": "en",
    "type": "category",
    "url": "https://blog.banhalmi.art/en/blog/categories/fine-art-nude-photography"
  },
  {
    "lang": "en",
    "type": "category",
    "url": "https://blog.banhalmi.art/en/blog/categories/portrait-headshot-photography"
  },
  {
    "lang": "en",
    "type": "category",
    "url": "https://blog.banhalmi.art/en/blog/categories/photography-history"
  },
  {
    "lang": "de",
    "type": "category",
    "url": "https://blog.banhalmi.art/de/blog/categories/vipach-fotografie-community"
  },
  {
    "lang": "de",
    "type": "category",
    "url": "https://blog.banhalmi.art/de/blog/categories/geschichten-von-frauen"
  },
  {
    "lang": "de",
    "type": "category",
    "url": "https://blog.banhalmi.art/de/blog/categories/portraet-portfoliofotografie"
  },
  {
    "lang": "de",
    "type": "category",
    "url": "https://blog.banhalmi.art/de/blog/categories/no-filter-ehrliche-geschichten"
  },
  {
    "lang": "de",
    "type": "category",
    "url": "https://blog.banhalmi.art/de/blog/categories/kuenstlerische-aktfotografie"
  },
  {
    "lang": "de",
    "type": "category",
    "url": "https://blog.banhalmi.art/de/blog/categories/portraet-headshotfotografie"
  },
  {
    "lang": "de",
    "type": "category",
    "url": "https://blog.banhalmi.art/de/blog/categories/fotogeschichte"
  },
  {
    "lang": "hu",
    "type": "post",
    "url": "https://blog.banhalmi.art/post/júlia-dominik-modell-portfóliója"
  },
  {
    "lang": "en",
    "type": "post",
    "url": "https://blog.banhalmi.art/en/post/júlia-dominik-model-portfolio"
  },
  {
    "lang": "de",
    "type": "post",
    "url": "https://blog.banhalmi.art/de/post/júlia-dominik-modelportfolio"
  }
];
const fullWixCategories = ['1', 'true'].includes(String(process.env.WIX_FULL_CATEGORY_QA || '').toLowerCase());
const wixAuditSamples = fullWixCategories ? wixSamples : wixSamples.filter(entry =>
  entry.type !== 'category' || entry.url.includes('/lifestyle-es-portfoliofotozas') ||
  entry.url.includes('/portrait-portfolio-photography') ||
  entry.url.includes('/portraet-portfoliofotografie')
);
const wix = [];
const browser = await chromium.launch({ headless: true });
for (const entry of wixAuditSamples) {
  for (const width of [375, 390, 768, 1024, 1280, 1440, 1920]) {
    const ctx = await browser.newContext(width < 500
      ? { ...devices['iPhone 13'], viewport: { width, height: 844 } }
      : width <= 1024
        ? { ...devices['iPad (gen 7)'], viewport: { width, height: 1024 } }
        : { viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const item = { ...entry, width, status: null, finalUrl: null, overflow: null, visibleH1: null, imageCount: null, potentialTopHero: null, screenshot: null, issue: null };
    try {
      const response = await page.goto(entry.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      item.status = response?.status() ?? 0;
      item.finalUrl = page.url();
      await page.waitForTimeout(1100);
      const facts = await page.evaluate(() => {
        const h1 = [...document.querySelectorAll('h1')].some(el => {
          const r = el.getBoundingClientRect(), style = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
        });
        const images = [...document.querySelectorAll('img')];
        const visibleImage = images.filter(img => {
          const r = img.getBoundingClientRect();
          return r.width > 80 && r.height > 80 && r.top > 0 && r.top < 1000;
        });
        return {
          overflow: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0) - innerWidth,
          actualViewport: innerWidth,
          pageScrollWidth: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0),
          overshootingElements: [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right > innerWidth + 8; }).slice(0, 6).map(el => ({tag: el.tagName.toLowerCase(), className: typeof el.className === 'string' ? el.className.slice(0, 50) : '', width: Math.round(el.getBoundingClientRect().width), right: Math.round(el.getBoundingClientRect().right)})),
          visibleH1: h1,
          imageCount: images.length,
          potentialTopHero: visibleImage.some(img => {
            const r = img.getBoundingClientRect();
            return r.width > innerWidth * 0.8 && r.height > Math.min(450, innerHeight * 0.55) && r.top < 250;
          })
        };
      });
      Object.assign(item, facts);
      const slug = new URL(entry.url).pathname.split('/').filter(Boolean).at(-1) || 'home';
      const shot = (entry.lang + '-' + entry.type + '-' + slug.normalize('NFKD').replace(/[^a-zA-Z0-9-]/g, '-').slice(0,70) + '-' + width + '.png');
      item.screenshot = shot;
      await page.screenshot({ path: path.join(dir, shot), fullPage: false });
      if (item.status !== 200 || item.overflow > 8)
        item.issue = 'HTTP ' + item.status + '; horizontal overflow=' + item.overflow + 'px';
      if (!item.visibleH1) warnings.push('Wix: no visible H1 at ' + entry.url + ' (' + width + 'px)');
      if (item.potentialTopHero) warnings.push('Wix: review possible oversized lead image at ' + entry.url + ' (' + width + 'px)');
    } catch (e) {
      item.issue = String(e?.message || e).slice(0, 260);
    } finally {
      if (item.issue) failures.push('Wix ' + entry.url + ' (' + width + 'px): ' + item.issue);
      wix.push(item);
      await ctx.close();
    }
  }
}
await browser.close();

const fixture = JSON.parse(fs.readFileSync('tools/fixtures/wix-20261123-live-urls.json', 'utf8'));
if (fixture.posts.length !== 555) failures.push('Wix fixture must contain exactly 555 published posts, got ' + fixture.posts.length);
const wixHttp = [];
const targetChecks = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function wixHttpGet(url) {
  // Sequentially paced lookups prevent load bursts against public Wix production.
  let r;
  for (let attempt = 0; attempt < 5; attempt++) {
    r = await getText(url, 28000);
    if (r.status !== 429) return r;
    await sleep(Math.min(12000, 2000 * (attempt + 1)));
  }
  return r;
}
for (const u of [...new Set(fixture.targets.map(s => s.split('#')[0]))]) {
  const result = await wixHttpGet(u);
  const record = { url: u, status: result.status, finalUrl: result.url };
  targetChecks.push(record);
  if (result.status !== 200) {
    if (result.status === 429) warnings.push('rate limited cross-site link target ' + u);
    else failures.push('Broken live cross-site blog target ' + u + ' HTTP ' + result.status);
  }
  await sleep(120);
}

const pendingPosts = [...fixture.posts];
async function postWorker() {
  while (pendingPosts.length) {
    const entry = pendingPosts.shift();
    const result = await wixHttpGet(entry.url);
    const html = result.body || '';
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
    const links = headLinks(html);
    const canonical = links.find(x => String(x.rel || '').toLowerCase().split(/\s+/).includes('canonical'))?.href || null;
    const rec = {
      url: entry.url, lang: entry.lang, httpStatus: result.status,
      finalUrl: result.url, canonical,
      title: /<title\b[^>]*>[^<]+<\/title>/i.test(head),
      hasH1: /<h1\b/i.test(html),
      noindex: /<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*\bnoindex/i.test(head)
    };
    wixHttp.push(rec);
    if (result.status === 429) warnings.push('Wix public endpoint throttled: ' + entry.url + '; cannot verify HTTP');
    else if (result.status !== 200) failures.push('Wix published blog HTTP failure ' + entry.url + ': ' + result.status);
    if (result.status === 200 && (!rec.title || !rec.hasH1)) warnings.push('Wix publication missing title or H1 in static HTML: ' + entry.url);
    if (rec.noindex) failures.push('Wix published article unexpectedly noindex: ' + entry.url);
    await sleep(680);
  }
}
await Promise.all([postWorker(), postWorker()]);
if (wixHttp.length !== fixture.posts.length) failures.push('Wix HTTP inventory incomplete');
const watch = fixture.watch.map(entry => {
  const page = wixHttp.find(rec => rec.url === entry.url);
  return { ...entry, currentHttp: page?.httpStatus ?? null, currentCanonical: page?.canonical ?? null };
});

rows.sort((a, b) => a.url.localeCompare(b.url));
const result = {
  generatedAt: new Date().toISOString(),
  scope: 'All 57 Professional and 93 ART sitemap HTML routes: production HTTP and semantic source/live checks. Wix: 3 homepages + 3 localized categories + 3 posts at 7 viewport widths (63 browser renders); optional WIX_FULL_CATEGORY_QA=1 covers all 21 localized categories; all 555 posts get separate paced live HTTP readback and 36 contextual ART/Professional targets are verified. NOT all 555 post visual renders.',
  deployment,
  wixMode: fullWixCategories ? 'full-21-categories' : 'rate-limit-safe-sample',
  routeCounts: { professional: rows.filter(r => r.site === 'professional').length, art: rows.filter(r => r.site === 'art').length },
  failures, warnings, rows, wix, wixHttp, targetChecks, watch
};
fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify(result, null, 2) + '\n');
console.log('THREE-SITE-LIVE-MATRIX ' + JSON.stringify({ deployment, routeCounts: result.routeCounts, wixRendered: wix.length, wixHttpChecked: wixHttp.length, targetChecks: targetChecks.length, warningsTracked: watch.length, failures: failures.length, warnings: warnings.length }));
for (const v of failures.slice(0, 30)) console.error('FAIL ' + v);
for (const v of warnings.slice(0, 30)) console.warn('WARN ' + v);
if (failures.length) process.exitCode = 1;

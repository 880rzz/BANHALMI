/**
 * Reproduce occasional Wix SSR title/H1 omissions on three indexed-target
 * public Blog posts; distinguish a transient HTTP response from a persistent
 * browser-rendered defect. Strictly read-only; never submits consent.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium, devices } from 'playwright';

const pages = [
  { lang: 'en', url: 'https://blog.banhalmi.art/en/post/not-yet' },
  { lang: 'de', url: 'https://blog.banhalmi.art/de/post/ohne-filter-die-geschichte-meines-körpers-kamilla' },
  { lang: 'de', url: 'https://blog.banhalmi.art/de/post/danke-mir-geht-es-gut-grüße-eine-cyborg-frau' }
];
const output = 'artifacts/wix-ssr-post-reproduction';
fs.mkdirSync(output, { recursive: true });
const failures = [], warnings = [], records = [];
const checkHtml = html => {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  const canonical = [...head.matchAll(/<link\b[^>]*>/gi)].map(x=>x[0]).find(s=>/rel=["']canonical["']/i.test(s)) || '';
  return { title: /<title\b[^>]*>[^<]+<\/title>/i.test(head), h1: /<h1\b/i.test(html),
    canonical: canonical.match(/href=["']([^"']+)["']/i)?.[1] || null, length: html.length };
};
const browser = await chromium.launch({ headless: true });
try {
  for (const item of pages) {
    const rec = { ...item, staticAttempts: [], browser: [] };
    for (let k = 0; k < 3; k++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 35000);
        let response;
        try { response = await fetch(item.url, { signal: controller.signal, headers: { 'User-Agent': 'BANHALMI-ReadOnly-Release-Audit/1.0', Accept: 'text/html' }, redirect: 'follow' }); }
        finally { clearTimeout(timer); }
        const html = await response.text();
        rec.staticAttempts.push({ status: response.status, ...checkHtml(html) });
      } catch(e) { rec.staticAttempts.push({ error: e?.message || String(e) }); }
      await new Promise(resolve=>setTimeout(resolve,900));
    }
    for (const width of [390, 1440]) {
      const context = await browser.newContext(width < 500
        ? { ...devices['iPhone 13'], viewport: { width, height: 844 } }
        : { viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const recBrowser = { width, status: null, title: null, h1: false, canonical: null };
      try {
        const response = await page.goto(item.url, {waitUntil:'domcontentloaded',timeout:45000});
        recBrowser.status = response?.status() ?? null;
        await page.waitForTimeout(2700);
        const details = await page.evaluate(() => {
          const canon = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null;
          const h = [...document.querySelectorAll('h1')].some(node => {
            const r = node.getBoundingClientRect(), s = getComputedStyle(node);
            return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
          });
          return { title: document.title, h1: h, canonical: canon };
        });
        Object.assign(recBrowser,details);
        await page.screenshot({path: path.join(output,item.lang+'-'+item.url.split('/').at(-1).normalize('NFKD').replace(/[^a-zA-Z0-9-]/g,'-')+'-'+width+'.png'),fullPage:false});
      } catch(e){recBrowser.error=String(e?.message||e).slice(0,160);}
      rec.browser.push(recBrowser);
      await context.close();
    }
    const anyStaticValid = rec.staticAttempts.some(x=>x.status===200&&x.title&&x.h1&&x.canonical===item.url);
    const browserValid = rec.browser.every(x=>x.status===200 && x.h1 && x.title && x.canonical===item.url);
    if (!anyStaticValid) warnings.push('No complete static HTML title/H1/canonical in 3 attempts: '+item.url);
    if (!browserValid) failures.push('Incomplete rendered DOM title/H1/canonical: '+item.url);
    rec.classification = browserValid && anyStaticValid ? 'REPRO_PASS'
      : browserValid ? 'RENDER_PASS_STATIC_SSR_INCONSISTENT' : 'RENDER_FAIL';
    records.push(rec);
  }
} finally { await browser.close(); }
fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({generatedAt:new Date().toISOString(),records,failures,warnings},null,2)+'\n');
console.log('WIX-3-POST-SSR '+JSON.stringify({records:records.map(x=>({url:x.url,classification:x.classification,staticAttempts:x.staticAttempts,browser:x.browser})),failures,warnings}));
if (failures.length) process.exitCode=1;

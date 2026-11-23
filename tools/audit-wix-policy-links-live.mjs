/**
 * Browser-only consent banner policy-link proof.
 * Do not accept/decline cookies, inject scripts, or send data.
 * Detect the effective policy URL for each Wix translation, click it and
 * read the resulting page/popup URL. Never infer it from settings alone.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium, devices } from 'playwright';
const outDir = 'artifacts/wix-policy-link-evidence';
fs.mkdirSync(outDir, { recursive: true });
const targets = [
  { lang: 'hu', locale: 'hu-HU', url: 'https://blog.banhalmi.art/', expected: 'https://www.banhalmiphotography.com/hu/sutik/', label: /Adatvédelmi tájékoztató|Sütitájékoztató/i },
  { lang: 'en', locale: 'en-GB', url: 'https://blog.banhalmi.art/en/', expected: 'https://www.banhalmiphotography.com/cookie-policy/', label: /Privacy Policy|Cookie Policy/i },
  { lang: 'de', locale: 'de-AT', url: 'https://blog.banhalmi.art/de/', expected: 'https://www.banhalmiphotography.com/de-at/cookies/', label: /Datenschutzerklärung|Cookie-Richtlinie/i }
];
const browser = await chromium.launch({ headless: true });
const results = [], failures = [], warnings = [];
const canon = x => { try { const u = new URL(x); return u.origin + u.pathname; } catch { return ''; } };
try {
  for (const target of targets) {
    for (const width of [390, 1440]) {
      const context = await browser.newContext(width < 500
        ? { ...devices['iPhone 13'], locale: target.locale, viewport: { width, height: 844 } }
        : { locale: target.locale, viewport: { width, height: 900 } });
      const page = await context.newPage();
      const record = { lang: target.lang, width, homepageStatus: null, expected: target.expected,
        anchors: [], selectedHref: null, clickedDestination: null, classification: null };
      let popup = null;
      page.on('popup', p => { popup = p; });
      try {
        const response = await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        record.homepageStatus = response?.status() ?? null;
        await page.waitForTimeout(5000);
        const found = [];
        for (const frame of page.frames()) {
          const candidates = frame.getByRole('link', { name: target.label });
          const count = Math.min(15, await candidates.count().catch(() => 0));
          for (let i = 0; i < count; i++) {
            const link = candidates.nth(i);
            if (!(await link.isVisible().catch(() => false))) continue;
            const href = await link.getAttribute('href').catch(() => null);
            const text = await link.innerText().catch(() => '');
            const pos = await link.boundingBox().catch(() => null);
            const withinViewport = pos && pos.y >= -20 && pos.y < (width < 500 ? 844 : 900);
            found.push({ link, href, text: text.slice(0, 80), withinViewport });
            record.anchors.push({ href, text: text.slice(0, 80), withinViewport });
          }
        }
        record.diagnostics = [];
        for (const frame of page.frames()) {
          try {
            const d = await frame.evaluate(() => ({
              anchors: [...document.querySelectorAll('a,[role="link"]')]
                .filter(el => /privacy|cookie|datenschutz|adatvéd|süti|policy|richtlinie|banhalmiphotography/i.test((el.textContent || '') + ' ' + (el.getAttribute('href') || '')))
                .slice(0, 16).map(el => ({ text: (el.textContent || '').trim().slice(0, 64), href: el.getAttribute('href'), hook: el.getAttribute('data-hook') })),
              controls: [...document.querySelectorAll('button,[role="button"]')]
                .filter(el => /cookie|consent|privacy|süti|adatvéd|akzept|accept|decline|ablehn|elutas/i.test((el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '')))
                .slice(0, 12).map(el => ({ text: (el.textContent || '').trim().slice(0, 64), hook: el.getAttribute('data-hook') })),
              bannerHooks: [...document.querySelectorAll('[data-hook*="consent-banner"]')].slice(0, 8).map(el => el.getAttribute('data-hook'))
            }));
            record.diagnostics.push(d);
          } catch { record.diagnostics.push({ inaccessibleFrame: true }); }
        }
        const picked = found.find(c => c.withinViewport && c.href?.includes('banhalmiphotography.com'))
          || found.find(c => c.withinViewport) || found[0];
        if (!picked) {
          record.classification = 'BANNER_POLICY_LINK_NOT_OBSERVED';
          failures.push(target.lang + ' ' + width + 'px policy link not observed; rendered policy link proof absent');
        } else {
          record.selectedHref = picked.href;
          try {
            await picked.link.click({ timeout: 7000 });
            await page.waitForTimeout(1200);
            record.clickedDestination = popup ? popup.url() : page.url();
          } catch {
            warnings.push(target.lang + ' ' + width + 'px link click inconclusive');
          }
          const actual = canon(record.clickedDestination) || canon(picked.href);
          if (actual === canon(target.expected)) record.classification = 'CORRECT_LOCALIZED_COOKIE_POLICY';
          else if (actual === canon('https://www.banhalmiphotography.com/privacy-policy/'))
            record.classification = 'GLOBAL_EN_PRIVACY_FALLBACK';
          else record.classification = 'OTHER_POLICY_TARGET';
          if (record.classification !== 'CORRECT_LOCALIZED_COOKIE_POLICY')
            failures.push(target.lang + ' ' + width + 'px effective policy URL mismatch: ' + actual);
        }
        await page.screenshot({ path: path.join(outDir, 'policy-' + target.lang + '-' + width + '.png'), fullPage: false }).catch(() => {});
      } catch (e) {
        record.classification = 'NAVIGATION_OR_BROWSER_ERROR';
        record.error = String(e?.message || e).slice(0, 220);
        failures.push(target.lang + ' ' + width + 'px page error: ' + record.error);
      } finally {
        results.push(record);
        await context.close();
      }
    }
  }
} finally { await browser.close(); }
fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify({ timestamp: new Date().toISOString(), results, failures, warnings }, null, 2));
console.log('WIX-POLICY-DOM-DIAGNOSTICS ' + JSON.stringify(results.map(x => ({ lang: x.lang, width: x.width, diagnostics: x.diagnostics }))));
console.log('WIX-POLICY-LINK-EVIDENCE ' + JSON.stringify({ tested: results.length, failures: failures.length, warnings: warnings.length, classification: results.map(x => [x.lang, x.width, x.classification, x.selectedHref, x.clickedDestination]) }));
for (const f of failures) console.error('FAIL ' + f);
for (const w of warnings) console.warn('WARN ' + w);
if (failures.length) process.exitCode = 1;

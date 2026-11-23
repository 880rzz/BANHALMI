/**
 * Live, read-only Wix Blog analytics consent network gate.
 * No cookies are accepted by default, no PII is logged, no POST requests are sent by the test.
 * The site's own Wix consent controls are the only interactions.
 */
import { chromium } from 'playwright';

const targets = [
  { locale: 'hu-HU', lang: 'hu', url: 'https://blog.banhalmi.art/' },
  { locale: 'en-GB', lang: 'en', url: 'https://blog.banhalmi.art/en/' },
  { locale: 'de-AT', lang: 'de', url: 'https://blog.banhalmi.art/de/' }
];
const widths = [{ label: 'mobile', width: 390, height: 844 }, { label: 'desktop', width: 1440, height: 900 }];

function classifyRequest(raw) {
  let u;
  try { u = new URL(raw); } catch { return null; }
  const host = u.hostname.toLowerCase();
  const path = u.pathname.toLowerCase();
  if ((/(^|\.)google-analytics\.com$/.test(host) || /(^|\.)analytics\.google\.com$/.test(host))
      && /\/(?:g\/collect|collect|mp\/collect|j\/collect)/.test(path)) return 'ga4-hit';
  if (/(^|\.)googletagmanager\.com$/.test(host) && path.startsWith('/gtag/js')) return 'gtag-script';
  if (/(^|\.)clarity\.ms$/.test(host)) return 'microsoft-clarity';
  if (/(^|\.)(twipla|visitor-analytics|visitoranalytics)\./.test(host)
      || /twipla|visitor-analytics/.test(host)) return 'twipla';
  return null;
}

async function findDeclineButton(page) {
  const names = /^(?:Összes elutasítása|Elutasítás|Elutasítom|Reject all|Decline all|Reject|Decline|Alle ablehnen|Alles ablehnen|Ablehnen)$/i;
  for (const frame of page.frames()) {
    const query = frame.getByRole('button', { name: names });
    const size = Math.min(await query.count().catch(() => 0), 8);
    for (let i = 0; i < size; i++) {
      const element = query.nth(i);
      if (await element.isVisible().catch(() => false)) return element;
    }
  }
  return null;
}

function readMeasurementId(raw) {
  try {
    const u = new URL(raw);
    const id = u.searchParams.get('tid') || u.searchParams.get('id');
    return /^G-[A-Z0-9]{6,18}$/.test(id || '') ? id : null;
  } catch { return null; }
}

async function findAcceptButton(page) {
  const names = /^(?:Összes elfogadása|Elfogadás|Accept all|Accept|Alle akzeptieren|Alles akzeptieren|Akzeptieren)$/i;
  for (const frame of page.frames()) {
    const query = frame.getByRole('button', { name: names });
    const size = Math.min(await query.count().catch(() => 0), 8);
    for (let i = 0; i < size; i++) {
      const element = query.nth(i);
      if (await element.isVisible().catch(() => false)) return element;
    }
  }
  return null;
}

const browser = await chromium.launch({ headless: true });
const results = [];
const acceptResults = [];

try {
  for (const target of targets) {
    for (const viewport of widths) {
      const context = await browser.newContext({
        locale: target.locale,
        viewport: { width: viewport.width, height: viewport.height },
        ignoreHTTPSErrors: false
      });
      const page = await context.newPage();
      const observed = [];
      page.on('request', request => {
        const kind = classifyRequest(request.url());
        if (kind) observed.push(kind);
      });
      let status = null, error = null, declined = false, before = [], after = [];
      try {
        const response = await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        status = response?.status() ?? null;
        await page.waitForTimeout(5500);
        before = [...observed];
        const reject = await findDeclineButton(page);
        if (reject) {
          await reject.click({ timeout: 8000 });
          declined = true;
          await page.waitForTimeout(2500);
        }
        after = observed.slice(before.length);
      } catch (e) {
        error = e?.name === 'TimeoutError' ? 'navigation-or-control-timeout' : 'navigation-or-consent-control-error';
      }
      const check = {
        locale: target.lang,
        viewport: viewport.label,
        httpStatus: status,
        declineButtonClicked: declined,
        preConsentAnalyticsKinds: [...new Set(before)],
        postDeclineAnalyticsKinds: [...new Set(after)],
        error,
        result: error || !status || status >= 400 || !declined
          ? 'INCONCLUSIVE_OR_FAILED'
          : before.length || after.length ? 'CONSENT_LEAK' : 'PASS'
      };
      results.push(check);
      await context.close();
    }
  }
  for (const target of targets) {
    const context = await browser.newContext({
      locale: target.locale,
      viewport: { width: 1440, height: 900 },
      ignoreHTTPSErrors: false
    });
    const page = await context.newPage();
    const observed = [];
    page.on('request', request => {
      const kind = classifyRequest(request.url());
      if (kind) observed.push({ kind, measurementId: readMeasurementId(request.url()) });
    });
    let status = null, accepted = false, error = null, before = [], after = [];
    try {
      const response = await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      status = response?.status() ?? null;
      await page.waitForTimeout(4500);
      before = [...observed];
      const button = await findAcceptButton(page);
      if (button) {
        await button.click({ timeout: 8000 });
        accepted = true;
        await page.waitForTimeout(4500);
        if (!observed.slice(before.length).some(x => x.measurementId === 'G-EY91Q4QSVF')) {
          await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
          await page.waitForTimeout(3500);
        }
      }
      after = observed.slice(before.length);
    } catch (e) {
      error = e?.name === 'TimeoutError' ? 'navigation-or-control-timeout' : 'navigation-or-consent-control-error';
    }
    const ids = [...new Set(after.map(x => x.measurementId).filter(Boolean))];
    const unexpected = ids.filter(x => x !== 'G-EY91Q4QSVF');
    const check = {
      locale: target.lang,
      httpStatus: status,
      acceptButtonClicked: accepted,
      preConsentAnalyticsKinds: [...new Set(before.map(x => x.kind))],
      postAcceptAnalyticsKinds: [...new Set(after.map(x => x.kind))],
      postAcceptMeasurementIDs: ids,
      error,
      result: error || !status || status >= 400 || !accepted
        ? 'INCONCLUSIVE_OR_FAILED'
        : before.length || unexpected.length || after.some(x => x.kind === 'microsoft-clarity')
          ? 'CONSENT_LEAK_OR_WRONG_MEASUREMENT'
          : ids.includes('G-EY91Q4QSVF') ? 'PASS' : 'NO_NATIVE_GA4_EVIDENCE'
    };
    acceptResults.push(check);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ audit: 'Wix Blog consent-first network plus native GA4 acceptance', timestamp: new Date().toISOString(), declineChecks: results, acceptChecks: acceptResults }, null, 2));
if (results.length !== targets.length * widths.length || results.some(row => row.result !== 'PASS') || acceptResults.length !== targets.length || acceptResults.some(row => row.result !== 'PASS')) {
  console.error('Wix consent gate is not proven. Do not mark GDPR live compliance complete or delete the remediation journal.');
  process.exitCode = 1;
}

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


// Revisit consent from the visible Wix UI (no injected Wix APIs or fake consent state).
async function findRevisitButton(page) {
  const labels = /(?:Süti[ -]?beállítások|Sütik beállításai|Cookie settings|Cookie preferences|Manage cookies|Cookie-Einstellungen|Cookie-Einwilligung|Datenschutzeinstellungen)/i;
  for (const frame of page.frames()) {
    for (const role of ['button', 'link']) {
      const matching = frame.getByRole(role, { name: labels });
      const count = Math.min(await matching.count().catch(() => 0), 8);
      for (let i = 0; i < count; i++) {
        const el = matching.nth(i);
        if (await el.isVisible().catch(() => false)) return el;
      }
    }
  }
  return null;
}


// Only inspect the visible, public cookie-controls UI; never log cookies or private values.
async function cookieControlCandidates(page) {
  const out = [];
  const relevant = /cookie|consent|privacy|analytics|statistik|statistical|süti|adatvéd|mentés|save|speichern|ablehnen|decline|elutasít|accept|elfogad|akzeptier|essential|necessary|erforderlich|szükséges|functional|marketing/i;
  for (const frame of page.frames()) {
    for (const role of ['button', 'checkbox', 'switch']) {
      const loc = frame.getByRole(role);
      const count = Math.min(await loc.count().catch(() => 0), 60);
      for (let i = 0; i < count; i++) {
        const el = loc.nth(i);
        if (!(await el.isVisible().catch(() => false))) continue;
        const name = String((await el.getAttribute('aria-label').catch(() => null)) ||
          (await el.innerText().catch(() => '')) || '').trim().replace(/\\s+/g, ' ').slice(0, 85);
        if (!relevant.test(name)) continue;
        const checked = role !== 'button' ? await el.isChecked().catch(() => null) : null;
        out.push({ role, name, checked });
        if (out.length >= 30) return out;
      }
    }
  }
  return out;
}


// Wix custom toggles may not expose a visible ARIA checkbox; inspect their
// non-sensitive public label/state without reading cookie values or private data.
async function consentToggleCandidates(page) {
  const hits = [];
  const category = /analytics|analyse|analitik|statistik|functional|funktion|marketing|advertis|essential|necessary|notwendig|szükséges/i;
  for (const frame of page.frames()) {
    try {
      const raw = await frame.locator('input[type="checkbox"], [role="switch"], [role="checkbox"], [aria-checked]')
        .evaluateAll(elements => elements.slice(0, 50).map(el => {
          const label = el.labels?.[0]?.textContent ||
            el.closest('label')?.textContent ||
            el.parentElement?.parentElement?.textContent ||
            el.getAttribute('aria-label') || '';
          const name = String(label).trim().replace(/\\s+/g, ' ').slice(0, 115);
          return {
            name,
            tag: el.tagName.toLowerCase(),
            role: el.getAttribute('role'),
            type: el.getAttribute('type'),
            checked: el.checked === undefined ? el.getAttribute('aria-checked') : el.checked,
            disabled: !!el.disabled
          };
        }));
      for (const item of raw) {
        if (category.test(item.name)) hits.push(item);
        if (hits.length >= 30) return hits;
      }
    } catch {
      // Frame may be short-lived; an empty result remains explicitly unproven.
    }
  }
  return hits;
}

const browser = await chromium.launch({ headless: true });
const results = [];
const acceptResults = [];
const withdrawalResults = [];

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
    let afterAcceptBannerVisible = null, consentCookieNameCount = null, consentStorageKeyCount = null;
    let initialAcceptControls = [];
    try {
      const response = await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      status = response?.status() ?? null;
      await page.waitForTimeout(4500);
      before = [...observed];
      let button = await findAcceptButton(page);
      if (!button) {
        await page.waitForTimeout(3000);
        button = await findAcceptButton(page);
        if (!button) initialAcceptControls = await cookieControlCandidates(page);
      }
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
      // Diagnose whether acceptance persisted; never inspect or log cookie/storage values.
      afterAcceptBannerVisible = Boolean(await findAcceptButton(page));
      consentCookieNameCount = (await context.cookies()).filter(cookie => /consent|cookie|privacy|usercentrics|^uc_/i.test(cookie.name)).length;
      consentStorageKeyCount = await page.evaluate(() => Object.keys(localStorage).filter(name => /consent|cookie|privacy|usercentrics|^uc_/i.test(name)).length);
    } catch (e) {
      error = e?.name === 'TimeoutError' ? 'navigation-or-control-timeout' : 'navigation-or-consent-control-error';
    }
    const ids = [...new Set(after.map(x => x.measurementId).filter(Boolean))];
    const unexpected = ids.filter(x => x !== 'G-EY91Q4QSVF');
    const check = {
      locale: target.lang,
      httpStatus: status,
      acceptButtonClicked: accepted,
      initialAcceptControls,
      afterAcceptBannerVisible,
      consentCookieNameCount,
      consentStorageKeyCount,
      preConsentAnalyticsKinds: [...new Set(before.map(x => x.kind))],
      postAcceptAnalyticsKinds: [...new Set(after.map(x => x.kind))],
      postAcceptMeasurementIDs: ids,
      error,
      result: error || !status || status >= 400 || !accepted || afterAcceptBannerVisible !== false
        ? 'INCONCLUSIVE_OR_FAILED'
        : before.length || unexpected.length || after.some(x => x.kind === 'microsoft-clarity')
          ? 'CONSENT_LEAK_OR_WRONG_MEASUREMENT'
          : ids.includes('G-EY91Q4QSVF') ? 'PASS' : 'MEASUREMENT_UNVERIFIED_CLIENT_ONLY'
    };
    acceptResults.push(check);

    // A fresh Accept -> Revisit settings -> Decline -> Reload chain.
    // This is a separate diagnostic; a confirmed client tracking leak is a hard failure.
    let revisitFound = false, withdrawalClicked = false;
    let postWithdrawalAnalyticsKinds = [], postWithdrawalAcceptVisible = null;
    let postWithdrawalRevisitVisible = null, withdrawalError = null;
    let revisitControls = [];
    let revisitToggles = [];
    try {
      const revisit = await findRevisitButton(page);
      if (revisit) {
        revisitFound = true;
        await revisit.click({ timeout: 8000 });
        await page.waitForTimeout(1500);
        revisitControls = await cookieControlCandidates(page);
        revisitToggles = await consentToggleCandidates(page);
        const decline = await findDeclineButton(page);
        if (decline) {
          await decline.click({ timeout: 8000 });
          withdrawalClicked = true;
          await page.waitForTimeout(1500);
          const marker = observed.length;
          await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
          await page.waitForTimeout(4000);
          postWithdrawalAnalyticsKinds = [...new Set(observed.slice(marker).map(x => x.kind))];
          postWithdrawalAcceptVisible = Boolean(await findAcceptButton(page));
          postWithdrawalRevisitVisible = Boolean(await findRevisitButton(page));
        }
      }
    } catch (e) {
      withdrawalError = e?.name === 'TimeoutError' ? 'withdrawal-timeout' : 'withdrawal-ui-error';
    }
    const withdrawalResult = {
      locale: target.lang,
      revisitFound,
      revisitControls,
      revisitToggles,
      declineAfterAcceptClicked: withdrawalClicked,
      postWithdrawalAnalyticsKinds,
      postWithdrawalAcceptVisible,
      postWithdrawalRevisitVisible,
      error: withdrawalError,
      result: postWithdrawalAnalyticsKinds.length
        ? 'POST_WITHDRAWAL_CLIENT_LEAK'
        : withdrawalError || !revisitFound || !withdrawalClicked || postWithdrawalAcceptVisible !== false
          ? 'WITHDRAWAL_UI_NOT_PROVEN'
          : 'CLIENT_WITHDRAWAL_PASS'
    };
    withdrawalResults.push(withdrawalResult);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ audit: 'Wix Blog consent-first network, opt-in and withdrawal diagnostics', timestamp: new Date().toISOString(), declineChecks: results, acceptChecks: acceptResults, withdrawalChecks: withdrawalResults }, null, 2));

// A native Wix Google Tag can also send events server-side. An absent client-side GA4
// request after Accept is not evidence that the opt-in measurement works or fails.
// Preserve this observation as a separate unresolved measurement requirement (#315).
const measurementUnverified = acceptResults.filter(row => row.result === 'MEASUREMENT_UNVERIFIED_CLIENT_ONLY');
if (measurementUnverified.length) {
  console.warn('MEASUREMENT_UNVERIFIED: No client GA4 after Accept in ' + measurementUnverified.map(row => row.locale).join(', ') + '. Server-side measurement not tested; see issue #315.');
}
const privacyNetworkGateFailed =
  results.length !== targets.length * widths.length
  || results.some(row => row.result !== 'PASS')
  || acceptResults.length !== targets.length
  || acceptResults.some(row => row.result !== 'PASS' && row.result !== 'MEASUREMENT_UNVERIFIED_CLIENT_ONLY')
  || withdrawalResults.some(row => row.result === 'POST_WITHDRAWAL_CLIENT_LEAK');
if (privacyNetworkGateFailed) {
  console.error('Privacy browser-network gate FAILED. Do not claim GDPR compliance or delete the active remediation journal.');
  process.exitCode = 1;
} else {
  console.log('Privacy browser-network gate PASSED for pre-consent, Decline and wrong post-Accept measurement requests. This does not verify server-side events, consent withdrawal, or legal compliance.');
}

// Do not claim server-side consent withdrawal until it is independently corroborated.
if (withdrawalResults.some(row => row.result !== 'CLIENT_WITHDRAWAL_PASS')) {
  console.warn('WITHDRAWAL_UNVERIFIED: One or more language/consent flows did not prove client withdrawal. See #315; preserve active remediation journal.');
} else {
  console.log('CLIENT_WITHDRAWAL_PASS: Revisit -> Decline -> Reload showed no classified client analytics requests in all three locales. Server-side tracking and legal consent still require separate evidence.');
}

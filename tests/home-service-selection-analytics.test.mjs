import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync('assets/js/home-service-analytics.js', 'utf8');
const script = '/assets/js/home-service-analytics.js?v=20261118-service-choice-v1';
const locales = {
  '/': { code: 'en', file: 'index.html', paths: {
    '/portrait/': 'portrait', '/lifestyle/': 'brand',
    '/event-photography/': 'event', '/fine-art/': 'artists'
  }},
  '/hu/': { code: 'hu', file: 'hu/index.html', paths: {
    '/hu/portre/': 'portrait', '/hu/brand/': 'brand',
    '/hu/rendezvenyfotozas/': 'event', '/hu/muveszi-fotografia/': 'artists'
  }},
  '/de-at/': { code: 'de', file: 'de-at/index.html', paths: {
    '/de-at/portrait/': 'portrait', '/de-at/brand/': 'brand',
    '/de-at/eventfotografie/': 'event', '/de-at/fine-art/': 'artists'
  }}
};
assert.ok(!/fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage\.setItem/.test(source),
  'Service selection must never contact or store data independently');

for (const [pathname, locale] of Object.entries(locales)) {
  const html = readFileSync(locale.file, 'utf8');
  assert.equal(html.split(script).length - 1, 1, pathname + ' analytics script is loaded once');
  const serviceSection = html.match(/<section id="services"[\s\S]*?<\/section>/)?.[0] || '';
  assert.equal((serviceSection.match(/class="card reveal"/g) || []).length, 4,
    pathname + ' keeps four existing service cards');

  let onClick;
  let consent = false;
  const calls = [];
  const window = {
    location: { pathname },
    BANHALMI_ANALYTICS: { hasConsent: () => consent },
    gtag: (...args) => calls.push(JSON.parse(JSON.stringify(args)))
  };
  const document = {
    addEventListener: (event, fn) => {
      assert.equal(event, 'click');
      onClick = fn;
    }
  };
  runInNewContext(source, { window, document }, { filename: 'home-service-analytics.js' });
  assert.equal(typeof onClick, 'function');

  function click(href, withinCard = true) {
    const anchor = { getAttribute: key => key === 'href' ? href : null };
    onClick({ target: {
      closest: selector => {
        assert.equal(selector, '#services .cards > a.card');
        return withinCard ? anchor : null;
      }
    }});
  }

  for (const [href, service] of Object.entries(locale.paths)) {
    assert.ok(serviceSection.includes('href="' + href + '"'), pathname + ' page contains the mapped card');
    click(href);
    assert.equal(calls.length, 0, 'no measurement before explicit consent');
    consent = true;
    click(href);
    assert.equal(calls.length, 1, 'one event per consented click');
    const [command, event, params] = calls.pop();
    assert.equal(command, 'event');
    assert.equal(event, 'select_content');
    assert.deepEqual(params, {
      content_type: 'service',
      item_id: service,
      event_category: 'homepage_service',
      event_label: locale.code + '_' + service
    });
    consent = false;
  }
  consent = true;
  click('/requestaquote/');
  click('/portrait/', false);
  assert.equal(calls.length, 0, 'only the exact four cards can be counted');
  window.BANHALMI_ANALYTICS = null;
  click(Object.keys(locale.paths)[0]);
  assert.equal(calls.length, 0, 'no event without loaded consent API');
}

let outsideHomeListeners = 0;
runInNewContext(source, {
  window: { location: { pathname: '/portrait/' } },
  document: { addEventListener: () => { outsideHomeListeners++; } }
});
assert.equal(outsideHomeListeners, 0, 'service tracker does not bind on non-homepage routes');

console.log('Homepage service selection analytics PASS: all 12 paths, consent deny/grant/revoke, allowlisted labels, no PII and no off-homepage listeners.');

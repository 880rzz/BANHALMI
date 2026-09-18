import fs from 'node:fs';

const errors = [];
function requireTokens(file, tokens) {
  const body = fs.readFileSync(file, 'utf8');
  for (const token of tokens) if (!body.includes(token)) errors.push(`${file}: missing required contract token: ${token}`);
}

const analytics = fs.readFileSync('assets/js/analytics.js', 'utf8');
for (const token of [
  'G-90C452LJKQ',
  'analytics_storage: "denied"',
  'ad_storage: "denied"',
  'allow_google_signals: false',
  'allow_ad_personalization_signals: false'
]) if (!analytics.includes(token)) errors.push(`assets/js/analytics.js: missing required contract token: ${token}`);
if (/banhalmi\.art/i.test(analytics)) errors.push('assets/js/analytics.js: ART domain must not be linked into the BANHALMI professional GA4 configuration');
if (/\blinker\s*:/i.test(analytics)) errors.push('assets/js/analytics.js: cross-domain GA4 linker must remain disabled after ART property isolation');

requireTokens('hu/adatvedelem/index.html', [
  'tiltakozhat az adatkezelés ellen',
  'Nemzetközi',
  'Österreichische Datenschutzbehörde',
  'G-90C452LJKQ'
]);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('BANHALMI analytics/privacy hardening contract passed: consent-first professional GA4 is isolated from ART and HU GDPR disclosures remain explicit.');

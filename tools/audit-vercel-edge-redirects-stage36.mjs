import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const middlewarePath = path.join(root, 'middleware.js');
const failures = [];

if (!fs.existsSync(middlewarePath)) {
  failures.push('middleware.js is missing');
} else {
  const source = fs.readFileSync(middlewarePath, 'utf8');
  const required = [
    "matcher: '/:path*'",
    "host.includes('banhalminorbert.hu')",
    "host.includes('banhalmi-hu-redirect')",
    "host.includes('banhalmi.at')",
    "host.includes('banhalmi-at-redirect')",
    "languageBase = 'https://www.norbertbanhalmi.com/hu/'",
    "languageBase = 'https://www.norbertbanhalmi.com/de-at/'",
    'status: 308',
    "'X-Robots-Tag': 'noindex'"
  ];

  for (const token of required) {
    if (!source.includes(token)) failures.push(`middleware.js missing required contract: ${token}`);
  }

  if (!source.includes("incoming.pathname.replace(/^\\/+/, '')")) {
    failures.push('middleware.js must preserve incoming paths after the language base');
  }
  if (!source.includes('target.search = incoming.search')) {
    failures.push('middleware.js must preserve query strings');
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log('Stage 36 Vercel hostname-aware edge redirect audit passed.');

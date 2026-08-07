import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const failures = [];

function auditMiddleware(relativePath, required) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${relativePath} is missing`);
    return;
  }

  const source = fs.readFileSync(fullPath, 'utf8');
  for (const token of required) {
    if (!source.includes(token)) failures.push(`${relativePath} missing required contract: ${token}`);
  }
  if (!source.includes("incoming.pathname.replace(/^\\/+/, '')")) {
    failures.push(`${relativePath} must preserve incoming paths after the language base`);
  }
  if (!source.includes('target.search = incoming.search')) {
    failures.push(`${relativePath} must preserve query strings`);
  }
}

auditMiddleware('middleware.js', [
  "matcher: '/:path*'",
  "host.includes('banhalminorbert.hu')",
  "host.includes('banhalmi-hu-redirect')",
  "host.includes('banhalmi.at')",
  "host.includes('banhalmi-at-redirect')",
  "languageBase = 'https://www.norbertbanhalmi.com/hu/'",
  "languageBase = 'https://www.norbertbanhalmi.com/de-at/'",
  'status: 308',
  "'X-Robots-Tag': 'noindex'"
]);

auditMiddleware('redirects/at/middleware.js', [
  "matcher: '/:path*'",
  "new URL(cleanPath, 'https://www.norbertbanhalmi.com/de-at/')",
  'status: 308',
  "'X-Robots-Tag': 'noindex'"
]);

auditMiddleware('redirects/hu/middleware.js', [
  "matcher: '/:path*'",
  "new URL(cleanPath, 'https://www.norbertbanhalmi.com/hu/')",
  'status: 308',
  "'X-Robots-Tag': 'noindex'"
]);

const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const ignore = vercel.ignoreCommand || '';
for (const redundantProjectId of [
  'prj_S6QfYbMXaV7mCI9rr47asrzyKdYX',
  'prj_2oUW8R7jfNrPC9LLo86VjyBsUBgm'
]) {
  if (!ignore.includes(redundantProjectId)) failures.push(`vercel.json ignoreCommand must skip redundant domainless project ${redundantProjectId}`);
}
if (!ignore.includes('$VERCEL_PROJECT_ID')) failures.push('vercel.json ignoreCommand must key build suppression from VERCEL_PROJECT_ID');
if (!ignore.includes('else exit 1')) failures.push('vercel.json ignoreCommand must allow all non-redundant Vercel projects to continue building');

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log('Stage 36 Vercel hostname-aware redirects and redundant-project build suppression audit passed.');

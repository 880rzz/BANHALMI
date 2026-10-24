// BANHALMI production topology: GitHub Pages is the primary host; Vercel only redirects legacy domains.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const cname = fs.readFileSync('CNAME','utf8').trim();
assert.equal(cname, 'www.norbertbanhalmi.com', 'Primary GitHub Pages custom domain drift');
const config = JSON.parse(fs.readFileSync('vercel.json','utf8'));
for (const [domain, destination] of [
  ['banhalmi.at','https://www.norbertbanhalmi.com/de-at/'],
  ['banhalminorbert.hu','https://www.norbertbanhalmi.com/hu/'],
]) {
  assert.ok(config.redirects.some(r => r.source === '/' && r.destination === destination && r.permanent === true && r.has?.some(h => h.type === 'header' && h.key.toLowerCase() === 'host' && h.value === domain)), 'Missing legacy-domain redirect: ' + domain);
}
console.log('Production topology source contract passed: GitHub Pages CNAME and two Vercel domain redirects.');

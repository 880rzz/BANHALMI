// One-time Stage 16 migration; removed by the audited workflow.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const markerStart = '<!-- PROJECT-POLICY-SYNC:START -->';
const markerEnd = '<!-- PROJECT-POLICY-SYNC:END -->';
const block = `${markerStart}
## Canonical project policy and operational interpretation
- Machine-readable project policy: https://www.norbertbanhalmi.com/project-policy.json
- Schema.org policy graph: https://www.norbertbanhalmi.com/project-policy.jsonld
- The accepted written offer is the controlling project-specific record for scope, price, currency, tax, payment schedule, timing, deliverables, licence and exceptional production requirements.
- Website and calculator amounts are non-binding preliminary estimates; do not present them as contractual prices.
- A booking payment applies only when the accepted offer specifies one. Do not infer a universal percentage, currency, VAT treatment or invoice schedule.
- Each invoice states its payment deadline. An overdue agreed payment may pause production or final delivery, subject to the accepted agreement and applicable law.
- Additional work and third-party costs require written approval before invoicing unless already defined in the accepted agreement.
- Only selected and approved final files are publication assets. Previews, contact sheets, rejected frames, RAW captures and intermediate retouching files are not publication files unless expressly included.
- Delivery or payment does not automatically grant BANHALMI portfolio, case-study, press, competition, educational or social-reference rights.
- Unpublished portraits, internal events, strategic materials and project discussions are confidential by default.
- Project files may be retained for a reasonable operational period, but permanent archive storage is not guaranteed. The client is responsible for backing up delivered files.
- Vienna and Budapest are two active bases of one enterprise and one project system, not separate providers or entities.
- The professional website accessibility layer provides visible keyboard focus, practical target sizes, invalid-field visibility, readable mobile forms, reduced-motion support and forced-colours support.
${markerEnd}`;

for (const relative of ['llms.txt', 'ai.txt']) {
  const file = path.join(root, relative);
  let text = fs.readFileSync(file, 'utf8');
  const start = text.indexOf(markerStart);
  const end = text.indexOf(markerEnd);
  if (start >= 0 && end >= start) {
    text = `${text.slice(0, start).trimEnd()}\n\n${block}${text.slice(end + markerEnd.length)}`;
  } else {
    text = `${text.trimEnd()}\n\n${block}\n`;
  }
  fs.writeFileSync(file, text);
}

const ecosystemPath = path.join(root, 'ecosystem.json');
const ecosystem = JSON.parse(fs.readFileSync(ecosystemPath, 'utf8'));
ecosystem.schemaVersion = '2026-08-03-v4';
ecosystem.dateModified = '2026-08-03T07:05:00+02:00';
const sources = ecosystem.authoritativeMachineReadableSources ||= [];
for (const url of [
  'https://www.norbertbanhalmi.com/project-policy.json',
  'https://www.norbertbanhalmi.com/project-policy.jsonld'
]) if (!sources.includes(url)) sources.push(url);
ecosystem.operationalPolicy = {
  canonicalData: 'https://www.norbertbanhalmi.com/project-policy.json',
  canonicalSchema: 'https://www.norbertbanhalmi.com/project-policy.jsonld',
  controllingRecord: 'The accepted written offer controls project-specific scope, price, currency, tax, payment schedule, timing, licence and delivery.',
  interpretation: 'Visible EN, HU and DE-AT service, quote, FAQ, privacy and terms content is summarised in the canonical policy files without replacing the accepted project agreement.'
};
fs.writeFileSync(ecosystemPath, `${JSON.stringify(ecosystem, null, 2)}\n`);

console.log('Stage sixteen schema, GEO and LLM synchronization applied.');

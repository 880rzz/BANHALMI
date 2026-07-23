import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve(import.meta.dirname, '..', 'de-at/eventfotografie/index.html');
const before = 'Koordinierte koordinierten Einsatz mehrerer Fotograf:innen';
const after = 'Koordinierter Einsatz mehrerer Fotograf:innen';
const input = fs.readFileSync(file, 'utf8');
if (!input.includes(before)) throw new Error('Expected duplicated coordination copy was not found');
fs.writeFileSync(file, input.split(before).join(after));
console.log('Corrected duplicated German coordination copy.');

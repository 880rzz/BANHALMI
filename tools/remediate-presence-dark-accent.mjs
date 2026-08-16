import fs from 'node:fs';

const file = 'assets/css/site.css';
let css = fs.readFileSync(file, 'utf8');
const before = `html body :is(.cta-band,.dark-band,.section-dark) :is(h1,h2,h3) :is(.title-accent,.semantic-emphasis){
    background:linear-gradient(90deg,#F5F5F7 0%,#AFC4D9 62%,#B79C44 100%)!important;`;
const after = `html body :is(.cta-band,.dark-band,.section-dark,.presence-thesis[data-surface="dark"]) :is(h1,h2,h3) :is(.title-accent,.semantic-emphasis){
    background:linear-gradient(90deg,#F5F5F7 0%,#AFC4D9 62%,#DCC56B 100%)!important;`;

if (css.includes(after)) {
  console.log('Presence dark accent remediation already applied.');
  process.exit(0);
}
if (!css.includes(before)) {
  throw new Error('Expected dark accent selector not found; refusing blind CSS rewrite.');
}
css = css.replace(before, after);
fs.writeFileSync(file, css);
console.log('Presence dark accent selector updated: no dark-on-dark gradient stop remains.');

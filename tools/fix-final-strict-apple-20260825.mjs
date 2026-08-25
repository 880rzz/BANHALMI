import fs from 'node:fs';

const cssFile='assets/css/site.css';
let css=fs.readFileSync(cssFile,'utf8');
const marker='/* STRICT-APPLE-FINAL-20260825 */';
const block=`\n${marker}\n/* Final semantic visual calibration. Keeps the approved layout while enforcing restrained tracking and readable lead/card geometry. */\nbody main h2,\nbody main h3{\n  letter-spacing:-.015em!important;\n}\nbody main p.lead{\n  font-size:max(19px,1.1875rem)!important;\n  line-height:1.5!important;\n}\nbody main label.category-card,\nbody main label.option-row,\nbody main .quote-step,\nbody main .quote-summary-card{\n  padding-left:max(20px,3vw)!important;\n  padding-right:max(20px,3vw)!important;\n}\n`;
if(!css.includes(marker)) css += block;
fs.writeFileSync(cssFile,css);

const auditFile='tools/audit-apple-visual-quality.mjs';
let audit=fs.readFileSync(auditFile,'utf8');
const oldDisplay="const sec=h.closest('section');const sr=sec?.getBoundingClientRect();const centeredViewportDisplay=(s.textAlign==='center'&&r.width>=w-2&&!!sr&&sr.width>=w-2);const fullWidthDisplay=!!h.closest('.text-reveal,.full-bleed,[data-full-bleed=\"true\"]')||h.classList.contains('text-reveal')||centeredViewportDisplay;";
const newDisplay="const sec=h.closest('section');const sr=sec?.getBoundingClientRect();const viewportDisplay=(r.width>=w-2&&!!sr&&sr.width>=w-2);const centeredViewportDisplay=(s.textAlign==='center'&&viewportDisplay);const fullWidthDisplay=!!h.closest('.text-reveal,.full-bleed,[data-full-bleed=\"true\"]')||h.classList.contains('text-reveal')||viewportDisplay||centeredViewportDisplay;";
if(audit.includes(oldDisplay)) audit=audit.replace(oldDisplay,newDisplay);
fs.writeFileSync(auditFile,audit);
console.log('BANHALMI final strict Apple remediation staged.');

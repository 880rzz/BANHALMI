import fs from 'node:fs';

const file = 'assets/css/site.css';
let css = fs.readFileSync(file, 'utf8');
const endMarker = '/* APPLE-RESPONSIVE-CONTRACT-V1:END */';
const auditMarker = '/* AUDIT-20260816-FOOTER-SUMMARY-CONTRAST */';
const guard = `${auditMarker}\n@media (max-width:1040px){\n  html body .site-footer .footer-accordion > summary{\n    color:#CBB45F!important;\n    opacity:1!important;\n    font-weight:650!important;\n  }\n  html body .site-footer .footer-accordion > summary:hover,\n  html body .site-footer .footer-accordion > summary:focus-visible{color:#fff!important;}\n}\n`;

if (!css.includes(endMarker)) throw new Error('Apple responsive END marker missing');
const escapedMarker = auditMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const trailingGuard = new RegExp(`\\n?${escapedMarker}\\n@media \\(max-width:1040px\\)\\{[\\s\\S]*?\\n\\}\\n?`, 'g');
css = css.replace(trailingGuard, '\n');
css = css.replace(endMarker, `${guard}\n${endMarker}`);
fs.writeFileSync(file, css);

const out = fs.readFileSync(file, 'utf8');
const markerIndex = out.indexOf(auditMarker);
const endIndex = out.indexOf(endMarker);
if (markerIndex < 0 || endIndex < 0 || markerIndex > endIndex) throw new Error('Footer contrast guard is not inside responsive authority');
if (out.indexOf(auditMarker, markerIndex + 1) !== -1) throw new Error('Duplicate footer contrast guard remains');
console.log('Footer contrast guard relocated inside final responsive authority.');

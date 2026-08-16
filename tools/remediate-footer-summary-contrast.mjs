import fs from 'node:fs';

const file = 'assets/css/site.css';
let css = fs.readFileSync(file, 'utf8');
const marker = '/* AUDIT-20260816-FOOTER-SUMMARY-CONTRAST */';
const rule = `\n${marker}\n@media (max-width:1040px){\n  html body .site-footer .footer-accordion > summary{\n    color:#CBB45F!important;\n    opacity:1!important;\n    font-weight:650!important;\n  }\n  html body .site-footer .footer-accordion > summary:hover,\n  html body .site-footer .footer-accordion > summary:focus-visible{color:#fff!important;}\n}\n`;
if (!css.includes(marker)) css += rule;
fs.writeFileSync(file, css);
const out = fs.readFileSync(file, 'utf8');
if (!out.includes('html body .site-footer .footer-accordion > summary')) throw new Error('Footer summary selector missing after remediation');
if (!out.includes('color:#CBB45F!important')) throw new Error('Accessible footer gold missing after remediation');
console.log('Footer accordion summary contrast remediation applied.');

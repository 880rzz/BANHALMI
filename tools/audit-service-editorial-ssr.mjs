#!/usr/bin/env node
import fs from 'node:fs';

const pages = [
  ['portrait/index.html', 'portrait', ['portrait-headshot-photography', 'vipach-photography-community']],
  ['hu/portre/index.html', 'portrait', ['portre-es-headshotfotozas', 'vipach-fotografiai-kozosseg']],
  ['de-at/portrait/index.html', 'portrait', ['portraet-headshotfotografie', 'vipach-fotografie-community']],
  ['lifestyle/index.html', 'brand', ['portrait-portfolio-photography', 'vipach-photography-community']],
  ['hu/brand/index.html', 'brand', ['lifestyle-es-portfoliofotozas', 'vipach-fotografiai-kozosseg']],
  ['de-at/brand/index.html', 'brand', ['portraet-portfoliofotografie', 'vipach-fotografie-community']],
  ['fine-art/index.html', 'fine', ['portrait-portfolio-photography', 'vipach-photography-community']],
  ['hu/muveszi-fotografia/index.html', 'fine', ['lifestyle-es-portfoliofotozas', 'vipach-fotografiai-kozosseg']],
  ['de-at/fine-art/index.html', 'fine', ['portraet-portfoliofotografie', 'vipach-fotografie-community']],
  ['event-photography/index.html', 'event', ['vipach-photography-community']],
  ['hu/rendezvenyfotozas/index.html', 'event', ['vipach-fotografiai-kozosseg']],
  ['de-at/eventfotografie/index.html', 'event', ['vipach-fotografie-community']],
];

const failures = [];
for (const [file, type, needles] of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!main) {
    failures.push(`${file}: missing main`);
    continue;
  }
  const body = main[1];
  if (!body.includes('id="service-editorial"')) {
    failures.push(`${file}: missing SSR #service-editorial in main`);
  }
  if (!body.includes(`data-service-editorial-type="${type}"`)) {
    failures.push(`${file}: wrong editorial type`);
  }
  for (const n of needles) {
    if (!body.includes(n)) failures.push(`${file}: main missing blog category token ${n}`);
  }
  const editorial = body.match(/id="service-editorial"[\s\S]*?<\/section>/)?.[0] || '';
  if (
    type === 'fine' &&
    /fine-art-nude-photography|aktfotozas-muveszi-szemmel|kuenstlerische-aktfotografie/.test(editorial)
  ) {
    failures.push(`${file}: Professional fine editorial must not link artistic-nude blog category`);
  }
  if (!/blog\.banhalmi\.art\/[^"']*\/post\//.test(editorial) && !/blog\.banhalmi\.art\/post\//.test(editorial)) {
    failures.push(`${file}: service-editorial must cite at least one specific blog post URL, not only categories`);
  }
  if (!editorial.includes('data-editorial-post="true"')) {
    failures.push(`${file}: missing data-editorial-post marker on specific article link`);
  }
}

const menu = fs.readFileSync('assets/js/mega-menu.js', 'utf8');
if (!menu.includes("'/fine-art'")) failures.push('mega-menu: /fine-art missing from serviceEditorialType');
if (!menu.includes("return'event'")) failures.push('mega-menu: event serviceEditorialType missing');
if (!menu.includes('fine:[0,4]')) {
  failures.push('mega-menu: fine editorial must use portfolio+vipach indexes, not nude');
}
if (!menu.includes('event:[4]')) failures.push('mega-menu: event editorial indexes missing');

const teamFiles = [
  ['about/index.html', 'may independently photograph'],
  ['hu/eletmu/index.html', 'önállóan is fotózhat'],
  ['de-at/werk/index.html', 'selbstständig fotografieren'],
  ['speier-viko/index.html', 'may photograph, coordinate and lead Budapest'],
  ['hu/speier-viko/index.html', 'önállóan is fotózhat, koordinálhat'],
  ['de-at/speier-viko/index.html', 'selbstständig fotografieren, koordinieren'],
];
for (const [file, needle] of teamFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes(needle)) {
    failures.push(`${file}: team role copy missing Budapest photography agency (${needle})`);
  }
  if (
    /Norbert remains the photographer and creative lead for commissioned BANHALMI work|A megbízott BANHALMI-munkák fotográfiai és kreatív vezetője Norbert marad|Fotografische und kreative Leitung beauftragter BANHALMI-Projekte bleibt bei Norbert/.test(
      html
    )
  ) {
    failures.push(`${file}: overclaiming sole-photographer sentence still present`);
  }
}

if (failures.length) {
  console.error('audit-service-editorial-ssr FAILED');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}
console.log('audit-service-editorial-ssr passed: SSR service↔blog anchors + team role Budapest agency');

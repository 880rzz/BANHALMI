import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '_site');
const pages = ['index.html', 'hu/index.html', 'de-at/index.html'];
const scriptRe = /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi;
const oldStyleToken = 'style.css?v=20260810-menu-polish-v65';
const newStyleToken = 'style.css?v=20260813-apple-authority-v70';

function heroFirst(html, rel) {
  if (html.includes('data-hero-position="header-first"')) return html;
  const decisionRe = /(<section class="fp-decision-system"[^>]*data-first-principles-path="stage68"[\s\S]*?<\/section>)/;
  const heroRe = /<section class="hero hero-image-first"><div class="wrap">(?<figure><figure class="hero-figure editorial-hero reveal">[\s\S]*?<\/figure>)(?<copy>[\s\S]*?)<\/div><\/section>/;
  const decision = decisionRe.exec(html);
  const hero = heroRe.exec(html);
  if (!decision || !hero) throw new Error(`${rel}: expected Stage68 decision block and canonical hero structure.`);
  if (decision.index > hero.index) throw new Error(`${rel}: unexpected source hierarchy; refusing ambiguous production rewrite.`);
  const gap = html.slice(decision.index + decision[0].length, hero.index);
  if (gap.trim()) throw new Error(`${rel}: unexpected content between decision layer and hero.`);
  const visual = `<section class="hero hero-image-first hero-visual-only" data-hero-position="header-first"><div class="wrap">${hero.groups.figure}</div></section>`;
  const copy = `<section class="hero hero-copy-only" data-hero-copy="stage70"><div class="wrap">${hero.groups.copy}</div></section>`;
  const rewritten = html.slice(0, decision.index) + visual + decision[0] + copy + html.slice(hero.index + hero[0].length);
  const mainPos = rewritten.indexOf('<main id="main">');
  const visualPos = rewritten.indexOf('data-hero-position="header-first"');
  const decisionPos = rewritten.indexOf('data-first-principles-path="stage68"');
  const copyPos = rewritten.indexOf('data-hero-copy="stage70"');
  if (!(mainPos >= 0 && visualPos > mainPos && decisionPos > visualPos && copyPos > decisionPos)) {
    throw new Error(`${rel}: failed header -> hero visual -> decision -> hero copy contract.`);
  }
  return rewritten;
}

async function updateStyleTokens(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await updateStyleTokens(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      const before = await readFile(full, 'utf8');
      if (!before.includes(oldStyleToken)) continue;
      await writeFile(full, before.replaceAll(oldStyleToken, newStyleToken), 'utf8');
    }
  }
}

await updateStyleTokens(root);

for (const rel of pages) {
  const file = path.join(root, rel);
  let html = await readFile(file, 'utf8');
  html = heroFirst(html, rel);
  const headClose = html.indexOf('</head>');
  const bodyClose = html.lastIndexOf('</body>');
  if (headClose < 0 || bodyClose < 0 || bodyClose <= headClose) {
    throw new Error(`${rel}: malformed document; cannot harden critical path.`);
  }

  const head = html.slice(0, headClose);
  const scripts = [...head.matchAll(scriptRe)].map(match => match[0]);
  if (!scripts.length) throw new Error(`${rel}: no JSON-LD found in <head>; expected canonical schema graph.`);

  for (const script of scripts) {
    const json = script.replace(/^<script\b[^>]*>/i, '').replace(/<\/script>$/i, '');
    JSON.parse(json);
  }

  const headBeforeBytes = Buffer.byteLength(head, 'utf8');
  const cleanedHead = head.replace(scriptRe, '');
  const headAfterBytes = Buffer.byteLength(cleanedHead, 'utf8');
  const reduction = headBeforeBytes - headAfterBytes;
  if (reduction < 5000) {
    throw new Error(`${rel}: JSON-LD relocation reduced critical <head> by only ${reduction} bytes; expected >= 5000.`);
  }

  html = `${cleanedHead}${html.slice(headClose)}`;
  const insertion = `\n${scripts.join('\n')}\n`;
  const newBodyClose = html.lastIndexOf('</body>');
  html = `${html.slice(0, newBodyClose)}${insertion}${html.slice(newBodyClose)}`;

  const newHead = html.slice(0, html.indexOf('</head>'));
  if (scriptRe.test(newHead)) throw new Error(`${rel}: JSON-LD remains in critical <head> after relocation.`);
  scriptRe.lastIndex = 0;

  const totalScripts = [...html.matchAll(scriptRe)].length;
  if (totalScripts !== scripts.length) {
    throw new Error(`${rel}: schema count changed during relocation (${scripts.length} -> ${totalScripts}).`);
  }
  if (!html.includes(newStyleToken)) throw new Error(`${rel}: Stage70 shared stylesheet cache token missing.`);

  await writeFile(file, html, 'utf8');
  console.log(`${rel}: hero-first hierarchy locked; moved ${scripts.length} JSON-LD block(s); head reduced by ${reduction} bytes.`);
}
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '_site');
const pages = ['index.html', 'hu/index.html', 'de-at/index.html'];
const scriptRe = /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi;

for (const rel of pages) {
  const file = path.join(root, rel);
  let html = await readFile(file, 'utf8');
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

  await writeFile(file, html, 'utf8');
  console.log(`${rel}: moved ${scripts.length} JSON-LD block(s) after visible content; head reduced by ${reduction} bytes.`);
}

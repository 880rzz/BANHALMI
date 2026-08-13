import fs from 'node:fs';

const branchFiles = [
  {
    path: 'hu/ajanlatkeres/index.html',
    step: '<div class="quote-step"><h3>2 · Részletek és opciók</h3>',
    guide: `<div class="quote-decision-guide" role="note" aria-label="Gyors döntési segítség"><strong>Gyors döntési segítség</strong><ul><li><b>Időtartam:</b> rövid headshot, ha egy gyors, célzott portré kell; hosszabb vezetett fotózás, ha több beállításra, ruhára vagy kommunikációs felületre készül.</li><li><b>Retusált képek:</b> csak a véglegesen kidolgozott, átadott képek számát válassza. Több kép azonnal módosítja a becsült árat.</li><li><b>Több ember / esemény:</b> adja meg a létszámot és az időkeretet; a kalkulátor szükség esetén automatikusan számolja a minimális fotóslétszámot.</li><li><b>Helyszín:</b> bécsi vagy budapesti stúdió a legegyszerűbb választás; iroda vagy külső helyszín esetén a szükséges kiszállás külön megjelenik a kalkulációban.</li></ul><p>Ha egy opció mellett <b>i</b> jel látható, nyissa meg: röviden elmagyarázza, mikor érdemes azt választani.</p></div>`
  },
  {
    path: 'requestaquote/index.html',
    step: '<div class="quote-step"><h3>2 · Details and options</h3>',
    guide: `<div class="quote-decision-guide" role="note" aria-label="Quick decision guide"><strong>Quick decision guide</strong><ul><li><b>Duration:</b> choose a short headshot for one focused portrait; choose a longer guided session when you need more setups, outfits or communication uses.</li><li><b>Retouched images:</b> select the number of fully finished images you want delivered. Extra images update the estimate immediately.</li><li><b>Teams / events:</b> enter the number of people and available time; the calculator automatically recommends the minimum photographer coverage when needed.</li><li><b>Location:</b> Vienna or Budapest studio is the simplest option; office or external locations add the relevant travel requirement to the estimate.</li></ul><p>Where you see an <b>i</b> icon, open it for a short explanation of when that option is the right choice.</p></div>`
  },
  {
    path: 'de-at/anfrage/index.html',
    step: '<div class="quote-step"><h3>2 · Details und Optionen</h3>',
    guide: `<div class="quote-decision-guide" role="note" aria-label="Schnelle Entscheidungshilfe"><strong>Schnelle Entscheidungshilfe</strong><ul><li><b>Dauer:</b> einen kurzen Headshot für ein gezieltes Porträt wählen; eine längere geführte Session, wenn mehrere Setups, Outfits oder Einsatzzwecke benötigt werden.</li><li><b>Retuschierte Bilder:</b> wählen Sie die Anzahl der vollständig ausgearbeiteten Bilder, die Sie erhalten möchten. Zusätzliche Bilder aktualisieren die Schätzung sofort.</li><li><b>Teams / Events:</b> Personenzahl und verfügbares Zeitfenster angeben; der Kalkulator empfiehlt bei Bedarf automatisch die minimale fotografische Abdeckung.</li><li><b>Ort:</b> Studio Wien oder Budapest ist die einfachste Wahl; Büro oder externe Location ergänzt die notwendige Anfahrt in der Kalkulation.</li></ul><p>Wo ein <b>i</b>-Symbol erscheint, öffnen Sie es für eine kurze Erklärung, wann die jeweilige Option sinnvoll ist.</p></div>`
  }
];

const mobileCss = `
.quote-decision-guide{margin:0 0 22px;padding:16px 18px;border:1px solid rgba(16,34,63,.13);border-radius:16px;background:rgba(255,255,255,.72);font-size:.94rem;line-height:1.5}
.quote-decision-guide>strong{display:block;margin-bottom:8px}
.quote-decision-guide ul{margin:0;padding-left:1.15rem}
.quote-decision-guide li+li{margin-top:6px}
.quote-decision-guide p{margin:10px 0 0;color:var(--muted,#5f6672)}
@media (max-width:899px){
  .quote-flow-line{font-size:.9rem}
  .quote-intro{margin-bottom:10px}
  .quote-summary-card{position:fixed!important;z-index:38;left:12px;right:12px;bottom:max(10px,env(safe-area-inset-bottom));margin:0!important;padding:10px 14px!important;min-height:58px;border-radius:16px!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;background:rgba(255,255,255,.96)!important;box-shadow:0 12px 34px rgba(16,34,63,.18);backdrop-filter:saturate(160%) blur(16px);-webkit-backdrop-filter:saturate(160%) blur(16px)}
  .quote-summary-card .eyebrow{margin:0!important;font-size:.72rem;line-height:1.15;white-space:normal}
  .quote-summary-card .quote-total{margin:0!important;font-size:clamp(1.05rem,5vw,1.38rem)!important;line-height:1.1;white-space:nowrap;text-align:right}
  .quote-summary-card dl,.quote-summary-card>p{display:none!important}
  .site-footer{padding-bottom:calc(82px + env(safe-area-inset-bottom))}
  .quote-decision-guide{padding:14px 15px;font-size:.9rem}
}
@media (max-width:360px){
  .quote-summary-card{left:8px;right:8px;padding:9px 11px!important;gap:7px}
  .quote-summary-card .eyebrow{font-size:.66rem}
  .quote-summary-card .quote-total{font-size:1rem!important}
}
`;

for (const cfg of branchFiles) {
  let html = fs.readFileSync(cfg.path, 'utf8');
  if (html.includes('quote-decision-guide')) {
    console.log(`Already hardened: ${cfg.path}`);
    continue;
  }
  if (!html.includes(cfg.step)) throw new Error(`${cfg.path}: step marker not found`);
  html = html.replace(cfg.step, cfg.step + cfg.guide);
  const styleEnd = '@media (max-width:899px){\n  .quote-flow-line{font-size:.9rem}\n  .quote-intro{margin-bottom:10px}\n}\n</style>';
  if (!html.includes(styleEnd)) throw new Error(`${cfg.path}: responsive style marker not found`);
  html = html.replace(styleEnd, mobileCss + '</style>');
  fs.writeFileSync(cfg.path, html);
  console.log(`Responsive quote hardening applied: ${cfg.path}`);
}

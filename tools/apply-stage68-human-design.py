from pathlib import Path
import json, re

ROOT = Path('.')
OLD = '20260810-menu-polish-v65'
NEW = '20260810-human-editorial-v68'

# Curated human-voice replacements only where the wording is genuinely formulaic.
REPLACEMENTS = {
    'portrait/index.html': [
        ('Fine-art profile of a woman with closed eyes in warm directional light; the sculpted face and dark background create stillness, intimacy and timeless form.',
         'Fine-art profile of a woman with closed eyes in warm directional light; the sculpted face and dark background create a quiet, intimate portrait.')
    ],
    'hu/portre/index.html': [
        ('A végső képkészlet szerep és felhasználás szerint áll össze, nem csak az alapján, melyik fotó a legerősebb önmagában.',
         'A végső képkészletet szerep és felhasználás szerint válogatjuk össze; egy erős sorozat többet tud, mint néhány különálló jó kép.')
    ],
    'hu/brand/index.html': [
        ('A végső képkészlet szerep és felhasználás szerint áll össze, nem csak az alapján, melyik fotó a legerősebb önmagában.',
         'A végső képkészletet szerep és felhasználás szerint válogatjuk össze; egy erős sorozat többet tud, mint néhány különálló jó kép.')
    ],
    'hu/rendezvenyfotozas/index.html': [
        ('A végső képkészlet szerep és felhasználás szerint áll össze, nem csak az alapján, melyik fotó a legerősebb önmagában.',
         'A végső képkészletet szerep és felhasználás szerint válogatjuk össze; egy erős sorozat többet tud, mint néhány különálló jó kép.')
    ],
    'de-at/portrait/index.html': [
        ('Das Ergebnis ist nicht nur ein Ordner mit Fotos, sondern ein nutzbares Bildsystem für Führung, Marke und Kommunikation.',
         'Am Ende steht ein nutzbares Bildsystem für Führung, Marke und Kommunikation – kein bloßer Ordner mit Einzelbildern.'),
        ('Die finale Serie wird nach Rolle und Einsatz ausgewählt, nicht nur danach, welches Einzelbild am stärksten wirkt.',
         'Die finale Serie wird nach Rolle und Einsatz ausgewählt. Entscheidend ist, wie die Bilder gemeinsam funktionieren.')
    ],
    'de-at/brand/index.html': [
        ('Das gilt nicht nur für Unternehmen.', 'Das gilt ebenso für Personenmarken, Teams und Institutionen.'),
        ('Das Ergebnis ist nicht nur ein Ordner mit Fotos, sondern ein nutzbares Bildsystem für Führung, Marke und Kommunikation.',
         'Am Ende steht ein nutzbares Bildsystem für Führung, Marke und Kommunikation – kein bloßer Ordner mit Einzelbildern.'),
        ('Die finale Serie wird nach Rolle und Einsatz ausgewählt, nicht nur danach, welches Einzelbild am stärksten wirkt.',
         'Die finale Serie wird nach Rolle und Einsatz ausgewählt. Entscheidend ist, wie die Bilder gemeinsam funktionieren.')
    ],
    'de-at/eventfotografie/index.html': [
        ('Das Ergebnis ist nicht nur ein Ordner mit Fotos, sondern ein nutzbares Bildsystem für Führung, Marke und Kommunikation.',
         'Am Ende steht ein nutzbares Bildsystem für Führung, Marke und Kommunikation – kein bloßer Ordner mit Einzelbildern.'),
        ('Die finale Serie wird nach Rolle und Einsatz ausgewählt, nicht nur danach, welches Einzelbild am stärksten wirkt.',
         'Die finale Serie wird nach Rolle und Einsatz ausgewählt. Entscheidend ist, wie die Bilder gemeinsam funktionieren.')
    ],
    'de-at/fine-art/index.html': [
        ('So entstehen Bilder, die nicht nur gut aussehen, sondern persönlich und ehrlich wirken.',
         'So entstehen Bilder, die persönlich wirken und dem Menschen vor der Kamera gerecht werden.')
    ],
    'de-at/speier-viko/index.html': [
        ('Diese Projekte zeigen denselben Grundsatz wie ihre kommerzielle Arbeit: Ein Bild soll einen echten Zweck erfüllen und nicht nur eine Botschaft dekorieren.',
         'Diese Projekte folgen demselben Grundsatz wie ihre kommerzielle Arbeit: Ein Bild braucht eine klare Aufgabe und soll eine Botschaft glaubwürdig tragen.')
    ],
}

for rel, pairs in REPLACEMENTS.items():
    p = ROOT / rel
    text = p.read_text(encoding='utf-8')
    for old, new in pairs:
        if old not in text:
            raise SystemExit(f'Missing reviewed copy in {rel}: {old[:90]}')
        text = text.replace(old, new)
    p.write_text(text, encoding='utf-8')

css_path = ROOT / 'assets/css/style.css'
css = css_path.read_text(encoding='utf-8')
marker = '/* STAGE68-HUMAN-EDITORIAL-DESIGN:START */'
if marker not in css:
    css += r'''

/* STAGE68-HUMAN-EDITORIAL-DESIGN:START */
/* Final editorial resilience: quiet Apple-like rhythm without changing the BANHALMI information architecture. */
:root{
  --editorial-reading:68ch;
  --editorial-reading-wide:76ch;
  --editorial-gutter:clamp(20px,4.2vw,64px);
  --editorial-section:clamp(72px,9vw,132px);
  --editorial-card-pad:clamp(22px,2.6vw,34px);
}

/* Long text should read like editorial copy, not fill the whole canvas. */
main p,main li,main dd,main blockquote{overflow-wrap:anywhere;hyphens:auto}
main .lead,main .section-head>p,main .prose,main .legal,main .structural-prose,
main .trust-note>p,main .faq-answer,main .project-framework p{max-width:var(--editorial-reading)}
main h1,main h2,main h3{text-wrap:balance}
main p,main li{text-wrap:pretty}

/* Flex/grid children may shrink instead of pushing text into cell edges or outside the viewport. */
main :is(.grid,.grid-2,.grid-3,.card-grid,.contact-grid,.location-cards,.service-grid,.trust-grid,
.project-grid,.quote-grid,.decision-grid,.footer-grid)>*,
main :is(.card,.trust-card,.service-card,.contact-card,.location-card,.project-card,.decision-card){min-width:0}

/* Consistent internal breathing room for card-like content. */
main :is(.card,.trust-card,.service-card,.contact-card,.location-card,.project-card,.decision-card){
  padding:var(--editorial-card-pad);
}
main :is(.card,.trust-card,.service-card,.contact-card,.location-card,.project-card,.decision-card)>:first-child{margin-top:0}
main :is(.card,.trust-card,.service-card,.contact-card,.location-card,.project-card,.decision-card)>:last-child{margin-bottom:0}

/* Tables and dense commercial data remain usable on narrow screens. */
main :is(.table-wrap,.pricing-table-wrap,.comparison-table-wrap){max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
main table{max-width:100%}
main th,main td{padding:14px 16px;vertical-align:top;overflow-wrap:anywhere}

/* Keep hero and section rhythm calm and predictable across viewport families. */
main>section{padding-top:var(--editorial-section);padding-bottom:var(--editorial-section)}
main>section.hero,main>section.editorial-hero,main>section.trust-hero{padding-top:clamp(88px,11vw,156px)}
main .section-head{margin-bottom:clamp(30px,4.5vw,56px)}
main .section-head h2{margin-bottom:clamp(12px,1.6vw,20px)}

@media(max-width:900px){
  :root{--editorial-gutter:clamp(20px,5vw,42px);--editorial-section:clamp(64px,9vw,96px)}
  main :is(.card,.trust-card,.service-card,.contact-card,.location-card,.project-card,.decision-card){padding:clamp(20px,3.5vw,28px)}
}
@media(max-width:680px){
  :root{--editorial-gutter:20px;--editorial-section:58px;--editorial-card-pad:20px}
  main h1{line-height:1.04;letter-spacing:-.035em}
  main h2{line-height:1.1;letter-spacing:-.025em}
  main h3{line-height:1.18}
  main p,main li{line-height:1.62}
  main th,main td{padding:12px 14px}
  main>section.hero,main>section.editorial-hero,main>section.trust-hero{padding-top:82px}
}
/* STAGE68-HUMAN-EDITORIAL-DESIGN:END */
'''
css_path.write_text(css, encoding='utf-8')

# Bump the shared presentation cache token across actual runtime references and audits that lock it.
for p in list(ROOT.rglob('*.html')) + [ROOT/'assets/js/site-config.js'] + list((ROOT/'tools').glob('audit-*.mjs')):
    text = p.read_text(encoding='utf-8')
    if OLD in text:
        p.write_text(text.replace(OLD, NEW), encoding='utf-8')

# Permanent Stage68 regression guard.
audit = ROOT / 'tools/audit-human-editorial-design-stage68.mjs'
audit.write_text(r'''import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const css=fs.readFileSync('assets/css/style.css','utf8');
const config=fs.readFileSync('assets/js/site-config.js','utf8');
const errors=[];
const token='20260810-human-editorial-v68';
for(const s of ['STAGE68-HUMAN-EDITORIAL-DESIGN:START','--editorial-reading:68ch','overflow-wrap:anywhere','text-wrap:balance','min-width:0','--editorial-card-pad']) if(!css.includes(s)) errors.push('style.css missing '+s);
if(!config.includes('mega-menu.css?v='+token)||!config.includes('mega-menu.js?v='+token)) errors.push('site-config cache token not Stage68');
const ignored=new Set(['.git','node_modules','redirects']); const files=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(ignored.has(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p)}} walk(root);
let indexed=0;
for(const f of files){const h=fs.readFileSync(f,'utf8');if(/<link[^>]+rel=["']canonical["']/i.test(h)&&!/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(h)) indexed++;
  for(const m of h.matchAll(/style=["']([^"']+)["']/gi)){const s=m[1];if(/font-size\s*:\s*(?:[0-9](?:\.[0-9]+)?px|0\.[0-7][0-9]*rem)/i.test(s))errors.push(path.relative(root,f)+': inline sub-reading-size text');if(/white-space\s*:\s*nowrap/i.test(s))errors.push(path.relative(root,f)+': inline nowrap can break responsive text');}
  for(const m of h.matchAll(/\/assets\/css\/style\.css\?v=([^"']+)/g)) if(m[1]!==token) errors.push(path.relative(root,f)+': stale style token '+m[1]);
}
const banned=[
 ['portrait/index.html','timeless form'],
 ['hu/portre/index.html','nem csak az alapján, melyik fotó a legerősebb önmagában'],
 ['hu/brand/index.html','nem csak az alapján, melyik fotó a legerősebb önmagában'],
 ['hu/rendezvenyfotozas/index.html','nem csak az alapján, melyik fotó a legerősebb önmagában'],
 ['de-at/portrait/index.html','Das Ergebnis ist nicht nur ein Ordner mit Fotos'],
 ['de-at/brand/index.html','Das Ergebnis ist nicht nur ein Ordner mit Fotos'],
 ['de-at/eventfotografie/index.html','Das Ergebnis ist nicht nur ein Ordner mit Fotos'],
 ['de-at/fine-art/index.html','nicht nur gut aussehen'],
 ['de-at/speier-viko/index.html','nicht nur eine Botschaft dekorieren']
];
for(const [f,s] of banned)if(fs.readFileSync(f,'utf8').includes(s))errors.push(f+': mechanical wording returned: '+s);
for(const f of ['index.html','hu/index.html','de-at/index.html','portrait/index.html','hu/portre/index.html','de-at/portrait/index.html','brand/index.html','hu/brand/index.html','de-at/brand/index.html','event-photography/index.html','hu/rendezvenyfotozas/index.html','de-at/eventfotografie/index.html']){const h=fs.readFileSync(f,'utf8');if(!h.includes('/assets/css/style.css?v='+token))errors.push(f+': missing Stage68 style token');}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Stage68 human editorial + Apple design audit passed across ${files.length} HTML files (${indexed} canonical/indexable surfaces): responsive text safety, shared cache authority and reviewed HU/EN/DE copy are locked.`);
''',encoding='utf-8')

pkg_path=ROOT/'package.json'
pkg=json.loads(pkg_path.read_text(encoding='utf-8'))
cmd=pkg['scripts']['audit']
needle='node tools/audit-ecosystem-closure-stage67.mjs'
if 'audit-human-editorial-design-stage68.mjs' not in cmd:
    if needle not in cmd: raise SystemExit('Stage67 audit chain anchor missing')
    cmd=cmd.replace(needle, needle+' && node tools/audit-human-editorial-design-stage68.mjs')
pkg['scripts']['audit']=cmd
pkg['scripts']['audit:human-design']='node tools/audit-human-editorial-design-stage68.mjs'
pkg_path.write_text(json.dumps(pkg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

print('Stage68 migration prepared: curated copy, responsive editorial CSS, cache token, permanent audit.')

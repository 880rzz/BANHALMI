import fs from 'node:fs';

const cssPath='assets/css/style.css';
let css=fs.readFileSync(cssPath,'utf8');
const marker='/* STAGE47-UI-DESIGN-CONTRACT:START */';
if(css.includes(marker)) throw new Error('Stage 47 UI design contract already exists');

const block=`

/* STAGE47-UI-DESIGN-CONTRACT:START */
/* Final visual contract shared conceptually with BANHALMI ART: one spacing
   scale, deterministic image treatment, restrained panels and stable gallery
   gutters. */
:root{
  --ui-space-1:8px;
  --ui-space-2:12px;
  --ui-space-3:16px;
  --ui-space-4:24px;
  --ui-space-5:32px;
  --ui-space-6:48px;
  --ui-space-7:64px;
  --ui-space-8:96px;
  --ui-image-radius:4px;
  --ui-panel-radius:12px;
  --ui-gallery-gap:16px;
  --ui-content-max:1200px;
  --ui-reading-max:68ch;
}

/* Footer viewport contract. */
html,body{min-height:100%}
body{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column}
body>main{flex:1 0 auto;width:100%;min-width:0}
body>.site-footer{margin-top:auto;width:100%}
.site-footer .brand,.site-footer .brand span,.site-footer .brand-word{color:#CBB45F}

/* Photographic surfaces: subtle 4px corner, never large app-card rounding. */
.editorial-hero,.editorial-image,.pf-item,.lb img{border-radius:var(--ui-image-radius)}
.editorial-hero img,.editorial-image img,.pf-item img{border-radius:inherit}

/* Portfolio masonry: exactly the same horizontal and vertical rhythm. */
.pf-grid{columns:3;column-gap:var(--ui-gallery-gap)}
.pf-item{break-inside:avoid;margin:0 0 var(--ui-gallery-gap);width:100%}
@media(max-width:900px){.pf-grid{columns:2}}
@media(max-width:560px){.pf-grid{columns:1}}

/* Information cards stay restrained and consistent. */
.location-cards,.contact-grid{gap:var(--ui-space-4)}
.location-cards .card,.contact-grid .card{border-radius:var(--ui-panel-radius)}

/* Editorial width: long-form copy should not become a wall of text. */
.prose,.legal,.structural-prose{max-width:var(--ui-reading-max)}
/* STAGE47-UI-DESIGN-CONTRACT:END */
`;
fs.writeFileSync(cssPath,css+block);
console.log('Stage 47 professional UI design contract appended.');

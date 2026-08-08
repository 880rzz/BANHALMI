import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(root, p), s);

// 1) Remove the legacy hero scroll-parallax. It performs a synchronous
// getBoundingClientRect() read followed by a style write on load/scroll/resize,
// which is exactly the kind of forced-layout loop Lighthouse reports.
{
  const file = 'assets/js/main.js';
  let src = read(file);
  const startMarker = '  // Very light hero depth on pointer devices only; no mobile parallax and no layout movement.\n';
  const endMarker = '  // Service lower galleries — progressive reveal for performance without removing SEO-visible HTML when JavaScript is disabled.\n';
  const start = src.indexOf(startMarker);
  const end = src.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Could not locate the legacy hero parallax block safely.');
  }
  src = src.slice(0, start) + '  // Hero remains static by design: no scroll-linked layout reads or parallax writes.\n\n' + src.slice(end);
  write(file, src);
}

// 2) Accessibility/performance overrides: darker text gold and no layout-driven
// max-height transition for the mobile navigation.
{
  const file = 'assets/css/accessibility-stage14.css';
  let css = read(file);
  css = css.replace('    color:#B79C44!important;\n    background:transparent!important;', '    color:#8A681F!important;\n    background:transparent!important;');
  const marker = '/* STAGE52-PAGESPEED-RUNTIME:START */';
  if (!css.includes(marker)) {
    css += `\n\n${marker}\n/* Avoid layout animations in the mobile navigation; transform/opacity remain available elsewhere. */\n@media (max-width:1040px){\n  .nav-links{transition:none!important;}\n}\n/* Text use of the brand gold must meet AA on the light navigation surface. */\n@media (max-width:680px), (pointer:coarse){\n  .lang-switch a.active,\n  .nav-links a[aria-current="page"],\n  .nav-links a.active,\n  .nav-links .active>a{color:#8A681F!important;}\n}\n/* STAGE52-PAGESPEED-RUNTIME:END */\n`;
  }
  write(file, css);
}

// 3) Stage 29 originally locked the decorative brand gold into a text role.
// Update that regression contract to require the darker AA-safe text gold.
{
  const file = 'tools/audit-mobile-menu-and-footer-stage29.mjs';
  let src = read(file);
  if (!src.includes("'color:#B79C44!important'")) {
    throw new Error('Stage 29 legacy navigation-gold contract not found.');
  }
  src = src.replace("'color:#B79C44!important'", "'color:#8A681F!important'");
  src = src.replace(
    "console.log('Stage 29 mobile menu and footer regression audit passed.');",
    "console.log('Stage 29 mobile menu and footer regression audit passed with AA-safe active navigation text.');"
  );
  write(file, src);
}

// 4) Remove competing high fetch priority from the decorative/brand mark while
// keeping the photographic hero as the sole high-priority LCP candidate.
for (const file of ['index.html', 'hu/index.html', 'de-at/index.html']) {
  let html = read(file);
  const before = html;
  html = html.replace(/(<img[^>]*class="hero-center-logo"[^>]*?)fetchpriority="high"([^>]*>)/g, '$1fetchpriority="low"$2');
  if (html === before && !html.includes('class="hero-center-logo"')) {
    throw new Error(`${file}: hero center logo not found`);
  }
  write(file, html);
}

// 5) Add a permanent regression audit and wire it into npm run audit.
{
  const auditFile = 'tools/audit-pagespeed-runtime-stage52.mjs';
  const auditSource = `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst root=path.resolve(import.meta.dirname,'..');\nconst read=(p)=>fs.readFileSync(path.join(root,p),'utf8');\nconst errors=[];\nconst main=read('assets/js/main.js');\nconst a11y=read('assets/css/accessibility-stage14.css');\nconst stage29=read('tools/audit-mobile-menu-and-footer-stage29.mjs');\n\nif(main.includes('getBoundingClientRect()') && main.includes('--hero-scroll-y')) errors.push('main.js still contains the legacy scroll-linked hero layout read/write loop');\nif(main.includes('window.addEventListener(\\"scroll\\", requestUpdate')) errors.push('main.js still registers the legacy hero scroll requestUpdate handler');\nif(!main.includes('Hero remains static by design: no scroll-linked layout reads or parallax writes.')) errors.push('main.js missing the static-hero performance contract');\nif(!a11y.includes('/* STAGE52-PAGESPEED-RUNTIME:START */')) errors.push('accessibility-stage14.css missing Stage 52 runtime hardening');\nif(!a11y.includes('.nav-links{transition:none!important;}')) errors.push('mobile navigation still lacks the no-layout-transition guard');\nif(/color:#B79C44!important;[\\s\\S]{0,160}background:transparent!important;/.test(a11y)) errors.push('brand gold #B79C44 is still used as active mobile text on a light background');\nif(!stage29.includes("'color:#8A681F!important'")) errors.push('Stage 29 must guard the AA-safe active navigation text color');\nfor(const file of ['index.html','hu/index.html','de-at/index.html']){\n  const html=read(file);\n  if(!/class=\\"hero-center-logo\\"[^>]*fetchpriority=\\"low\\"|fetchpriority=\\"low\\"[^>]*class=\\"hero-center-logo\\"/.test(html)) errors.push(file+': decorative hero logo must use low fetch priority');\n  if(!/data-banhalmi-lcp-preload=\\"\\"[^>]*fetchpriority=\\"high\\"|fetchpriority=\\"high\\"[^>]*data-banhalmi-lcp-preload=\\"\\"/.test(html)) errors.push(file+': photographic LCP preload must remain high priority');\n}\nif(errors.length){console.error(errors.join('\\n'));process.exit(1);}\nconsole.log('Stage 52 PageSpeed runtime audit passed: no scroll-linked hero reflow, no mobile layout transition, AA active navigation gold, and one high-priority LCP candidate.');\n`;
  write(auditFile, auditSource);

  const pkgFile = 'package.json';
  const pkg = JSON.parse(read(pkgFile));
  const token = 'node tools/audit-pagespeed-runtime-stage52.mjs';
  if (!pkg.scripts.audit.includes(token)) pkg.scripts.audit += ' && ' + token;
  pkg.scripts['audit:pagespeed-runtime'] = token;
  write(pkgFile, JSON.stringify(pkg, null, 2) + '\n');
}

console.log('Applied Stage 52 PageSpeed hardening safely.');

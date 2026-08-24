import fs from 'node:fs';

const failures = [];
const cssPath = 'assets/css/visual-rhythm-20260825.css';
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
const menu = fs.readFileSync('assets/js/mega-menu.js', 'utf8');
const workflow = fs.readFileSync('.github/workflows/pages.yml', 'utf8');

if (!css) failures.push(`${cssPath} missing`);

for (const needle of [
  '--rhythm-section:',
  'line-height:1.68',
  'content-visibility:visible!important',
  'contain-intrinsic-size:none!important',
  'section.surface-white',
  'section.surface-soft',
  'section.surface-dark',
  '.project-framework-drawer > summary',
  '.fp-art-path',
  '.fp-decision-actions',
  '.bn-mega-link:focus-visible',
  'outline:0!important',
  'body > .site-footer'
]) {
  if (!css.includes(needle)) failures.push(`visual rhythm authority missing: ${needle}`);
}

if (!menu.includes('/assets/css/visual-rhythm-20260825.css?v=20260825-1')) {
  failures.push('mega-menu runtime does not load the visual rhythm authority');
}
if (!menu.includes('data-banhalmi-visual-rhythm')) {
  failures.push('visual rhythm stylesheet loader lacks duplicate-load guard');
}

// This production-only mutation caused Safari/homepage blank bands to return.
if (workflow.includes('contain-intrinsic-size:auto 760px')) {
  failures.push('production workflow reintroduces 760px intrinsic blank-band placeholder');
}
if (workflow.includes("test \"$(find _site/assets/css -type f -name '*.css' | wc -l | tr -d ' ')\" = \"2\"")) {
  failures.push('production CSS-count contract still assumes only two stylesheets');
}
if (!workflow.includes('_site/assets/css/visual-rhythm-20260825.css')) {
  failures.push('production artifact does not preserve/minify the visual rhythm authority');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('BANHALMI visual rhythm regression guard passed: spacing, surface alternation, alignment, menu focus and footer flow are protected.');

from pathlib import Path
import re

ROOT=Path('.')
HOMES=[Path('index.html'),Path('hu/index.html'),Path('de-at/index.html')]
OLD_STYLE='style.css?v=20260810-menu-polish-v65'
NEW_STYLE='style.css?v=20260813-apple-authority-v70'

for path in HOMES:
    html=path.read_text(encoding='utf-8')
    decision_re=re.compile(r'(<section class="fp-decision-system"[^>]*data-first-principles-path="stage68"[\s\S]*?</section>)')
    hero_re=re.compile(r'<section class="hero hero-image-first"><div class="wrap">(?P<figure><figure class="hero-figure editorial-hero reveal">[\s\S]*?</figure>)(?P<copy>[\s\S]*?)</div></section>')
    dm=decision_re.search(html)
    hm=hero_re.search(html)
    if not dm or not hm:
        raise SystemExit(f'{path}: expected Stage68 decision block and original hero structure')
    if dm.start()>hm.start():
        raise SystemExit(f'{path}: source order already changed unexpectedly')
    between=html[dm.end():hm.start()]
    if between.strip():
        raise SystemExit(f'{path}: unexpected content between decision and hero')
    visual='<section class="hero hero-image-first hero-visual-only" data-hero-position="header-first"><div class="wrap">'+hm.group('figure')+'</div></section>'
    intro='<section class="hero hero-copy-only" data-hero-copy="stage70"><div class="wrap">'+hm.group('copy')+'</div></section>'
    replacement=visual+dm.group(1)+intro
    html=html[:dm.start()]+replacement+html[hm.end():]
    path.write_text(html,encoding='utf-8')

# Bust the shared stylesheet cache on every real HTML document so Stage70 is
# consistently visible site-wide, while leaving the independently versioned
# mega-menu assets untouched.
for path in ROOT.rglob('*.html'):
    text=path.read_text(encoding='utf-8')
    if OLD_STYLE in text:
        path.write_text(text.replace(OLD_STYLE,NEW_STYLE),encoding='utf-8')

css_path=Path('assets/css/style.css')
css=css_path.read_text(encoding='utf-8')
marker='/* STAGE70-APPLE-DESIGN-AUTHORITY:START */'
if marker in css:
    raise SystemExit('style.css: Stage70 authority already present')
css += r'''

/* STAGE70-APPLE-DESIGN-AUTHORITY:START */
/* Single shared visual authority. Apple-inspired discipline, BANHALMI identity.
   Presentation belongs here; accessibility CSS and runtime JS stay scoped. */
:root{
  --bn-surface:#fff;
  --bn-surface-soft:#f5f5f7;
  --bn-ink:#1d1d1f;
  --bn-muted:#6e6e73;
  --bn-hairline:#d2d2d7;
  --bn-gold-aa:#8a681f;
  --bn-reading:68ch;
  --bn-content:1180px;
  --bn-radius:24px;
  --bn-section-space:clamp(4rem,7vw,7rem);
}
html{scroll-padding-top:88px;}
body{background:var(--bn-surface);color:var(--bn-ink);}
main{overflow:clip;}
main h1,main h2,main h3{font-style:normal;text-wrap:balance;letter-spacing:-.025em;}
main h1{line-height:1.04;}
main h2{line-height:1.08;}
main p,main li{line-height:1.62;}
main .prose,main .section-head{max-width:var(--bn-reading);}
main .section-head{margin-inline:auto;text-align:center;}
main>section:not(.hero-visual-only){padding-block:var(--bn-section-space);}
main>section+section{border-top:1px solid rgba(29,29,31,.08);}
main>section:nth-of-type(even):not(.hero):not(.fp-decision-system){background:var(--bn-surface-soft);}

/* The signature image is the first meaningful visual immediately after the header. */
.hero-visual-only{padding:0!important;margin:0;background:#000;border:0!important;}
.hero-visual-only .wrap{width:100%;max-width:none;padding:0;margin:0;}
.hero-visual-only .hero-figure{width:100%;max-width:none;margin:0;border-radius:0;overflow:hidden;}
.hero-visual-only picture,.hero-visual-only picture img{display:block;width:100%;}
.hero-visual-only picture img{height:auto;object-fit:cover;}
.hero-visual-only+.fp-decision-system{border-top:1px solid var(--bn-hairline);}
.fp-decision-system+.hero-copy-only{border-top:1px solid var(--bn-hairline);background:var(--bn-surface);}
.hero-copy-only .wrap{max-width:980px;}
.hero-copy-only> .wrap>p:not(.eyebrow):not(.hero-location-line){max-width:var(--bn-reading);}

/* One block = one idea: calm surfaces, restrained cards, no decorative shadow stack. */
.cards{gap:clamp(1rem,2vw,1.5rem);}
.card,.next-step-selector,main details:not(.nav-submenu):not(.footer-accordion),.quote-summary,.contact-card,.pricing-card{
  border:1px solid var(--bn-hairline);
  border-radius:var(--bn-radius);
  box-shadow:none;
}
.card{background:var(--bn-surface);padding:clamp(1.5rem,2.5vw,2.25rem);}
.card:hover{box-shadow:none;transform:translateY(-2px);border-color:#b7b7bd;}
.card h3{margin-top:0;}
main details:not(.nav-submenu):not(.footer-accordion){background:var(--bn-surface);padding:clamp(1rem,2vw,1.5rem);}

/* Clear action hierarchy, with one obvious primary action and quiet secondary links. */
.btn,.nav-cta{border-radius:999px;box-shadow:none;font-weight:650;}
.btn:hover,.nav-cta:hover{box-shadow:none;}
.btn-link,.more,.fp-text-action{font-weight:600;text-underline-offset:.18em;}
.hero-actions,.fp-decision-actions{gap:.9rem 1.1rem;align-items:center;}

/* Consistent editorial rhythm across service, legal, archive, profile and contact pages. */
main>.hero:not(.hero-visual-only),main>.section-band,main>section>.wrap{position:relative;}
main>.hero:not(.hero-visual-only)>.wrap,main>section>.wrap{width:min(calc(100% - 40px),var(--bn-content));margin-inline:auto;}
main .eyebrow{letter-spacing:.08em;text-transform:uppercase;font-size:.78rem;font-weight:700;}
main hr{border:0;border-top:1px solid var(--bn-hairline);margin-block:clamp(2rem,4vw,4rem);}

@media(max-width:680px){
  :root{--bn-section-space:clamp(3rem,12vw,4.75rem);--bn-radius:20px;}
  main>.hero:not(.hero-visual-only)>.wrap,main>section>.wrap{width:min(calc(100% - 28px),var(--bn-content));}
  .hero-visual-only .wrap{width:100%;}
  .hero-copy-only .hero-actions,.fp-decision-actions{align-items:stretch;}
  .hero-copy-only .btn,.fp-decision-actions .btn{width:100%;justify-content:center;}
}
@media(prefers-reduced-motion:reduce){.card:hover{transform:none;}}
/* STAGE70-APPLE-DESIGN-AUTHORITY:END */
'''
css_path.write_text(css,encoding='utf-8')

# Extend the existing permanent Stage68 guard rather than adding parallel audit debt.
audit_path=Path('tools/audit-first-principles-apple-stage68.mjs')
audit=audit_path.read_text(encoding='utf-8')
needle="  const section=(html.match(/<section[^>]+data-first-principles-path=\"stage68\"[\\s\\S]*?<\\/section>/)||[''])[0];"
insert="""  const visualPos=html.indexOf('data-hero-position=\"header-first\"');\n  const decisionPos=html.indexOf(page.marker);\n  const copyPos=html.indexOf('data-hero-copy=\"stage70\"');\n  const mainPos=html.indexOf('<main id=\"main\">');\n  if(!(mainPos>=0 && visualPos>mainPos && decisionPos>visualPos && copyPos>decisionPos)) errors.push(`${page.file}: required order is header -> hero image -> decision layer -> hero copy`);\n  const beforeVisual=html.slice(mainPos,visualPos);\n  if(/<section\\b/.test(beforeVisual)) errors.push(`${page.file}: another section appears before the header-first hero visual`);\n  const visualSection=(html.match(/<section class=\"hero hero-image-first hero-visual-only\"[\\s\\S]*?<\\/section>/)||[''])[0];\n  if(!visualSection.includes('hero-figure editorial-hero reveal')) errors.push(`${page.file}: header-first hero image is missing`);\n  if(/<h1\\b/.test(visualSection)) errors.push(`${page.file}: visual hero must remain image-led; H1 belongs to the post-decision hero copy`);\n  const copySection=(html.match(/<section class=\"hero hero-copy-only\"[\\s\\S]*?<\\/section>/)||[''])[0];\n  if(!/<h1\\b/.test(copySection)) errors.push(`${page.file}: hero copy must retain the page H1`);\n"""+needle
if needle not in audit:
    raise SystemExit('Stage68 audit insertion point not found')
audit=audit.replace(needle,insert)
audit=audit.replace("'STAGE69-FINE-ART-PATH:START','.fp-art-path'","'STAGE69-FINE-ART-PATH:START','.fp-art-path','STAGE70-APPLE-DESIGN-AUTHORITY:START','.hero-visual-only','.hero-copy-only','--bn-section-space'")
audit=audit.replace("console.log('Stage68 passed: EN/HU/DE homepages start from customer problems, keep exactly six primary choices, preserve contact/booking discipline, expose fine-art photography as a secondary path, and retain the shared Apple-style hierarchy.');","const hardener=fs.readFileSync('tools/optimize-homepage-critical-path.mjs','utf8');\nif(hardener.includes('fp-decision-system')||hardener.includes('hero-visual-only')||hardener.includes('hero-copy-only')) errors.push('production critical-path hardener must not rewrite visible homepage hierarchy');\nif(!css.includes('style.css')){}\nconsole.log('Stage68/70 passed: EN/HU/DE homepages render the signature hero image immediately after the header, then the six-choice decision layer, then the retained hero copy; fine art, contact/booking discipline and the shared Apple-style authority remain guarded.');")
# The replacement above inserted a late error check after the existing error exit; move it before that exit.
audit=audit.replace("if(errors.length){\n  console.error('Stage68 first-principles Apple audit failed:');","const hardener=fs.readFileSync('tools/optimize-homepage-critical-path.mjs','utf8');\nif(hardener.includes('fp-decision-system')||hardener.includes('hero-visual-only')||hardener.includes('hero-copy-only')) errors.push('production critical-path hardener must not rewrite visible homepage hierarchy');\n\nif(errors.length){\n  console.error('Stage68 first-principles Apple audit failed:');")
# Remove any duplicate late hardener block introduced by the prior message replacement.
audit=audit.replace("const hardener=fs.readFileSync('tools/optimize-homepage-critical-path.mjs','utf8');\nif(hardener.includes('fp-decision-system')||hardener.includes('hero-visual-only')||hardener.includes('hero-copy-only')) errors.push('production critical-path hardener must not rewrite visible homepage hierarchy');\nif(!css.includes('style.css')){}\nconsole.log", "console.log")
audit_path.write_text(audit,encoding='utf-8')

print('Stage70 hero-first structure, shared Apple authority and permanent guard applied.')
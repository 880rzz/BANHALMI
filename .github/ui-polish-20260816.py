from pathlib import Path

CSS = Path('assets/css/site.css')
s = CSS.read_text(encoding='utf-8')
marker = '/* APPLE-RESPONSIVE-CONTRACT-V1:END */'
start = '/* UI-POLISH-20260816:START */'
end = '/* UI-POLISH-20260816:END */'
if start in s or end in s:
    raise SystemExit('UI polish block already present')
if s.count(marker) != 1:
    raise SystemExit(f'Expected exactly one final responsive marker, found {s.count(marker)}')
block = r'''
/* UI-POLISH-20260816:START */
/* Homepage visual hero must touch the header without inheriting the generic
   main>section vertical rhythm from later design-system layers. */
html body main > section.hero.hero-image-first.hero-visual-only{
  padding-top:0!important;
  margin-top:0!important;
}
html body main > section.hero.hero-image-first.hero-visual-only > .wrap{
  padding-top:0!important;
}

/* PageSpeed/Lighthouse contrast: the author-led fine-art prompt is secondary
   copy, but it must still meet normal-text WCAG contrast on the soft surface. */
html body .fp-decision-system.surface-soft .fp-art-path > span{
  color:#3f4147!important;
}

/* Quote cards keep the 44px accessible info target in normal flow while the
   copy wrapper owns the full second grid column. This pins every info control
   to the card's right edge instead of letting it follow the label text. */
html body .smart-quote-layout :is(.option-row,.category-card) > span{
  display:grid!important;
  width:100%!important;
  min-width:0!important;
  grid-template-columns:minmax(0,1fr) 44px!important;
  column-gap:12px!important;
  align-items:center!important;
}
html body .smart-quote-layout :is(.option-row,.category-card) > span > .info-tip{
  position:static!important;
  grid-column:2!important;
  grid-row:1 / span 2!important;
  justify-self:end!important;
  align-self:center!important;
  margin:0!important;
}

/* Footer business identifiers are compact two-column data, not loose list
   copy. Keep identifiers on one line at desktop widths and allow narrow-screen
   wrapping only where it is genuinely needed. */
.site-footer .footer-legal-list{
  min-width:225px;
}
.site-footer .footer-legal-list li{
  display:grid!important;
  grid-template-columns:58px minmax(0,1fr)!important;
  column-gap:10px!important;
  align-items:start!important;
  margin-bottom:8px!important;
  line-height:1.35!important;
}
.site-footer .footer-legal-list li > span{
  min-width:0!important;
  line-height:1.35!important;
}
.site-footer .footer-legal-list li > strong{
  min-width:0!important;
  line-height:1.35!important;
  white-space:nowrap;
}

/* Copyright and utility links form one deliberate metadata row on desktop,
   with a compact stacked fallback instead of space-between stretching. */
.site-footer .footer-bottom{
  display:grid!important;
  grid-template-columns:max-content minmax(0,1fr)!important;
  align-items:start!important;
  justify-content:initial!important;
  column-gap:24px!important;
  row-gap:8px!important;
  margin-top:28px!important;
  padding-top:16px!important;
  line-height:1.4!important;
}
.site-footer .footer-bottom > span:first-child{
  white-space:nowrap;
  line-height:1.4!important;
}
.site-footer .footer-bottom > span:last-child{
  min-width:0;
  line-height:1.4!important;
}
@media (max-width:980px){
  .site-footer .footer-bottom{
    grid-template-columns:1fr!important;
  }
  .site-footer .footer-bottom > span:first-child{
    white-space:normal;
  }
}
@media (max-width:620px){
  .site-footer .footer-legal-list{min-width:0;}
  .site-footer .footer-legal-list li > strong{white-space:normal;}
}
/* UI-POLISH-20260816:END */
'''.strip()
s = s.replace(marker, block + '\n' + marker)
CSS.write_text(s, encoding='utf-8')

check = CSS.read_text(encoding='utf-8')
assert check.count(start) == 1 and check.count(end) == 1
assert check.rstrip().endswith(marker)
assert 'main > section.hero.hero-image-first.hero-visual-only' in check
assert '.fp-decision-system.surface-soft .fp-art-path > span' in check
assert 'color:#3f4147!important' in check
assert 'grid-template-columns:minmax(0,1fr) 44px!important' in check
assert '.site-footer .footer-legal-list li{' in check
assert 'grid-template-columns:max-content minmax(0,1fr)!important' in check
print('UI polish source patch applied and verified.')

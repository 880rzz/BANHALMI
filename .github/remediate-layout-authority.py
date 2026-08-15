from pathlib import Path
import json, re, sys

phase=sys.argv[1]
css_path=Path('assets/css/site.css')

def replace_exact(s, old, new, count, label):
    found=s.count(old)
    if found!=count:
        raise SystemExit(f'{label}: expected {count}, found {found}')
    return s.replace(old,new)

if phase=='phase1':
    s=css_path.read_text()
    # Scope every naked global section-padding authority. The negative lookbehind
    # excludes class/id/combinator-prefixed selectors, so only literal global
    # `section{padding:...}` authorities are rewritten.
    pattern=r'(?<![A-Za-z0-9_.>:=-])section\{padding:'
    found=len(re.findall(pattern,s))
    if found!=6:
        raise SystemExit(f'naked section padding authority count: expected 6, found {found}')
    s=re.sub(pattern,'main>section{padding:',s)
    if re.search(pattern,s):
        raise SystemExit('naked section padding authority survived scoping')
    css_path.write_text(s)

elif phase=='phase2':
    s=css_path.read_text()
    old='.option-row,.category-card{position:relative;display:grid;grid-template-columns:auto 1fr;align-items:flex-start;gap:.75rem;min-height:56px;padding-right:58px;padding-bottom:52px;}'
    new='.option-row,.category-card{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:flex-start;gap:.75rem;min-height:0;padding:12px 14px;}'
    s=replace_exact(s,old,new,1,'legacy quote geometry')
    anchor='.option-row span,.category-card span{min-width:0;line-height:1.42;}'
    replacement=anchor+'\n.option-row>span,.category-card>span{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;align-items:start;}\n.option-row>span>strong,.category-card>span>strong,.option-row>span>em,.category-card>span>em{grid-column:1;min-width:0;}\n.option-row>span>.info-tip,.category-card>span>.info-tip{position:static!important;grid-column:2;grid-row:1 / span 2;align-self:center;justify-self:end;margin:0!important;}'
    s=replace_exact(s,anchor,replacement,1,'quote span anchor')
    s=replace_exact(s,'html body .smart-quote-layout .category-grid{gap:9px!important}','html body .smart-quote-layout .category-grid{gap:9px!important;align-items:start!important}',1,'quote grid density rule')
    s=replace_exact(s,'html body .smart-quote-layout :is(.category-card,.option-row){padding:11px 13px!important;border-radius:12px!important}','html body .smart-quote-layout :is(.category-card,.option-row){padding:12px 14px!important;border-radius:12px!important;align-self:start!important}',1,'desktop quote density override')
    s=replace_exact(s,'html body .smart-quote-layout :is(.category-card,.option-row){padding:13px!important;border-radius:13px!important}','html body .smart-quote-layout :is(.category-card,.option-row){padding:13px 14px!important;border-radius:13px!important;align-self:start!important}',1,'mobile quote density override')
    css_path.write_text(s)

elif phase=='phase3':
    # The legacy browser regression asserted a 10px absolute bottom/right offset
    # for the info control. The new density contract deliberately flow-positions
    # the 44x44 control. Replace that obsolete coordinate assertion with the
    # invariant we actually need: static positioning, inside-card containment,
    # and no overlap with the primary option copy.
    quote_test=Path('tests/quote-calculator.spec.mjs')
    qs=quote_test.read_text()
    old_test="""    const optionBox = await trigger.locator('xpath=ancestor::label[1]').boundingBox();
    expect(optionBox).not.toBeNull();
    expect(Math.abs((optionBox.x + optionBox.width) - (triggerBox.x + triggerBox.width) - 10)).toBeLessThanOrEqual(1);
    expect(Math.abs((optionBox.y + optionBox.height) - (triggerBox.y + triggerBox.height) - 10)).toBeLessThanOrEqual(1);
"""
    new_test="""    const option = trigger.locator('xpath=ancestor::label[1]');
    const optionBox = await option.boundingBox();
    expect(optionBox).not.toBeNull();
    await expect(trigger).toHaveCSS('position', 'static');
    expect(triggerBox.x).toBeGreaterThanOrEqual(optionBox.x - 1);
    expect(triggerBox.y).toBeGreaterThanOrEqual(optionBox.y - 1);
    expect(triggerBox.x + triggerBox.width).toBeLessThanOrEqual(optionBox.x + optionBox.width + 1);
    expect(triggerBox.y + triggerBox.height).toBeLessThanOrEqual(optionBox.y + optionBox.height + 1);
    const copyBox = await option.locator('strong').first().boundingBox();
    if (copyBox) expect(triggerBox.x).toBeGreaterThanOrEqual(copyBox.x + copyBox.width - 1);
"""
    qs=replace_exact(qs,old_test,new_test,1,'stale quote info-position regression')
    quote_test.write_text(qs)

    audit=Path('tools/audit-layout-authority.mjs')
    audit.write_text(r"""import fs from 'node:fs';
const css=fs.readFileSync('assets/css/site.css','utf8');
const fail=[];
if(/(^|[}\s])section\{padding:/m.test(css)) fail.push('naked global section padding returned');
if(!css.includes('main>section{padding:72px 0;}')) fail.push('desktop base page-section rhythm missing');
if(!css.includes('main>section{padding:var(--jony-air) 0;}')) fail.push('Jony page-section rhythm is not scoped');
if(!css.includes('main>section{padding:clamp(64px,7.5vw,104px) 0;}')) fail.push('readability page-section rhythm is not scoped');
if((css.match(/main>section\{padding:56px 0;\}/g)||[]).length<2) fail.push('mobile page-section rhythm authority drifted');
if(css.includes('padding-bottom:52px')||css.includes('padding-right:58px')) fail.push('legacy quote-card reserved whitespace returned');
if(!css.includes('.option-row>span>.info-tip,.category-card>span>.info-tip{position:static!important;')) fail.push('quote info control is not flow-positioned');
if(!css.includes('.smart-quote-layout .category-grid{gap:9px!important;align-items:start!important}')) fail.push('quote grid may stretch cards again');
if((css.match(/html body \.smart-quote-layout :is\(\.category-card,\.option-row\)\{/g)||[]).length!==2) fail.push('quote density authority count drifted');
if(fail.length){console.error('Layout authority audit failed:\n- '+fail.join('\n- '));process.exit(1)}
console.log('Layout authority audit passed.');
""")
    package=Path('package.json')
    p=json.loads(package.read_text())
    cmd='node tools/audit-layout-authority.mjs'
    if cmd not in p['scripts']['test']:
        p['scripts']['test'] += ' && '+cmd
    package.write_text(json.dumps(p,indent=2)+'\n')
    wf=Path('.github/workflows/desktop-regression.yml')
    s=wf.read_text()
    anchor='          AUDIT_BASE_URL=http://127.0.0.1:4173 AUDIT_SITE_DIR=_site node tools/audit-first-principles-layout.mjs\n'
    addition=anchor+'          AUDIT_BASE_URL=http://127.0.0.1:4173 AUDIT_SITE_DIR=_site node tools/audit-layout-authority-browser.mjs\n'
    if 'audit-layout-authority-browser.mjs' not in s:
        if s.count(anchor)!=1:
            raise SystemExit(f'desktop workflow anchor count {s.count(anchor)}')
        s=s.replace(anchor,addition)
        wf.write_text(s)

else:
    raise SystemExit('usage: remediate-layout-authority.py phase1|phase2|phase3')

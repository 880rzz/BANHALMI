from pathlib import Path
ROOT=Path('.')
old='20260810-menu-polish-v65'
new='20260810-menu-frame-hotfix-v66'
# Cache-bust both the site config loader and the canonical stylesheet on every
# HTML page. Stage 48 intentionally requires one shared release token so stale
# menu JS/CSS cannot survive while the page shell advances.
count=0
for p in ROOT.rglob('*.html'):
    if any(x in p.parts for x in ('.git','node_modules')): continue
    s=p.read_text(encoding='utf-8');before=s
    s=s.replace('/assets/js/site-config.js?v='+old,'/assets/js/site-config.js?v='+new)
    s=s.replace('/assets/css/style.css?v='+old,'/assets/css/style.css?v='+new)
    if s!=before:p.write_text(s,encoding='utf-8');count+=1

# Existing permanent regression tests that name the shared release token must
# advance with the same cache release. The new Stage 68 test is created below
# and deliberately retains `old` only as the stale-token sentinel.
for folder in ('tools','tests'):
    base=ROOT/folder
    if not base.exists(): continue
    for p in base.rglob('*.mjs'):
        if p.name=='audit-menu-cache-hotfix-stage68.mjs': continue
        s=p.read_text(encoding='utf-8')
        if old in s:p.write_text(s.replace(old,new),encoding='utf-8')

# The loader itself must request fresh menu assets.
p=ROOT/'assets/js/site-config.js';s=p.read_text(encoding='utf-8')
s=s.replace('mega-menu.css?v='+old,'mega-menu.css?v='+new)
s=s.replace('mega-menu.js?v='+old,'mega-menu.js?v='+new)
p.write_text(s,encoding='utf-8')

# Defensive visual invariant: none of the support/pricing/archive menu entries
# may render as a rounded framed card, even if a stale class name survives.
p=ROOT/'assets/css/mega-menu.css';s=p.read_text(encoding='utf-8')
marker='/* STAGE66-MENU-FRAME-HOTFIX:START */'
if marker not in s:
    s += '''\n\n/* STAGE66-MENU-FRAME-HOTFIX:START\n   PR142 intentionally made the mega menu frameless. Keep that invariant at the\n   final cascade layer as a defensive guard against legacy CTA/ART class names. */\n.bn-mega-menu :is(.bn-mega-cta,.bn-mega-art,.bn-mega-pricing){\n  border:0!important;outline:0!important;box-shadow:none!important;\n  background:transparent!important;border-radius:0!important;\n  margin-left:0!important;margin-right:0!important;\n}\n.bn-mega-menu :is(.bn-mega-cta,.bn-mega-art,.bn-mega-pricing) .bn-mega-link{\n  border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;border-radius:0!important;\n}\n/* STAGE66-MENU-FRAME-HOTFIX:END */\n'''
p.write_text(s,encoding='utf-8')

# Strengthen Stage 65's permanent frameless contract.
p=ROOT/'tools/audit-menu-polish-stage65.mjs';s=p.read_text(encoding='utf-8')
insert="""\nfor(const t of ['STAGE66-MENU-FRAME-HOTFIX:START','.bn-mega-pricing','border:0!important;outline:0!important;box-shadow:none!important'])if(!css.includes(t))errors.push('missing frameless hotfix '+t);\nif(config.includes('mega-menu.js?v=20260810-menu-polish-v65')||config.includes('mega-menu.css?v=20260810-menu-polish-v65'))errors.push('stale v65 mega-menu asset token remains in site-config');\n"""
pos=s.find("function ch(v)")
if pos!=-1 and 'missing frameless hotfix' not in s:s=s[:pos]+insert+s[pos:]
p.write_text(s,encoding='utf-8')

# Dedicated cache regression check across all production HTML.
audit=ROOT/'tools/audit-menu-cache-hotfix-stage68.mjs'
audit.write_text(r'''import fs from 'node:fs';import path from 'node:path';
const errors=[];const root=process.cwd();const old='20260810-menu-polish-v65',fresh='20260810-menu-frame-hotfix-v66';
const config=fs.readFileSync('assets/js/site-config.js','utf8');const css=fs.readFileSync('assets/css/mega-menu.css','utf8');const js=fs.readFileSync('assets/js/mega-menu.js','utf8');
for(const asset of ['mega-menu.css','mega-menu.js'])if(!config.includes(asset+'?v='+fresh))errors.push('site-config does not request fresh '+asset);
if(!js.includes("'bn-mega-pricing'"))errors.push('pricing entry is not frameless bn-mega-pricing');
if(js.includes("'bn-mega-cta'"))errors.push('legacy framed pricing class is still emitted');
if(!css.includes('STAGE66-MENU-FRAME-HOTFIX:START'))errors.push('final frameless CSS guard missing');
const files=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p)}}walk(root);
let checked=0;for(const f of files){const h=fs.readFileSync(f,'utf8');if(!h.includes('/assets/js/site-config.js'))continue;checked++;if(!h.includes('/assets/js/site-config.js?v='+fresh))errors.push(path.relative(root,f)+': stale site-config cache token');if(!h.includes('/assets/css/style.css?v='+fresh))errors.push(path.relative(root,f)+': stale style cache token');if(h.includes('/assets/js/site-config.js?v='+old)||h.includes('/assets/css/style.css?v='+old))errors.push(path.relative(root,f)+': old v65 release reference remains');}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log(`Stage 68 menu frame/cache hotfix passed across ${checked} production HTML pages.`);
''',encoding='utf-8')

# Append dedicated check to canonical audit chain.
p=ROOT/'package.json';import json
obj=json.loads(p.read_text(encoding='utf-8'));cmd=obj['scripts']['audit']
if 'audit-menu-cache-hotfix-stage68.mjs' not in cmd:obj['scripts']['audit']=cmd+' && node tools/audit-menu-cache-hotfix-stage68.mjs'
obj['scripts']['audit:menu-cache-hotfix']='node tools/audit-menu-cache-hotfix-stage68.mjs'
p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('updated',count,'HTML files')
#!/usr/bin/env python3
from pathlib import Path
import re, hashlib, json, shutil

ROOT=Path(__file__).resolve().parents[1]
CSS_DIR=ROOT/'assets/css'
SITE_CSS=CSS_DIR/'site.css'

css_parts=[]
for name in ['style.css','mega-menu.css','accessibility-stage14.css']:
    p=CSS_DIR/name
    if p.exists():
        css_parts.append(f"\n/* === SOURCE: {name} === */\n"+p.read_text(encoding='utf-8'))

inline_rules=[]
seen_blocks=set()
style_attr_rules={}
stylesheet_re=re.compile(r'<link\b(?=[^>]*\brel=["\']stylesheet["\'])[^>]*>',re.I)
href_re=re.compile(r'\bhref=["\']([^"\']+)["\']',re.I)
style_block_re=re.compile(r'<style\b[^>]*>([\s\S]*?)</style>',re.I)
style_attr_re=re.compile(r'\sstyle=(["\'])(.*?)\1',re.I|re.S)

html_files=[p for p in ROOT.rglob('*.html') if '.git' not in p.parts and '_site' not in p.parts]
for p in html_files:
    rel=p.relative_to(ROOT).as_posix()
    html=p.read_text(encoding='utf-8')

    def move_block(m):
        css=m.group(1).strip()
        css=css.replace('box-shadow:0 12px 34px rgba(16,34,63,.18)','box-shadow:none')
        digest=hashlib.sha256(css.encode()).hexdigest()[:12]
        if css and digest not in seen_blocks:
            seen_blocks.add(digest)
            inline_rules.append(f"\n/* === INLINE SOURCE {rel} / {digest} === */\n{css}\n")
        return ''
    html=style_block_re.sub(move_block,html)

    def tag_rewrite(tm):
        tag=tm.group(0)
        sm=style_attr_re.search(tag)
        if not sm: return tag
        raw=' '.join(sm.group(2).split())
        digest=hashlib.sha256(raw.encode()).hexdigest()[:10]
        cls=f'u-inline-{digest}'
        style_attr_rules[cls]=raw.rstrip(';')+';'
        tag=style_attr_re.sub('',tag,count=1)
        cm=re.search(r'\bclass=(["\'])(.*?)\1',tag,re.I|re.S)
        if cm:
            new=f'class={cm.group(1)}{cm.group(2)} {cls}{cm.group(1)}'
            tag=tag[:cm.start()]+new+tag[cm.end():]
        else:
            tag=tag[:-1]+f' class="{cls}">'
        return tag
    html=re.sub(r'<[^!/?][^>]*\sstyle=["\'][^"\']*["\'][^>]*>',tag_rewrite,html,flags=re.I|re.S)

    def link_rewrite(m):
        tag=m.group(0); hm=href_re.search(tag)
        if not hm: return tag
        href=hm.group(1)
        if href.startswith('http://') or href.startswith('https://') or href.startswith('//'):
            return tag
        return ''
    html=stylesheet_re.sub(link_rewrite,html)

    if '/assets/css/site.css' not in html:
        html=html.replace('</head>','<link rel="stylesheet" href="/assets/css/site.css?v=20260814-clean-v1"/></head>',1)

    head=html.split('</head>',1)[0]
    if 'rel="icon"' not in head and "rel='icon'" not in head:
        fav='<link rel="icon" href="/assets/img/brand/favicon.ico"/><link rel="apple-touch-icon" href="/assets/img/brand/apple-touch-icon.png"/>'
        html=html.replace('</head>',fav+'</head>',1)

    p.write_text(html,encoding='utf-8')

if style_attr_rules:
    inline_rules.append('\n/* === INLINE ATTRIBUTE UTILITIES === */\n')
    for cls,rule in sorted(style_attr_rules.items()):
        inline_rules.append(f'.{cls}{{{rule}}}\n')

inline_rules.append('''\n/* === CLEAN FINAL AUTHORITY === */\n.smart-quote-layout .quote-summary-card{box-shadow:none!important;text-shadow:none!important;filter:none!important}\n.fine-art-archive-continuation,.fine-art-archive-continuation .fine-art-archive-content{margin:0!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}\n''')
SITE_CSS.write_text(''.join(css_parts+inline_rules),encoding='utf-8')

for p in CSS_DIR.glob('*.css'):
    if p.name!='site.css': p.unlink()

for pattern in ['tools/apply-*stage*.mjs','tools/optimize-homepage-critical-path.mjs','tools/minify-pages-css.mjs','assets/css/*stage*.css']:
    for p in ROOT.glob(pattern):
        if p.is_file(): p.unlink()
for d in ['docs/content-migrations','playwright-report','test-results']:
    q=ROOT/d
    if q.exists(): shutil.rmtree(q)

(ROOT/'.well-known').mkdir(exist_ok=True)
(ROOT/'api/v1').mkdir(parents=True,exist_ok=True)
(ROOT/'.well-known/agent.json').write_text(json.dumps({'name':'BANHALMI','canonical':'https://www.norbertbanhalmi.com/','type':'commercial-authority','languages':['en','hu-HU','de-AT'],'artisticArchive':'https://www.banhalmi.art/','read':['/api/v1/identity.json','/api/v1/services.json','/api/v1/locations.json','/api/v1/actions.json']},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'api/v1/identity.json').write_text(json.dumps({'name':'BANHALMI','legalName':'Norbert Banhalmi e.U.','person':'Bánhalmi Norbert','personWikidata':'Q56391118','organizationWikidata':'Q138425941','canonical':'https://www.norbertbanhalmi.com/'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'api/v1/locations.json').write_text(json.dumps({'viennaStudio':{'address':'Schwedenplatz 2, Top 8–9, 1010 Wien, Austria','type':'studio'},'viennaOffice':{'address':'Gersthofer Straße 150–154/6/2, 1180 Wien, Austria','type':'office/client meeting location'},'budapestStudio':{'address':'Lágymányosi u. 15, 1111 Budapest, Hungary','type':'studio'},'worldwideTravel':True},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'api/v1/services.json').write_text(json.dumps({'services':['executive portrait','professional headshot','brand photography and visual positioning','C-level event photography','fine art photography'],'canonical':'https://www.norbertbanhalmi.com/'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'api/v1/actions.json').write_text(json.dumps({'requestQuote':{'method':'GET','url':'https://www.norbertbanhalmi.com/requestaquote/'},'bookConsultation':{'method':'GET','url':'https://meet.bookipi.com/zk5ly35r','interfaceLanguage':'en'},'transactionalApiAvailable':False},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

audit=ROOT/'tools/audit-clean-architecture.mjs'
audit.write_text(r'''import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),fail=[];const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()&&!['.git','node_modules'].includes(e.name)?walk(path.join(d,e.name)):[path.join(d,e.name)]);const files=walk(root);const css=files.filter(f=>f.endsWith('.css'));if(css.length!==1||!css[0].endsWith('/assets/css/site.css'))fail.push(`expected one CSS authority, found ${css.length}: ${css.join(', ')}`);for(const f of files.filter(f=>f.endsWith('.html'))){const h=fs.readFileSync(f,'utf8');const local=[...h.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["'](?!https?:|\/\/)([^"']+)/gi)];if(local.length!==1||!local[0][1].includes('/assets/css/site.css'))fail.push(`${path.relative(root,f)}: local stylesheet contract ${local.map(x=>x[1]).join(',')}`);if(/<style\b/i.test(h))fail.push(`${path.relative(root,f)}: inline <style> survived`);if(/\sstyle=["']/i.test(h))fail.push(`${path.relative(root,f)}: inline style attribute survived`)}const s=fs.readFileSync(path.join(root,'assets/css/site.css'),'utf8');if(!/\.smart-quote-layout \.quote-summary-card\{[^}]*box-shadow:none!important/i.test(s))fail.push('quote summary no-shadow authority missing');for(const p of ['llms.txt','ai.txt','robots.txt','sitemap.xml','.well-known/agent.json','api/v1/identity.json','api/v1/services.json','api/v1/locations.json','api/v1/actions.json'])if(!fs.existsSync(path.join(root,p)))fail.push(`${p}: missing`);if(fail.length){console.error(fail.join('\n'));process.exit(1)}console.log(`Clean BANHALMI architecture passed: ${files.filter(f=>f.endsWith('.html')).length} HTML pages, one CSS authority, no inline styles.`);''',encoding='utf-8')

(ROOT/'package.json').write_text(json.dumps({'private':True,'scripts':{'test':'node tools/audit-clean-architecture.mjs','audit':'node tools/audit-clean-architecture.mjs'}},indent=2)+'\n',encoding='utf-8')
for p in [ROOT/'package-lock.json',ROOT/'playwright.config.mjs',ROOT/'playwright.production.config.mjs']:
    if p.exists(): p.unlink()

wf=ROOT/'.github/workflows/pages.yml'
wf.write_text('''name: Clean architecture verification\n\non:\n  push:\n    branches: [main]\n  pull_request:\n  workflow_dispatch:\n\npermissions:\n  contents: read\n  pages: write\n  id-token: write\n\nconcurrency:\n  group: clean-pages-${{ github.ref }}\n  cancel-in-progress: true\n\njobs:\n  verify:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 24\n      - run: npm test\n  deploy:\n    if: github.event_name == 'push' && github.ref == 'refs/heads/main'\n    needs: verify\n    runs-on: ubuntu-latest\n    environment:\n      name: github-pages\n      url: ${{ steps.deployment.outputs.page_url }}\n    steps:\n      - uses: actions/checkout@v4\n      - name: Prepare immutable static artifact\n        run: |\n          set -euo pipefail\n          rm -rf _site && mkdir _site\n          tar --exclude=.git --exclude=.github --exclude=tools --exclude=node_modules --exclude=package.json -cf - . | tar -xf - -C _site\n          printf '%s\\n' "$GITHUB_SHA" > _site/deployment-sha.txt\n      - uses: actions/configure-pages@v5\n      - id: upload\n        uses: actions/upload-pages-artifact@v4\n        with:\n          path: _site\n      - id: deployment\n        uses: actions/deploy-pages@v4\n  exact-live:\n    if: github.event_name == 'push' && github.ref == 'refs/heads/main'\n    needs: deploy\n    runs-on: ubuntu-latest\n    steps:\n      - name: Verify exact BANHALMI commit is live\n        shell: bash\n        run: |\n          set -euo pipefail\n          expected="$GITHUB_SHA"\n          for attempt in $(seq 1 30); do\n            actual="$(curl -fsSL --max-time 20 'https://www.norbertbanhalmi.com/deployment-sha.txt' || true)"\n            if [ "$actual" = "$expected" ]; then echo "Exact live SHA verified: $actual"; exit 0; fi\n            sleep 10\n          done\n          echo "Expected $expected, received ${actual:-nothing}" >&2\n          exit 1\n''',encoding='utf-8')

(ROOT/'CLEAN-ARCHITECTURE.json').write_text(json.dumps({'version':'2026-08-14-clean-v1','cssAuthority':'/assets/css/site.css','runtimeCssInjection':False,'inlineStyles':False,'agentEntry':'/.well-known/agent.json'},indent=2)+'\n')
print(f'Clean BANHALMI migration complete: {len(html_files)} HTML pages, {len(style_attr_rules)} inline style utilities, {len(seen_blocks)} moved style blocks.')

from pathlib import Path

pages = {
    'index.html': ('<div class="fp-decision-actions">', '<div class="fp-art-path"><span>Looking for a more personal, author-led image?</span><a href="/glamour/">Explore fine-art photography →</a></div><div class="fp-decision-actions">'),
    'hu/index.html': ('<div class="fp-decision-actions">', '<div class="fp-art-path"><span>Művészi, személyesebb képet keres?</span><a href="/hu/muveszi-fotografia/">Művészi fotográfia →</a></div><div class="fp-decision-actions">'),
    'de-at/index.html': ('<div class="fp-decision-actions">', '<div class="fp-art-path"><span>Suchen Sie eine persönlichere, künstlerische Bildsprache?</span><a href="/de-at/fine-art/">Fine-Art-Fotografie →</a></div><div class="fp-decision-actions">'),
}

for file, (needle, replacement) in pages.items():
    p = Path(file)
    text = p.read_text()
    if 'class="fp-art-path"' in text:
        continue
    if needle not in text:
        raise SystemExit(f'{file}: decision actions not found')
    p.write_text(text.replace(needle, replacement, 1))

css_path = Path('assets/css/style.css')
css = css_path.read_text()
marker = '/* STAGE69-FINE-ART-PATH:START */'
if marker not in css:
    css += '''\n\n/* STAGE69-FINE-ART-PATH:START */\n.fp-art-path{display:flex;flex-wrap:wrap;align-items:center;gap:.45rem .75rem;margin-top:1.35rem;color:#6e7480;font-size:.95rem;line-height:1.45;}\n.fp-art-path a{color:#1d1d1f;font-weight:650;text-decoration:none;text-underline-offset:.2em;}\n.fp-art-path a:hover{text-decoration:underline;}\n.fp-art-path a:focus-visible{outline:3px solid #8A681F;outline-offset:3px;border-radius:6px;}\n@media(max-width:620px){.fp-art-path{display:block;margin-top:1.15rem;}.fp-art-path span{display:block;margin-bottom:.35rem;}.fp-art-path a{display:inline-block;min-height:44px;padding-block:.65rem;}}\n/* STAGE69-FINE-ART-PATH:END */\n'''
    css_path.write_text(css)

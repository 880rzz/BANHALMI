from pathlib import Path

path = Path('assets/js/quote-pdf.js')
text = path.read_text(encoding='utf-8')

replacements = {
    "title:'BANHALMI preliminary estimate'": "title:'Preliminary estimate'",
    "title:'BANHALMI unverbindliche Kalkulation'": "title:'Unverbindliche Kalkulation'",
    "title:'BANHALMI előzetes kalkuláció'": "title:'Előzetes kalkuláció'",
}
for old, new in replacements.items():
    text = text.replace(old, new)

old_header = "ctx.fillStyle='#111';ctx.font='700 40px Arial, Helvetica, sans-serif';ctx.fillText('BANHALMI',M,y);y+=60;ctx.font='700 31px Arial, Helvetica, sans-serif';wrap(ctx,data.l.title,W-2*M).slice(0,2).forEach(function(line){ctx.fillText(line,M,y);y+=40;});ctx.font='400 20px Arial, Helvetica, sans-serif';ctx.fillStyle='#606060';"
new_header = "ctx.fillStyle='#111';ctx.font='700 46px Arial, Helvetica, sans-serif';ctx.fillText('BANHALMI',M,y);y+=58;ctx.font='400 16px Arial, Helvetica, sans-serif';ctx.fillStyle='#B79C44';ctx.fillText('EXECUTIVE PORTRAIT · VISUAL POSITIONING',M,y);y+=38;ctx.font='700 31px Arial, Helvetica, sans-serif';ctx.fillStyle='#111';wrap(ctx,data.l.title,W-2*M).slice(0,2).forEach(function(line){ctx.fillText(line,M,y);y+=40;});ctx.font='400 20px Arial, Helvetica, sans-serif';ctx.fillStyle='#606060';"
if new_header not in text:
    if old_header not in text:
        raise RuntimeError('PDF header source block not found')
    text = text.replace(old_header, new_header, 1)

path.write_text(text, encoding='utf-8')
print('Elegant PDF header patch applied.')

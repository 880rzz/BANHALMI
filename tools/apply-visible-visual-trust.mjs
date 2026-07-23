import fs from 'node:fs';

const pages = {
  'index.html': {
    required: [
      ['Two roles. One visual language.', 'Visual Trust Strategy'],
      ['A strong portrait speaks before the meeting begins.', 'We build visual trust before the meeting begins.']
    ]
  },
  'hu/index.html': {
    required: [
      ['Két szerep. Egy vizuális nyelv.', 'Vizuális bizalomstratégia'],
      ['A jó portré már az első találkozás előtt beszél.', 'Vizuális bizalmat építünk már az első találkozás előtt.']
    ]
  },
  'de-at/index.html': {
    required: [
      ['Zwei Rollen. Eine visuelle Sprache.', 'Strategie für visuelles Vertrauen'],
      ['Ein starkes Porträt spricht schon vor der ersten Begegnung.', 'Wir schaffen visuelles Vertrauen vor der ersten Begegnung.']
    ],
    optional: [
      ['diplomatische geschäftliche und diplomatische Situationen', 'diplomatische und geschäftliche Situationen']
    ]
  }
};

for (const [file, config] of Object.entries(pages)) {
  let html = fs.readFileSync(file, 'utf8');
  for (const [from, to] of [...config.required, ...(config.optional || [])]) html = html.replaceAll(from, to);
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';
  const visibleBody = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  for (const [, to] of config.required) {
    if (!visibleBody.includes(to)) throw new Error(`${file}: required visible target text missing after migration: ${to}`);
  }
  fs.writeFileSync(file, html);
}

console.log('Visible Visual Trust positioning and German copy correction applied.');

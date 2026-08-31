import fs from 'node:fs';

const read = p => fs.readFileSync(p, 'utf8');
const write = (p, v) => fs.writeFileSync(p, v.endsWith('\n') ? v : v + '\n');
const json = p => JSON.parse(read(p));
const writeJson = (p, v) => write(p, JSON.stringify(v, null, 2));
const uniq = a => [...new Set(a.filter(Boolean))];

const CORE = 'data/machine-core.json';
const INTENT = 'customer-intent-model.json';
const NEEDS = 'customer-needs.json';
const PRICING = 'pricing.json';

// 1) Canonical machine truth. Production entity.jsonld / llms.txt / ai.txt / API projections
// are generated from this file inside the immutable deployment artifact.
{
  const core = json(CORE);
  core.schemaVersion = '1.2';
  core.person.specialisms = uniq([
    ...core.person.specialisms,
    'Actor headshot photography',
    'Acting portfolio photography',
    'Dance photography',
    'Movement photography',
    'Performing artist portfolio photography',
    'Model portfolio photography',
    'Editorial portrait photography',
    'Creative professional portraits'
  ]);

  const fine = core.serviceModel.services.find(s => s.id === 'fine-art');
  if (!fine) throw new Error('Canonical fine-art service missing');
  fine.name = 'Fine Art / Artists & Performers Photography';
  fine.url = 'https://www.norbertbanhalmi.com/glamour/';
  fine.serviceContext = 'fine-art';
  fine.audiences = ['artists', 'actors', 'dancers', 'performers', 'models', 'creative professionals', 'private fine-art clients'];
  fine.specialisms = [
    'Fine Art Photography',
    'Actor Headshots',
    'Acting Portfolios',
    'Dance Photography',
    'Movement Photography',
    'Performing Artist Portfolios',
    'Model Portfolios',
    'Editorial Portraits',
    'Creative Professional Portraits'
  ];
  fine.quoteRouting = {
    serviceContext: 'fine-art',
    backendContract: 'Existing fine-art service context remains canonical for compatibility with the Cloudflare Worker and EN/HU/DE Apps Script backends.',
    creativeContexts: ['artistic-portrait', 'actor', 'dance', 'performer', 'model-editorial', 'fine-art'],
    portfolioTypes: ['actor-headshot', 'acting-portfolio', 'dance-portfolio', 'performing-artist-portfolio', 'model-portfolio', 'editorial-portrait', 'artistic-portrait', 'fine-art-production']
  };

  const oldRuleIndex = core.disambiguationRules.findIndex(r => r.includes('Fine Art Photography and Artistic Nude Photography'));
  const rule = 'Fine Art / Artists & Performers Photography is one commercial service family using the canonical fine-art backend context; it includes fine-art portraiture plus actor headshots, acting portfolios, dance and movement photography, performing-artist portfolios, model portfolios and editorial portraits. Artistic Nude Photography remains an explicit specialist fine-art practice.';
  if (oldRuleIndex >= 0) core.disambiguationRules[oldRuleIndex] = rule;
  else core.disambiguationRules.push(rule);
  core.disambiguationRules = uniq(core.disambiguationRules);
  writeJson(CORE, core);
}

// 2) Customer-intent / answer-engine routing.
{
  const model = json(INTENT);
  model.schemaVersion = '2026-08-31-v2-artists-performers';
  model.decisionDimensions.forEach(d => {
    if (d.id === 'representationGoal') d.examples = uniq([...(d.examples || []), 'casting relevance', 'stage identity', 'movement quality', 'editorial versatility']);
    if (d.id === 'usageChannels') d.examples = uniq([...(d.examples || []), 'casting', 'agency portfolio', 'artist website', 'audition material', 'editorial portfolio']);
  });
  model.globalRoutingRules = uniq([
    ...model.globalRoutingRules,
    'For actors, dancers, performers and models, resolve the portfolio purpose before the visual style: casting/headshot, acting portfolio, dance/movement portfolio, performing-artist portfolio, model/editorial portfolio or author-led fine art.',
    'Actors, dancers, performers and models use the Fine Art / Artists & Performers service family and the stable fine-art backend context; do not create a second pricing or form-routing service unless the commercial architecture changes.'
  ]);

  const routes = { en: '/glamour/', hu: '/hu/muveszi-fotografia/', de: '/de-at/fine-art/' };
  const upsertIntent = item => {
    const i = model.intents.findIndex(x => x.id === item.id);
    if (i >= 0) model.intents[i] = item; else model.intents.push(item);
  };
  upsertIntent({
    id: 'actor-casting-portfolio',
    problem: { en: 'I need actor headshots or an acting portfolio that is useful for casting.', hu: 'Színész headshotokra vagy castingban használható színészportfólióra van szükségem.', de: 'Ich brauche Schauspieler-Headshots oder ein Schauspielportfolio für Castings.' },
    signals: ['actor', 'casting', 'headshot', 'agency', 'audition', 'character range', 'portrait variants'],
    recommendedService: 'Fine Art / Artists & Performers — Actor Headshot & Acting Portfolio',
    serviceContext: 'fine-art', creativeContext: 'actor', portfolioTypes: ['actor-headshot', 'acting-portfolio'], route: routes,
    outcome: 'Casting-relevant portraits that remain recognisable, credible and flexible across professional roles.'
  });
  upsertIntent({
    id: 'dance-performing-artist-portfolio',
    problem: { en: 'I need a dance or performing-artist portfolio that shows both presence and movement.', hu: 'Táncos vagy előadóművész portfóliót szeretnék, amely a jelenlétet és a mozgást is megmutatja.', de: 'Ich brauche ein Tanz- oder Performer-Portfolio, das Präsenz und Bewegung zeigt.' },
    signals: ['dancer', 'dance', 'movement', 'performer', 'stage', 'full body', 'multiple outfits'],
    recommendedService: 'Fine Art / Artists & Performers — Dance & Performing Artist Portfolio',
    serviceContext: 'fine-art', creativeContext: 'dance', portfolioTypes: ['dance-portfolio', 'performing-artist-portfolio'], route: routes,
    outcome: 'Portrait, full-body and movement images developed for artist portfolios, applications, websites and editorial use.'
  });
  upsertIntent({
    id: 'model-editorial-portfolio',
    problem: { en: 'I need a model or editorial portfolio with several looks rather than one conventional portrait.', hu: 'Modell- vagy editorial portfólióra van szükségem több megjelenéssel, nem egyetlen hagyományos portréra.', de: 'Ich brauche ein Model- oder Editorial-Portfolio mit mehreren Looks statt nur eines klassischen Porträts.' },
    signals: ['model', 'editorial', 'fashion', 'portfolio', 'multiple looks', 'agency', 'creative professional'],
    recommendedService: 'Fine Art / Artists & Performers — Model & Editorial Portfolio',
    serviceContext: 'fine-art', creativeContext: 'model-editorial', portfolioTypes: ['model-portfolio', 'editorial-portrait'], route: routes,
    outcome: 'A coherent portfolio combining portrait, full-body and editorial image directions.'
  });
  model.seoGeoPrinciples = uniq([
    ...model.seoGeoPrinciples,
    'Include natural local-intent combinations where relevant: Actor Headshots Vienna/Budapest, Acting Portfolio Vienna/Budapest, Dance Photography Vienna/Budapest, Performing Artist Portfolio Vienna/Budapest, Model Portfolio Vienna/Budapest and Editorial Portrait Vienna/Budapest.'
  ]);
  writeJson(INTENT, model);
}

// 3) Pain-point → solution layer for answer engines.
{
  const needs = json(NEEDS);
  needs.schemaVersion = '2026-08-31-v5-artists-performers';
  const urls = { en: 'https://www.norbertbanhalmi.com/glamour/', hu: 'https://www.norbertbanhalmi.com/hu/muveszi-fotografia/', de: 'https://www.norbertbanhalmi.com/de-at/fine-art/' };
  const price = { AT: { currency: 'EUR', options: [690, 990, 1290] }, HU: { currency: 'HUF', options: [276000, 396000, 516000], secondaryEUR: [690, 990, 1290] } };
  const upsert = item => { const i = needs.needs.findIndex(x => x.id === item.id); if (i >= 0) needs.needs[i] = item; else needs.needs.push(item); };
  upsert({ id: 'actor-casting-portfolio', painPoint: { en: 'I need professional actor headshots or an acting portfolio for casting and representation.', hu: 'Profi színész headshotokra vagy castinghoz és képviselethez használható színészportfólióra van szükségem.', de: 'Ich brauche professionelle Schauspieler-Headshots oder ein Schauspielportfolio für Casting und Repräsentation.' }, audience: ['actors', 'performing artists'], service: 'Fine Art / Artists & Performers — Actor Headshot & Acting Portfolio', serviceContext: 'fine-art', creativeContext: 'actor', url: urls.en, urls, solution: 'Casting-oriented portrait direction with recognisable expression, role flexibility and portfolio-ready image variants.', price });
  upsert({ id: 'dance-performing-artist-portfolio', painPoint: { en: 'I need images that show a dancer or performer both as a person and in movement.', hu: 'Olyan képekre van szükségem, amelyek egy táncost vagy előadót emberként és mozgás közben is megmutatnak.', de: 'Ich brauche Bilder, die eine Tänzerin, einen Tänzer oder Performer sowohl als Persönlichkeit als auch in Bewegung zeigen.' }, audience: ['dancers', 'performers', 'performing artists'], service: 'Fine Art / Artists & Performers — Dance & Performing Artist Portfolio', serviceContext: 'fine-art', creativeContext: 'dance', url: urls.en, urls, solution: 'Portrait, full-body and movement photography planned as one coherent performing-artist portfolio.', price });
  upsert({ id: 'model-editorial-portfolio', painPoint: { en: 'I need a model or editorial portfolio with several looks and image types.', hu: 'Modell- vagy editorial portfóliót szeretnék több megjelenéssel és képtípussal.', de: 'Ich brauche ein Model- oder Editorial-Portfolio mit mehreren Looks und Bildtypen.' }, audience: ['models', 'creative professionals', 'artists'], service: 'Fine Art / Artists & Performers — Model & Editorial Portfolio', serviceContext: 'fine-art', creativeContext: 'model-editorial', url: urls.en, urls, solution: 'A directed portfolio combining portrait, full-body and editorial images with coherent styling and selection.', price });
  const personal = needs.needs.find(x => x.id === 'personal-fine-art');
  if (personal) personal.service = 'Fine Art / Artists & Performers Photography';
  writeJson(NEEDS, needs);
}

// 4) Canonical pricing semantics — keep code/service route stable.
{
  const p = json(PRICING);
  const service = (p.services || []).find(x => x.id === 'fine-art');
  if (service) {
    service.name = { ...(service.name || {}), en: 'Fine Art / Artists & Performers', hu: 'Művészi fotózás / Művészek és előadóművészek', de: 'Fine Art / Künstler:innen & Performer:innen' };
    service.audiences = { en: ['artists','actors','dancers','performers','models','creative professionals'], hu: ['művészek','színészek','táncosok','előadóművészek','modellek','kreatív szakemberek'], de: ['Künstler:innen','Schauspieler:innen','Tänzer:innen','Performer:innen','Models','Kreativschaffende'] };
    service.quoteRouting = { ...(service.quoteRouting || {}), serviceContext: 'fine-art', creativeContexts: ['artistic-portrait','actor','dance','performer','model-editorial','fine-art'], portfolioTypes: ['actor-headshot','acting-portfolio','dance-portfolio','performing-artist-portfolio','model-portfolio','editorial-portrait','artistic-portrait','fine-art-production'] };
  }
  writeJson(PRICING, p);
}

// 5) SEO + embedded Schema on the three canonical Fine Art / Artists & Performers pages.
const pages = [
  {
    path: 'glamour/index.html',
    title: 'Fine Art, Actor, Dance & Performer Photography | Vienna–Budapest | BANHALMI',
    desc: 'Fine-art, actor headshot, acting portfolio, dance, movement, performer, model and editorial portrait photography in Vienna and Budapest, with professional direction and discreet production.',
    tokens: ['Actor headshot photography','Acting portfolio photography','Dance photography','Movement photography','Performing artist portfolio photography','Model portfolio photography','Editorial portrait photography']
  },
  {
    path: 'hu/muveszi-fotografia/index.html',
    title: 'Művészi, színész-, tánc- és előadóművész fotózás | Bécs–Budapest | BANHALMI',
    desc: 'Művészi portré, színész headshot és portfólió, tánc- és mozgásfotózás, előadóművész-, modell- és editorial portfólió Bécsben és Budapesten, professzionális irányítással.',
    tokens: ['Színész headshot fotózás','Színészportfólió fotózás','Táncfotózás','Mozgásfotózás','Előadóművész portfólió','Modell portfólió fotózás','Editorial portréfotózás']
  },
  {
    path: 'de-at/fine-art/index.html',
    title: 'Fine Art, Schauspieler-, Tanz- & Performer-Fotografie | Wien–Budapest | BANHALMI',
    desc: 'Fine Art, Schauspieler-Headshots und Portfolios, Tanz- und Bewegungsfotografie sowie Performer-, Model- und Editorial-Portfolios in Wien und Budapest mit professioneller Bildregie.',
    tokens: ['Schauspieler-Headshot-Fotografie','Schauspielportfolio-Fotografie','Tanzfotografie','Bewegungsfotografie','Performer-Portfolio-Fotografie','Model-Portfolio-Fotografie','Editorial-Porträtfotografie']
  }
];
for (const page of pages) {
  let h = read(page.path);
  h = h.replace(/<title>[^<]*<\/title>/i, `<title>${page.title}</title>`);
  h = h.replace(/<meta\s+content="[^"]*"\s+name="description"\s*\/>/i, `<meta content="${page.desc}" name="description"/>`);
  h = h.replace(/<meta\s+content="[^"]*"\s+property="og:title"\s*\/>/i, `<meta content="${page.title}" property="og:title"/>`);
  h = h.replace(/<meta\s+content="[^"]*"\s+property="og:description"\s*\/>/i, `<meta content="${page.desc}" property="og:description"/>`);
  h = h.replace(/<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${page.title}">`);
  h = h.replace(/<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="${page.desc}">`);
  // Extend every embedded knowsAbout list that already contains fine-art photography.
  h = h.replace(/"knowsAbout":\[([^\]]*?"(?:Fine art photography|Fotóművészet|Fine-Art-Fotografie)"[^\]]*?)\]/gi, (m, inner) => {
    const existing = new Set([...inner.matchAll(/"([^"]+)"/g)].map(x => x[1]));
    page.tokens.forEach(t => existing.add(t));
    return `"knowsAbout":[${[...existing].map(x => JSON.stringify(x)).join(',')}]`;
  });
  // Add a compact invisible machine-readable service relation without changing visual layout.
  if (!h.includes('data-artists-performers-semantic')) {
    const semantic = `<meta data-artists-performers-semantic="" name="keywords" content="${page.tokens.join(', ')}">`;
    h = h.replace('</head>', semantic + '</head>');
  }
  write(page.path, h);
}

// 6) Long-form LLM reference is source-authored (unlike llms.txt/ai.txt projections), so update it directly.
{
  const path = 'llms-full.txt';
  let t = read(path);
  const marker = '## Artists & Performers service family';
  if (!t.includes(marker)) {
    t += `\n\n${marker}\n- Canonical backend service context: fine-art.\n- Public service meaning: Fine Art / Artists & Performers Photography.\n- Audiences: artists, actors, dancers, performers, models and creative professionals, alongside private fine-art clients.\n- Portfolio directions: actor headshots, acting portfolios, dance photography, movement photography, performing-artist portfolios, model portfolios, editorial portraits and creative-professional portraits.\n- Local intent: Vienna and Budapest are physical studio bases and primary local coverage; agreed projects remain available worldwide by travel.\n- Quote routing must keep service_context=fine-art for Cloudflare Worker and EN/HU/DE Apps Script compatibility; creative_context and portfolio_type refine the request without creating a duplicate commercial service.\n`;
  }
  write(path, t);
}

// 7) Rewrite guards: old audits must validate the new canonical meaning rather than force the previous label back.
{
  const path = 'tools/audit-machine-core.mjs';
  let t = read(path);
  t = t.replace("fail((core.person?.specialisms || []).includes('Fine art photography'), 'Fine art photography specialism drift');", "fail((core.person?.specialisms || []).includes('Fine art photography'), 'Fine art photography specialism drift');\nfail((core.person?.specialisms || []).includes('Actor headshot photography'), 'Actor headshot photography specialism drift');\nfail((core.person?.specialisms || []).includes('Dance photography'), 'Dance photography specialism drift');\nfail((core.person?.specialisms || []).includes('Performing artist portfolio photography'), 'Performing artist portfolio specialism drift');\nfail((core.person?.specialisms || []).includes('Model portfolio photography'), 'Model portfolio photography specialism drift');");
  t = t.replace("fail(services.some((service) => service.id === 'fine-art' && /Fine Art Photography/i.test(service.name)), 'Fine Art Photography service missing');", "fail(services.some((service) => service.id === 'fine-art' && /Fine Art \/ Artists & Performers Photography/i.test(service.name) && service.serviceContext === 'fine-art'), 'Fine Art / Artists & Performers canonical service missing');");
  write(path, t);
}

const dedicatedAudit = `import fs from 'node:fs';\n\nconst errors = [];\nconst fail = (c,m) => { if (!c) errors.push(m); };\nconst core = JSON.parse(fs.readFileSync('data/machine-core.json','utf8'));\nconst intent = JSON.parse(fs.readFileSync('customer-intent-model.json','utf8'));\nconst needs = JSON.parse(fs.readFileSync('customer-needs.json','utf8'));\nconst pricing = JSON.parse(fs.readFileSync('pricing.json','utf8'));\nconst fine = core.serviceModel.services.find(s => s.id === 'fine-art');\nfail(fine?.serviceContext === 'fine-art', 'fine-art backend contract drift');\nfail(/Artists & Performers/.test(fine?.name || ''), 'Artists & Performers public meaning missing from canonical core');\nfor (const token of ['Actor headshot photography','Dance photography','Performing artist portfolio photography','Model portfolio photography','Editorial portrait photography']) fail(core.person.specialisms.includes(token), 'canonical specialism missing: ' + token);\nfor (const id of ['actor-casting-portfolio','dance-performing-artist-portfolio','model-editorial-portfolio']) {\n  fail(intent.intents.some(x => x.id === id && x.serviceContext === 'fine-art'), 'intent route missing: ' + id);\n  fail(needs.needs.some(x => x.id === id && x.serviceContext === 'fine-art'), 'customer need missing: ' + id);\n}\nconst p = (pricing.services || []).find(x => x.id === 'fine-art');\nfail(p?.quoteRouting?.serviceContext === 'fine-art', 'pricing quote route drift');\nfor (const file of ['glamour/index.html','hu/muveszi-fotografia/index.html','de-at/fine-art/index.html']) {\n  const h = fs.readFileSync(file,'utf8');\n  fail(h.includes('data-artists-performers-semantic'), file + ': semantic marker missing');\n  fail(/actor|színész|Schauspiel/i.test(h), file + ': actor intent missing');\n  fail(/dance|tánc|Tanz/i.test(h), file + ': dance intent missing');\n}\nconst generator = fs.readFileSync('tools/generate-machine-projections.mjs','utf8');\nfail(generator.includes('core.serviceModel.services.map'), 'production projection no longer derives service semantics from canonical core');\nconst hardener = fs.readFileSync('tools/harden-production-artifact.mjs','utf8');\nfail(hardener.includes('generateMachineProjections(root)'), 'production hardener no longer regenerates machine projections');\nif (errors.length) { console.error(errors.join('\\n')); process.exit(1); }\nconsole.log('Artists & Performers SEO/GEO/Schema/LLM contract passed: canonical core, intent routing, pricing, localized pages and deployment projection ownership are aligned.');\n`;
write('tools/audit-artists-performers-layer.mjs', dedicatedAudit);

{
  const pkg = json('package.json');
  if (!pkg.scripts.test.includes('audit-artists-performers-layer.mjs')) {
    pkg.scripts.test = pkg.scripts.test.replace('node tools/audit-machine-core.mjs &&', 'node tools/audit-machine-core.mjs && node tools/audit-artists-performers-layer.mjs &&');
  }
  writeJson('package.json', pkg);
}

console.log('Artists & Performers canonical SEO/GEO/Schema/LLM migration applied with rewrite guards.');

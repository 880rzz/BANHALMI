import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const groups={
  en:{
    files:['portrait/index.html','lifestyle/index.html','event-photography/index.html'],
    html:'<section class="section-band partnership-deliverables" data-strategic-partnership="concrete"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">What the partnership includes</span><h2>One shoot is only useful when the images work everywhere they need to.</h2><p>Before the camera comes out, we define who the images are for, where they will appear and what they must communicate. The result is not simply a folder of photographs, but a usable visual system for leadership, brand and communication teams.</p></div><div class="cards reveal"><article class="card"><h3>1. Visual brief</h3><p>Purpose, audience, tone, locations and practical constraints are agreed before production.</p></article><article class="card"><h3>2. Use map</h3><p>LinkedIn, press, website, annual report, employer branding and event communication are planned together.</p></article><article class="card"><h3>3. Preparation</h3><p>Wardrobe, location, light, schedule and the people involved are prepared so the day stays focused.</p></article><article class="card"><h3>4. Direction on set</h3><p>Clear guidance without forcing a pose, with room for the moment when the person becomes present.</p></article><article class="card"><h3>5. Structured selection</h3><p>The final set is chosen by role and use, not only by which frame looks strongest in isolation.</p></article><article class="card"><h3>6. Consistent delivery</h3><p>Files are prepared for the agreed channels so later publications and future shoots remain coherent.</p></article></div></div></section>'
  },
  hu:{
    files:['hu/portre/index.html','hu/brand/index.html','hu/rendezvenyfotozas/index.html'],
    html:'<section class="section-band partnership-deliverables" data-strategic-partnership="concrete"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">Mit jelent a partnerség a gyakorlatban?</span><h2>Egy fotózás akkor hasznos, ha a képek minden fontos felületen működnek.</h2><p>Mielőtt előkerül a kamera, tisztázzuk, kinek készülnek a képek, hol jelennek meg és mit kell közvetíteniük. Az eredmény nem egyszerűen egy fotómappa, hanem használható képi rendszer a vezetői, brand- és kommunikációs csapat számára.</p></div><div class="cards reveal"><article class="card"><h3>1. Vizuális brief</h3><p>A célt, a közönséget, a hangvételt, a helyszínt és a gyakorlati kereteket még a gyártás előtt rögzítjük.</p></article><article class="card"><h3>2. Felhasználási térkép</h3><p>A LinkedIn, a sajtó, a weboldal, az éves jelentés, az employer branding és az eseménykommunikáció együtt készül elő.</p></article><article class="card"><h3>3. Előkészítés</h3><p>Öltözék, helyszín, fény, időrend és résztvevők: minden úgy áll össze, hogy a fotózás napja fókuszált maradjon.</p></article><article class="card"><h3>4. Irányítás a helyszínen</h3><p>Egyértelmű vezetést adok, de nem erőltetek pózt; helyet hagyok annak a pillanatnak, amikor az ember valóban jelen van.</p></article><article class="card"><h3>5. Strukturált válogatás</h3><p>A végső képkészlet szerep és felhasználás szerint áll össze, nem csak az alapján, melyik fotó a legerősebb önmagában.</p></article><article class="card"><h3>6. Következetes átadás</h3><p>A fájlokat a megbeszélt csatornákhoz készítem elő, hogy a későbbi publikációk és fotózások is egységesek maradjanak.</p></article></div></div></section>'
  },
  de:{
    files:['de-at/portrait/index.html','de-at/brand/index.html','de-at/eventfotografie/index.html'],
    html:'<section class="section-band partnership-deliverables" data-strategic-partnership="concrete"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">Was die Partnerschaft konkret umfasst</span><h2>Ein Shooting ist dann sinnvoll, wenn die Bilder auf allen wichtigen Kanälen funktionieren.</h2><p>Bevor die Kamera zum Einsatz kommt, klären wir Zielgruppen, Einsatzorte und die Botschaft der Bilder. Das Ergebnis ist nicht nur ein Ordner mit Fotos, sondern ein nutzbares Bildsystem für Führung, Marke und Kommunikation.</p></div><div class="cards reveal"><article class="card"><h3>1. Visuelles Briefing</h3><p>Ziel, Publikum, Tonalität, Orte und praktische Rahmenbedingungen werden vor der Produktion festgelegt.</p></article><article class="card"><h3>2. Einsatzplan</h3><p>LinkedIn, Presse, Website, Geschäftsbericht, Employer Branding und Eventkommunikation werden gemeinsam gedacht.</p></article><article class="card"><h3>3. Vorbereitung</h3><p>Kleidung, Ort, Licht, Zeitplan und Beteiligte werden so vorbereitet, dass der Produktionstag fokussiert bleibt.</p></article><article class="card"><h3>4. Klare Führung vor Ort</h3><p>Präzise Anleitung ohne starre Pose, mit Raum für den Moment, in dem eine Person wirklich präsent wird.</p></article><article class="card"><h3>5. Strukturierte Auswahl</h3><p>Die finale Serie wird nach Rolle und Einsatz ausgewählt, nicht nur danach, welches Einzelbild am stärksten wirkt.</p></article><article class="card"><h3>6. Konsistente Übergabe</h3><p>Die Dateien werden für die vereinbarten Kanäle vorbereitet, damit spätere Publikationen und weitere Shootings zusammenpassen.</p></article></div></div></section>'
  }
};

for(const group of Object.values(groups)){
  for(const relative of group.files){
    const file=path.join(root,relative);
    let html=fs.readFileSync(file,'utf8');
    if(html.includes('data-strategic-partnership="concrete"')) continue;
    const main=html.indexOf('<main');
    const firstSectionEnd=html.indexOf('</section>',main);
    if(main<0||firstSectionEnd<0) throw new Error(`${relative}: first main section not found`);
    const insertAt=firstSectionEnd+'</section>'.length;
    html=html.slice(0,insertAt)+group.html+html.slice(insertAt);
    fs.writeFileSync(file,html,'utf8');
  }
}
console.log('Stage-four strategic partnership content added to nine service pages.');

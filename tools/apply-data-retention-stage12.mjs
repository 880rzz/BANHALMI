import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const groups={
  en:{
    files:['portrait/index.html','lifestyle/index.html','event-photography/index.html','faq/index.html','privacy/index.html','terms-conditions/index.html'],
    html:`<section class="section-band data-retention-clarity" data-data-retention="stage12"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">File governance</span><h2>Storage, access and deletion</h2><p>The written offer records the delivery route, access period and any project-specific retention requirement. Delivery is not a promise of permanent archive storage.</p></div><div class="cards books-grid"><article class="card reveal"><h3>Controlled access</h3><p>Preview galleries, download links and working folders are limited to the agreed project team. Access links may expire and should not be forwarded outside the authorised group.</p></article><article class="card reveal"><h3>Delivered files and working files</h3><p>The client receives the agreed final files. RAW captures, rejected frames, contact sheets and intermediate retouching files remain working material unless the written offer expressly includes them.</p></article><article class="card reveal"><h3>Retention and backup</h3><p>BANHALMI may keep project files for a reasonable operational period, but does not guarantee permanent storage. The client is responsible for securely backing up the delivered package after download.</p></article><article class="card reveal"><h3>Deletion requests</h3><p>A deletion request can be submitted in writing. Files are removed where the request applies, except where continued retention is required for an accepted contract, accounting, legal claims or another valid legal basis.</p></article></div></div></section>`
  },
  hu:{
    files:['hu/portre/index.html','hu/brand/index.html','hu/rendezvenyfotozas/index.html','hu/gyik/index.html','hu/adatvedelem/index.html','hu/aszf/index.html'],
    html:`<section class="section-band data-retention-clarity" data-data-retention="stage12"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">Fájlkezelés</span><h2>Tárolás, hozzáférés és törlés</h2><p>Az írásos ajánlat rögzíti az átadás módját, a hozzáférési időszakot és az esetleges projektspecifikus megőrzési igényt. Az átadás nem jelent korlátlan idejű archívumtárolási ígéretet.</p></div><div class="cards books-grid"><article class="card reveal"><h3>Szabályozott hozzáférés</h3><p>Az előnézeti galériákhoz, letöltési linkekhez és munkamappákhoz csak az egyeztetett projektcsapat fér hozzá. A linkek lejárhatnak, és nem továbbíthatók az engedélyezett körön kívülre.</p></article><article class="card reveal"><h3>Átadott és munkafájlok</h3><p>Az ügyfél az egyeztetett végleges fájlokat kapja meg. A RAW-felvételek, kiesett képek, kontaktívek és köztes retusfájlok munkafájlok maradnak, kivéve, ha az írásos ajánlat kifejezetten tartalmazza őket.</p></article><article class="card reveal"><h3>Megőrzés és biztonsági mentés</h3><p>A BANHALMI a projektfájlokat észszerű működési ideig megőrizheti, de tartós archiválást nem garantál. A letöltött végleges csomag biztonsági mentéséről az ügyfél gondoskodik.</p></article><article class="card reveal"><h3>Törlési kérelem</h3><p>Törlési igény írásban nyújtható be. A fájlokat a kérelem hatálya szerint töröljük, kivéve, ha elfogadott szerződés, számviteli kötelezettség, jogi igény vagy más érvényes jogalap miatt további megőrzés szükséges.</p></article></div></div></section>`
  },
  de:{
    files:['de-at/portrait/index.html','de-at/brand/index.html','de-at/eventfotografie/index.html','de-at/faq/index.html','de-at/datenschutz/index.html','de-at/agb/index.html'],
    html:`<section class="section-band data-retention-clarity" data-data-retention="stage12"><div class="wrap"><div class="section-head reveal"><span class="eyebrow">Dateiverwaltung</span><h2>Speicherung, Zugriff und Löschung</h2><p>Das schriftliche Angebot hält Übergabeweg, Zugriffszeitraum und projektspezifische Aufbewahrungsanforderungen fest. Die Übergabe ist keine Zusage einer unbegrenzten Archivierung.</p></div><div class="cards books-grid"><article class="card reveal"><h3>Kontrollierter Zugriff</h3><p>Vorschaugalerien, Downloadlinks und Arbeitsordner sind auf das vereinbarte Projektteam beschränkt. Links können ablaufen und dürfen nicht außerhalb des berechtigten Personenkreises weitergegeben werden.</p></article><article class="card reveal"><h3>Gelieferte Dateien und Arbeitsdateien</h3><p>Der Kunde erhält die vereinbarten finalen Dateien. RAW-Aufnahmen, verworfene Bilder, Kontaktbögen und Zwischenstände der Retusche bleiben Arbeitsmaterial, sofern das schriftliche Angebot sie nicht ausdrücklich umfasst.</p></article><article class="card reveal"><h3>Aufbewahrung und Sicherung</h3><p>BANHALMI kann Projektdateien für einen angemessenen betrieblichen Zeitraum aufbewahren, garantiert jedoch keine dauerhafte Archivierung. Für die sichere Sicherung des heruntergeladenen finalen Pakets ist der Kunde verantwortlich.</p></article><article class="card reveal"><h3>Löschanfragen</h3><p>Eine Löschanfrage kann schriftlich gestellt werden. Dateien werden im anwendbaren Umfang gelöscht, außer eine weitere Aufbewahrung ist wegen eines angenommenen Vertrags, der Buchhaltung, rechtlicher Ansprüche oder einer anderen gültigen Rechtsgrundlage erforderlich.</p></article></div></div></section>`
  }
};

for(const group of Object.values(groups)) for(const relative of group.files){
  const file=path.join(root,relative);
  let html=fs.readFileSync(file,'utf8');
  if(html.includes('data-data-retention="stage12"')) continue;
  const anchor='</main>';
  const index=html.lastIndexOf(anchor);
  if(index<0) throw new Error(`${relative}: main closing tag missing`);
  html=html.slice(0,index)+group.html+html.slice(index);
  fs.writeFileSync(file,html);
}
console.log('Stage-twelve data retention blocks added to eighteen pages.');

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const replacements = {
  'about/index.html': [
    [
      'Some turns change more than the route.',
      'Some moments change the reason you work.'
    ],
    [
      'A serious accident forced me to stop and ask what I wanted photography to be for. I decided that a picture should do more than look good. It should carry meaning for the person who trusted me to make it. That decision still guides both portraits and long-term projects.',
      'A serious accident forced me to stop and ask what photography was for. I realised that a well-made image was not enough. The work had to matter to the person in front of the camera as well. That decision still shapes my portraits and long-term projects.'
    ],
    [
      'New York taught me the next lesson. I arrived with very little money and a large idea. People helped, doors opened and the project found its way forward. Since then I have trusted careful preparation, human connection and the courage to begin before every answer is available.',
      'New York taught me something different. I arrived with little money and a clear idea. People helped, doors opened and the project moved forward one conversation at a time. Since then I have relied on preparation, human connection and the willingness to begin before every detail is settled.'
    ]
  ],
  'hu/eletmu/index.html': [
    [
      'Egy súlyos baleset megállított, és arra kényszerített, hogy megkérdezzem: mire szeretném használni a fotográfiát? Arra jutottam, hogy egy képnek a jó megjelenésnél többet kell adnia. Jelentenie kell valamit annak is, aki bizalmat adott hozzá. Ez a döntés ma is vezeti a portrékat és a hosszabb projekteket.',
      'Egy súlyos baleset megállított, és rákényszerített, hogy feltegyem a kérdést: mire való számomra a fotográfia? Arra jutottam, hogy egy jól elkészített kép önmagában kevés. A munkának annak is jelentenie kell valamit, aki a kamera előtt áll. Ez a döntés ma is meghatározza a portréimat és a hosszabb projektjeimet.'
    ],
    [
      'New York adta a következő leckét. Kevés pénzzel és egy nagy ötlettel érkeztem. Emberek segítettek, ajtók nyíltak ki, a projekt pedig lépésről lépésre utat talált magának. Azóta hiszek az alapos felkészülésben, az emberi kapcsolatokban és abban a bátorságban, amely akkor is elindít, ha még nincs minden kérdésre válasz.',
      'New York másfajta leckét adott. Kevés pénzzel, de világos elképzeléssel érkeztem. Emberek segítettek, ajtók nyíltak ki, a projekt pedig beszélgetésről beszélgetésre haladt előre. Azóta az alapos felkészülésre, az emberi kapcsolatokra és arra a bátorságra támaszkodom, amely akkor is elindít, amikor még nincs minden részlet a helyén.'
    ],
    [
      'Az alábbi lista tömör kurátori térkép. Minden projekt a művészeti archívumban található teljes forrásoldalra vezet.',
      'Az alábbi válogatás röviden mutatja be a fontosabb projekteket. A címek a művészeti archívum részletes forrásoldalaira vezetnek.'
    ]
  ],
  'de-at/werk/index.html': [
    [
      'Manche Wendungen ändern mehr als nur die Richtung.',
      'Manche Momente verändern den Grund, warum man arbeitet.'
    ],
    [
      'Ein schwerer Unfall zwang mich zu einer Pause und zu der Frage, wofür ich Fotografie einsetzen möchte. Ich entschied, dass ein Bild mehr leisten soll als gut auszusehen. Es soll auch für den Menschen Bedeutung haben, der mir dafür Vertrauen schenkt. Diese Entscheidung prägt bis heute Porträts und langfristige Projekte.',
      'Ein schwerer Unfall zwang mich zu einer Pause und zu der Frage, wofür Fotografie für mich da ist. Mir wurde klar, dass ein gut gemachtes Bild allein nicht genügt. Die Arbeit muss auch für den Menschen vor der Kamera Bedeutung haben. Diese Entscheidung prägt bis heute meine Porträts und langfristigen Projekte.'
    ]
  ]
};

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const count = (text, value) => text.split(value).length - 1;
const manifest = {
  stage: 25,
  date: '2026-08-06',
  purpose: 'Apply the reviewed multilingual oeuvre copy and remove the orphan write-capable migration directory.',
  files: []
};

for (const [file, pairs] of Object.entries(replacements)) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  const changes = [];

  for (const [oldText, newText] of pairs) {
    const oldCount = count(after, oldText);
    if (oldCount !== 1) {
      throw new Error(`${file}: expected old phrase exactly once, found ${oldCount}: ${oldText.slice(0, 90)}`);
    }
    if (after.includes(newText)) {
      throw new Error(`${file}: replacement phrase already exists before migration: ${newText.slice(0, 90)}`);
    }
    after = after.replace(oldText, newText);
    changes.push({ oldText, newText });
  }

  if (after === before) throw new Error(`${file}: migration produced no change`);
  fs.writeFileSync(file, after, 'utf8');
  manifest.files.push({
    file,
    beforeSha256: sha256(before),
    afterSha256: sha256(after),
    beforeBytes: Buffer.byteLength(before),
    afterBytes: Buffer.byteLength(after),
    changes
  });
}

if (!fs.existsSync('.human-voice/oeuvre-rewrite.py')) {
  throw new Error('expected orphan .human-voice/oeuvre-rewrite.py before cleanup');
}
fs.rmSync('.human-voice', { recursive: true, force: false });

const manifestPath = 'docs/content-migrations/2026-08-06-oeuvre-human-voice-stage25.json';
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

for (const [file, pairs] of Object.entries(replacements)) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [oldText, newText] of pairs) {
    if (html.includes(oldText)) throw new Error(`${file}: old phrase remains after migration`);
    if (count(html, newText) !== 1) throw new Error(`${file}: replacement phrase must occur exactly once after migration`);
  }
}
if (fs.existsSync('.human-voice')) throw new Error('orphan .human-voice directory remains after cleanup');

console.log(`Stage 25 migration applied to ${Object.keys(replacements).length} localized oeuvre pages.`);

import fs from 'node:fs';

const sourcePath = 'tools/migrate-portrait-brand-cluster-20260812-v2.mjs';
let source = fs.readFileSync(sourcePath, 'utf8');

const patches = [
  [
    "s = rx1(s, /Four principal services:[^<]+/, 'Four principal services remain the structure: Portrait Photography, Brand Photography, C-Level Event Photography and Fine Art Photography. Within the business track, one connected system runs from a precise headshot and business portrait through executive portraiture to personal brand photography, business brand photography and strategic visual positioning.', 'EN home hierarchy');",
    "s = rx1(s, /<strong>Four principal services:<\\/strong>[^<]+/, '<strong>Four principal services:</strong> Portrait Photography, Brand Photography, C-Level Event Photography and Fine Art Photography remain the structure. Within the business track, one connected system runs from a precise headshot and business portrait through executive portraiture to personal brand photography, business brand photography and strategic visual positioning.', 'EN home hierarchy');"
  ],
  [
    "s = rx1(s, /Négy fő szolgáltatás:[^<]+/, 'A négy fő szolgáltatás változatlan: portréfotózás, brandfotózás, felsővezetői eseményfotózás és művészi fotográfia. Az üzleti területen azonban egy összefüggő rendszer épül: üzleti headshot → üzleti portré → executive és vezetői portré → személyes brand fotózás → üzleti és vállalati brandfotózás → stratégiai vizuális pozicionálás.', 'HU home hierarchy');",
    "s = rx1(s, /<strong>Négy fő szolgáltatás:<\\/strong>[^<]+/, '<strong>Négy fő szolgáltatás:</strong> portréfotózás, brandfotózás, felsővezetői eseményfotózás és művészi fotográfia. Az üzleti területen egy összefüggő rendszer épül: üzleti headshot → üzleti portré → executive és vezetői portré → személyes brand fotózás → üzleti és vállalati brandfotózás → stratégiai vizuális pozicionálás.', 'HU home hierarchy');"
  ],
  [
    "s = rx1(s, /Vier Hauptleistungen:[^<]+/, 'Die vier Hauptleistungen bleiben Porträtfotografie, Brandfotografie, C-Level-Eventfotografie und Fine-Art-Fotografie. Im Business-Bereich bilden sie eine klare Kette: Business-Headshot → Business-Porträt → Executive-Porträt → Personal Branding → Unternehmens- und Brandfotografie → strategische visuelle Positionierung.', 'DE home hierarchy');",
    "s = rx1(s, /<strong>Vier Hauptleistungen:<\\/strong>[^<]+/, '<strong>Vier Hauptleistungen:</strong> Porträtfotografie, Brandfotografie, C-Level-Eventfotografie und Fine-Art-Fotografie bleiben die Struktur. Im Business-Bereich bilden sie eine klare Kette: Business-Headshot → Business-Porträt → Executive-Porträt → Personal Branding → Unternehmens- und Brandfotografie → strategische visuelle Positionierung.', 'DE home hierarchy');"
  ],
  [
    "s = lit1(s, 'Brand Photography &amp; Visual Positioning', 'Personal &amp; Business Brand Photography', 'EN brand H1');",
    "s = s; // Preserve the human-facing EN brand H1; search intent is carried by metadata, eyebrow, lead, lists and service schema."
  ],
  [
    "s = rx1(s, /Brandfotografie &amp; visuelle Markenpositionierung|Brandfotografie &amp; Visuelle Markenpositionierung/, 'Personal Branding &amp; Unternehmensfotografie', 'DE brand H1');",
    "s = s; // Preserve the human-facing DE brand H1; search intent is carried by metadata, eyebrow, lead, lists and service schema."
  ],
  [
    "s = rx1(s, /Brandfotografie · Visuelle[^<]+/, 'Personal-Branding-Fotografie · Business-Brand-Fotografie · Visuelle Positionierung · Wien · Budapest', 'DE brand eyebrow');",
    "s = rx1(s, /Brandfotografie · Strategische visuelle Markenpositionierung/, 'Personal-Branding-Fotografie · Business-Brand-Fotografie · Visuelle Positionierung · Wien · Budapest', 'DE brand eyebrow');"
  ],
  [
    "s = rx1(s, /A brand becomes credible when the people inside it remain visible\\.[^<]+/, 'A brand becomes credible when the people inside it remain visible. Personal brand photography extends a leader beyond the headshot into a recognisable public image system; business brand photography connects leaders, teams, workplaces, products and campaigns into one visual identity. In Vienna and Budapest, both start with positioning and end with photographs built for real communication.', 'EN brand intro');",
    "s = rx1(s, /<p class=\"lead\">A company has a face too\\.[^<]+<\\/p>/, '<p class=\"lead\">Personal brand photography extends a leader beyond the headshot into a recognisable public image system; business brand photography connects leaders, teams, workplaces, products and campaigns into one visual identity. In Vienna and Budapest, both start with positioning and end with photographs built for real communication.</p>', 'EN brand intro');"
  ],
  [
    "s = rx1(s, /Eine Marke wird glaubwürdig, wenn die Menschen darin sichtbar bleiben\\.[^<]+/, 'Eine Marke wird glaubwürdig, wenn die Menschen darin sichtbar bleiben. Personal-Branding-Fotografie erweitert eine Führungsperson über den Headshot hinaus zu einem wiedererkennbaren öffentlichen Bildsystem; Business-Brand-Fotografie verbindet Führung, Teams, Arbeitswelten, Produkte und Kampagnen zu einer visuellen Identität. In Wien und Budapest beginnt beides mit Positionierung und endet mit Bildern für reale Kommunikation.', 'DE brand intro');",
    "s = rx1(s, /<p class=\"lead\">Auch ein Unternehmen hat ein Gesicht\\.[^<]+<\\/p>/, '<p class=\"lead\">Personal-Branding-Fotografie erweitert eine Führungsperson über den Headshot hinaus zu einem wiedererkennbaren öffentlichen Bildsystem; Business-Brand-Fotografie verbindet Führung, Teams, Arbeitswelten, Produkte und Kampagnen zu einer visuellen Identität. In Wien und Budapest beginnt beides mit Positionierung und endet mit Bildern für reale Kommunikation.</p>', 'DE brand intro');"
  ]
];

for (const [from, to] of patches) {
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`Migration-source patch mismatch: expected 1, got ${count}`);
  source = source.replace(from, to);
}

const temp = 'tools/.portrait-brand-migration-v3-runtime.mjs';
fs.writeFileSync(temp, source);
try {
  await import(`../${temp}?v=${Date.now()}`);
} finally {
  fs.rmSync(temp, { force: true });
}

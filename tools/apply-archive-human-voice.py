from pathlib import Path

REPLACEMENTS = {
    "archive/index.html": [
        ("The BANHALMI archive preserves the artistic research, authorship and historical evidence behind the current strategic visual partnership.", "The BANHALMI archive gathers the projects, books, exhibitions and conversations that shaped the work presented here today."),
        ("The stories do not end here.", "The current work has a history."),
        ("This website is where you will find my current work and services. Banhalmi.art holds the road that led here: complete art projects, books, exhibitions, interviews and more than twenty-five years of photographs. Take your time with it.", "This site presents the work I do now. Banhalmi.art opens the wider record behind it: complete projects, books, exhibitions, interviews and photographs made since 1999. It is not a highlights reel, but a place to understand how the visual language developed."),
        ("A wider visual selection from more than twenty-five years of commissioned and personal photography.", "A broad selection of commissioned and personal photographs, arranged as a visual record rather than a sales portfolio."),
        ("Three major publications connecting photography with personal testimony, literature, illness and the stages of women’s lives.", "Three publications in which photographs meet personal testimony, literature, illness and different stages of women’s lives."),
        ("Full project pages, dates, locations and visual concepts from 2014 onward.", "Project pages with dates, locations, participating voices and the ideas that held each exhibition together."),
        ("Conversations about the people, turning points and ideas behind the photographs. A good place to get to know the person behind the camera.", "Interviews and articles about the people, decisions and turning points behind the photographs — including the doubts and changes that rarely fit into a portfolio."),
        ("A longer contextual analysis for curators, institutions and researchers.", "A structured account of the oeuvre, its recurring themes and its institutional context for curators, researchers and collections.")
    ],
    "hu/archivum/index.html": [
        ("A történetek itt nem érnek véget.", "A jelenlegi munkának története van."),
        ("Ezen az oldalon a mai munkáimat és szolgáltatásaimat találja. A banhalmi.art őrzi mindazt, ami idáig vezetett: a teljes művészeti projekteket, könyveket, kiállításokat, interjúkat és több mint huszonöt év képeit. Érdemes elmerülni benne.", "Ez az oldal a jelenlegi munkámat mutatja be. A banhalmi.art mögé néz: teljes projekteket, könyveket, kiállításokat, interjúkat és 1999 óta készült fényképeket rendez össze. Nem válogatott sikerek sora, hanem annak nyoma, hogyan alakult ki ez a képi gondolkodás."),
        ("Tágabb vizuális válogatás több mint huszonöt év alkalmazott és személyes fotográfiájából.", "Alkalmazott és személyes munkák széles válogatása, nem értékesítési portfólióként, hanem vizuális feljegyzésként rendezve."),
        ("Három meghatározó kiadvány, amely a fotográfiát személyes vallomással, irodalommal, betegséggel és női életállomásokkal kapcsolja össze.", "Három kiadvány, amelyben a fényképek személyes vallomással, irodalommal, betegséggel és női élethelyzetekkel találkoznak."),
        ("Teljes projektoldalak, dátumok, helyszínek és vizuális koncepciók 2014-től.", "Projektoldalak dátumokkal, helyszínekkel, résztvevőkkel és az egyes kiállításokat összetartó gondolatokkal."),
        ("Beszélgetések a képek mögötti emberekről, fordulópontokról és ötletekről. Innen a kamera mögött álló ember is jobban megismerhető.", "Interjúk és cikkek a képek mögötti emberekről, döntésekről és fordulópontokról — azokról a kételyekről és változásokról is, amelyek egy portfólióból rendszerint kimaradnak."),
        ("Hosszabb kontextuális elemzés kurátoroknak, intézményeknek és kutatóknak.", "Az életmű visszatérő témáinak, összefüggéseinek és intézményi hátterének rendezett áttekintése kurátorok, kutatók és gyűjtemények számára.")
    ],
    "de-at/archiv/index.html": [
        ("Die Geschichten enden hier nicht.", "Die aktuelle Arbeit hat eine Geschichte."),
        ("Auf dieser Website finden Sie meine aktuellen Arbeiten und Leistungen. Banhalmi.art bewahrt den Weg dorthin: vollständige Kunstprojekte, Bücher, Ausstellungen, Interviews und mehr als fünfundzwanzig Jahre Fotografie. Nehmen Sie sich Zeit dafür.", "Diese Website zeigt meine heutige Arbeit. Banhalmi.art öffnet das größere Archiv dahinter: vollständige Projekte, Bücher, Ausstellungen, Interviews und Fotografien seit 1999. Es ist keine Sammlung von Höhepunkten, sondern zeigt, wie sich die Bildsprache entwickelt hat."),
        ("Eine breitere visuelle Auswahl aus mehr als fünfundzwanzig Jahren Auftrags- und persönlicher Fotografie.", "Eine breite Auswahl aus Auftragsarbeiten und persönlichen Serien — als visuelle Aufzeichnung geordnet, nicht als Verkaufsportfolio."),
        ("Drei zentrale Publikationen verbinden Fotografie mit persönlichem Zeugnis, Literatur, Krankheit und den Lebensphasen von Frauen.", "Drei Publikationen, in denen Fotografie auf persönliche Zeugnisse, Literatur, Krankheit und unterschiedliche Lebensphasen von Frauen trifft."),
        ("Vollständige Projektseiten, Daten, Orte und visuelle Konzepte seit 2014.", "Projektseiten mit Daten, Orten, Beteiligten und den Gedanken, die die jeweiligen Ausstellungen zusammenhalten."),
        ("Gespräche über die Menschen, Wendepunkte und Ideen hinter den Bildern. Ein guter Ort, um auch den Menschen hinter der Kamera kennenzulernen.", "Interviews und Beiträge über Menschen, Entscheidungen und Wendepunkte hinter den Bildern — auch über Zweifel und Veränderungen, die in einem Portfolio meist keinen Platz finden."),
        ("Eine längere Kontextanalyse für Kurator:innen, Institutionen und Forschung.", "Eine strukturierte Einordnung des Werks, seiner wiederkehrenden Themen und seines institutionellen Kontexts für Kurator:innen, Forschung und Sammlungen.")
    ]
}

for filename, pairs in REPLACEMENTS.items():
    path = Path(filename)
    text = path.read_text(encoding="utf-8")
    for old, new in pairs:
        count = text.count(old)
        if count == 0:
            raise SystemExit(f"Missing source text in {filename}: {old[:80]}")
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")
    print(f"Updated {filename}")

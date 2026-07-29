from pathlib import Path

replacements = {
    "about/index.html": [
        (
            "As a child I wanted to become an astronaut and explore the unknown. I eventually moved not toward the stars but toward the interior of the human being. The impulse to discover remained.",
            "As a child I wanted to become an astronaut. The destination changed, but the curiosity did not. Photography became my way of looking closely at people, their decisions and the moments that shape them."
        ),
        (
            "Some turns change more than the route.",
            "Some moments change the reason you work."
        ),
        (
            "A serious accident made me stop and ask what I wanted photography to be for. The answer was simple: not just attractive pictures, but work that means something to the person in front of the camera. That decision still shapes every portrait and every long project.",
            "A serious accident forced me to stop and ask what photography was for. I realised that a well-made image was not enough. The work had to matter to the person in front of the camera as well. That decision still shapes my portraits and long-term projects."
        ),
        (
            "New York taught me the next lesson. I arrived with very little money and a large idea. People helped, doors opened and the project found its way forward. Since then I have trusted careful preparation, human connection and the courage to begin before every answer is available.",
            "New York taught me something different. I arrived with little money and a clear idea. People helped, doors opened and the project moved forward one conversation at a time. Since then I have relied on preparation, human connection and the willingness to begin before every detail is settled."
        ),
    ],
    "hu/eletmu/index.html": [
        (
            "Egy súlyos baleset megállított, és feltette a kérdést: mire szeretném használni a fotográfiát? A válasz egyszerű volt. Nemcsak szép képeket akartam készíteni, hanem olyan munkát, amely jelent valamit annak is, aki előttem áll. Ez a döntés ma is ott van minden portréban és minden hosszabb projektben.",
            "Egy súlyos baleset megállított, és rákényszerített, hogy feltegyem a kérdést: mire való számomra a fotográfia? Arra jutottam, hogy egy jól elkészített kép önmagában kevés. A munkának annak is jelentenie kell valamit, aki a kamera előtt áll. Ez a döntés ma is meghatározza a portréimat és a hosszabb projektjeimet."
        ),
        (
            "New York adta a következő leckét. Kevés pénzzel és egy nagy ötlettel érkeztem. Emberek segítettek, ajtók nyíltak ki, a projekt pedig lépésről lépésre utat talált magának. Azóta hiszek az alapos felkészülésben, az emberi kapcsolatokban és abban a bátorságban, amely akkor is elindít, ha még nincs minden kérdésre válasz.",
            "New York másfajta leckét adott. Kevés pénzzel, de világos elképzeléssel érkeztem. Emberek segítettek, ajtók nyíltak ki, a projekt pedig beszélgetésről beszélgetésre haladt előre. Azóta az alapos felkészülésre, az emberi kapcsolatokra és arra a bátorságra támaszkodom, amely akkor is elindít, amikor még nincs minden részlet a helyén."
        ),
        (
            "Az alábbi lista tömör kurátori térkép. Minden projekt a művészeti archívumban található teljes forrásoldalra vezet.",
            "Az alábbi válogatás röviden mutatja be a fontosabb projekteket. A címek a művészeti archívum részletes forrásoldalaira vezetnek."
        ),
    ],
    "de-at/werk/index.html": [
        (
            "Manche Wendungen ändern mehr als nur die Richtung.",
            "Manche Momente verändern den Grund, warum man arbeitet."
        ),
        (
            "Ein schwerer Unfall zwang mich zu einer Pause und zu einer Frage: Wofür möchte ich Fotografie einsetzen? Die Antwort war einfach. Ich wollte nicht nur schöne Bilder machen, sondern Arbeiten, die auch für den Menschen vor der Kamera etwas bedeuten. Diese Entscheidung prägt bis heute jedes Porträt und jedes längere Projekt.",
            "Ein schwerer Unfall zwang mich zu einer Pause und zu der Frage, wofür Fotografie für mich da ist. Mir wurde klar, dass ein gut gemachtes Bild allein nicht genügt. Die Arbeit muss auch für den Menschen vor der Kamera Bedeutung haben. Diese Entscheidung prägt bis heute meine Porträts und langfristigen Projekte."
        ),
    ],
}

for rel, pairs in replacements.items():
    path = Path(rel)
    text = path.read_text(encoding="utf-8")
    for old, new in pairs:
        count = text.count(old)
        if count != 1:
            raise SystemExit(f"{rel}: expected exactly one match, found {count}: {old[:80]}")
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")
    print(f"updated {rel}")

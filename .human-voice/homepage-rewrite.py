#!/usr/bin/env python3
from pathlib import Path

replacements = {
    "index.html": [
        (
            "The photograph speaks before the meeting begins.",
            "The photograph often speaks before you do.",
        ),
        (
            "I work with leaders and organisations whose photographs have a real job to do. An executive portrait may introduce a person before a meeting. A brand series may shape how a company is understood. Images from a C-level event may become part of its public memory. I approach all of them as one visual language: clear, credible and recognisably human.",
            "I work with leaders and organisations where the image has a real job. Introducing someone before a meeting. Showing what a company feels like. Holding on to an important day. I do not treat these as separate genres. One language.",
        ),
        (
            "A perfect pose has never interested me much. I am waiting for the quieter moment after it\u2014the instant when the person in front of me stops managing the camera and becomes present. That is usually where the portrait begins.",
            "The perfect pose? Not really my interest.",
        ),
        (
            "That is why the work starts with a conversation, not with a shutter. We talk about what the images must communicate, who will see them and where they will live. Only then do I decide how the light, setting and direction should work.",
            "I am waiting for the moment after \u2014 when the person stops managing the camera and is simply there. That is usually where the portrait starts. So we talk first. What does the image need to say? Who will see it? Where will it live? Light, place and direction come after that.",
        ),
        (
            "Sometimes the result is a precise executive headshot. Sometimes it is a visual system for an entire organisation, the record of an important encounter or a personal work that belongs in a book or exhibition. The setting changes. My attention remains with the person and what is true in that moment.",
            "Sometimes it is a precise headshot. Sometimes a full visual position for a leader. Sometimes the quiet record of a boardroom, or a series that ends up in a book. The setting changes. The attention does not.",
        ),
        (
            "Two kinds of work. One way of looking.",
            "Two kinds of work. Same way of looking.",
        ),
        (
            "In commissioned work, I look for the photograph that makes a person or organisation understandable before the first handshake.",
            "In commissions I look for the picture that makes a person or a company understandable before the first handshake.",
        ),
        (
            "In my personal work, I slow the process down. Those series grow from memory, the body, biography and experiences that do not always fit neatly into words.",
            "In my own series I slow down. Memory, body, biography \u2014 things that do not always fit neatly into words.",
        ),
        (
            "The assignments and the independent projects are different, but the test is the same: does the image feel inhabited, or merely arranged?",
            "The test is the same either way: does the image feel inhabited, or just arranged?",
        ),
        (
            "Every substantial photographic project begins with one honest conversation.",
            "Every serious photographic project starts with one honest conversation.",
        ),
    ],
    "hu/index.html": [
        (
            "A f\u00e9nyk\u00e9p m\u00e1r az els\u0151 tal\u00e1lkoz\u00e1s el\u0151tt megsz\u00f3lal.",
            "A f\u00e9nyk\u00e9p gyakran el\u0151bb besz\u00e9l, mint \u00d6n.",
        ),
        (
            "Olyan vezet\u0151kkel \u00e9s szervezetekkel dolgozom, akikn\u00e9l a k\u00e9peknek val\u00f3di feladatuk van. Egy executive portr\u00e9 m\u00e9g a szem\u00e9lyes tal\u00e1lkoz\u00e1s el\u0151tt bemutat valakit. Egy brandfot\u00f3-sorozat meghat\u00e1rozza, hogyan \u00e9rtik meg a c\u00e9get. Egy C-level esem\u00e9ny k\u00e9pei k\u00e9s\u0151bb annak k\u00f6z\u00f6s eml\u00e9kezet\u00e9v\u00e9 v\u00e1lhatnak. Ezeket nem k\u00fcl\u00f6n\u00e1ll\u00f3 m\u0171fajokk\u00e9nt, hanem egyetlen vizu\u00e1lis nyelv r\u00e9szek\u00e9nt kezelem: legyen vil\u00e1gos, hiteles \u00e9s emberi.",
            "Olyan vezet\u0151kkel \u00e9s c\u00e9gekkel dolgozom, akikn\u00e9l a k\u00e9pnek t\u00e9nyleg van dolga. Bemutatni valakit egy tal\u00e1lkoz\u00e1s el\u0151tt. Megmutatni, milyen a c\u00e9g. Meg\u0151rizni egy fontos napot. Nem k\u00fcl\u00f6n m\u0171fajok ezek nekem. Egy nyelv.",
        ),
        (
            "A t\u00f6k\u00e9letes p\u00f3z \u00f6nmag\u00e1ban sosem \u00e9rdekelt. Ink\u00e1bb az ut\u00e1na k\u00f6vetkez\u0151 csendesebb pillanatot figyelem: amikor valaki m\u00e1r nem a kamer\u00e1t pr\u00f3b\u00e1lja kezelni, hanem egyszer\u0171en jelen van. T\u00f6bbnyire ott kezd\u0151dik el a portr\u00e9.",
            "A t\u00f6k\u00e9letes p\u00f3z? Nem az \u00e9rdekel.",
        ),
        (
            "Ez\u00e9rt a munka nem az expon\u00e1l\u00e1ssal, hanem besz\u00e9lget\u00e9ssel kezd\u0151dik. Mit kell elmondaniuk a k\u00e9peknek? Kik fogj\u00e1k l\u00e1tni \u0151ket? Hol kell m\u0171k\u00f6dni\u00fck? Csak ezut\u00e1n d\u00f6nt\u00f6k a f\u00e9nyr\u0151l, a helysz\u00ednr\u0151l \u00e9s arr\u00f3l, mennyi ir\u00e1ny\u00edt\u00e1sra van sz\u00fcks\u00e9g.",
            "Ink\u00e1bb az a p\u00e1r m\u00e1sodperc ut\u00e1na, amikor m\u00e1r nem a kamer\u00e1t kezeli az ember, hanem egyszer\u0171en ott van. Ott szokott elindulni a portr\u00e9. Ez\u00e9rt el\u0151bb besz\u00e9lget\u00fcnk. Mit kell elmondania a k\u00e9pnek? Kik l\u00e1tj\u00e1k majd? Hol fog \u00e9lni? A f\u00e9ny, a hely, az ir\u00e1ny\u00edt\u00e1s csak ut\u00e1na j\u00f6n.",
        ),
        (
            "Az eredm\u00e9ny lehet pontos executive headshot, egy vezet\u0151 teljes vizu\u00e1lis pozicion\u00e1l\u00e1sa, v\u00e1llalati k\u00e9prendszer, egy fontos tal\u00e1lkoz\u00e1s dokumentuma vagy k\u00f6nyvbe \u00e9s ki\u00e1ll\u00edt\u00e1sra sz\u00e1nt szem\u00e9lyes munka. A helyzet v\u00e1ltozik. A figyelem mindig az emberen marad, \u00e9s azon, mi igaz bel\u0151le abban a pillanatban.",
            "Az eredm\u00e9ny lehet pontos \u00fczleti portr\u00e9, egy vezet\u0151 teljes k\u00e9pi vil\u00e1ga, egy vezet\u0151i \u00fcl\u00e9s visszafogott dokument\u00e1ci\u00f3ja vagy k\u00e9s\u0151bb k\u00f6nyvbe ker\u00fcl\u0151 sorozat. A helyzet v\u00e1ltozik, a figyelem az emberen marad.",
        ),
        (
            "Egy alkot\u00f3i gyakorlat, k\u00e9t forma",
            "Egy gyakorlat, k\u00e9t forma",
        ),
        (
            "K\u00e9tf\u00e9le munka. Ugyanaz a figyelem.",
            "K\u00e9tf\u00e9le munka. Ugyanaz a figyelem.",
        ),
        (
            "A megb\u00edz\u00e1sos munk\u00e1imban azt a k\u00e9pet keresem, amely m\u00e1r az els\u0151 k\u00e9zfog\u00e1s el\u0151tt \u00e9rthet\u0151v\u00e9 tesz egy embert vagy egy szervezetet.",
            "A megb\u00edz\u00e1sokn\u00e1l azt keresem, ami m\u00e1r az els\u0151 k\u00e9zfog\u00e1s el\u0151tt \u00e9rthet\u0151v\u00e9 tesz valakit vagy egy c\u00e9get.",
        ),
        (
            "A szem\u00e9lyes sorozatokn\u00e1l lelass\u00edtom a folyamatot. Ezek a munk\u00e1k eml\u00e9kezetb\u0151l, testb\u0151l, \u00e9letrajzb\u00f3l \u00e9s olyan tapasztalatokb\u00f3l \u00e9p\u00fclnek, amelyek nem mindig f\u00e9rnek bele egy mondatba.",
            "A saj\u00e1t sorozatokn\u00e1l lelass\u00edtom a folyamatot. Eml\u00e9kekb\u0151l, testb\u0151l \u00e9s \u00e9lett\u00f6rt\u00e9netekb\u0151l dolgozom \u2014 olyan tapasztalatokb\u00f3l, amelyek nem mindig f\u00e9rnek bele a szavakba.",
        ),
        (
            "A k\u00e9t ter\u00fclet m\u00e1sk\u00e9pp m\u0171k\u00f6dik, de ugyanaz a k\u00e9rd\u00e9s d\u00f6nti el, hogy elk\u00e9sz\u00fclt-e a k\u00e9p: van benne val\u00f3di jelenl\u00e9t, vagy csak sz\u00e9pen elrendezt\u00fck?",
            "Mindk\u00e9t ter\u00fcleten ugyanaz a k\u00e9rd\u00e9s: val\u00f3di jelenl\u00e9tet l\u00e1tunk, vagy csup\u00e1n gondosan elrendezett form\u00e1t?",
        ),
    ],
    "de-at/index.html": [
        (
            "Das Bild spricht, bevor die Begegnung beginnt.",
            "Das Bild spricht oft, bevor Sie es tun.",
        ),
        (
            "Ich arbeite mit F\u00fchrungskr\u00e4ften und Organisationen, deren Bilder eine konkrete Aufgabe erf\u00fcllen m\u00fcssen. Ein Executive-Portr\u00e4t stellt einen Menschen oft vor dem pers\u00f6nlichen Gespr\u00e4ch vor. Eine Brandserie pr\u00e4gt, wie ein Unternehmen verstanden wird. Die Bilder eines C-Level-Events k\u00f6nnen sp\u00e4ter Teil seiner gemeinsamen Erinnerung werden. F\u00fcr mich geh\u00f6ren diese Aufgaben zu einer visuellen Sprache: klar, glaubw\u00fcrdig und menschlich.",
            "Ich arbeite mit F\u00fchrungskr\u00e4ften und Organisationen, bei denen das Bild eine echte Aufgabe hat. Jemanden vor dem Gespr\u00e4ch vorstellen. Zeigen, wie sich ein Unternehmen anf\u00fchlt. Einen wichtigen Tag festhalten. Das sind f\u00fcr mich keine getrennten Genres. Eine Sprache.",
        ),
        (
            "Die perfekte Pose hat mich nie besonders interessiert. Ich warte eher auf den ruhigeren Moment danach: wenn der Mensch vor der Kamera aufh\u00f6rt, sie kontrollieren zu wollen, und wirklich anwesend ist. Meist beginnt genau dort das Portr\u00e4t.",
            "Die perfekte Pose? Interessiert mich nicht besonders.",
        ),
        (
            "Darum beginnt die Arbeit mit einem Gespr\u00e4ch und nicht mit dem Ausl\u00f6ser. Was sollen die Bilder vermitteln? Wer wird sie sehen? Wo m\u00fcssen sie funktionieren? Erst danach entscheide ich \u00fcber Licht, Ort und dar\u00fcber, wie viel F\u00fchrung die Situation braucht.",
            "Ich warte eher auf den Moment danach \u2014 wenn der Mensch aufh\u00f6rt, die Kamera zu managen, und einfach da ist. Meist beginnt dort das Portr\u00e4t. Deshalb sprechen wir zuerst. Was soll das Bild sagen? Wer sieht es? Wo soll es leben? Licht, Ort und F\u00fchrung kommen danach.",
        ),
        (
            "Das Ergebnis kann ein pr\u00e4ziser Executive-Headshot sein, die visuelle Positionierung einer F\u00fchrungspers\u00f6nlichkeit, ein Bildsystem f\u00fcr ein Unternehmen, das Dokument einer wichtigen Begegnung oder eine pers\u00f6nliche Arbeit f\u00fcr Buch und Ausstellung. Die Situation ver\u00e4ndert sich. Meine Aufmerksamkeit bleibt beim Menschen und bei dem, was in diesem Moment wahr ist.",
            "Manchmal wird daraus ein pr\u00e4ziser Headshot. Manchmal die ganze visuelle Position einer F\u00fchrungsperson. Manchmal das ruhige Dokument eines Board Meetings oder eine Serie, die sp\u00e4ter in ein Buch wandert. Die Situation \u00e4ndert sich. Die Aufmerksamkeit nicht.",
        ),
        (
            "Zwei Arbeitsfelder. Dieselbe Aufmerksamkeit.",
            "Zwei Arbeitsfelder. Dieselbe Art zu schauen.",
        ),
        (
            "In Auftragsarbeiten suche ich das Bild, das einen Menschen oder eine Organisation schon vor dem ersten H\u00e4ndedruck verst\u00e4ndlich macht.",
            "Bei Auftr\u00e4gen suche ich das Bild, das einen Menschen oder ein Unternehmen schon vor dem H\u00e4ndedruck verst\u00e4ndlich macht.",
        ),
        (
            "Bei freien Serien verlangsame ich den Prozess. Sie entstehen aus Erinnerung, K\u00f6rper, Biografie und Erfahrungen, die sich nicht immer sauber in Worte fassen lassen.",
            "Bei freien Serien werde ich langsamer. Erinnerung, K\u00f6rper, Biografie \u2014 Dinge, die sich nicht immer sauber in Worte fassen lassen.",
        ),
        (
            "Die beiden Bereiche funktionieren unterschiedlich. Die entscheidende Frage bleibt dieselbe: Ist im Bild wirkliche Gegenwart zu sp\u00fcren \u2014 oder wurde nur alles ordentlich arrangiert?",
            "Die Frage bleibt dieselbe: Ist im Bild Gegenwart \u2014 oder nur Anordnung?",
        ),
    ],
}

def main():
    root = Path(__file__).resolve().parents[1]
    for rel, pairs in replacements.items():
        path = root / rel
        text = path.read_text(encoding="utf-8")
        for old, new in pairs:
            count = text.count(old)
            if count != 1:
                raise SystemExit(f"{rel}: expected 1, found {count} for: {old[:50]!r}")
            text = text.replace(old, new)
        path.write_text(text, encoding="utf-8")
        print(f"updated {rel}")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Apply natural human-voice rewrites to the three homepages."""
from pathlib import Path
import json
import base64

HERE = Path(__file__).resolve().parent

def load_pairs():
    json_path = HERE / "homepage-voice-pairs.json"
    b64_path = HERE / "homepage-voice-pairs.b64"
    if json_path.exists():
        return json.loads(json_path.read_text(encoding="utf-8"))
    if b64_path.exists():
        raw = base64.b64decode(b64_path.read_text(encoding="ascii").strip())
        return json.loads(raw.decode("utf-8"))
    raise SystemExit("Missing homepage-voice-pairs.json or .b64")

pairs = load_pairs()

FILES = {
    "index.html": pairs["en"],
    "hu/index.html": pairs["hu"],
    "de-at/index.html": pairs["de"],
}

def main():
    root = HERE.parent
    for rel, file_pairs in FILES.items():
        path = root / rel
        text = path.read_text(encoding="utf-8")
        for old, new in file_pairs:
            count = text.count(old)
            if count != 1:
                raise SystemExit(f"{rel}: expected 1 match, found {count} for: {old[:60]!r}")
            text = text.replace(old, new)
        path.write_text(text, encoding="utf-8")
        print(f"updated {rel}")

if __name__ == "__main__":
    main()

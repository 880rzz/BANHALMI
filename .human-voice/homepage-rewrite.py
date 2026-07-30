#!/usr/bin/env python3
from pathlib import Path
import base64
HERE = Path(__file__).resolve().parent
code = base64.b64decode((HERE / "homepage-rewrite.b64").read_text().strip())
exec(compile(code, str(HERE / "_homepage_rewrite_body.py"), "exec"))

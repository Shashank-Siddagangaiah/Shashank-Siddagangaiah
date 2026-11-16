#!/usr/bin/env python3
"""build_page.py - assemble a study page (or a hub of pages) from topic files and the shared engine.

Usage:
  python3 build_page.py --out page.html TOPIC.js [TOPIC.js ...] [--catalog catalog.js] [--title "Name"] [--artifact]

  TOPIC.js     one file per topic; each calls CE.register({...}) (see assets/topic.schema.md)
  --catalog    optional hub file that calls CE.setCatalog({...}); without it the page shows the first topic
  --title      <title> of the page (defaults to the first topic's title or the catalog title)
  --artifact   omit <!doctype>/<html>/<head>/<body>; the Artifact publish step adds its own skeleton
               (use this for files you publish with the Artifact tool; leave it off for a standalone .html file)

The output is ONE self-contained HTML file: engine CSS and JS are inlined, fonts come from Google Fonts
(the only stylesheet host the Artifact CSP allows), and nothing else is loaded from the network.
"""
import argparse
import html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&'
         'family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap">')


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def guess_title(srcs):
    for s in srcs:
        m = re.search(r'\btitle:\s*"([^"]+)"', s)
        if m:
            return m.group(1)
    return "Study Guide"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("topics", nargs="+")
    ap.add_argument("--catalog")
    ap.add_argument("--out", required=True)
    ap.add_argument("--title")
    ap.add_argument("--artifact", action="store_true")
    a = ap.parse_args()

    css = read(os.path.join(ASSETS, "engine.css"))
    js = read(os.path.join(ASSETS, "engine.js"))
    cat = read(a.catalog) if a.catalog else ""
    tops = [read(t) for t in a.topics]
    for t, src in zip(a.topics, tops):
        if "CE.register(" not in src:
            sys.exit(f"{t}: no CE.register(...) call found")
        if "</script" in src.lower():
            sys.exit(f"{t}: contains '</script' which would end the inline script early; split it as '<\\/script'")
    title = a.title or guess_title(([cat] if cat else []) + tops)

    head = (f"<title>{html.escape(title)}</title>\n"
            '<meta name="claude:viewport-fit-sides" content="cover">\n'
            f"{FONTS}\n<style>\n{css}\n</style>\n")
    body = ("<main></main>\n"
            f"<script>\n{js}\n</script>\n"
            + (f"<script>\n{cat}\n</script>\n" if cat else "")
            + "".join(f"<script>\n{t}\n</script>\n" for t in tops)
            + "<script>CE.start();</script>\n")
    if a.artifact:
        out = head + body
    else:
        out = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
               '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
               + head + "</head>\n<body>\n" + body + "</body>\n</html>\n")
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"wrote {a.out} ({len(out) // 1024} KB, {len(tops)} topic(s){', hub' if cat else ''})")


if __name__ == "__main__":
    main()

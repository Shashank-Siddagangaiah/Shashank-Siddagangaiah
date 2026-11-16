#!/usr/bin/env python3
"""ste_lint.py - measure how close a text is to ~80% ASD-STE100 (Simplified Technical English).

Usage:
  python3 ste_lint.py FILE [FILE ...] [--glossary TERMS.txt] [--max-words 25] [--min-clean 0.8] [--json]

Reads .md, .txt or .html (scripts, styles, SVG, code and pre blocks are ignored).
For each sentence it flags:
  LONG     more words than --max-words (default 25; procedures should aim for 20)
  PASSIVE  a form of "be" followed by a past participle (heuristic)
  WORDY    a corporate or vague word with a plain replacement (leverage -> use)
  MULTI    two clauses joined by "; " or by ", which" / ", and" after 18+ words
Numbered or bulleted lines that look like steps are also checked:
  NOVERB   a numbered step that does not start with a verb in command form (heuristic: starts with a/an/the/this/it/there)
A glossary file (one line per term: preferred=synonym1,synonym2) adds:
  SYNONYM  a banned synonym of a preferred term appears (K5: one word for one meaning)

Exit code 0 when the share of clean sentences is >= --min-clean, else 1.
"""
import argparse
import html
import json
import re
import sys
from html.parser import HTMLParser

WORDY = {
    "leverage": "use", "leverages": "uses", "leveraging": "using", "utilize": "use", "utilizes": "uses",
    "utilizing": "using", "utilization": "use", "facilitate": "help", "facilitates": "helps",
    "in order to": "to", "prior to": "before", "subsequent to": "after", "commence": "start",
    "terminate": "stop", "endeavor": "try", "ascertain": "find out", "approximately": "about",
    "numerous": "many", "sufficient": "enough", "additional": "more", "demonstrate": "show",
    "synergy": "(cut it)", "robust": "(say what it resists)", "seamless": "(cut it)",
    "it is important to note that": "(cut it)", "note that": "(cut it)", "basically": "(cut it)",
    "essentially": "(cut it)", "very": "(cut it or use a stronger word)", "in terms of": "for",
    "a number of": "some", "due to the fact that": "because", "at this point in time": "now",
}
BE = r"(?:is|are|was|were|be|been|being|gets|got)"
IRREGULAR = ("built|done|made|given|taken|shown|known|seen|written|sent|kept|found|held|left|set|put|"
             "run|read|chosen|driven|frozen|broken|split|spent|thrown|hidden|drawn|grown|bound|"
             "fed|led|meant|paid|sold|told|won|cut|hit|shut|spread|stored|used")
PASSIVE_RE = re.compile(r"\b" + BE + r"\s+(?:\w+ly\s+)?(\w+ed|" + IRREGULAR + r")\b", re.I)
NOT_PASSIVE = {"based", "called", "needed", "used to", "supposed", "interested", "tired", "excited",
               "concerned", "related", "limited", "advanced", "detailed", "fixed", "skilled", "red", "bed", "shed"}
STEP_RE = re.compile(r"^\s*(?:(\d+)[.)]|[-*•])\s+(.*)$")
BAD_STEP_START = re.compile(r"^(?:a|an|the|this|that|these|those|it|there|we|you should|one)\b", re.I)


class TextOnly(HTMLParser):
    SKIP = {"script", "style", "svg", "code", "pre", "head", "title"}
    BLOCK = {"p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "div", "section", "figcaption", "td", "th",
             "tr", "br", "summary", "details", "header", "footer", "blockquote", "dd", "dt", "label", "button"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.out = []

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self.depth += 1
        if tag in self.BLOCK:
            self.out.append("\n")
        if tag == "li":
            self.out.append("- ")

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.depth:
            self.depth -= 1
        if tag in self.BLOCK:
            self.out.append("\n")

    def handle_data(self, data):
        if not self.depth:
            self.out.append(data)


def extract(path):
    raw = open(path, encoding="utf-8", errors="replace").read()
    if path.lower().endswith((".html", ".htm")):
        p = TextOnly()
        p.feed(raw)
        text = "".join(p.out)
    else:
        text = re.sub(r"```.*?```", "\n", raw, flags=re.S)       # code fences
        text = re.sub(r"`[^`]*`", "x", text)                     # inline code
        text = re.sub(r"^\s*\|.*\|\s*$", "", text, flags=re.M)    # tables: cells are not sentences
        text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)
        text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)      # links -> text
        text = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.S)  # front matter
        text = re.sub(r"[#>*_]+", " ", text)
    return html.unescape(text)


def sentences(text):
    out = []
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        m = STEP_RE.match(line)
        is_step = bool(m and m.group(1))          # only numbered lines count as steps
        body = m.group(2) if m else line
        parts = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9“\"(])", body)
        for i, s in enumerate(parts):
            s = s.strip()
            if len(re.findall(r"[A-Za-z]+", s)) < 3:   # labels, numbers, headings of 1-2 words
                continue
            out.append((s, is_step and i == 0))
    return out


def load_glossary(path):
    rules = []
    if not path:
        return rules
    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        pref, syns = line.split("=", 1)
        for s in syns.split(","):
            s = s.strip()
            if s:
                rules.append((pref.strip(), s, re.compile(r"\b" + re.escape(s) + r"\b", re.I)))
    return rules


def check(sent, is_step, max_words, glossary):
    flags = []
    words = re.findall(r"[A-Za-z0-9'’-]+", sent)
    if len(words) > max_words:
        flags.append(f"LONG({len(words)})")
    for m in PASSIVE_RE.finditer(sent):
        if m.group(1).lower() not in NOT_PASSIVE:
            flags.append(f"PASSIVE('{m.group(0)}')")
            break
    low = sent.lower()
    for w, rep in WORDY.items():
        if re.search(r"\b" + re.escape(w) + r"\b", low):
            flags.append(f"WORDY('{w}'->{rep})")
    if "; " in sent or (len(words) >= 18 and re.search(r",\s+(which|and then|and also)\b", low)):
        flags.append("MULTI")
    if is_step and BAD_STEP_START.match(sent):
        flags.append("NOVERB")
    for pref, syn, rx in glossary:
        if rx.search(sent):
            flags.append(f"SYNONYM('{syn}'->'{pref}')")
    return flags


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+")
    ap.add_argument("--glossary")
    ap.add_argument("--max-words", type=int, default=25)
    ap.add_argument("--min-clean", type=float, default=0.8)
    ap.add_argument("--json", action="store_true", help="print a machine-readable summary")
    ap.add_argument("--show", type=int, default=12, help="how many flagged sentences to print per file")
    a = ap.parse_args()
    glossary = load_glossary(a.glossary)
    ok_all = True
    results = []
    for f in a.files:
        sents = sentences(extract(f))
        flagged = [(s, check(s, st, a.max_words, glossary)) for s, st in sents]
        bad = [(s, fl) for s, fl in flagged if fl]
        n = len(sents) or 1
        clean = 1 - len(bad) / n
        avg = sum(len(re.findall(r"[A-Za-z0-9'’-]+", s)) for s, _ in sents) / n
        ok = clean >= a.min_clean
        ok_all &= ok
        counts = {}
        for _, fl in bad:
            for x in fl:
                k = x.split("(")[0]
                counts[k] = counts.get(k, 0) + 1
        results.append({"file": f, "sentences": len(sents), "clean_share": round(clean, 3),
                        "avg_words": round(avg, 1), "flags": counts, "pass": ok})
        if not a.json:
            print(f"{f}: {len(sents)} sentences, {clean:.0%} clean, avg {avg:.1f} words/sentence -> {'PASS' if ok else 'FAIL'} (target {a.min_clean:.0%})")
            if counts:
                print("  flags: " + ", ".join(f"{k} {v}" for k, v in sorted(counts.items(), key=lambda kv: -kv[1])))
            for s, fl in bad[: a.show]:
                print(f"  - [{' '.join(fl)}] {s[:160]}")
    if a.json:
        print(json.dumps(results, indent=1))
    sys.exit(0 if ok_all else 1)


if __name__ == "__main__":
    main()

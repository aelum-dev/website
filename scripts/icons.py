#!/usr/bin/env python3
"""
Manage the website's tiny icon font.

The website references a handful of Nerd Font glyphs via <span class="nf-icon">
in the Astro components and icon codes in src/lib/site.ts. Those glyphs live in
a hand-built subset of the Nerd Fonts "Symbols Only" build
(SymbolsNerdFont-Regular.ttf) that has been compressed to a woff2 and inlined
into the CSS. Keeping the subset small keeps the inlined font small.

This tool does two things:

  1. find   - look up the codepoint(s) of an icon in the FULL source font, by
              exact glyph name or keyword (e.g. "gitlab", "cloud download").
  2. add    - add one or more glyphs to the website subset and rebuild the
              woff2. It reads whatever glyphs are already in the woff2 and keeps
              them, so running it repeatedly never drops an existing icon.

The other subcommands are helpers:

  list     - show the glyphs currently in the website subset.
  info     - show which set/codepoint a given codepoint maps to.

Usage:
    python scripts/icons.py find <keyword>
    python scripts/icons.py add <codepoint> [<codepoint> ...]
    python scripts/icons.py list
    python scripts/icons.py info <codepoint>

Codepoints may be given as bare hex (f296) or with a U+ prefix (U+f296).

The full source font is read for lookups and glyph outlines. Override its
location with --font or the NERD_FONT environment variable; it defaults to the
Nerd Fonts "Symbols Only" build used to build the site originally.
"""

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    from fontTools.ttLib import TTFont
except ImportError:  # pragma: no cover
    print("fonttools is required:  pip install fonttools")
    sys.exit(1)

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
WOFF2 = ROOT / "src" / "styles" / "fonts" / "NerdFontsSymbols.woff2"
DEFAULT_FONT = Path.home() / "Downloads" / "NerdFontsSymbolsOnly" / "SymbolsNerdFont-Regular.ttf"
SCRIPT_REL = os.path.relpath(__file__, ROOT)


def run(cmd):
    subprocess.run(cmd, check=True)


def load_cmap(path):
    """Return {codepoint: glyph_name} for a font file."""
    return TTFont(str(path))["cmap"].getBestCmap()


def parse_cp(token):
    return int(token.upper().replace("U+", ""), 16)


def fmt_cp(cp):
    return "U+" + format(cp, "x").upper()


def resolve_font(args):
    font = Path(args.font) if getattr(args, "font", None) else None
    if font is None:
        font = Path(os.environ["NERD_FONT"]) if os.environ.get("NERD_FONT") else DEFAULT_FONT
    if not font.exists():
        print(f"ERROR: source font not found: {font}", file=sys.stderr)
        print(f"Point it with:  python {SCRIPT_REL} --font <path> ...  (or set NERD_FONT)", file=sys.stderr)
        sys.exit(1)
    return font


def cmd_find(args):
    font = resolve_font(args)
    cmap = load_cmap(font)
    kw = args.keyword.lower()
    hits = {nm: cp for cp, nm in cmap.items() if isinstance(nm, str) and kw in nm.lower()}
    if not hits:
        print(f"No glyphs matching '{args.keyword}' in {font.name}")
        return 1
    for nm, cp in sorted(hits.items(), key=lambda kv: (len(fmt_cp(kv[1])), fmt_cp(kv[1]))):
        print(f"  {fmt_cp(cp):>8}  {nm}")
    best = min(hits.values(), key=lambda cp: (len(fmt_cp(cp)), fmt_cp(cp)))
    print(f"\nAdd it with:  python {SCRIPT_REL} add {fmt_cp(best)}")
    return 0


def cmd_add(args):
    font = resolve_font(args)
    if not WOFF2.exists():
        print(f"ERROR: {WOFF2} does not exist yet.", file=sys.stderr)
        sys.exit(1)

    font_cmap = load_cmap(font)
    existing = load_cmap(WOFF2)
    new_cps = [parse_cp(t) for t in args.codepoints]

    for cp in new_cps:
        if cp in existing:
            print(f"  {fmt_cp(cp)} already present ({font_cmap.get(cp, '?')})")
    to_add = [cp for cp in new_cps if cp not in existing]
    missing = [cp for cp in to_add if font_cmap.get(cp) is None]
    if missing:
        print(
            "ERROR: codepoint(s) not in source font (they may belong to a different "
            "patch set). Add the glyph to the source font first.",
            file=sys.stderr,
        )
        print("  " + ", ".join(fmt_cp(c) for c in missing))
        return 1

    all_cps = sorted(set(existing) | set(new_cps))
    print(f"Rebuilding {WOFF2.name}: {len(existing)} -> {len(all_cps)} glyphs (+{len(to_add)}).")

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        ttf = td / "subset.ttf"
        woff = td / "subset.woff2"
        unicodes = ",".join("U+" + format(cp, "x").upper() for cp in all_cps)
        # Subset the full font down to just the glyphs we need.
        run(["fonttools", "subset", str(font), f"--output-file={ttf}", f"--unicodes={unicodes}"])
        # Compress to woff2 (woff2_compress writes <input>.woff2 next to the input).
        run(["woff2_compress", str(ttf)])
        shutil.copy(woff, WOFF2)

    print("Done.")
    return 0


def cmd_list(args):
    font = resolve_font(args)
    font_cmap = load_cmap(font)
    cmap = load_cmap(WOFF2)
    print(f"{len(cmap)} glyphs in {WOFF2.name} (names from {font.name}):")
    for cp in sorted(cmap):
        print(f"  {fmt_cp(cp):>8}  {font_cmap.get(cp, cmap.get(cp, '?'))}")
    return 0


def cmd_info(args):
    font = resolve_font(args)
    font_cmap = load_cmap(font)
    cp = parse_cp(args.codepoint)
    print(f"{fmt_cp(cp)}:")
    print(f"  source font {font.name}: {font_cmap.get(cp, 'NOT PRESENT')}")
    if WOFF2.exists():
        w = load_cmap(WOFF2)
        print(f"  website woff2 : {'present' if cp in w else 'not in subset'}")
    else:
        print("  website woff2 : (missing)")
    return 0


def main():
    parser = argparse.ArgumentParser(description="Manage the website's Nerd Font icon subset.")
    parser.add_argument(
        "--font",
        help=f"Path to the full source Nerd Font (default: {DEFAULT_FONT}).",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_find = sub.add_parser("find", help="Look up icon codepoints by name/keyword.")
    p_find.add_argument("keyword", help="Exact glyph name or keyword, e.g. 'gitlab' or 'cloud download'.")
    p_find.set_defaults(func=cmd_find)

    p_add = sub.add_parser("add", help="Add glyph(s) to the website subset and rebuild the woff2.")
    p_add.add_argument("codepoints", nargs="+", help="Codepoint(s) to add, hex or U+ prefixed.")
    p_add.set_defaults(func=cmd_add)

    p_list = sub.add_parser("list", help="List glyphs currently in the website subset.")
    p_list.set_defaults(func=cmd_list)

    p_info = sub.add_parser("info", help="Show the glyph at a codepoint.")
    p_info.add_argument("codepoint")
    p_info.set_defaults(func=cmd_info)

    args = parser.parse_args()
    sys.exit(args.func(args))


if __name__ == "__main__":
    main()

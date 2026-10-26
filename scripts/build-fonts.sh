#!/usr/bin/env bash
# Rebuild the self-hosted text fonts (Sora display + Nunito body).
#
# Run this manually when a font needs updating; the produced woff2 files are
# committed artifacts (same policy as scripts/icons.py and the rEFInd PNGs).
# It is the only place the website touches the network for fonts — the site
# itself stays fully offline.
#
# Upstream: google/fonts (SIL Open Font License 1.1).
#   ofl/sora/Sora[wght].ttf      wght 100..800   (Latin, Latin Extended)
#   ofl/nunito/Nunito[wght].ttf  wght 200..1000  (Latin, Latin Extended, Cyrillic)
#
# Requires: curl, python3 + fontTools (pyftsubset), brotli.
set -euo pipefail

cd "$(dirname "$0")/.."
OUT="src/styles/fonts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

GF="https://raw.githubusercontent.com/google/fonts/main/ofl"

fetch() { # fetch <ofl-path> <out-name>
  curl -sfL --retry 3 -o "$TMP/$2" "$GF/$1"
}

fetch "sora/Sora%5Bwght%5D.ttf"    "Sora[wght].ttf"
fetch "nunito/Nunito%5Bwght%5D.ttf" "Nunito[wght].ttf"

# Axis ranges are clamped to what the CSS actually asks for: a face that cannot
# go lighter or heavier than declared can never be faux-weighted again.
# (pyftsubset has no --instancer in every distro build, so instance first.)
python3 - "$TMP" "$OUT" <<'PY'
import sys, pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.subset import Subsetter, Options

TMP, OUT = map(pathlib.Path, sys.argv[1:3])

# Google's own subsetting ranges, so coverage matches what a CDN build would ship.
LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
CYRILLIC = "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116"

options = Options()
options.flavor = "woff2"
options.layout_features = ["kern", "liga", "calt", "tnum", "lnum"]
options.drop_tables += ["DSIG"]
options.notdef_outline = True

jobs = [
    ("Sora[wght].ttf", "sora-wght-latin.woff2", LATIN, {"wght": (400, 800)}),
    ("Nunito[wght].ttf", "nunito-wght-latin.woff2", LATIN, {"wght": (400, 900)}),
    ("Nunito[wght].ttf", "nunito-wght-cyrillic.woff2", CYRILLIC, {"wght": (400, 900)}),
]

def parse_unicodes(spec):
    # Accepts "U+0041-005A,U+0400" (the pyftsubset CLI spelling).
    out = []
    for part in spec.split(","):
        part = part.strip().lstrip("U+")
        if not part:
            continue
        if "-" in part:
            lo, hi = part.split("-")
            out.extend(range(int(lo, 16), int(hi, 16) + 1))
        else:
            out.append(int(part, 16))
    return out


for src_name, out_name, unicodes, axes in jobs:
    font = TTFont(TMP / src_name)
    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=parse_unicodes(unicodes))
    subsetter.subset(font)
    # Instance after subsetting: instancing first disturbs glyf variation glyph
    # names and the subsetter then trips over them.
    font = instancer.instantiateVariableFont(
        font, axes, updateFontNames=False, inplace=True
    )
    font.flavor = "woff2"
    font.save(OUT / out_name)
    print(f"wrote {out_name}")
PY

# The variable axes must survive subsetting, otherwise the CSS weights are fake again.
python3 - "$OUT" <<'PY'
import sys, pathlib
from fontTools.ttLib import TTFont
out = pathlib.Path(sys.argv[1])
for p in sorted(out.glob("*.woff2")):
    if p.name.startswith("NerdFonts"):
        continue
    f = TTFont(p)
    axes = [(a.axisTag, a.minValue, a.maxValue) for a in f["fvar"].axes] if "fvar" in f else []
    print(f"{p.name:34} {p.stat().st_size:>7} B  axes={axes}")
PY

echo "done -> $OUT"

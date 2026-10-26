#!/usr/bin/env python3
"""
Crop full-desktop installer captures into the screenshot sources the site uses.

    <dir>/1.png … N.png   a desktop screenshot with the installer window in it
      -> assets/<prefix>-<n>-<light|dark>.png

Why this exists: the site's walkthrough shows the installer **window**, not the
desktop around it (see components/Install.astro). A capture off a real display
carries the top bar and the wallpaper, and the window is only part of it — the
window here is 1200x800 inside a 2560x1440 frame. Cropping is what turns a
capture into a source, and it is done here rather than by hand so the geometry
is written down instead of guessed at each re-shoot.

The window is found, not assumed: everything that differs from the colour of the
capture's corners is content, and the largest contiguous band of content rows and
content columns is the window. That ignores the desktop bar (it shares the
corner colour or is a few rows tall) and needs no hardcoded offsets. The result
is printed and sanity-checked; the script refuses to write a crop it is not
confident about.

Sources are written lossless (PNG). Everything after this point — the responsive
ladder and src/lib/images.ts — is scripts/build-images.py's job.

Requires: python3 + Pillow + numpy.

    python3 scripts/prepare-sources.py \
        --light ~/Pictures/Screenshots/installer-light \
        --dark  ~/Pictures/Screenshots/installer-dark
"""

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets"

# A row/column counts as holding the window when at least this many of its
# pixels differ from the capture background. Below the noise of a wallpaper or a
# desktop bar, above the anti-aliasing of a window edge.
MIN_CONTENT_PIXELS = 50
# Channel-sum distance from the background that counts as content.
COLOR_TOLERANCE = 18
# The window is a landscape rectangle; a crop outside these ratios means the
# detection found something else.
MIN_ASPECT, MAX_ASPECT = 1.1, 2.4
# A crop smaller than this is a fragment, not a window.
MIN_SIDE = 400


def background(im: Image.Image) -> tuple[int, int, int]:
    """The capture's background: the colour its corners agree on."""
    px = im.load()
    w, h = im.size
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    return tuple(sum(c[i] for c in corners) // 4 for i in range(3))


def content_counts(im: Image.Image, bg: tuple[int, int, int]):
    """Per-row and per-column count of pixels that are not the background."""
    a = np.asarray(im, dtype=np.int16)
    diff = np.abs(a - np.array(bg, dtype=np.int16)).sum(axis=2)
    mask = diff > COLOR_TOLERANCE
    return mask.sum(axis=1).tolist(), mask.sum(axis=0).tolist()


def bands(counts: list[int]) -> list[tuple[int, int]]:
    """Contiguous runs where the row/column holds content, widest first."""
    runs = []
    start = None
    for i, n in enumerate(counts):
        if n >= MIN_CONTENT_PIXELS and start is None:
            start = i
        elif n < MIN_CONTENT_PIXELS and start is not None:
            runs.append((start, i - 1))
            start = None
    if start is not None:
        runs.append((start, len(counts) - 1))
    return sorted(runs, key=lambda r: r[1] - r[0], reverse=True)


def window_box(im: Image.Image) -> tuple[int, int, int, int]:
    """Bounding box of the largest content block: the installer window."""
    rows, cols = content_counts(im, background(im))

    row_band = bands(rows)[0]
    col_band = bands(cols)[0]
    box = (col_band[0], row_band[0], col_band[1] + 1, row_band[1] + 1)

    bw, bh = box[2] - box[0], box[3] - box[1]
    aspect = bw / bh
    if min(bw, bh) < MIN_SIDE or not (MIN_ASPECT <= aspect <= MAX_ASPECT):
        raise SystemExit(
            f"detected window {bw}x{bh} at {box} does not look like an installer "
            f"window (want a landscape crop, both sides >= {MIN_SIDE})"
        )
    return box


def prepare(src_dir: Path, theme: str, prefix: str, first: int, last: int) -> int:
    if not src_dir.is_dir():
        raise SystemExit(f"no such directory: {src_dir}")

    written = 0
    for n in range(first, last + 1):
        src = src_dir / f"{n}.png"
        if not src.is_file():
            print(f"  skip {src} (missing)", file=sys.stderr)
            continue

        with Image.open(src) as im:
            if im.mode != "RGB":
                im = im.convert("RGB")
            box = window_box(im)
            crop = im.crop(box)

        out = OUT_DIR / f"{prefix}-{n}-{theme}.png"
        crop.save(out, "PNG", optimize=True)
        written += 1
        print(
            f"  {src.name} {im.size[0]}x{im.size[1]} -> {out.relative_to(ROOT)} "
            f"{crop.width}x{crop.height} (window at {box})"
        )
    return written


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--light", required=True, help="directory of light-theme captures (1.png, 2.png, …)")
    ap.add_argument("--dark", required=True, help="directory of dark-theme captures (1.png, 2.png, …)")
    ap.add_argument("--prefix", default="installer-step", help="manifest key prefix (default: installer-step)")
    ap.add_argument("--from", dest="first", type=int, default=1, help="first capture number")
    ap.add_argument("--to", dest="last", type=int, default=7, help="last capture number")
    args = ap.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    total = prepare(Path(args.light).expanduser(), "light", args.prefix, args.first, args.last)
    total += prepare(Path(args.dark).expanduser(), "dark", args.prefix, args.first, args.last)
    if not total:
        print("nothing written", file=sys.stderr)
        return 1
    print(f"wrote {total} sources to {OUT_DIR.relative_to(ROOT)}; now run scripts/build-images.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

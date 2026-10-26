#!/usr/bin/env python3
"""
Build the website's served image set from the source screenshots.

    assets/<key>.png            the screenshots themselves (the only copy)
      -> public/images/<key>-<width>w.<hash>.avif
      -> public/images/<key>-<width>w.<hash>.webp
      -> src/lib/images.ts      generated manifest the components read

A capture off a display is not a source: it is a whole desktop with the installer
window in it. scripts/prepare-sources.py crops those captures into assets/ (see
that file); this one turns sources into what the site serves.

Why a manifest: the served filenames are content-hashed so they can be cached
forever (GitHub Pages has no header control). Hashes change when a screenshot is
re-shot, and components must not be edited to follow them — they look a key up
in `images` and the component builds the <picture>.

Responsive widths are derived per source: a 1200px-wide screenshot never gets a
2560px derivative, and a source is never upscaled.

Format policy: **AVIF is the only responsive ladder.** WebP is encoded once per
source, at the fallback width, and is used solely as the <img src> for a browser
that cannot decode AVIF (Safari < 16, Firefox < 93, a few Linux builds without
libavif). A browser that supports <picture> but not AVIF skips the AVIF <source>
and takes the <img src>, so one WebP covers every browser in scope. Shipping a
full WebP ladder as well cost ~530 KB of repo for a format almost no current
visitor fetches: AVIF is ~1.7x smaller on these screenshots.

Requires: python3 + Pillow, avifenc.
"""

import hashlib
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "assets"
OUT_DIR = ROOT / "public" / "images"
MANIFEST = ROOT / "src" / "lib" / "images.ts"

# Candidate widths; anything wider than the source is dropped (no upscaling).
WIDTHS = (800, 1280, 1920)
# The single WebP fallback is encoded at the widest ladder width at or below this.
FALLBACK_MAX_WIDTH = 1280

# Encode quality, chosen by what the screenshot is *of*.
#   ui      — a window whose subject is text, and which the page renders close to
#             1:1. A low qcolor puts ringing on every glyph edge, and that is the
#             first thing a visitor sees, so these pay ~1.5x the bytes.
#   desktop — a whole-desktop shot used as a decorative frame (the hero): it is
#             shown small relative to its pixels, so the old profile is invisible.
PROFILES = {
    "ui": {"avif_qcolor": 55, "webp_quality": 82},
    "desktop": {"avif_qcolor": 38, "webp_quality": 74},
}
# Sources keep the "ui" profile unless named here. The hero stays on "desktop"
# until the landing page's own screenshots are re-shot.
PROFILE_BY_PREFIX = {"hero-": "desktop"}


def profile_for(key: str) -> dict:
    for prefix, name in PROFILE_BY_PREFIX.items():
        if key.startswith(prefix):
            return PROFILES[name]
    return PROFILES["ui"]


def target_widths(src_w: int) -> list[int]:
    widths = [w for w in WIDTHS if w < src_w]
    if src_w <= WIDTHS[-1]:
        widths.append(src_w)  # keep a 1:1 derivative for the source size
    return sorted(set(widths))


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:8]


def encode(src: Path, key: str, width: int, height: int, is_fallback: bool, written: set) -> dict:
    """Encode one derivative. AVIF always; WebP only at the fallback width."""
    quality = profile_for(key)
    with Image.open(src) as im:
        im.load()
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        if width != im.width:
            im = im.resize((width, height), Image.LANCZOS)

        tmp = OUT_DIR / f".tmp-{key}-{width}.png"
        im.save(tmp, "PNG")

        entry = {}
        kinds = ["avif"] + (["webp"] if is_fallback else [])
        for kind in kinds:
            out = OUT_DIR / f"{key}-{width}w.placeholder.{kind}"
            if kind == "avif":
                subprocess.run(
                    ["avifenc", "--qcolor", str(quality["avif_qcolor"]), "--qalpha", "0",
                     "--jobs", "4", str(tmp), str(out)],
                    check=True, capture_output=True,
                )
            else:
                im.save(out, "WEBP", quality=quality["webp_quality"], method=6)

            name = f"{key}-{width}w.{digest(out)}.{kind}"
            final = OUT_DIR / name
            out.rename(final)
            entry[kind] = f"/images/{name}"
            written.add(name)
            print(f"  {name:52} {final.stat().st_size:>7} B")

        tmp.unlink()
        return entry


def main() -> int:
    if not SRC_DIR.is_dir():
        print(f"no source directory: {SRC_DIR}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    sources = sorted(SRC_DIR.glob("*.png"))
    if not sources:
        print("no source PNGs found", file=sys.stderr)
        return 1

    manifest: dict[str, dict] = {}
    written: set[str] = set()

    for src in sources:
        key = src.stem
        with Image.open(src) as im:
            src_w, src_h = im.size
        print(f"{key}  {src_w}x{src_h}")
        widths = target_widths(src_w)
        # One WebP, at the widest ladder entry a non-AVIF browser should get.
        fallback_width = max([w for w in widths if w <= FALLBACK_MAX_WIDTH] or [widths[-1]])

        per_width = {}
        for w in widths:
            h = round(src_h * w / src_w)
            per_width[w] = encode(src, key, w, h, w == fallback_width, written)

        fallback = per_width[fallback_width]
        manifest[key] = {
            "width": src_w,
            "height": src_h,
            "variants": [
                {"width": w, "avif": v["avif"]}
                for w, v in sorted(per_width.items())
            ],
            "fallback": {"width": fallback_width, "webp": fallback["webp"]},
        }

    # Drop derivatives that are no longer produced (re-shot or resized sources).
    keep = set(written)
    for stale in OUT_DIR.iterdir():
        if stale.is_file() and stale.name not in keep and ".tmp-" not in stale.name:
            stale.unlink()
            print(f"  removed stale {stale.name}")

    body = json.dumps(manifest, indent=2)
    MANIFEST.write_text(
        "// GENERATED by scripts/build-images.py — do not edit by hand.\n"
        "// Maps a screenshot key to its content-hashed, responsive derivatives.\n"
        "// Consume it through components/Shot.astro, not directly.\n"
        "\n"
        "export interface ShotVariant {\n"
        "  /** rendered width in CSS pixels */\n"
        "  width: number;\n"
        "  /** site-root path */\n"
        "  avif: string;\n"
        "}\n"
        "\n"
        "export interface ShotSource {\n"
        "  /** intrinsic size of the source screenshot, for width/height attributes */\n"
        "  width: number;\n"
        "  height: number;\n"
        "  /** ascending by width; AVIF only */\n"
        "  variants: ShotVariant[];\n"
        "  /** the single WebP used as the <img src>, for browsers without AVIF */\n"
        "  fallback: { width: number; webp: string };\n"
        "}\n"
        "\n"
        "export const images: Record<string, ShotSource> = " + body + ";\n"
    )
    print(f"wrote {MANIFEST.relative_to(ROOT)} ({len(manifest)} images)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

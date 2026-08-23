#!/usr/bin/env python3
"""
Find correct Nerd Font icon code points in the project's font file.

The font file (src/styles/fonts/NerdFontsSymbols.woff2) contains Material Design Icons
glyphs at specific Unicode code points. This script helps find the correct code point
for any icon by name.

Usage:
    python scripts/find-nerd-icons.py <keyword>
    python scripts/find-nerd-icons.py check
    python scripts/find-nerd-icons.py terminal
    python scripts/find-nerd-icons.py "account circle"

Output format for use in site.ts:
    icon: "f046", // nerd-fonts: check
"""

import subprocess
import sys
from pathlib import Path

FONT_PATH = Path(__file__).parent.parent / "src" / "styles" / "fonts" / "NerdFontsSymbols.woff2"


def find_icons(keywords: list[str]) -> None:
    if not FONT_PATH.exists():
        print(f"Error: Font file not found at {FONT_PATH}")
        print("Make sure you're running from the project root directory.")
        sys.exit(1)

    # Use ttx to dump the font and parse the <map> entries
    result = subprocess.run(
        ["ttx", "-o", "-", str(FONT_PATH)],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print(f"Error running ttx: {result.stderr}")
        sys.exit(1)

    # Parse <map> entries from ttx output
    # Format: <map code="0xf046" name="check"/><!-- ???? -->
    import re
    pattern = r'<map\s+code="([^"]+)"\s+name="([^"]+)"'

    # Build a lookup: glyph_name -> code
    all_icons = {}
    for match in re.finditer(pattern, result.stdout):
        code, glyph_name = match.group(1), match.group(2)
        if glyph_name not in all_icons:
            all_icons[glyph_name] = code

    # Match keywords against exact glyph names (case-insensitive)
    matches = {}
    for glyph_name, code in all_icons.items():
        glyph_lower = glyph_name.lower()
        for kw in keywords:
            if kw == glyph_lower or glyph_lower == kw.replace("-", " "):
                matches[glyph_name] = code
                break

    if not matches:
        print(f"No icons found matching keywords: {keywords}")
        sys.exit(1)

    # Display results
    print(f"\nIcons matching {' + '.join(keywords)}:\n")
    for glyph_name, code in sorted(matches.items()):
        print(f'  icon: "{code}", // nerd-fonts: {glyph_name}')
    print()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        print("Examples:")
        print('  python scripts/find-nerd-icons.py check')
        print('  python scripts/find-nerd-icons.py terminal')
        print('  python scripts/find-nerd-icons.py "account circle"')
        print('  python scripts/find-nerd-icons.py globe harddisk monitor')
        sys.exit(1)

    keywords = sys.argv[1:]
    find_icons(keywords)

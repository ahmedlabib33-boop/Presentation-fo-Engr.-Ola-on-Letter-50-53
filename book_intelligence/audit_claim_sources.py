from __future__ import annotations

import argparse
import re
from pathlib import Path

from pypdf import PdfReader


DEFAULT_TERMS = (
    "longest path|critical path|project finish|ground works finish|"
    "76 day|78 day|43 day|37 day|15 day|12 day|20.sep|15.sep"
)


def main() -> None:
    parser = argparse.ArgumentParser(description="Print page-local claim-source matches.")
    parser.add_argument("files", nargs="+", type=Path)
    parser.add_argument("--terms", default=DEFAULT_TERMS)
    args = parser.parse_args()
    terms = re.compile(args.terms, re.IGNORECASE)

    for path in args.files:
        print(f"FILE: {path}")
        reader = PdfReader(str(path))
        matched = False
        for page_no, page in enumerate(reader.pages, start=1):
            text = (page.extract_text() or "").replace("\x00", "")
            lines = [line.strip() for line in text.splitlines()]
            indexes = [index for index, line in enumerate(lines) if terms.search(line)]
            if not indexes:
                continue
            matched = True
            print(f"  PAGE {page_no}")
            emitted: set[int] = set()
            for index in indexes:
                for nearby in range(max(0, index - 2), min(len(lines), index + 3)):
                    if nearby not in emitted and lines[nearby]:
                        print(f"    {lines[nearby]}")
                        emitted.add(nearby)
        if not matched:
            print("  NO TEXT MATCHES")


if __name__ == "__main__":
    main()

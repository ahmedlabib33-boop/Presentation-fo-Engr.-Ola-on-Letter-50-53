from __future__ import annotations

import json
from pathlib import Path

from pypdf import PdfReader


BOOK_DIR = Path(r"C:\Users\pc\Desktop\books")
OUTPUT_DIR = Path(__file__).resolve().parent / "text"

PDFS = [
    "AACE_International_Recommended_Practice_Delay_Analysis.pdf",
    "aace-48r-06-schedule-constructability-review_compress.pdf",
    "ACCE Schedule Basis 38r-06.pdf",
    "American concrete institute - ACI_347_2R_17_official.pdf",
    "American concrete institute - ACI_347R_14_official.pdf",
    "Egypt Housing & Building Research Center - HBRC_ECP203_official.pdf",
    "fidic_-_conditions_of_contract_for_construction_for_building_and_engineering_works_designed_by_the_employer_(1999).pdf",
]


def safe_stem(name: str) -> str:
    return "".join(c.lower() if c.isalnum() else "_" for c in Path(name).stem).strip("_")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest: list[dict[str, object]] = []

    for name in PDFS:
        path = BOOK_DIR / name
        reader = PdfReader(str(path))
        pages: list[dict[str, object]] = []
        rendered: list[str] = []
        for number, page in enumerate(reader.pages, start=1):
            try:
                text = page.extract_text() or ""
            except Exception as exc:  # retain the extraction gap in the manifest
                text = ""
                error = str(exc)
            else:
                error = None
            text = text.replace("\x00", "").strip()
            pages.append({"page": number, "chars": len(text), "error": error, "text": text})
            rendered.append(f"\n\n===== PDF PAGE {number} =====\n\n{text}")

        stem = safe_stem(name)
        (OUTPUT_DIR / f"{stem}.txt").write_text("".join(rendered), encoding="utf-8")
        (OUTPUT_DIR / f"{stem}.pages.json").write_text(
            json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        manifest.append(
            {
                "file": name,
                "pages": len(pages),
                "text_pages": sum(1 for page in pages if page["chars"]),
                "text_chars": sum(int(page["chars"]) for page in pages),
                "bytes": path.stat().st_size,
                "output": f"{stem}.txt",
            }
        )

    txt_path = BOOK_DIR / "OSHA_1926_703_Cast_In_Place_Concrete.txt"
    txt = txt_path.read_text(encoding="utf-8", errors="replace")
    (OUTPUT_DIR / "osha_1926_703_cast_in_place_concrete.txt").write_text(txt, encoding="utf-8")
    manifest.append(
        {
            "file": txt_path.name,
            "pages": None,
            "text_pages": None,
            "text_chars": len(txt),
            "bytes": txt_path.stat().st_size,
            "output": "osha_1926_703_cast_in_place_concrete.txt",
        }
    )
    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

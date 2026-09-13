from __future__ import annotations

import concurrent.futures
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PDF = Path(r"C:\Users\pc\Desktop\books\Egypt Housing & Building Research Center - HBRC_ECP203_official.pdf")
POPPLER = Path(r"C:\Users\pc\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe")
TESSERACT = Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
TESSDATA = ROOT / "tessdata"
IMAGE_DIR = ROOT / "ecp203_pages"
TEXT_DIR = ROOT / "ecp203_ocr_pages"
COMBINED = ROOT / "text" / "egypt_housing___building_research_center___hbrc_ecp203_official.ocr.txt"
MANIFEST = ROOT / "text" / "egypt_housing___building_research_center___hbrc_ecp203_official.ocr.json"


def render() -> None:
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    if len(list(IMAGE_DIR.glob("page-*.jpg"))) >= 225:
        return
    subprocess.run(
        [str(POPPLER), "-jpeg", "-r", "170", str(PDF), str(IMAGE_DIR / "page")],
        check=True,
    )


def ocr_page(image: Path) -> tuple[int, int]:
    number = int(image.stem.split("-")[-1])
    target = TEXT_DIR / f"page-{number:03d}"
    txt = target.with_suffix(".txt")
    if not txt.exists():
        subprocess.run(
            [
                str(TESSERACT),
                str(image),
                str(target),
                "--tessdata-dir",
                str(TESSDATA),
                "-l",
                "ara+eng",
                "--psm",
                "6",
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    return number, len(txt.read_text(encoding="utf-8", errors="replace"))


def main() -> None:
    render()
    TEXT_DIR.mkdir(parents=True, exist_ok=True)
    images = sorted(IMAGE_DIR.glob("page-*.jpg"))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        sizes = list(pool.map(ocr_page, images))

    pages = []
    chunks = []
    for number, chars in sorted(sizes):
        text = (TEXT_DIR / f"page-{number:03d}.txt").read_text(encoding="utf-8", errors="replace").strip()
        pages.append({"page": number, "chars": chars, "text": text})
        chunks.append(f"\n\n===== PDF PAGE {number} =====\n\n{text}")
    COMBINED.write_text("".join(chunks), encoding="utf-8")
    MANIFEST.write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"pages": len(pages), "text_pages": sum(1 for p in pages if p["chars"] > 40), "chars": sum(p["chars"] for p in pages)}, ensure_ascii=False))


if __name__ == "__main__":
    main()

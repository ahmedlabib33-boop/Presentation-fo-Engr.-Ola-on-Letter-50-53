from pathlib import Path
import textwrap

import pymupdf
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "evidence"

RENDERS = {
    ROOT / "books" / "fidic1999.pdf": [27, 43, 74, 75],
    ROOT / "books" / "aace29.pdf": [18, 24, 58, 109],
    ROOT / "books" / "aace38.pdf": [4, 8, 9],
    ROOT / "books" / "aace48.pdf": [3, 6, 8],
    ROOT / "books" / "aci347.pdf": [6],
    ROOT / "books" / "aci3472.pdf": [4],
    ROOT / "books" / "ecp203.pdf": [186],
    ROOT / "evidence" / "ifc-schedules" / "01-prospective-before-fragnet.pdf": [1],
    ROOT / "evidence" / "ifc-schedules" / "02-prospective-after-fragnet.pdf": [1, 2],
    ROOT / "evidence" / "ifc-schedules" / "03-actual-durations-logic-kept.pdf": [1],
    ROOT / "evidence" / "ifc-schedules" / "04-actual-durations-logic-removed-before-fragnet.pdf": [1],
    ROOT / "evidence" / "ifc-schedules" / "05-actual-durations-logic-removed-after-fragnet.pdf": [1],
}


def output_name(pdf: Path, page: int) -> str:
    stem = pdf.stem
    if pdf.parent.name == "ifc-schedules":
        return f"ifc-{stem}-page-{page}.png"
    return f"{stem}-page-{page}.png"


def render(pdf: Path, page_number: int) -> Path:
    document = pymupdf.open(pdf)
    if not 1 <= page_number <= len(document):
        raise ValueError(f"Page {page_number} is outside {pdf.name} ({len(document)} pages)")
    page = document[page_number - 1]
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(1.65, 1.65), alpha=False)
    destination = EVIDENCE / output_name(pdf, page_number)
    pixmap.save(destination)
    document.close()
    return destination


def render_osha_excerpt() -> Path:
    source = ROOT / "books" / "osha703.txt"
    text = source.read_text(encoding="utf-8")
    start = text.index("1926.703(e) Removal of formwork.")
    excerpt = text[start:].split("[61 FR", 1)[0].strip()
    width, height = 1600, 1180
    image = Image.new("RGB", (width, height), "#f7f3ea")
    draw = ImageDraw.Draw(image)
    regular = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 31)
    small = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 24)
    bold = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 39)
    draw.rounded_rectangle((45, 45, width - 45, height - 45), 22, fill="#ffffff", outline="#b8933e", width=4)
    draw.text((90, 86), "OSHA 1926.703 - Controlled source excerpt", font=bold, fill="#0d2030")
    draw.text((90, 150), "Requirements for cast-in-place concrete | Embedded source retrieved from OSHA", font=small, fill="#45606f")
    draw.line((90, 204, width - 90, 204), fill="#d4b76a", width=3)
    y = 250
    for paragraph in excerpt.split("\n\n"):
        for line in textwrap.wrap(" ".join(paragraph.split()), width=94):
            draw.text((90, y), line, font=regular, fill="#172c3a")
            y += 46
        y += 20
    draw.text((90, height - 105), "Source file: books/osha703.txt | This excerpt supports strength-based release control; it does not prove any exact project lag.", font=small, fill="#6b4d13")
    destination = EVIDENCE / "osha-1926.703-removal.png"
    image.save(destination, optimize=True)
    return destination


if __name__ == "__main__":
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    for source, pages in RENDERS.items():
        if not source.exists():
            raise FileNotFoundError(source)
        for page_number in pages:
            path = render(source, page_number)
            print(path.relative_to(ROOT))
    print(render_osha_excerpt().relative_to(ROOT))

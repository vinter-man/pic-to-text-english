from __future__ import annotations

import argparse
import re
import shutil
import sys
from collections.abc import Callable
from pathlib import Path

from pic2text import __version__
from pic2text.document import Document, fingerprint
from pic2text.ocr import Engine, RapidEngine, join_lines

IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"}


def natural_key(path: Path) -> list[int | str]:
    """Sort "img_2" before "img_10", the way a file manager does."""
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", path.name)]


def find_images(folder: Path) -> list[Path]:
    images = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_SUFFIXES]
    return sorted(images, key=natural_key)


def fit(line: str) -> str:
    """Cut a progress line to the terminal width so long OCR text doesn't wrap."""
    width = max(shutil.get_terminal_size().columns, 40)
    return line if len(line) <= width else line[: width - 1] + "…"


def run(
    folder: Path,
    output: Path,
    make_engine: Callable[[], Engine],
    *,
    title: str = "Notes",
    min_score: float = 0.75,
) -> int:
    if not folder.is_dir():
        print(f"Folder not found: {folder}", file=sys.stderr)
        print(f"Create it and drop some screenshots in:  mkdir {folder}", file=sys.stderr)
        return 2

    doc = Document.load(output)
    pending: list[tuple[Path, str]] = []
    queued = set(doc.seen)  # also catches the same image saved twice under different names
    for image in find_images(folder):
        digest = fingerprint(image)
        if digest not in queued:
            queued.add(digest)
            pending.append((image, digest))

    if not pending:
        print(f"Nothing new in {folder}/ — {output} is up to date.")
        return 0

    print(f"Reading {len(pending)} new image(s) from {folder}/")
    engine = make_engine()
    results, failed = [], 0
    width = len(str(len(pending)))
    for i, (image, digest) in enumerate(pending, 1):
        counter = f"[{i:>{width}}/{len(pending)}]"
        try:
            text = join_lines(engine.read(image), min_score)
        except Exception as exc:  # one broken file shouldn't sink the whole batch
            failed += 1
            print(f"  {counter} failed  {image.name}: {exc}")
            continue
        results.append((text, image, digest))
        if text:
            print(fit(f"  {counter} ok      {image.name}  {text}"))
        else:
            print(f"  {counter} no text {image.name}")

    if results:
        numbers = doc.append(results, title)
        if len(numbers) == 1:
            print(f"\nAdded #{numbers.start} to {output}")
        elif numbers:
            print(f"\nAdded #{numbers.start}-#{numbers[-1]} to {output}")
        else:
            print(f"\nNo text found; nothing added to {output}")
    return 1 if failed else 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="pic2text",
        description="Turn a folder of screenshots into a numbered Markdown checklist.",
    )
    parser.add_argument(
        "folder",
        nargs="?",
        type=Path,
        default=Path("screenshots"),
        help="folder with images (default: ./screenshots)",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=Path("notes.md"),
        help="Markdown file to append to (default: ./notes.md)",
    )
    parser.add_argument(
        "--title", default="Notes", help="heading used when the file is created (default: Notes)"
    )
    parser.add_argument(
        "--min-confidence",
        type=float,
        default=0.75,
        metavar="0-1",
        help="drop OCR fragments below this score (default: 0.75)",
    )
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    args = parser.parse_args(argv)
    return run(
        args.folder,
        args.output,
        RapidEngine,
        title=args.title,
        min_score=args.min_confidence,
    )


if __name__ == "__main__":
    sys.exit(main())

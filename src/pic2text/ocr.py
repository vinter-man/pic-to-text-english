"""OCR backend: RapidOCR wrapped behind a tiny interface, plus line joining."""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol


@dataclass(frozen=True)
class Line:
    text: str
    score: float


class Engine(Protocol):
    def read(self, image: Path) -> list[Line]: ...


class RapidEngine:
    """PP-OCR models running on ONNX Runtime. Fully offline: the models ship inside the wheel."""

    def __init__(self) -> None:
        # Imported here so `pic2text --help` doesn't pay for loading OpenCV and ONNX Runtime.
        from rapidocr import RapidOCR

        self._ocr = RapidOCR(params={"Global.log_level": "error"})

    def read(self, image: Path) -> list[Line]:
        # Pass bytes rather than the path: OpenCV can't open non-ASCII paths on Windows.
        result = self._ocr(image.read_bytes())
        if result.txts is None:
            return []
        return [
            Line(text, float(score)) for text, score in zip(result.txts, result.scores, strict=True)
        ]


def join_lines(lines: Iterable[Line], min_score: float) -> str:
    """Merge the lines of one screenshot into a single paragraph.

    Low-confidence fragments are dropped; they are almost always icons or avatars
    misread as text (":o:", "@", ...).
    """
    text = ""
    for line in lines:
        part = " ".join(line.text.split())
        if line.score < min_score or not part:
            continue
        if not text:
            text = part
        elif text.endswith("-") and part[0].islower():
            # "multi-" + "hundred" -> "multi-hundred"
            text += part
        else:
            text += " " + part
    return text

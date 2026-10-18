"""The Markdown output file: a numbered checklist that only ever grows.

Every entry carries an invisible HTML comment with a fingerprint of its source image,
so re-running on the same folder skips images that are already in the document,
even after they were renamed, moved, or the entry was ticked off.
"""

from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass, field
from pathlib import Path

_ENTRY = re.compile(r"^(\d+)\. \[[ xX]\] ", re.MULTILINE)
_MARKER = re.compile(r"<!-- pic2text ([0-9a-f]{12})\b")


def fingerprint(image: Path) -> str:
    return hashlib.sha256(image.read_bytes()).hexdigest()[:12]


@dataclass
class Document:
    path: Path
    last_number: int = 0
    seen: set[str] = field(default_factory=set)

    @classmethod
    def load(cls, path: Path) -> Document:
        if not path.exists():
            return cls(path)
        content = path.read_text(encoding="utf-8")
        numbers = [int(n) for n in _ENTRY.findall(content)]
        return cls(path, max(numbers, default=0), set(_MARKER.findall(content)))

    def append(self, results: list[tuple[str, Path, str]], title: str) -> range:
        """Write (text, image, fingerprint) results; return the numbers given to new entries.

        Images without text get a hidden marker instead of an entry, so they aren't
        re-read on every run.
        """
        first = self.last_number + 1
        entries, markers = [], []
        for text, image, digest in results:
            self.seen.add(digest)
            if text:
                self.last_number += 1
                entries.append(
                    f"{self.last_number}. [ ] {text} <!-- pic2text {digest} {image.name} -->"
                )
            else:
                markers.append(f"<!-- pic2text {digest} {image.name}: no text -->")

        if self.path.exists():
            existing = self.path.read_text(encoding="utf-8")
            prefix = "" if existing.endswith("\n") or not existing else "\n"
        else:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            prefix = f"# {title}\n\n"

        with self.path.open("a", encoding="utf-8") as f:
            f.write(prefix + "\n".join(entries + markers) + "\n")
        return range(first, self.last_number + 1)

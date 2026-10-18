import os
from pathlib import Path

import pytest
from PIL import Image

from pic2text.cli import find_images, progress, run
from pic2text.ocr import Line


class FakeEngine:
    """Canned OCR result per filename; "BROKEN" simulates an unreadable file."""

    def __init__(self, texts: dict[str, str]):
        self.texts = texts
        self.calls: list[str] = []

    def read(self, image: Path) -> list[Line]:
        self.calls.append(image.name)
        text = self.texts[image.name]
        if text == "BROKEN":
            raise ValueError("cannot decode image")
        return [Line(text, 0.99)] if text else []


def make_image(folder: Path, name: str, shade: int) -> Path:
    path = folder / name
    Image.new("RGB", (8, 8), (shade, shade, shade)).save(path)
    return path


@pytest.fixture
def shots(tmp_path: Path) -> Path:
    folder = tmp_path / "screenshots"
    folder.mkdir()
    make_image(folder, "img_10.png", 10)
    make_image(folder, "img_2.png", 2)
    make_image(folder, "img_1.jpg", 1)
    (folder / "notes.txt").write_text("not an image")
    return folder


TEXTS = {"img_1.jpg": "first", "img_2.png": "second", "img_10.png": "tenth"}


def test_finds_images_in_natural_order(shots: Path):
    assert [p.name for p in find_images(shots)] == ["img_1.jpg", "img_2.png", "img_10.png"]


def test_creates_a_numbered_checklist(shots: Path, tmp_path: Path):
    out = tmp_path / "notes.md"
    assert run(shots, out, lambda: FakeEngine(TEXTS), title="Phrases") == 0

    lines = out.read_text(encoding="utf-8").splitlines()
    assert lines[0] == "# Phrases"
    assert lines[2].startswith("1. [ ] first <!-- pic2text ")
    assert lines[2].endswith(" img_1.jpg -->")
    assert lines[3].startswith("2. [ ] second ")
    assert lines[4].startswith("3. [ ] tenth ")


def test_second_run_only_reads_new_images(shots: Path, tmp_path: Path):
    out = tmp_path / "notes.md"
    run(shots, out, lambda: FakeEngine(TEXTS))

    make_image(shots, "img_11.png", 11)
    engine = FakeEngine({**TEXTS, "img_11.png": "eleventh"})
    run(shots, out, lambda: engine)

    assert engine.calls == ["img_11.png"]
    assert out.read_text(encoding="utf-8").count("[ ]") == 4
    assert "4. [ ] eleventh" in out.read_text(encoding="utf-8")


def test_nothing_new_does_not_load_the_engine(shots: Path, tmp_path: Path):
    out = tmp_path / "notes.md"
    run(shots, out, lambda: FakeEngine(TEXTS))
    before = out.read_text(encoding="utf-8")

    def must_not_load():
        raise AssertionError("engine loaded with nothing to do")

    assert run(shots, out, must_not_load) == 0
    assert out.read_text(encoding="utf-8") == before


def test_continues_numbering_and_keeps_ticked_entries(shots: Path, tmp_path: Path):
    out = tmp_path / "notes.md"
    out.write_text("# My phrases\n\n41. [x] learned already\n42. [ ] still learning", "utf-8")

    run(shots, out, lambda: FakeEngine(TEXTS))

    lines = out.read_text(encoding="utf-8").splitlines()
    assert lines[2:4] == ["41. [x] learned already", "42. [ ] still learning"]
    assert lines[4].startswith("43. [ ] first ")


def test_renamed_or_duplicate_image_is_not_added_twice(shots: Path, tmp_path: Path):
    out = tmp_path / "notes.md"
    (shots / "copy of img_1.jpg").write_bytes((shots / "img_1.jpg").read_bytes())

    run(shots, out, lambda: FakeEngine({**TEXTS, "copy of img_1.jpg": "first"}))

    assert out.read_text(encoding="utf-8").count("first") == 1


def test_skips_images_without_text(shots: Path, tmp_path: Path):
    out = tmp_path / "notes.md"
    run(shots, out, lambda: FakeEngine({**TEXTS, "img_2.png": ""}))

    content = out.read_text(encoding="utf-8")
    assert "1. [ ] first" in content
    assert "2. [ ] tenth" in content
    assert "img_2.png: no text -->" in content

    # remembered, so the next run has nothing to do
    assert run(shots, out, lambda: FakeEngine({})) == 0


def test_broken_image_is_reported_and_the_rest_still_saved(shots, tmp_path, capsys):
    out = tmp_path / "notes.md"
    code = run(shots, out, lambda: FakeEngine({**TEXTS, "img_2.png": "BROKEN"}))

    assert code == 1
    assert "failed  img_2.png: cannot decode image" in capsys.readouterr().out
    assert "2. [ ] tenth" in out.read_text(encoding="utf-8")


def test_missing_folder(tmp_path: Path, capsys):
    assert run(tmp_path / "nope", tmp_path / "notes.md", FakeEngine) == 2
    assert "Folder not found" in capsys.readouterr().err


def test_progress_line_fits_the_terminal(monkeypatch):
    monkeypatch.setattr("shutil.get_terminal_size", lambda: os.terminal_size((50, 24)))
    line = progress("[1/4]", "ok", "IMG_2041.png", "a long sentence " * 10)
    assert len(line) == 50
    assert line.endswith("…")
    assert progress("[2/4]", "no text", "IMG_2042.jpg") == "  [2/4] no text IMG_2042.jpg"

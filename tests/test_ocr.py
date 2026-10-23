from pathlib import Path

import pytest

from pic2text.ocr import Line, RapidEngine, join_lines

EXAMPLES = Path(__file__).parent.parent / "examples" / "screenshots"


def test_joins_wrapped_lines_into_one_paragraph():
    lines = [Line("I went to the woods because", 0.99), Line("I wished to live deliberately", 0.98)]
    assert join_lines(lines, 0.75) == "I went to the woods because I wished to live deliberately"


def test_rejoins_words_split_at_a_hyphen():
    lines = [Line("a multi-", 0.99), Line("hundred billion dollar industry", 0.99)]
    assert join_lines(lines, 0.75) == "a multi-hundred billion dollar industry"


def test_keeps_dash_before_a_capitalised_line():
    lines = [Line("Pros -", 0.99), Line("Cons", 0.99)]
    assert join_lines(lines, 0.75) == "Pros - Cons"


def test_drops_low_confidence_noise_and_blank_lines():
    lines = [Line(":o:", 0.68), Line("   ", 0.99), Line("real  text", 0.95)]
    assert join_lines(lines, 0.75) == "real text"


def test_no_lines_means_no_text():
    assert join_lines([], 0.75) == ""


@pytest.mark.ocr
def test_reads_the_example_screenshots():
    engine = RapidEngine()

    chat = join_lines(engine.read(EXAMPLES / "Screenshot 2026-10-12 at 09.14.03.png"), 0.75)
    assert chat == "Yes, but I I am more white than you. You look gypsy. I am blonde hair. Blonde"

    book = join_lines(engine.read(EXAMPLES / "Screenshot 2026-10-12 at 21.40.55.png"), 0.75)
    assert book.startswith("It is a truth universally acknowledged")

    assert engine.read(EXAMPLES / "IMG_2042.jpg") == []

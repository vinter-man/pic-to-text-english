#!/usr/bin/env bash
# Rebuild every picture in the README.
# Needs ffmpeg and img2webp (brew install ffmpeg webp) and `uv sync` in the repo root.
set -euo pipefail
cd "$(dirname "$0")"
repo="$(cd .. && pwd)"

# Run the real CLI on the example screenshots; the video replays this exact output.
work="$(mktemp -d)/english"
mkdir -p "$work" && cp -R ../examples/screenshots "$work/"
(
  cd "$work"
  export COLUMNS=66 NO_COLOR=1
  ls -1 screenshots > "$repo/demo/public/ls.txt"
  uv run --quiet --project "$repo" pic2text > "$repo/demo/public/run-1.txt"
  uv run --quiet --project "$repo" pic2text > "$repo/demo/public/run-2.txt"
)

npx remotion still Banner ../docs/banner.png --scale=2 --log=error
npx remotion still Demo ../docs/step-1-drop.png --frame=110 --log=error
npx remotion still Demo ../docs/step-2-run.png --frame=255 --log=error
npx remotion still Demo ../docs/step-3-learn.png --frame=470 --log=error
npx remotion render Demo out/demo.mp4 --crf=18 --log=error

frames=$(mktemp -d)
ffmpeg -loglevel error -i out/demo.mp4 -vf "fps=20,scale=1100:-1:flags=lanczos" "$frames/f%04d.png"
img2webp -loop 0 -lossless -m 4 -d 50 "$frames"/f*.png -o ../docs/demo.webp

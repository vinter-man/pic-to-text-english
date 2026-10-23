#!/usr/bin/env bash
# Rebuild every README asset: the real terminal recording, the banners and the demo video.
# Needs vhs, ffmpeg, img2webp and gh (brew install vhs ffmpeg webp gh) and `uv sync` in the repo root.
set -euo pipefail
cd "$(dirname "$0")"

vhs demo.tape
gh api markdown -f mode=gfm -f text="$(cat ../examples/notes.md)" > public/notes.html
npx remotion still Banner ../docs/banner.png --scale=2 --log=error
npx remotion still Meme ../docs/meme.png --scale=2 --log=error
npx remotion still ResultDark ../docs/result-dark.png --scale=2 --log=error
npx remotion still ResultLight ../docs/result-light.png --scale=2 --log=error
npx remotion render Demo out/demo.mp4 --crf=18 --log=error

frames=$(mktemp -d)
ffmpeg -loglevel error -i out/demo.mp4 -vf "fps=20,scale=1100:-1:flags=lanczos" "$frames/f%04d.png"
img2webp -loop 0 -lossy -q 85 -m 4 -d 50 "$frames"/f*.png -o ../docs/demo.webp

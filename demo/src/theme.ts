import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const sans = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] }).fontFamily;

// GitHub's dark palette, same as the cad-helper demo.
export const ui = {
  page: "#0d1117",
  pane: "#161b22",
  inset: "#1f242c",
  border: "#30363d",
  fg: "#e6edf3",
  muted: "#8b949e",
  faint: "#484f58",
  accent: "#e5795e",
  green: "#3fb950",
  blue: "#58a6ff",
};

// Copied verbatim from examples/notes.md (real pic2text output).
export const notes = [
  'hectic full of busy, hurried activity "I\'ve had quite a hectic week."',
  "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach.",
  "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
];

export const screenshots = [
  "screenshots/Screenshot 2026-10-12 at 09.14.03.png",
  "screenshots/Screenshot 2026-10-12 at 21.40.55.png",
  "screenshots/IMG_2041.png",
  "screenshots/IMG_2042.jpg",
];

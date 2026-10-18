import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const sans = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] })
  .fontFamily;
export const serif = loadSerif("italic", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] }).fontFamily;

export const palette = {
  dark: {
    bg: "#0a0b14",
    fg: "#f4f4fb",
    muted: "#9a9cb8",
    card: "#141627",
    border: "#262a45",
    glowA: "#7c5cff",
    glowB: "#22d3ee",
    glowC: "#f472b6",
  },
  light: {
    bg: "#fbfbfe",
    fg: "#14152a",
    muted: "#5d6080",
    card: "#ffffff",
    border: "#e3e4f0",
    glowA: "#a78bfa",
    glowB: "#67e8f9",
    glowC: "#f9a8d4",
  },
};

export type Mode = keyof typeof palette;

export const accentGradient = "linear-gradient(100deg, #a78bfa 0%, #22d3ee 55%, #f472b6 100%)";

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

export const installCommand = "uv tool install git+https://github.com/vinter-man/pic-to-text-english";

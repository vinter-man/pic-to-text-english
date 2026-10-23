import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";
import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import {
  siGithubactions,
  siMarkdown,
  siObsidian,
  siOnnx,
  siOpencv,
  siPaddlepaddle,
  siPytest,
  siPython,
  siRuff,
  siUv,
} from "simple-icons";
import { notes, screenshots } from "./theme";

const geist = loadGeist("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;
const geistMono = loadGeistMono("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

const paper = "#f7f6f1";
const ink = "#141414";
const pencil = "#6b6a66";

const stack = [
  siPython,
  siUv,
  siOnnx,
  siPaddlepaddle,
  siOpencv,
  siMarkdown,
  siObsidian,
  siPytest,
  siRuff,
  siGithubactions,
];

/** Slightly wobbly line, so it reads as drawn by hand rather than by a ruler. */
const HandArrow: React.FC = () => (
  <svg width={150} height={60} viewBox="0 0 150 60" style={{ position: "absolute", left: 606, top: 238 }}>
    <path
      d="M4 46 C 30 30, 46 24, 70 24 C 86 23, 96 18, 112 17 L 140 22"
      fill="none"
      stroke={ink}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path d="M124 9 L 141 22 L 122 33" fill="none" stroke={ink} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const Dimension: React.FC<{ x: number; y1: number; y2: number; label: string }> = ({ x, y1, y2, label }) => (
  <>
    <div style={{ position: "absolute", left: x, top: y1, width: 1, height: y2 - y1, background: ink }} />
    {[y1, y2].map((y) => (
      <div key={y} style={{ position: "absolute", left: x - 6, top: y, width: 13, height: 1, background: ink }} />
    ))}
    <div
      style={{
        position: "absolute",
        left: x - 26,
        top: (y1 + y2) / 2,
        transform: "translate(-50%, -50%) rotate(-90deg)",
        fontFamily: geistMono,
        fontSize: 12,
        color: ink,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  </>
);

/** The right-hand "drawing": four screenshots in, one Markdown sheet out. */
const Drawing: React.FC = () => {
  const prints = [
    { src: screenshots[1], left: 64, top: 44, width: 250, rotate: -4 },
    { src: screenshots[2], left: 210, top: 70, width: 210, rotate: 3 },
    { src: screenshots[0], left: 34, top: 150, width: 330, rotate: -1.5 },
    { src: screenshots[3], left: 330, top: 150, width: 100, rotate: 6 },
  ];
  return (
    <div style={{ position: "absolute", left: 790, top: 0, width: 470, height: 640 }}>
      <div style={{ position: "absolute", left: 40, top: 18, fontFamily: geistMono, fontSize: 12, color: ink }}>
        screenshots/
      </div>
      {prints.map(({ src, left, top, width, rotate }) => (
        <div
          key={src}
          style={{
            position: "absolute",
            left,
            top,
            width,
            transform: `rotate(${rotate}deg)`,
            border: `1px solid ${ink}`,
            background: paper,
            padding: 5,
            boxShadow: `4px 4px 0 ${ink}`,
          }}
        >
          <Img
            src={staticFile(src)}
            style={{ width: "100%", display: "block", filter: "grayscale(1) contrast(1.35)", mixBlendMode: "multiply" }}
          />
        </div>
      ))}
      <Dimension x={14} y1={44} y2={215} label="4 files" />

      {/* OCR leader line */}
      <div style={{ position: "absolute", left: 230, top: 236, width: 1, height: 82, borderLeft: `1px dashed ${ink}` }} />
      <svg width={14} height={10} style={{ position: "absolute", left: 223.5, top: 316 }}>
        <path d="M0 0 L7 10 L14 0" fill="none" stroke={ink} />
      </svg>
      <div style={{ position: "absolute", left: 246, top: 258, fontFamily: geistMono, fontSize: 12, color: ink, lineHeight: 1.5 }}>
        $ pic2text
        <br />
        <span style={{ color: pencil }}>OCR on CPU, offline</span>
      </div>

      {/* notes.md sheet */}
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 334,
          width: 400,
          height: 248,
          border: `1px solid ${ink}`,
          background: "#fff",
          boxShadow: `5px 5px 0 ${ink}`,
          padding: "16px 20px",
          boxSizing: "border-box",
          fontFamily: geist,
          color: ink,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 500, paddingBottom: 6, borderBottom: `1px solid ${ink}`, marginBottom: 12 }}>
          Notes
        </div>
        {notes.map((text, i) => (
          <div key={text} style={{ display: "flex", gap: 10, fontSize: 13.5, lineHeight: 1.4, marginBottom: 10 }}>
            <span style={{ fontFamily: geistMono, fontSize: 12, color: pencil, marginTop: 1 }}>{i + 1}.</span>
            <svg width={15} height={15} viewBox="0 0 15 15" style={{ flex: "none", marginTop: 2 }}>
              <rect x={0.5} y={0.5} width={14} height={14} fill="none" stroke={ink} />
              {i === 0 && <path d="M2 7.5 L6 12 L15 -1" fill="none" stroke={ink} strokeWidth={2} strokeLinecap="round" />}
            </svg>
            <span
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textDecoration: i === 0 ? "line-through" : undefined,
                color: i === 0 ? pencil : ink,
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
      <Dimension x={14} y1={334} y2={582} label="3 entries" />
      <div
        style={{
          position: "absolute",
          right: 22,
          bottom: 14,
          fontFamily: geistMono,
          fontSize: 13,
          color: ink,
          whiteSpace: "nowrap",
        }}
      >
        notes.md · 3 entries · 1 skipped · 0 API keys
      </div>
    </div>
  );
};

export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: paper, color: ink, fontFamily: geist }}>
    <div style={{ position: "absolute", left: 64, top: 52, fontFamily: geistMono, fontSize: 15 }}>
      github.com/vinter-man/pic-to-text-english
    </div>
    <div style={{ position: "absolute", left: 58, top: 70, fontSize: 124, fontWeight: 500, letterSpacing: -8 }}>
      pic2text
    </div>
    <div style={{ position: "absolute", left: 64, top: 238, width: 560, fontSize: 31, lineHeight: 1.3, letterSpacing: -0.5 }}>
      “Screenshot it. I'll learn this phrase later.”
      <div style={{ fontSize: 17, color: pencil, marginTop: 8, letterSpacing: 0 }}>— me, a few hundred screenshots ago</div>
    </div>
    <HandArrow />
    <div style={{ position: "absolute", left: 64, top: 384, width: 520, fontSize: 17, lineHeight: 1.45, color: "#4a4945" }}>
      Drop screenshots into a folder. Get a Markdown checklist
      <br />
      of the text in them. OCR runs on your own machine.
    </div>
    <div style={{ position: "absolute", left: 64, top: 524, display: "flex", alignItems: "center", gap: 26 }}>
      {stack.map((icon) => (
        <svg key={icon.slug} width={30} height={30} viewBox="0 0 24 24" aria-label={icon.title}>
          <path d={icon.path} fill={ink} />
        </svg>
      ))}
    </div>
    <svg width={600} height={10} style={{ position: "absolute", left: 58, top: 566 }}>
      <path d="M2 6 C 120 3, 260 7, 400 4 S 560 6, 598 3" fill="none" stroke={ink} strokeWidth={1.6} />
    </svg>
    <Drawing />
  </AbsoluteFill>
);

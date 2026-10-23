import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";
import type React from "react";
import { AbsoluteFill } from "remotion";

const geist = loadGeist("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily;
const mono = loadGeistMono("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

const paper = "#f7f6f1";
const ink = "#141414";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: geist, fontSize: 34, fontWeight: 600, letterSpacing: -0.8, color: ink, padding: "22px 30px 0" }}>
    {children}
  </div>
);

const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ border: `2px solid ${ink}`, position: "relative", overflow: "hidden", ...style }}>{children}</div>
);

const rows = [
  [1, "hectic full of busy, hurried activity"],
  [2, "I went to the woods because I wished to live deliberately"],
  [3, "It is a truth universally acknowledged"],
  [4, "to be on the same page"],
  ["…", ""],
  [3417, "it's not rocket science"],
  [3418, "I'll learn this one later, I promise"],
] as const;

/** Closing meme for the README. */
export const Meme: React.FC = () => (
  <AbsoluteFill style={{ background: paper, padding: 26, gap: 22, display: "flex", flexDirection: "column" }}>
    <Panel style={{ flex: 0.8, background: "#1b1b1d" }}>
      <div style={{ fontFamily: geist, fontSize: 34, fontWeight: 600, color: "#f5f5f7", padding: "22px 30px 0", letterSpacing: -0.8 }}>
        my phone, every month:
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 92,
          transform: "translateX(-50%)",
          width: 470,
          borderRadius: 26,
          background: "#2c2c2ec0",
          border: "1px solid #ffffff1c",
          fontFamily: geist,
          color: "#f5f5f7",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "26px 30px 22px" }}>
          <div style={{ fontSize: 25, fontWeight: 600 }}>Storage Almost Full</div>
          <div style={{ fontSize: 19, lineHeight: 1.4, marginTop: 10, color: "#d1d1d6" }}>
            3,418 screenshots of “useful English phrases” you will definitely learn later.
          </div>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid #ffffff22", fontSize: 21, color: "#0a84ff" }}>
          <div style={{ flex: 1, padding: 16, borderRight: "1px solid #ffffff22" }}>Later</div>
          <div style={{ flex: 1, padding: 16, fontWeight: 600 }}>Also later</div>
        </div>
      </div>
    </Panel>

    <Panel style={{ flex: 1.25, background: paper }}>
      <Caption>me after pic2text:</Caption>
      <div
        style={{
          margin: "18px 30px 0",
          border: `1.5px solid ${ink}`,
          background: "#fff",
          boxShadow: `6px 6px 0 ${ink}`,
          padding: "14px 22px",
          fontFamily: geist,
          color: ink,
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 15, color: "#6b6a66", marginBottom: 8 }}>notes.md</div>
        {rows.map(([n, text]) => (
          <div key={String(n)} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 19, height: 34 }}>
            <span style={{ fontFamily: mono, fontSize: 15, color: "#6b6a66", width: 46, textAlign: "right" }}>
              {n === "…" ? "⋮" : `${n}.`}
            </span>
            {n !== "…" && (
              <svg width={18} height={18}>
                <rect x={1} y={1} width={16} height={16} fill="none" stroke={ink} strokeWidth={1.5} />
              </svg>
            )}
            <span>{text}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: 34,
          bottom: 30,
          transform: "rotate(-9deg)",
          border: "4px solid #d6312b",
          color: "#d6312b",
          fontFamily: geist,
          fontWeight: 700,
          fontSize: 25,
          lineHeight: 1.1,
          letterSpacing: 1,
          textTransform: "uppercase",
          textAlign: "center",
          padding: "10px 16px",
          background: "#f7f6f1e0",
        }}
      >
        Still not learned
        <br />
        but now in Markdown
      </div>
    </Panel>
  </AbsoluteFill>
);

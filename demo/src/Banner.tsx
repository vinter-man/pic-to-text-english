import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop, Checkbox, GradientText, WindowChrome } from "./parts";
import { type Mode, notes, palette, sans, screenshots, serif } from "./theme";

const cards = [
  { src: screenshots[1], x: 0, y: 24, r: -7, w: 330 },
  { src: screenshots[2], x: 70, y: 168, r: 5, w: 300 },
  { src: screenshots[0], x: 30, y: 290, r: -3, w: 400 },
];

export const Banner: React.FC<{ mode: Mode }> = ({ mode }) => {
  const c = palette[mode];
  return (
    <AbsoluteFill>
      <Backdrop mode={mode} />
      <div style={{ position: "absolute", left: 84, top: 86, width: 600, fontFamily: sans }}>
        <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 1.05 }}>
          <GradientText>pic2text</GradientText>
        </div>
        <div style={{ fontSize: 42, fontWeight: 600, letterSpacing: -1, color: c.fg, marginTop: 14 }}>
          Screenshots in.{" "}
          <span style={{ fontFamily: serif, fontWeight: 400, fontSize: 48 }}>
            <GradientText style={{ paddingRight: 4 }}>Notes</GradientText>
          </span>{" "}
          out.
        </div>
        <div style={{ fontSize: 22, color: c.muted, marginTop: 16, lineHeight: 1.45 }}>
          Offline OCR that turns a folder of screenshots
          <br />
          into a Markdown checklist.
        </div>
      </div>

      <div style={{ position: "absolute", left: 690, top: 0, width: 560, height: 520 }}>
        {cards.map(({ src, x, y, r, w }) => (
          <Img
            key={src}
            src={staticFile(src)}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              transform: `rotate(${r}deg)`,
              borderRadius: 12,
              border: `1px solid ${c.border}`,
              boxShadow: "0 24px 50px -18px #00000080",
            }}
          />
        ))}
        <WindowChrome
          title="notes.md"
          mode={mode}
          style={{ position: "absolute", left: 210, top: 118, width: 360, transform: "rotate(3deg)" }}
        >
          <div style={{ padding: "14px 18px 6px", fontFamily: sans, color: c.fg, fontSize: 15 }}>
            {notes.map((text, i) => (
              <div key={text} style={{ display: "flex", gap: 10, marginBottom: 10, lineHeight: 1.35 }}>
                <Checkbox checked={i === 0 ? 1 : 0} size={20} />
                <span
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    opacity: i === 0 ? 0.55 : 1,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </WindowChrome>
      </div>
    </AbsoluteFill>
  );
};

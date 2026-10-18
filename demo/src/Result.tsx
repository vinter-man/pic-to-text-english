import type React from "react";
import { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, staticFile } from "remotion";
import { WindowChrome } from "./parts";
import { mono, type Mode, palette, sans, screenshots } from "./theme";

// GitHub's own colours for rendered Markdown, so the right-hand pane looks like the repo page.
const github = {
  light: { bg: "#ffffff", fg: "#1f2328", rule: "#d1d9e0", page: "#f6f8fa", box: "#d0d7de" },
  dark: { bg: "#0d1117", fg: "#f0f6fc", rule: "#3d444d", page: "#010409", box: "#3d444d" },
};

/**
 * Before/after still: the example screenshots next to examples/notes.md exactly as GitHub
 * renders it. render.sh fetches that HTML from the GitHub Markdown API into public/notes.html.
 */
export const Result: React.FC<{ mode: Mode }> = ({ mode }) => {
  const [html, setHtml] = useState<string | null>(null);
  const [handle] = useState(() => delayRender("Loading GitHub-rendered notes.html"));
  useEffect(() => {
    fetch(staticFile("notes.html"))
      .then((r) => r.text())
      .then((text) => {
        setHtml(text);
        continueRender(handle);
      });
  }, [handle]);

  const g = github[mode];
  const c = palette[mode];
  return (
    <AbsoluteFill
      style={{ background: g.page, flexDirection: "row", alignItems: "center", gap: 34, padding: 40 }}
    >
      <div style={{ width: 420, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontFamily: mono, fontSize: 17, color: c.muted }}>screenshots/</div>
        {screenshots.map((src) => (
          <Img
            key={src}
            src={staticFile(src)}
            style={{
              width: "100%",
              height: src.endsWith(".jpg") ? 96 : undefined,
              objectFit: "cover",
              borderRadius: 10,
              border: `1px solid ${g.box}`,
              display: "block",
            }}
          />
        ))}
      </div>
      <div style={{ fontFamily: mono, fontSize: 18, color: c.muted, textAlign: "center" }}>
        <div
          style={{
            background: mode === "dark" ? "#f0f6fc" : "#1f2328",
            color: mode === "dark" ? "#0d1117" : "#f0f6fc",
            borderRadius: 8,
            padding: "7px 12px",
          }}
        >
          $ pic2text
        </div>
        <div style={{ fontSize: 40, marginTop: 4 }}>→</div>
      </div>
      <WindowChrome title="notes.md" mode={mode} style={{ flex: 1, background: g.bg, borderColor: g.box }}>
        <div
          className="md"
          style={{ padding: "6px 30px 22px", fontFamily: sans, color: g.fg, colorScheme: mode }}
          dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
        <style>{`
          .md { font-size: 19px; line-height: 1.5; }
          .md h1 { font-size: 34px; font-weight: 600; margin: 16px 0 18px; padding-bottom: 8px; border-bottom: 1px solid ${g.rule}; }
          .md ol { margin: 0; padding-left: 8px; }
          .md li { list-style: none; margin-top: 10px; padding-left: 28px; text-indent: -28px; }
          .md input { width: 17px; height: 17px; margin: 0 10px 0 0; vertical-align: -2px; accent-color: #7c5cff; }
        `}</style>
      </WindowChrome>
    </AbsoluteFill>
  );
};

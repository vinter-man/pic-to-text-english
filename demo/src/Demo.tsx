import type React from "react";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Img,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { mono, notes, sans, ui } from "./theme";

// Frame timeline (30 fps).
const T = {
  thumbs: 12,
  ls: 80,
  lsOut: 108,
  run: 122,
  reading: 146,
  progress: [164, 184, 204, 224],
  added: 244,
  notesTab: 256,
  entries: [262, 274, 286],
  again: 310,
  nothingNew: 356,
  learn: 378,
  ticks: [392, 414],
};
export const DEMO_FRAMES = 480;

/** Lines of a text file in public/, written by render.sh from a real pic2text run. */
const useLines = (name: string) => {
  const [lines, setLines] = useState<string[]>([]);
  const [handle] = useState(() => delayRender(`Loading ${name}`));
  useEffect(() => {
    fetch(staticFile(name))
      .then((r) => r.text())
      .then((text) => {
        setLines(text.replace(/\n$/, "").split("\n"));
        continueRender(handle);
      });
  }, [name, handle]);
  return lines;
};

const typed = (text: string, frame: number, start: number, framesPerChar = 1.6) =>
  text.slice(0, Math.max(0, Math.floor((frame - start) / framesPerChar)));

const Pane: React.FC<{
  title: React.ReactNode;
  right?: React.ReactNode;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ title, right, style, children }) => (
  <div
    style={{
      position: "absolute",
      top: 22,
      bottom: 22,
      background: ui.pane,
      border: `1px solid ${ui.border}`,
      borderRadius: 12,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    <div
      style={{
        height: 44,
        flex: "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 14px",
        borderBottom: `1px solid ${ui.border}`,
        fontFamily: sans,
        fontSize: 14,
        color: ui.muted,
      }}
    >
      {title}
      <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>{right}</div>
    </div>
    <div style={{ flex: 1, position: "relative" }}>{children}</div>
  </div>
);

const Pill: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => (
  <span
    style={{
      fontFamily: sans,
      fontSize: 13,
      padding: "3px 10px",
      borderRadius: 999,
      border: `1px solid ${active ? ui.accent : ui.border}`,
      background: active ? ui.accent : "transparent",
      color: active ? "#1b0d08" : ui.muted,
    }}
  >
    {children}
  </span>
);

const Dots = () => (
  <>
    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
      <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />
    ))}
  </>
);

/** Colour one line of pic2text output the same way the CLI does on a TTY. */
const OutputLine: React.FC<{ text: string }> = ({ text }) => {
  const progress = text.match(/^(\s+)(\[\d+\/\d+\]) (ok {6}|no text|failed {2})(.*)$/);
  if (progress) {
    const [, indent, counter, status, rest] = progress;
    const [name, ...preview] = rest.trimStart().split("  ");
    return (
      <div>
        {indent}
        <span style={{ color: ui.faint }}>{counter}</span>{" "}
        <span style={{ color: status.startsWith("ok") ? ui.green : ui.muted }}>{status}</span> {name}
        {preview.length > 0 && <span style={{ color: ui.muted }}>{`  ${preview.join("  ")}`}</span>}
      </div>
    );
  }
  const added = text.match(/^(Added #\S+)(.*)$/);
  if (added) {
    return (
      <div>
        <span style={{ color: ui.green, fontWeight: 600 }}>{added[1]}</span>
        {added[2]}
      </div>
    );
  }
  return <div>{text || " "}</div>;
};

const Command: React.FC<{ text: string; cursor: boolean }> = ({ text, cursor }) => (
  <div
    style={{
      background: ui.inset,
      borderLeft: `3px solid ${ui.blue}`,
      borderRadius: 4,
      padding: "7px 12px",
      margin: "10px 0 8px",
      color: ui.fg,
    }}
  >
    <span style={{ color: ui.blue }}>$ </span>
    {text}
    {cursor && <span style={{ background: ui.fg, marginLeft: 1 }}>&nbsp;</span>}
  </div>
);

const Terminal: React.FC<{ frame: number }> = ({ frame }) => {
  const ls = useLines("ls.txt");
  const run1 = useLines("run-1.txt");
  const run2 = useLines("run-2.txt");
  const blink = Math.floor(frame / 15) % 2 === 0;

  // run-1.txt is "Reading …", one line per image, a blank line, "Added …".
  const run1At = (i: number) =>
    i === 0 ? T.reading : i <= T.progress.length ? T.progress[i - 1] : T.added;

  const cmd = (text: string, start: number, done: number, speed?: number) =>
    frame >= start && <Command text={typed(text, frame, start, speed)} cursor={frame < done && blink} />;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        fontFamily: mono,
        fontSize: 16,
        lineHeight: 1.55,
        color: ui.fg,
        whiteSpace: "pre",
      }}
    >
      {cmd("ls screenshots", T.ls, T.lsOut)}
      {frame >= T.lsOut && ls.map((l) => <div key={l}>{l}</div>)}
      {cmd("pic2text", T.run, T.reading)}
      {run1.map((l, i) => frame >= run1At(i) && <OutputLine key={`${i}${l}`} text={l} />)}
      {cmd("pic2text   # run it again any time", T.again, T.nothingNew, 1.2)}
      {frame >= T.nothingNew && run2.map((l) => <OutputLine key={l} text={l} />)}
      {frame < T.ls && (
        <div style={{ color: ui.blue }}>
          $ {blink && <span style={{ background: ui.fg }}>&nbsp;</span>}
        </div>
      )}
    </div>
  );
};

const Thumbs: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const files = useLines("ls.txt");
  const run1 = useLines("run-1.txt");
  return (
    <div
      style={{
        position: "absolute",
        inset: 18,
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gridAutoRows: "min-content",
        gap: 16,
      }}
    >
      {files.map((name, i) => {
        const s = spring({ frame: frame - T.thumbs - i * 10, fps, config: { damping: 18 } });
        const line = run1.find((l) => l.includes(` ${name}`)) ?? "";
        const done = frame >= T.progress[i];
        const reading = !done && frame >= (i === 0 ? T.reading : T.progress[i - 1]);
        const ok = line.includes("] ok");
        return (
          <div key={name} style={{ opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
            <div
              style={{
                position: "relative",
                height: 112,
                borderRadius: 8,
                overflow: "hidden",
                border: `1px solid ${reading ? ui.accent : ui.border}`,
                boxShadow: reading ? `0 0 0 2px ${ui.accent}55` : undefined,
                background: ui.inset,
              }}
            >
              <Img
                src={staticFile(`screenshots/${name}`)}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left top" }}
              />
              {done && (
                <span
                  style={{
                    position: "absolute",
                    left: 8,
                    bottom: 8,
                    fontFamily: mono,
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: ok ? "#0f2a17" : ui.inset,
                    color: ok ? ui.green : ui.muted,
                    border: `1px solid ${ok ? "#238636" : ui.border}`,
                  }}
                >
                  {ok ? "ok" : "no text"}
                </span>
              )}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 12,
                color: ui.muted,
                marginTop: 6,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Checkbox: React.FC<{ checked: number }> = ({ checked }) => (
  <svg width={18} height={18} viewBox="0 0 18 18" style={{ flex: "none", marginTop: 4 }}>
    <rect
      x={0.75}
      y={0.75}
      width={16.5}
      height={16.5}
      rx={4}
      fill={ui.accent}
      fillOpacity={checked}
      stroke={checked > 0.5 ? ui.accent : ui.faint}
      strokeWidth={1.5}
    />
    <path
      d="M4.5 9.2l3 3 6-6.5"
      fill="none"
      stroke="#1b0d08"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={14}
      strokeDashoffset={14 * (1 - checked)}
    />
  </svg>
);

const Notes: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0, padding: "18px 24px", fontFamily: sans, color: ui.fg }}>
      <div
        style={{ fontSize: 28, fontWeight: 600, paddingBottom: 8, borderBottom: `1px solid ${ui.border}`, marginBottom: 14 }}
      >
        Notes
      </div>
      {notes.map((text, i) => {
        const s = spring({ frame: frame - T.entries[i], fps, config: { damping: 200 } });
        const tick = i < T.ticks.length ? spring({ frame: frame - T.ticks[i], fps, config: { damping: 16 } }) : 0;
        return (
          <div
            key={text}
            style={{
              display: "flex",
              gap: 10,
              fontSize: 16,
              lineHeight: 1.5,
              marginBottom: 12,
              opacity: s,
              transform: `translateY(${(1 - s) * 10}px)`,
            }}
          >
            <span style={{ fontFamily: mono, fontSize: 14, color: ui.muted, marginTop: 2, width: 18 }}>{i + 1}.</span>
            <Checkbox checked={tick} />
            <span style={{ color: tick > 0.5 ? ui.muted : ui.fg }}>{text}</span>
          </div>
        );
      })}
    </div>
  );
};

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const stage = frame < T.run ? "drop" : frame < T.learn ? "run" : "learn";
  // A hard tab switch, like a real editor. A crossfade also leaves ghosting in the lossy WebP.
  const notesOn = frame >= T.notesTab ? 1 : 0;
  const tab = (label: string, active: boolean) => (
    <span
      style={{
        color: active ? ui.fg : ui.muted,
        paddingBottom: 11,
        marginBottom: -12,
        borderBottom: `2px solid ${active ? ui.accent : "transparent"}`,
      }}
    >
      {label}
    </span>
  );

  return (
    <AbsoluteFill style={{ background: ui.page }}>
      <Pane
        style={{ left: 22, width: 740 }}
        title={
          <>
            <Dots />
            <span style={{ marginLeft: 8 }}>zsh · ~/english</span>
          </>
        }
        right={(["drop", "run", "learn"] as const).map((s) => (
          <Pill key={s} active={s === stage}>
            {s}
          </Pill>
        ))}
      >
        <Terminal frame={frame} />
      </Pane>
      <Pane
        style={{ left: 780, right: 22 }}
        title={
          <div style={{ display: "flex", gap: 18 }}>
            {tab("screenshots/", notesOn < 0.5)}
            {tab("notes.md", notesOn >= 0.5)}
          </div>
        }
      >
        <div style={{ position: "absolute", inset: 0, opacity: 1 - notesOn }}>
          {frame < T.thumbs + 4 && (
            <div
              style={{
                position: "absolute",
                inset: 18,
                border: `1px dashed ${ui.border}`,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: sans,
                color: ui.faint,
              }}
            >
              empty folder
            </div>
          )}
          <Thumbs frame={frame} />
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: notesOn }}>
          <Notes frame={frame} />
        </div>
      </Pane>
    </AbsoluteFill>
  );
};

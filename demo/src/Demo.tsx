import type React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop, Checkbox, GradientText, StepCaption, useEnterExit, WindowChrome } from "./parts";
import { mono, notes, palette, sans, screenshots, serif } from "./theme";

const c = palette.dark;

// Scene boundaries in frames (30 fps).
const INTRO = { from: 0, len: 66 };
const DROP = { from: 56, len: 118 };
const TERMINAL = { from: 164, len: 236 };
const RESULT = { from: 390, len: 140 };
export const DEMO_FRAMES = RESULT.from + RESULT.len;

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = useEnterExit(0, INTRO.len);
  const word = (i: number) => {
    const s = spring({ frame: frame - 6 - i * 5, fps, config: { damping: 14, mass: 0.6 } });
    return {
      display: "inline-block",
      opacity: s,
      transform: `translateY(${(1 - s) * 50}px) rotate(${(1 - s) * 4}deg)`,
    } as const;
  };
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", ...exit, transform: undefined }}
    >
      <div style={{ fontFamily: mono, fontSize: 24, color: c.muted, marginBottom: 22, ...word(0) }}>
        $ pic2text
      </div>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 104,
          letterSpacing: -4,
          color: c.fg,
          lineHeight: 1.05,
          textAlign: "center",
        }}
      >
        <span style={word(1)}>Screenshots</span> <span style={word(2)}>in.</span>
        <br />
        <span style={{ ...word(3), fontFamily: serif, fontWeight: 400, letterSpacing: -1 }}>
          <GradientText style={{ paddingRight: 8 }}>Notes</GradientText>
        </span>{" "}
        <span style={word(4)}>out.</span>
      </div>
    </AbsoluteFill>
  );
};

// Where each card floats before being filed (x, y, rotation).
const fan = [
  [-330, -100, -8],
  [300, -120, 6],
  [-280, 120, 5],
  [330, 110, -7],
] as const;

const Drop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fileAt = 62;
  const folderIn = spring({ frame: frame - 10, fps, config: { damping: 16 } });
  const filed = screenshots.filter((_, i) => frame > fileAt + i * 6 + 10).length;
  const bump = spring({ frame: frame - fileAt - 14, fps, config: { damping: 8, mass: 0.5 } });
  const exit = useEnterExit(0, DROP.len);

  return (
    <AbsoluteFill style={{ ...exit, transform: undefined }}>
      <StepCaption step="01" text="Drop screenshots into a folder" end={DROP.len} />
      {screenshots.map((src, i) => {
        const [x, y, r] = fan[i];
        const enter = spring({ frame: frame - i * 7, fps, config: { damping: 13, mass: 0.7 } });
        const file = spring({ frame: frame - fileAt - i * 6, fps, config: { damping: 18 } });
        const float = Math.sin((frame + i * 20) / 14) * 6 * (1 - file);
        const tx = interpolate(enter, [0, 1], [x * 2.2, x]) * (1 - file);
        const ty = interpolate(enter, [0, 1], [y * 2.2 + 300, y]) * (1 - file) + file * 200 + float;
        return (
          <div
            key={src}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${r * (1 - file)}deg) scale(${interpolate(file, [0, 1], [1, 0.12])})`,
              opacity: enter * interpolate(file, [0.7, 1], [1, 0], { extrapolateLeft: "clamp" }),
              zIndex: 2,
            }}
          >
            <Img
              src={staticFile(src)}
              style={{
                width: 440,
                borderRadius: 14,
                border: "1px solid #ffffff22",
                boxShadow: "0 30px 60px -20px #000000d0",
                display: "block",
              }}
            />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 70,
          transform: `translateX(-50%) translateY(${(1 - folderIn) * 160}px) scale(${1 + (bump - 1) * 0.08 + 0.0})`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "18px 28px",
          borderRadius: 22,
          background: "#ffffff0f",
          border: "1px solid #ffffff24",
          backdropFilter: "blur(14px)",
          zIndex: 1,
        }}
      >
        <svg width={58} height={46} viewBox="0 0 58 46">
          <defs>
            <linearGradient id="folder" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path d="M2 8a6 6 0 0 1 6-6h14l6 6h22a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6z" fill="url(#folder)" />
        </svg>
        <div style={{ fontFamily: mono, fontSize: 28, color: c.fg }}>screenshots/</div>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 20,
            color: "#0a0b14",
            background: c.fg,
            borderRadius: 999,
            minWidth: 34,
            textAlign: "center",
            padding: "3px 10px",
            opacity: filed > 0 ? 1 : 0,
          }}
        >
          {filed}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 4, fps, config: { damping: 20, mass: 0.9 } });
  const exit = useEnterExit(0, TERMINAL.len);
  const badge = spring({ frame: frame - 120, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ ...exit, transform: undefined, perspective: 1600 }}>
      <StepCaption step="02" text="Run one command" end={TERMINAL.len} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 128,
          width: 1200,
          height: 440,
          transform: `translateX(-50%) translateY(${(1 - enter) * 120}px) rotateX(${(1 - enter) * 24}deg) scale(${0.9 + enter * 0.1})`,
          opacity: enter,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 50px 140px -30px #7c5cff70, 0 30px 80px -20px #000000c0",
        }}
      >
        {/* Real recording of the CLI (demo/demo.tape), trimmed and sped up 1.3x. */}
        <OffthreadVideo
          src={staticFile("terminal.mp4")}
          trimBefore={78}
          playbackRate={1.3}
          muted
          style={{ width: "100%", display: "block" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: 120,
          transform: `scale(${badge}) rotate(${(1 - badge) * -12}deg)`,
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 22,
          color: "#0a0b14",
          backgroundImage: "linear-gradient(100deg, #a78bfa, #22d3ee)",
          padding: "10px 18px",
          borderRadius: 999,
          boxShadow: "0 12px 30px -8px #22d3ee80",
        }}
      >
        100% offline · no API keys
      </div>
    </AbsoluteFill>
  );
};

const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18 } });
  const exit = useEnterExit(0, RESULT.len);
  return (
    <AbsoluteFill style={{ ...exit, transform: undefined }}>
      <StepCaption step="03" text="Get a checklist you can tick off" end={RESULT.len} />
      <WindowChrome
        title="notes.md"
        style={{
          position: "absolute",
          left: "50%",
          top: 140,
          width: 1020,
          transform: `translateX(-50%) translateY(${(1 - enter) * 80}px) scale(${0.94 + enter * 0.06})`,
          opacity: enter,
        }}
      >
        <div style={{ padding: "24px 44px 34px", fontFamily: sans, color: c.fg }}>
          <div
            style={{
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: -1,
              paddingBottom: 12,
              borderBottom: `1px solid ${c.border}`,
              marginBottom: 20,
            }}
          >
            Notes
          </div>
          {notes.map((text, i) => {
            const s = spring({ frame: frame - 12 - i * 9, fps, config: { damping: 16 } });
            const tick = i < 2 ? spring({ frame: frame - 62 - i * 16, fps, config: { damping: 14 } }) : 0;
            return (
              <div
                key={text}
                style={{
                  display: "flex",
                  gap: 16,
                  fontSize: 27,
                  lineHeight: 1.45,
                  marginBottom: 16,
                  opacity: s,
                  transform: `translateX(${(1 - s) * -40}px)`,
                }}
              >
                <span style={{ color: c.muted, fontFamily: mono, fontSize: 22, marginTop: 6, width: 26 }}>
                  {i + 1}.
                </span>
                <Checkbox checked={tick} />
                <span style={{ opacity: 1 - tick * 0.45 }}>{text}</span>
              </div>
            );
          })}
        </div>
      </WindowChrome>
    </AbsoluteFill>
  );
};

export const Demo: React.FC = () => (
  <AbsoluteFill style={{ background: c.bg }}>
    <Backdrop />
    <Sequence from={INTRO.from} durationInFrames={INTRO.len}>
      <Intro />
    </Sequence>
    <Sequence from={DROP.from} durationInFrames={DROP.len}>
      <Drop />
    </Sequence>
    <Sequence from={TERMINAL.from} durationInFrames={TERMINAL.len}>
      <Terminal />
    </Sequence>
    <Sequence from={RESULT.from} durationInFrames={RESULT.len}>
      <Result />
    </Sequence>
  </AbsoluteFill>
);

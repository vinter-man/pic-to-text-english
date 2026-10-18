import type React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { accentGradient, mono, type Mode, palette, sans } from "./theme";

/**
 * Soft colour blobs over a dotted grid. Kept still on purpose: a moving full-frame
 * gradient makes every frame unique, which bloats the animated WebP and adds blocking.
 */
export const Backdrop: React.FC<{ mode?: Mode }> = ({ mode = "dark" }) => {
  const c = palette[mode];
  const blob = (color: string, x: number, y: number, size: number, phase: number) => (
    <div
      style={{
        position: "absolute",
        left: x + Math.sin(phase) * 60,
        top: y + Math.cos(phase) * 40,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(120px)",
        opacity: mode === "dark" ? 0.32 : 0.45,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: c.bg, overflow: "hidden" }}>
      {blob(c.glowA, -120, -160, 620, 0)}
      {blob(c.glowB, 760, 260, 560, 2)}
      {blob(c.glowC, 380, 520, 420, 4)}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${mode === "dark" ? "#ffffff14" : "#14152a14"} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const GradientText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <span
    style={{
      backgroundImage: accentGradient,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      ...style,
    }}
  >
    {children}
  </span>
);

/** Fade + lift in at `start`, fade + blur out at `end` (frames relative to the scene). */
export const useEnterExit = (start: number, end: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - start, fps, config: { damping: 200 } });
  const exit = interpolate(frame, [end - 12, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    opacity: enter * (1 - exit),
    transform: `translateY(${(1 - enter) * 24 - exit * 16}px)`,
    filter: `blur(${exit * 8}px)`,
  };
};

export const StepCaption: React.FC<{ step: string; text: string; end: number }> = ({
  step,
  text,
  end,
}) => {
  const style = useEnterExit(0, end);
  return (
    <div
      style={{
        position: "absolute",
        top: 44,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 22px 10px 10px",
          borderRadius: 999,
          background: "#ffffff0d",
          border: "1px solid #ffffff1f",
          backdropFilter: "blur(12px)",
          fontFamily: sans,
          fontSize: 26,
          fontWeight: 500,
          color: palette.dark.fg,
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 18,
            fontWeight: 600,
            color: "#0a0b14",
            backgroundImage: accentGradient,
            borderRadius: 999,
            padding: "6px 12px",
          }}
        >
          {step}
        </span>
        {text}
      </div>
    </div>
  );
};

export const WindowChrome: React.FC<{
  title: string;
  children: React.ReactNode;
  mode?: Mode;
  style?: React.CSSProperties;
}> = ({ title, children, mode = "dark", style }) => {
  const c = palette[mode];
  return (
    <div
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow:
          mode === "dark"
            ? "0 40px 120px -20px #000000c0, 0 0 0 1px #ffffff08"
            : "0 30px 80px -24px #2a2d5a40",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderBottom: `1px solid ${c.border}`,
          fontFamily: sans,
          fontSize: 16,
          fontWeight: 500,
          color: c.muted,
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
          <span key={color} style={{ width: 12, height: 12, borderRadius: 6, background: color }} />
        ))}
        <span style={{ marginLeft: 10 }}>{title}</span>
      </div>
      {children}
    </div>
  );
};

/** A GitHub-style task-list checkbox that draws its tick once `checked` goes from 0 to 1. */
export const Checkbox: React.FC<{ checked: number; size?: number }> = ({ checked, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" style={{ flex: "none", marginTop: 4 }}>
    <rect
      x={1}
      y={1}
      width={24}
      height={24}
      rx={7}
      fill={checked > 0 ? "url(#tick-fill)" : "transparent"}
      fillOpacity={checked}
      stroke={checked > 0.5 ? "transparent" : "#4b4f72"}
      strokeWidth={2}
    />
    <defs>
      <linearGradient id="tick-fill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#a78bfa" />
        <stop offset="1" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
    <path
      d="M7 13.5l4 4 8-9"
      fill="none"
      stroke="#0a0b14"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={20}
      strokeDashoffset={20 * (1 - checked)}
    />
  </svg>
);

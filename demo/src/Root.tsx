import type React from "react";
import { Composition, Still } from "remotion";
import { Banner } from "./Banner";
import { DEMO_FRAMES, Demo } from "./Demo";

export const Root: React.FC = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={DEMO_FRAMES} fps={30} width={1280} height={720} />
    <Still id="Banner" component={Banner} width={1280} height={640} />
  </>
);

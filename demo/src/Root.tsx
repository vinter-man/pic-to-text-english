import type React from "react";
import { Composition, Still } from "remotion";
import { Banner } from "./Banner";
import { DEMO_FRAMES, Demo } from "./Demo";
import { Result } from "./Result";

export const Root: React.FC = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={DEMO_FRAMES} fps={30} width={1280} height={720} />
    <Still id="BannerDark" component={Banner} defaultProps={{ mode: "dark" }} width={1280} height={460} />
    <Still id="BannerLight" component={Banner} defaultProps={{ mode: "light" }} width={1280} height={460} />
    <Still id="ResultDark" component={Result} defaultProps={{ mode: "dark" }} width={1240} height={600} />
    <Still id="ResultLight" component={Result} defaultProps={{ mode: "light" }} width={1240} height={600} />
  </>
);

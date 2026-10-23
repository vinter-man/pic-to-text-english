import type React from "react";
import { Composition, Still } from "remotion";
import { Banner } from "./Banner";
import { DEMO_FRAMES, Demo } from "./Demo";
import { Meme } from "./Meme";
import { Result } from "./Result";

export const Root: React.FC = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={DEMO_FRAMES} fps={30} width={1280} height={720} />
    <Still id="Banner" component={Banner} width={1280} height={640} />
    <Still id="Meme" component={Meme} width={760} height={900} />
    <Still id="ResultDark" component={Result} defaultProps={{ mode: "dark" }} width={1240} height={600} />
    <Still id="ResultLight" component={Result} defaultProps={{ mode: "light" }} width={1240} height={600} />
  </>
);

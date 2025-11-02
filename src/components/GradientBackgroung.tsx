import { Rect, RectProps } from "@motion-canvas/2d";
import shader from "../shaders/gradBG.glsl";
import { SignalValue, Vector2 } from "@motion-canvas/core";

export interface BackroundProps extends RectProps {
  offset?: SignalValue<Vector2>;
}

export default function Backround(props?: BackroundProps) {
  return (
    <Rect
      size={"100%"}
      fill={"white"}
      shaders={{
        fragment: shader,
        uniforms: { offset: props?.offset || new Vector2(0.5, 0) },
      }}
      zIndex={-999}
      opacity={0.2}
      filters={props?.filters}
    />
  );
}

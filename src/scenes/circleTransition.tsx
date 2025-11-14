import { Circle, Line, makeScene2D, Node, Rect } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  easeInOutExpo,
  Vector2,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const setup = createRef<Node>();
  const initLength = 400;
  const maxDistance = 400;
  const angle = createSignal<number>(30);
  const color1 = "orange";
  const color2 = "skyblue";
  const showLine = true;

  view.fill(color1);

  view.add(
    <Node ref={setup}>
      <Line
        stroke={"blue"}
        lineWidth={5}
        opacity={() => (showLine ? 1 : 0)}
        points={[
          [0, 0],
          () =>
            new Vector2(
              -initLength * Math.cos(((angle() / 2) * Math.PI) / 180),
              -initLength * Math.sin(((angle() / 2) * Math.PI) / 180)
            ),
        ]}
        lineCap={"round"}
      />

      <Line
        stroke={"green"}
        lineWidth={5}
        opacity={() => (showLine ? 1 : 0)}
        points={[
          [0, 0],
          () =>
            new Vector2(
              -initLength * Math.cos(((-angle() / 2) * Math.PI) / 180),
              -initLength * Math.sin(((-angle() / 2) * Math.PI) / 180)
            ),
        ]}
        lineCap={"round"}
      />

      <Circle
        size={() => {
          const effectiveAngle = angle() > 180 ? 360 - angle() : angle();
          const halfAngleRad = ((effectiveAngle / 2) * Math.PI) / 180;
          const r = maxDistance * Math.tan(halfAngleRad);
          return 2 * r;
        }}
        position={() => {
          const effectiveAngle = angle() > 180 ? 360 - angle() : angle();
          const halfAngleRad = ((effectiveAngle / 2) * Math.PI) / 180;
          const r = maxDistance * Math.tan(halfAngleRad);
          const d = r / Math.sin(halfAngleRad);
          return [-(angle() > 180 ? -d : d), 0];
        }}
        fill={() => {
          if (angle() <= 180) {
            view.fill(color2);
            return color1;
          } else {
            view.fill(color1);
            return color2;
          }
        }}
      />

      <Rect
        fill={color1}
        width={() => view.width() * 2}
        height={() => view.height() * 2}
        x={() => -view.width()}
        position={() => [0, 0]}
        opacity={() => (Math.round(angle()) === 180 ? 1 : 0)}
      />
    </Node>
  );

  setup().position([-300, 300]);

  yield* all(
    setup().position([300, -300], 1.6, easeInOutExpo, Vector2.arcLerp),
    angle(330, 1.6, easeInOutExpo)
  );
});

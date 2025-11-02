import { makeScene2D } from "@motion-canvas/2d";
import { waitUntil } from "@motion-canvas/core";
import Backround from "../components/GradientBackgroung";

export default makeScene2D(function* (view) {
  view.add(<Backround />);

  yield* waitUntil("start");
});

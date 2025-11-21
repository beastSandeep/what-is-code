import { makeScene2D } from "@motion-canvas/2d";
import Backround from "../components/GradientBackgroung";
import { useScene, waitUntil } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const isFinal = useScene().variables.get("isFinal", true)();

  view.add(<Backround />);

  yield* waitUntil("end");
});

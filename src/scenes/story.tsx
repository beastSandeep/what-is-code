import { makeScene2D } from "@motion-canvas/2d";
import Backround from "../components/GradientBackgroung";

export default makeScene2D(function* (view) {
  view.add(<Backround />);
});

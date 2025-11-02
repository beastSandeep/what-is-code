import { makeProject } from "@motion-canvas/core";

import hook from "./scenes/hook?scene";
import intro from "./scenes/intro?scene";

import "./global.css";

export default makeProject({
  scenes: [hook, intro],
  experimentalFeatures: true,
});

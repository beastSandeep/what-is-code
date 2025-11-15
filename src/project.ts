import { makeProject } from "@motion-canvas/core";

import hook from "./scenes/hook?scene";
import intro from "./scenes/intro?scene";
import story from "./scenes/story?scene";
import blinking from "./scenes/blinking?scene";

import audio from "../src/audios/script.wav";

import "./global.css";

export default makeProject({
  scenes: [hook, intro, story, blinking],
  audio,
  experimentalFeatures: true,
  variables: { isFinal: false },
});

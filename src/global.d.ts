// src/global.d.ts

declare module "*.glsl" {
  const content: string;
  export default content;
}

// -----------------------------
// Motion Canvas Scene Imports
// -----------------------------
declare module "*?scene" {
  import { FullSceneDescription } from "@motion-canvas/core";
  const scene: FullSceneDescription;
  export default scene;
}

// -----------------------------
// Raw file imports (SVG, etc.)
// -----------------------------
declare module "*.svg?raw" {
  const content: string;
  export default content;
}

// -----------------------------
// Images
// -----------------------------
declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

// -----------------------------
// Audio
// -----------------------------
declare module "*.mp3" {
  const value: string;
  export default value;
}

declare module "*.wav" {
  const value: string;
  export default value;
}

declare module "*.ogg" {
  const value: string;
  export default value;
}

// -----------------------------
// Optional: JSON files
// -----------------------------
declare module "*.json" {
  const value: any;
  export default value;
}
// -----------------------------
// Video
// -----------------------------
declare module "*.mp4" {
  const value: string;
  export default value;
}

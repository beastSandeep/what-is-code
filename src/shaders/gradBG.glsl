#version 300 es

precision highp float;
#define SMOOTH(a, b, t) smoothstep(a, b, t)

#include "@motion-canvas/core/shaders/common.glsl"

uniform vec2 offset;

// 2D rotation matrix
mat2 rotate2D(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
}

// Simple hash function returning a value between 0 and 1
float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

// Value noise based on grid interpolation
float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    // Sample four corners of the cell
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    // Smooth interpolation weights
    vec2 u = f * f * (3.0 - 2.0 * f);
    // Bilinear interpolation
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
    // Normalize coordinates and adjust for aspect ratio
    vec2 uv = sourceUV;
    float aspect = resolution.x / resolution.y;
    vec2 pos = uv - 0.5;
    pos.x *= aspect;
    pos += offset;
    // Apply a noise-based rotation for dynamic distortion
    float noiseVal = valueNoise(vec2(time * 0.2, pos.x * pos.y));
    float angle = (noiseVal - 0.5) * 1.57; // Rotate by up to ±0.785 radians (~45°)
    pos = rotate2D(angle) * pos;

    // Apply a subtle wave distortion
    float waveFreq = 4.0;
    float waveAmp = 0.05;
    pos.x += sin(pos.y * waveFreq + time) * waveAmp;
    pos.y += cos(pos.x * waveFreq + time) * waveAmp;

    // Create two gradient layers with a digital, neon-inspired palette
    vec3 gradA = mix(vec3(0.7, 0.7, 0.7), vec3(0.1, 0.9, 0.9), SMOOTH(0.0, 1.0, pos.x + 0.5));  // Deep navy → Bright cyan-green
    vec3 gradB = mix(vec3(1.0, 1.0, 1.0), vec3(0.1, 0.2, 0.3), SMOOTH(0.0, 1.0, pos.y + 0.5));  // Dark purple → Neon magenta-red

    // Blend the two layers using a factor derived from the distorted position
    float blend = SMOOTH(-0.2, 0.2, pos.x * pos.y);
    vec3 color = mix(gradA, gradB, blend);

    outColor = vec4(color, 1);
}

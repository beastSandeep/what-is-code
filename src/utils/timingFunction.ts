export function sharpEase(t: number): number {
  return t < 0.5
    ? (0.5 * Math.pow(2 * t, 3)) / (Math.pow(2 * t, 3) + Math.pow(1 - 2 * t, 3))
    : 0.5 +
        (0.5 * Math.pow(2 * t - 1, 3)) /
          (Math.pow(2 * t - 1, 3) + Math.pow(1 - (2 * t - 1), 3));
}

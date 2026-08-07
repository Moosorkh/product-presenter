import { useMotionValue, useMotionValueEvent, type MotionValue } from "framer-motion";

function clampedInterpolate(
  value: number,
  input: number[],
  output: number[]
) {
  if (value <= input[0]) return output[0];
  if (value >= input[input.length - 1]) return output[output.length - 1];
  for (let i = 0; i < input.length - 1; i++) {
    const a = input[i];
    const b = input[i + 1];
    if (value >= a && value <= b) {
      const t = b === a ? 0 : (value - a) / (b - a);
      return output[i] + t * (output[i + 1] - output[i]);
    }
  }
  return output[output.length - 1];
}

/**
 * Splits scrollYProgress (0-1) into `total` equal stages and returns an
 * opacity MotionValue for `index` that fades in/out at its stage boundaries,
 * with the first stage starting opaque and the last staying opaque at the end.
 *
 * Computed via a manual change-listener into a plain useMotionValue rather
 * than useTransform's declarative input/output-range form. Framer Motion v13
 * opportunistically routes that form through native CSS scroll-timelines for
 * performance (`MotionValue.accelerate`) when several transforms share one
 * scrollYProgress source; in this app that path desynced the actual DOM
 * opacity from the value Framer itself reports, leaving stages visually
 * stuck. Driving the value with .set() on every scroll change sidesteps that
 * optimization and keeps the DOM and the reported value in agreement.
 *
 * `overlapFraction` controls how much of each stage's span is spent
 * crossfading with its neighbor. Keep this small (~0.12-0.16) — a wide
 * overlap leaves two stages of differing content height semi-visible at
 * once, which reads as the cards "shuffling" rather than a clean handoff.
 */
export function useStageOpacity(
  scrollYProgress: MotionValue<number>,
  index: number,
  total: number,
  overlapFraction = 0.1
): MotionValue<number> {
  const span = 1 / total;
  const start = index * span;
  const end = start + span;
  const fadeIn = span * overlapFraction;
  const fadeOut = span * overlapFraction;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const input = isFirst && isLast
    ? [0, 1]
    : isFirst
      ? [start, end - fadeOut, end]
      : isLast
        ? [start - fadeIn, start, end]
        : [start - fadeIn, start, end - fadeOut, end];

  const output = isFirst && isLast
    ? [1, 1]
    : isFirst
      ? [1, 1, 0]
      : isLast
        ? [0, 1, 1]
        : [0, 1, 1, 0];

  const opacity = useMotionValue(clampedInterpolate(scrollYProgress.get(), input, output));

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    opacity.set(clampedInterpolate(latest, input, output));
  });

  return opacity;
}

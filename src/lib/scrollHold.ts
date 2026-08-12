import { getLenis } from "@/lib/lenis";

// A deliberate scroll rest: freezes scrolling outright via lenis.stop() for
// `cooldownMs`. A single continuous scroll gesture cannot carry through a
// freeze — the user has to stop and scroll again once it lifts, which is
// what makes it read as a real stop rather than just a slow patch.
export function createScrollPause(cooldownMs = 800) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function trigger() {
    const lenis = getLenis();
    if (!lenis) return;
    if (timeoutId) clearTimeout(timeoutId);
    lenis.stop();
    timeoutId = setTimeout(() => {
      getLenis()?.start();
      timeoutId = null;
    }, cooldownMs);
  }

  function destroy() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    getLenis()?.start();
  }

  return { trigger, destroy };
}

"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import Snap from "lenis/snap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// Matches the -72 offset the anchor-nav handler below already uses to clear
// the sticky header — lenis/snap has no header-offset concept of its own
// (it snaps to an element's raw document top), so snap points are computed
// manually instead of via its `addElements` convenience API.
const HEADER_OFFSET = 72;

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const lenis = new Lenis({
      duration: 1.1,
      easing: easeOutCubic,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const snap = new Snap(lenis, {
      type: "proximity",
      duration: 0.9,
      easing: easeOutCubic,
      distanceThreshold: "20%",
    });

    let removeSnapPoints: Array<() => void> = [];
    const registerSnapPoints = () => {
      removeSnapPoints.forEach((remove) => remove());
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("#top > *")
      );
      removeSnapPoints = sections.map((section) =>
        snap.add(section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET)
      );
    };

    const snapFrame = requestAnimationFrame(registerSnapPoints);
    window.addEventListener("load", registerSnapPoints);
    window.addEventListener("resize", registerSnapPoints);

    const handleHashNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;

      const hash = anchor.hash;
      const target =
        hash === "#top"
          ? document.documentElement
          : document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      lenis.scrollTo(target, {
        offset: hash === "#top" ? 0 : -HEADER_OFFSET,
        duration: reduceMotion ? 0 : 1.15,
        easing: easeOutCubic,
        immediate: reduceMotion,
        onComplete: () => ScrollTrigger.refresh(),
      });

      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
    };

    document.addEventListener("click", handleHashNavigation);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      cancelAnimationFrame(snapFrame);
      window.removeEventListener("load", registerSnapPoints);
      window.removeEventListener("resize", registerSnapPoints);
      removeSnapPoints.forEach((remove) => remove());
      snap.destroy();
      document.removeEventListener("click", handleHashNavigation);
      setLenis(null);
      lenis.destroy();
      gsap.ticker.remove(onTick);
    };
  }, []);

  return <>{children}</>;
}

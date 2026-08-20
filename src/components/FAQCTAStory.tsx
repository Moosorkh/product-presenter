"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FAQ from "./FAQ";
import WellnessTeaser from "./WellnessTeaser";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FAQCTAStory() {
  const storyRef = useRef<HTMLDivElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const video = backgroundVideoRef.current;

        if (!video) return;

        video.pause();

        let faqHoldTrigger: ScrollTrigger | null = null;
        let ctaHoldTrigger: ScrollTrigger | null = null;

        if (window.matchMedia("(min-width: 900px) and (min-height: 700px)").matches) {
          const faq = storyRef.current?.querySelector<HTMLElement>("#faq");
          const cta = storyRef.current?.querySelector<HTMLElement>(
            "[data-final-cta]"
          );

          if (faq) {
            faqHoldTrigger = ScrollTrigger.create({
              trigger: faq,
              start: "top 64px",
              end: () => `+=${Math.min(window.innerHeight * 0.34, 340)}`,
              pin: true,
              pinSpacing: true,
              invalidateOnRefresh: true,
            });
          }

          if (cta) {
            ctaHoldTrigger = ScrollTrigger.create({
              trigger: cta,
              start: "top 64px",
              end: () => `+=${Math.min(window.innerHeight * 0.38, 380)}`,
              pin: true,
              pinSpacing: true,
              invalidateOnRefresh: true,
            });
          }
        }

        const scrubTrigger = ScrollTrigger.create({
          trigger: storyRef.current,
          start: "top 64px",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            if (!Number.isFinite(video.duration)) return;

            const nextTime = progress * video.duration;

            if (Math.abs(video.currentTime - nextTime) >= 1 / 24) {
              video.currentTime = nextTime;
            }
          },
        });

        return () => {
          scrubTrigger.kill();
          faqHoldTrigger?.kill();
          ctaHoldTrigger?.kill();
          video.pause();
        };
      });

      return () => mm.revert();
    },
    { scope: storyRef }
  );

  return (
    <div
      ref={storyRef}
      className="relative isolate bg-[#050604] lg:motion-safe:-mt-[190svh]"
    >
      <div className="pointer-events-none sticky top-16 z-0 h-[calc(100svh-64px)] min-h-[680px] overflow-hidden">
        <video
          ref={backgroundVideoRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover md:translate-x-[8%] md:scale-[1.18]"
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
        >
          <source src="/CTA-BG-video.mp4" type="video/mp4" />
        </video>
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,4,3,0.88)_0%,rgba(3,4,3,0.68)_40%,rgba(3,4,3,0.26)_72%,rgba(3,4,3,0.4)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] mix-blend-soft-light"
          style={{
            backgroundImage: "url(/concrete-black-1024x773.jpg)",
            backgroundSize: "700px auto",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div className="relative z-10 -mt-[max(680px,calc(100svh-64px))]">
        <div
          aria-hidden
          className="hidden h-[calc(100svh-64px)] lg:motion-safe:block"
        />
        <FAQ />
        <WellnessTeaser />
      </div>
    </div>
  );
}

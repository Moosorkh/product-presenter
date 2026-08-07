"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import VapePen from "./VapePen";
import { flavors } from "@/data/products";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const marquee = "THE SIGNATURE LINE";

function readableText(hex: string) {
  const value = hex.replace("#", "");
  const [red, green, blue] = [0, 2, 4].map((offset) =>
    Number.parseInt(value.slice(offset, offset + 2), 16)
  );
  const luminance = (red * 299 + green * 587 + blue * 114) / 255000;

  return luminance > 0.58 ? "#4a3508" : "#f8f3e8";
}

export default function SignatureSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const activeFlavor = flavors[activeIndex];
  const foreground = readableText(activeFlavor.penColor);

  useGSAP(
    () => {
      let currentStage = 0;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * flavors.length * 0.62}`,
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            const nextStage = Math.min(
              Math.floor(progress * flavors.length),
              flavors.length - 1
            );

            if (nextStage !== currentStage) {
              currentStage = nextStage;
              setActiveIndex(nextStage);
            }
          },
        },
      });

      timeline
        .fromTo(
          marqueeRef.current,
          { xPercent: 3 },
          { xPercent: -28, duration: 1, ease: "none" },
          0
        )
        .fromTo(
          penRef.current,
          { y: 34, scale: 0.88, rotate: -2 },
          { y: -16, scale: 1.04, rotate: 1.5, duration: 1, ease: "power1.inOut" },
          0
        )
        .fromTo(
          shineRef.current,
          { xPercent: -260, opacity: 0 },
          { xPercent: 290, opacity: 0.9, duration: 0.72, ease: "power2.inOut" },
          0.12
        )
        .fromTo(
          haloRef.current,
          { scale: 0.7, opacity: 0.3 },
          { scale: 1.18, opacity: 0.78, duration: 1, ease: "none" },
          0
        );
    },
    { scope: sectionRef }
  );

  return (
    <motion.section
      id="signature-spotlight"
      ref={sectionRef}
      className="relative flex h-screen min-h-[680px] items-center justify-center overflow-hidden"
      animate={{ backgroundColor: activeFlavor.penColor, color: foreground }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-45"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.72), transparent 31%), linear-gradient(115deg, rgba(255,255,255,0.18), transparent 36%, rgba(182,147,47,0.22) 72%, transparent)",
        }}
      />

      <div
        ref={marqueeRef}
        aria-hidden
        className="absolute left-[-12vw] top-1/2 z-10 flex -translate-y-1/2 whitespace-nowrap will-change-transform"
      >
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className="mr-[0.24em] text-[clamp(2.25rem,9vw,10rem)] font-black leading-none tracking-[-0.055em] text-transparent"
            style={{
              WebkitTextStroke: `1.6px ${foreground}9c`,
            }}
          >
            {marquee}
          </span>
        ))}
      </div>

      <div
        ref={haloRef}
        aria-hidden
        className="absolute left-1/2 top-1/2 z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] will-change-transform"
        style={{ backgroundColor: `${activeFlavor.boxAccent}b8` }}
      />

      <div
        ref={penRef}
        className="relative z-20 will-change-transform"
      >
        <div
          aria-hidden
          className="absolute left-1/2 top-[94%] h-16 w-44 -translate-x-1/2 rounded-full bg-[#6d4d0c]/35 blur-2xl"
        />
        <VapePen
          color={activeFlavor.penColor}
          accent={activeFlavor.boxAccent}
          name={activeFlavor.name}
          className="relative h-[66vh] min-h-[500px] max-h-[760px] w-auto drop-shadow-[0_34px_36px_rgba(36,24,3,0.35)]"
        />
        <div
          ref={shineRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-[6%] left-[39%] z-30 w-[14%] -skew-x-12 rounded-full bg-gradient-to-r from-transparent via-white/75 to-transparent opacity-0 blur-[5px] mix-blend-screen will-change-transform"
        />
      </div>

      <div className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 text-center">
        <p className="text-xs font-black uppercase tracking-[0.34em] opacity-80">
          Dime Industries
        </p>
        <p className="mt-2 text-sm font-semibold opacity-70">
          {activeFlavor.name} &middot; {activeFlavor.type}
        </p>
      </div>
    </motion.section>
  );
}

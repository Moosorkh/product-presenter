"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import { pillars } from "@/data/products";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
} as const;

export default function BrandSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const video = backgroundVideoRef.current;

        if (!video) return;

        video.pause();

        const setPlayback = (isActive: boolean) => {
          if (isActive) {
            void video.play().catch(() => {
              // Muted viewport playback can still be blocked by browser settings.
            });
          } else {
            video.pause();
          }
        };

        let scrubTrigger: ScrollTrigger | null = null;
        const resumePlayback = gsap
          .delayedCall(0.18, () => {
            if (scrubTrigger?.isActive) setPlayback(true);
          })
          .pause();

        scrubTrigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => {
            if (!isActive) resumePlayback.pause(0);
            setPlayback(isActive);
          },
          onUpdate: ({ progress }) => {
            if (!Number.isFinite(video.duration)) return;

            video.pause();
            const nextTime = progress * video.duration;

            if (Math.abs(video.currentTime - nextTime) >= 1 / 24) {
              video.currentTime = nextTime;
            }

            resumePlayback.restart(true);
          },
        });

        setPlayback(scrubTrigger.isActive);

        return () => {
          scrubTrigger?.kill();
          resumePlayback.kill();
          video.pause();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="accessories" ref={sectionRef} className="relative overflow-hidden bg-[#090806] py-20 text-[#f7f1e7]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <video
          ref={backgroundVideoRef}
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
        >
          <source src="/smoke.mp4" type="video/mp4" />
        </video>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-[#120e09] via-[#120e09]/45 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#efbd59]">
            Why Dime
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black sm:text-5xl">
            Award winning, lab tested, licensed every step
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-white/72">
            From the flower we source to the hardware in your hand &mdash;
            every part of the process is built to the same standard.
          </p>
        </Reveal>

        <Reveal y={18} className="mt-12">
          <div className="overflow-hidden rounded-[1.75rem] bg-transparent px-5 py-6 sm:px-10">
            <Image
              src="/dime-awards.png"
              alt="Dime Industries awards from cannabis publications and competitions"
              width={938}
              height={352}
              className="mx-auto h-auto w-full max-w-[938px] object-contain"
            />
          </div>
        </Reveal>

        <motion.div
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          {pillars.slice(1).map((pillar) => (
            <motion.div
              key={pillar.name}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-black/30 p-6 text-left text-[#f3ede1] shadow-lg backdrop-blur-md"
            >
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <p className="relative text-sm font-bold uppercase tracking-wide text-gold">
                {pillar.name}
              </p>
              <p className="relative mt-2 text-sm text-[#f3ede1]/60">{pillar.blurb}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

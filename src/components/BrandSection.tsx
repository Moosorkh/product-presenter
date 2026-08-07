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
  const stripesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(stripesRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="accessories" ref={sectionRef} className="relative overflow-hidden bg-gold py-20 text-ink-deep">
      <div
        ref={stripesRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -top-1/4 h-[150%] opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #0a0a0a 0px, #0a0a0a 2px, transparent 2px, transparent 40px)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.3em]">
            Why Dime
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black sm:text-5xl">
            Award winning, lab tested, licensed every step
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-ink-deep/80">
            From the flower we source to the hardware in your hand &mdash;
            every part of the process is built to the same standard.
          </p>
        </Reveal>

        <Reveal y={18} className="mt-12">
          <div className="overflow-hidden rounded-[1.75rem] border border-ink-deep/10 bg-[#efefec] px-5 py-6 shadow-[0_24px_70px_rgba(35,24,7,0.13)] sm:px-10">
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
              className="group relative overflow-hidden rounded-2xl bg-ink-deep p-6 text-left text-[#f3ede1] shadow-lg"
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

"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import { heroFlavor, labSpecs } from "@/data/products";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const checkpoints = [
  { label: "Batch identity", detail: "Code matched", width: "100%" },
  { label: "Extraction record", detail: "Method logged", width: "100%" },
  { label: "Hardware review", detail: "Ceramic coil", width: "100%" },
  { label: "Third-party screen", detail: "COA attached", width: "100%" },
];

const chartLabels = ["Identity", "Extract", "Hardware", "Release"];

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.12 },
  },
} as const;

const rowVariants = {
  hidden: { opacity: 0, x: 14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

export default function NutritionFacts() {
  const sectionRef = useRef<HTMLElement>(null);
  const checkpointsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (min-height: 700px)", () => {
        gsap.set(".checkpoint-fill", {
          scaleX: 0,
          transformOrigin: "left center",
        });
        const analysisLines =
          gsap.utils.toArray<SVGPathElement>(".analysis-line");
        const analysisPoints =
          gsap.utils.toArray<SVGGElement>(".analysis-point");

        analysisLines.forEach((line) => {
          const length = line.getTotalLength();
          gsap.set(line, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        });
        gsap.set(analysisPoints, { opacity: 0 });

        const checkpointsTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: checkpointsRef.current,
            start: "top 92px",
            end: "+=38%",
            pin: checkpointsRef.current,
            scrub: 0.65,
            anticipatePin: 1,
          },
        });

        checkpointsTimeline.to(".checkpoint-fill", {
          scaleX: 1,
          duration: 0.55,
          stagger: 0.14,
          ease: "power2.out",
        });

        const chartTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: chartRef.current,
            start: "top 84%",
            end: "top 38%",
            scrub: true,
          },
        });

        chartTimeline
          .to(
            analysisLines[0],
            {
              strokeDashoffset: 0,
              duration: 1,
              ease: "none",
            },
            0
          )
          .to(analysisPoints[0], { opacity: 1, duration: 0.06 }, 0.02)
          .to(analysisPoints[1], { opacity: 1, duration: 0.06 }, 0.3)
          .to(analysisPoints[2], { opacity: 1, duration: 0.06 }, 0.53)
          .to(
            analysisLines[1],
            {
              strokeDashoffset: 0,
              duration: 0.45,
              ease: "none",
            },
            0.54
          )
          .to(analysisPoints[3], { opacity: 1, duration: 0.08 }, 0.96);
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="nutrition"
      ref={sectionRef}
      className="relative overflow-x-hidden bg-[#f1f0eb] py-24 text-[#151515] sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: "url(/concrete-black-1024x773.jpg)",
          backgroundSize: "740px auto",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div
          ref={checkpointsRef}
          className="mx-auto w-full bg-[#f1f0eb] pb-3"
        >
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#a87719]">
              Certificate Analysis
            </p>
            <h2 className="mt-5 text-[clamp(3.4rem,6vw,6.8rem)] font-black leading-[0.88] tracking-[-0.06em]">
              Read the result.
              <br />
              Not the hype.
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-black/60 sm:text-lg">
              Every unit connects to a batch record. This illustrative analysis
              shows how {heroFlavor.name} moves from documented inputs to a
              third-party certificate.
            </p>
          </Reveal>

          <div className="mx-auto mt-12 max-w-5xl border-y border-black/10 py-8">
            <p className="mb-6 text-center text-xs font-black uppercase tracking-[0.26em] text-black/48">
              Documented verification checkpoints
            </p>
            <div className="space-y-4">
              {checkpoints.map((item, index) => (
                <div
                  key={item.label}
                  className="grid items-center gap-3 sm:grid-cols-[12rem_minmax(0,1fr)_8rem]"
                >
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-black/58">
                    {item.label}
                  </p>
                  <div className="h-9 overflow-hidden bg-black/[0.08]">
                    <div
                      className={`checkpoint-fill h-full ${
                        index === checkpoints.length - 1
                          ? "bg-gradient-to-r from-[#f6cf3f] to-[#bc7f10]"
                          : "bg-[#262626]"
                      }`}
                      style={{ width: item.width }}
                    />
                  </div>
                  <p
                    className={`text-sm font-bold sm:text-right ${
                      index === checkpoints.length - 1
                        ? "text-[#a26700]"
                        : "text-black/60"
                    }`}
                  >
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div ref={chartRef}>
            <Reveal y={26}>
              <div className="border border-black/10 bg-[#f8f7f2] p-5 shadow-[0_24px_80px_rgba(22,22,20,0.06)] sm:p-9">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a87719]">
                    Analysis path
                  </p>
                  <h3 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                    Four checks. One release.
                  </h3>
                </div>
                <p className="max-w-[15rem] text-sm leading-relaxed text-black/48">
                  A visual record of the review sequence attached to a batch.
                </p>
              </div>

              <div className="mt-10 overflow-hidden">
                <svg
                  viewBox="0 0 720 360"
                  role="img"
                  aria-label="Illustrative batch review chart moving through identity, extraction, hardware and release checks"
                  className="h-auto w-full"
                >
                  <g stroke="#171717" strokeOpacity="0.12" strokeWidth="1">
                    <path d="M78 70H680" />
                    <path d="M78 145H680" />
                    <path d="M78 220H680" />
                    <path d="M78 295H680" />
                  </g>
                  <path
                    d="M78 48V295H690"
                    fill="none"
                    stroke="#171717"
                    strokeOpacity="0.5"
                    strokeWidth="1.5"
                  />

                  <path
                    className="analysis-line"
                    d="M105 254 C180 250 210 221 265 210 S355 174 410 166 S515 117 585 91 S638 77 668 70"
                    fill="none"
                    stroke="#8e8e89"
                    strokeWidth="3"
                  />
                  <path
                    className="analysis-line"
                    d="M410 166 C475 151 515 117 585 91 S638 77 668 70"
                    fill="none"
                    stroke="#bd7d09"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />

                  {[
                    [105, 254],
                    [265, 210],
                    [410, 166],
                    [668, 70],
                  ].map(([cx, cy], index) => (
                    <g
                      className="analysis-point"
                      key={chartLabels[index]}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r="10"
                        fill={index === 3 ? "#f6cf3f" : "#f1f0eb"}
                        stroke={index === 3 ? "#9d6908" : "#262626"}
                        strokeWidth="3"
                      />
                    </g>
                  ))}

                  <path
                    d="M558 55H680"
                    fill="none"
                    stroke="#bd7d09"
                    strokeWidth="2"
                  />
                  <text
                    x="558"
                    y="42"
                    fill="#9d6908"
                    fontSize="13"
                    fontWeight="800"
                    letterSpacing="2"
                  >
                    RELEASE READY
                  </text>

                  {chartLabels.map((label, index) => (
                    <text
                      key={label}
                      x={[105, 265, 410, 668][index]}
                      y="326"
                      textAnchor="middle"
                      fill="#171717"
                      fillOpacity="0.62"
                      fontSize="13"
                      fontWeight="700"
                    >
                      {label}
                    </text>
                  ))}
                  <text
                    x="18"
                    y="185"
                    fill="#171717"
                    fillOpacity="0.5"
                    fontSize="12"
                    fontWeight="700"
                    letterSpacing="1.4"
                    transform="rotate(-90 18 185)"
                  >
                    DOCUMENTED REVIEW
                  </text>
                </svg>
              </div>
              </div>
            </Reveal>
          </div>

          <Reveal y={34} delay={0.12}>
            <div className="rounded-[1.75rem] border border-gold/30 bg-[#111210] p-7 text-[#f3ede1] shadow-[0_28px_90px_rgba(22,22,20,0.14)] sm:p-9">
              <div className="flex items-center justify-between border-b border-gold/30 pb-5">
                <div>
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-gold">
                    Dime Industries
                  </p>
                  <h3 className="mt-2 text-xl font-black uppercase tracking-wide">
                    Certificate Docket
                  </h3>
                </div>
                <span className="rounded-full bg-gold px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-wide text-[#17130b]">
                  Sample
                </span>
              </div>

              <motion.dl
                className="mt-3 divide-y divide-white/10 text-sm"
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
              >
                {labSpecs.map((fact) => (
                  <motion.div
                    key={fact.label}
                    variants={rowVariants}
                    className="grid grid-cols-[0.8fr_1.2fr] gap-5 py-3.5"
                  >
                    <dt className="text-[#f3ede1]/48">{fact.label}</dt>
                    <dd className="text-right font-bold leading-snug text-[#f3ede1]">
                      {fact.value}
                    </dd>
                  </motion.div>
                ))}
              </motion.dl>

              <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-relaxed text-[#f3ede1]/38">
                Illustrative sample values for presentation purposes only.
                Confirm real results using the code printed on your unit.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

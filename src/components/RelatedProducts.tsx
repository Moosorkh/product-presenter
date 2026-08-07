"use client";

import { useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VapePen from "./VapePen";
import StrainIcon from "./StrainIcon";
import { flavors } from "@/data/products";

const productPositions = [
  { x: -92, y: 6, rotate: 0, scale: 1.16, opacity: 1 },
  { x: 172, y: 52, rotate: 5, scale: 1, opacity: 1 },
  { x: 418, y: 82, rotate: 10, scale: 0.94, opacity: 1 },
  { x: 650, y: 110, rotate: 14, scale: 0.88, opacity: 0.92 },
  { x: 872, y: 138, rotate: 17, scale: 0.82, opacity: 0.6 },
] as const;

function SmokeBackdrop({
  flavorId,
  primary,
  secondary,
}: {
  flavorId: string;
  primary: string;
  secondary: string;
}) {
  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={flavorId}
        aria-hidden
        className="product-smoke absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={
          {
            "--smoke-primary": primary,
            "--smoke-secondary": secondary,
          } as CSSProperties
        }
      >
        <span className="product-smoke__cloud product-smoke__cloud--one" />
        <span className="product-smoke__cloud product-smoke__cloud--two" />
        <span className="product-smoke__haze" />
      </motion.div>
    </AnimatePresence>
  );
}

function readableText(hex: string) {
  const value = hex.replace("#", "");
  const [red, green, blue] = [0, 2, 4].map((offset) =>
    Number.parseInt(value.slice(offset, offset + 2), 16)
  );
  const luminance = (red * 299 + green * 587 + blue * 114) / 255000;

  return luminance > 0.58 ? "#17130b" : "#f8f3e8";
}

export default function RelatedProducts() {
  const [activeIndex, setActiveIndex] = useState(4);
  const [direction, setDirection] = useState(1);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const activeFlavor = flavors[activeIndex];
  const foreground = readableText(activeFlavor.penColor);

  const move = (step: number) => {
    setDirection(step);
    setActiveIndex((current) => (current + step + flavors.length) % flavors.length);
  };

  const selectFlavor = (index: number, slot: number) => {
    if (index === activeIndex) return;

    setDirection(slot <= flavors.length / 2 ? 1 : -1);
    setActiveIndex(index);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return;
    }

    move(deltaX < 0 ? 1 : -1);
  };

  return (
    <motion.section
      id="edibles"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative isolate overflow-hidden border-t-[14px] border-[#080808]"
      style={{ touchAction: "pan-y" }}
      animate={{ backgroundColor: activeFlavor.penColor, color: foreground }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-[31%] right-0 hidden bg-[#f5f0e5] lg:block"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: "url(/concrete-black-1024x773.jpg)",
          backgroundSize: "620px auto",
          backgroundPosition: "left center",
        }}
      />

      <div className="relative min-h-[760px] w-full sm:min-h-[820px] lg:min-h-[850px]">
        <div className="relative z-20 flex min-h-[760px] items-start px-7 pb-8 pt-[448px] sm:min-h-[820px] sm:px-12 sm:pt-[500px] lg:min-h-[850px] lg:w-[31%] lg:items-center lg:px-10 lg:pb-0 lg:pt-0 xl:px-14">
          <div className="grid w-full max-w-[420px] grid-rows-[minmax(0,1fr)_auto] gap-5 lg:h-[590px] lg:gap-8">
            <div className="relative min-h-[205px] sm:min-h-[230px] lg:min-h-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeFlavor.id}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 0, x: direction * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -20 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-65">
                    Dime Signature Line
                  </p>
                  <h2 className="mt-3 text-[clamp(2.65rem,12vw,4rem)] font-black leading-[0.9] tracking-[-0.055em] lg:mt-5 lg:text-[clamp(3.25rem,4.25vw,5.1rem)]">
                    {activeFlavor.name}
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed opacity-70 lg:mt-6 lg:text-lg">
                    {activeFlavor.tagline}.
                  </p>

                  <div className="mt-4 flex items-center gap-3 lg:mt-7">
                    <span
                      className="inline-flex items-center gap-2 rounded-full border bg-white/20 px-4 py-2 text-sm font-bold"
                      style={{ borderColor: `${foreground}38` }}
                    >
                      <StrainIcon
                        type={activeFlavor.type}
                        className="h-4 w-4"
                      />
                      {activeFlavor.type}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(flavors.length).padStart(2, "0")}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              className="flex shrink-0 justify-center gap-3 lg:justify-start lg:self-end"
              aria-label="Flavor carousel controls"
            >
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous flavor"
                className="group grid h-12 w-12 place-items-center rounded-full border bg-white/15 transition-colors hover:bg-white/30 lg:h-14 lg:w-14"
                style={{ borderColor: `${foreground}38` }}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-5 w-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next flavor"
                className="group grid h-12 w-12 place-items-center rounded-full border bg-white/15 transition-colors hover:bg-white/30 lg:h-14 lg:w-14"
                style={{ borderColor: `${foreground}38` }}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-0 z-10 h-[430px] overflow-hidden sm:h-[480px] lg:inset-y-0 lg:left-[31%] lg:right-0 lg:h-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e5] via-[#f5f0e5] to-[#efe5d1] lg:hidden" />
          <SmokeBackdrop
            flavorId={activeFlavor.id}
            primary={activeFlavor.penColor}
            secondary={activeFlavor.boxAccent}
          />
          <div className="absolute left-1/2 top-[42%] z-[2] h-[460px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-3xl lg:left-[11%] lg:top-1/2" />

          <div className="absolute inset-x-0 top-0 z-10 h-full lg:left-0 lg:right-auto lg:w-full">
            {flavors.map((flavor, index) => {
              const slot = (index - activeIndex + flavors.length) % flavors.length;
              const position = productPositions[slot];
              const isVisible = Boolean(position);

              return (
                <motion.button
                  key={flavor.id}
                  type="button"
                  aria-label={`Select ${flavor.name}`}
                  aria-pressed={index === activeIndex}
                  tabIndex={isVisible ? 0 : -1}
                  onClick={() => selectFlavor(index, slot)}
                  className="absolute left-1/2 top-[15%] origin-bottom cursor-pointer border-0 bg-transparent p-0 text-left outline-none will-change-transform focus-visible:drop-shadow-[0_0_14px_rgba(203,160,90,0.9)] sm:top-[13%] lg:left-[8%] lg:top-[15%]"
                  animate={
                    isVisible
                      ? position
                      : {
                          x: direction > 0 ? -330 : 1030,
                          y: 170,
                          rotate: direction > 0 ? -8 : 20,
                          scale: 0.74,
                          opacity: 0,
                        }
                  }
                  transition={{
                    duration: 0.56,
                    ease: [0.22, 1, 0.36, 1],
                    opacity: { duration: 0.22 },
                  }}
                  style={{
                    zIndex: isVisible ? 20 - slot : 0,
                    pointerEvents: isVisible ? "auto" : "none",
                  }}
                >
                  <VapePen
                    color={flavor.penColor}
                    accent={flavor.boxAccent}
                    name={flavor.name}
                    className="h-[330px] w-auto drop-shadow-[0_28px_28px_rgba(74,49,0,0.25)] sm:h-[400px] lg:h-[610px]"
                  />
                </motion.button>
              );
            })}
          </div>

          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#efe5d1] to-transparent lg:h-32"
          />
        </div>
      </div>
    </motion.section>
  );
}

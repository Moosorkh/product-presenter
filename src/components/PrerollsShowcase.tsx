"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP);

const products = [
  {
    name: "Signature Line",
    tag: "Blueberry Lemon Haze",
    blurb: "The original Dime all-in-one, built around bold terpene flavor.",
    src: "/ROYALPEAR-6-9.png",
    color: "#2157b9",
  },
  {
    name: "Balanced Line",
    tag: "Mowie Wowie",
    blurb: "A bright, balanced profile in Dime's rechargeable all-in-one hardware.",
    src: "/ROYALPEAR-4-13.png",
    color: "#a9d9ef",
  },
  {
    name: "Rosin Line",
    tag: "Garlic Cookies",
    blurb: "Solventless rosin, low-temperature hardware, and full terpene expression.",
    src: "/ROYALPEAR-3-17.png",
    color: "#c98f80",
  },
  {
    name: "Cannabis Gummies",
    tag: "Blue Raspberry",
    blurb: "A full-spectrum edible made for a smooth, measured experience.",
    src: "/ROYALPEAR-11-4.png",
    color: "#66a9df",
  },
  {
    name: "Wellness Line",
    tag: "Strawberry THC Gummies",
    blurb: "A fruit-forward wellness format with Dime quality in every serving.",
    src: "/ROYALPEAR-1-2.png",
    color: "#e97c8e",
  },
  {
    name: "Broad Spectrum",
    tag: "Softgels + CBG",
    blurb: "A precise softgel format for a simple, consistent daily ritual.",
    src: "/ROYALPEAR.png",
    color: "#d29ac9",
  },
  {
    name: "State Exclusives",
    tag: "Bombsicle",
    blurb: "Limited regional drops that bring new flavor to familiar hardware.",
    src: "/ROYALPEAR-2-22.png",
    color: "#ed643e",
  },
];

// Three copies of the deck sit side by side so a free drag never runs out of
// cards — onDrag/onThrowUpdate silently jumps the track back by one deck
// width whenever it strays into the first or third copy, so the loop reads
// as endless while a real DOM element always exists under the cursor.
const loopedProducts = [...products, ...products, ...products];

function modulo(value: number, length: number) {
  return ((value % length) + length) % length;
}

export default function PrerollsShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const draggableRef = useRef<Draggable | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useGSAP(
    () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      const getSetWidth = () => track.scrollWidth / 3;

      // Only safe to reposition the track when no tween owns its "x" right
      // now — nudging it mid-throw fights InertiaPlugin's own trajectory
      // and the two corrections compound into a runaway drift.
      const wrapAtRest = () => {
        const setWidth = getSetWidth();
        const x = gsap.getProperty(track, "x") as number;
        if (x > 0 || x < -setWidth * 2) {
          gsap.set(track, { x: gsap.utils.wrap(-setWidth * 2, 0, x) });
          draggableRef.current?.update();
        }
      };

      const applyBounds = () => {
        const setWidth = getSetWidth();
        draggableRef.current?.applyBounds({
          minX: -setWidth * 2.5,
          maxX: setWidth * 0.5,
        });
      };

      const syncActiveIndex = () => {
        const viewportCenter =
          viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });
        setActiveIndex(modulo(nearestIndex, products.length));
      };

      const place = () => {
        gsap.set(track, { x: -getSetWidth() });
        syncActiveIndex();
        setIsReady(true);
      };

      const frame = requestAnimationFrame(() => {
        place();
        applyBounds();
      });
      const resizeObserver = new ResizeObserver(() => {
        const setWidth = getSetWidth();
        const x = gsap.getProperty(track, "x") as number;
        // Re-anchor to the middle deck on resize without disturbing which
        // card is currently centered.
        gsap.set(track, { x: gsap.utils.clamp(-setWidth * 2, 0, x) });
        applyBounds();
      });
      resizeObserver.observe(viewport);

      const [draggable] = Draggable.create(track, {
        type: "x",
        inertia: true,
        allowNativeTouchScrolling: "y" as unknown as boolean,
        dragClickables: true,
        onPress() {
          gsap.killTweensOf(track);
        },
        onThrowComplete() {
          wrapAtRest();
          syncActiveIndex();
        },
        onDragEnd() {
          if (!this.tween) {
            wrapAtRest();
            syncActiveIndex();
          }
        },
      });
      draggableRef.current = draggable;

      return () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        draggable.kill();
      };
    },
    { scope: sectionRef }
  );

  function nudge(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    gsap.killTweensOf(track);

    const cardWidth = cardRefs.current[0]?.offsetWidth ?? 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    const x = (gsap.getProperty(track, "x") as number) - direction * (cardWidth + gap);

    gsap.to(track, {
      x,
      duration: 0.6,
      ease: "power3.out",
      onComplete: () => {
        const setWidth = track.scrollWidth / 3;
        const current = gsap.getProperty(track, "x") as number;
        if (current > 0 || current < -setWidth * 2) {
          gsap.set(track, { x: gsap.utils.wrap(-setWidth * 2, 0, current) });
        }
        draggableRef.current?.update();
        const viewport = viewportRef.current;
        if (!viewport) return;
        const viewportCenter =
          viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });
        setActiveIndex(modulo(nearestIndex, products.length));
      },
    });
  }

  return (
    <section
      id="prerolls"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink-deep py-[clamp(3.5rem,8vh,6rem)] text-[#f3ede1]"
    >
      <div className="mx-auto w-full max-w-[1500px] px-6 text-center sm:px-10">
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">
            The Dime collection
          </p>
          <h2 className="mt-4 text-[clamp(2.8rem,5vw,5.4rem)] font-black leading-[0.94] tracking-[-0.055em]">
            More ways to Think Higher.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#f3ede1]/65 sm:text-xl">
            Explore the full family, from signature all-in-ones and rosin to
            gummies, wellness, and regional releases.
          </p>
        </Reveal>
      </div>

      <div className="relative mt-9 sm:mt-11">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-ink-deep via-ink-deep/80 to-transparent sm:w-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-ink-deep via-ink-deep/80 to-transparent sm:w-28"
        />

        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Previous product"
          className="group absolute left-3 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/70 shadow-2xl backdrop-blur-md transition hover:border-gold hover:bg-gold hover:text-ink-deep sm:left-7 sm:h-14 sm:w-14"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Next product"
          className="group absolute right-3 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/70 shadow-2xl backdrop-blur-md transition hover:border-gold hover:bg-gold hover:text-ink-deep sm:right-7 sm:h-14 sm:w-14"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <div ref={viewportRef} className="w-full overflow-hidden">
          <div
            ref={trackRef}
            className={`flex w-max cursor-grab gap-5 px-[12vw] transition-opacity duration-300 will-change-transform active:cursor-grabbing sm:gap-7 ${
              isReady ? "opacity-100" : "opacity-0"
            }`}
          >
            {loopedProducts.map((product, index) => (
              <motion.div
                key={`${product.name}-${index}`}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                whileHover={{ y: -8 }}
                className="group relative w-[82vw] max-w-[430px] shrink-0 select-none overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#f3eee3] text-center text-ink-deep shadow-[0_26px_80px_rgba(0,0,0,0.28)] sm:w-[46vw] lg:w-[30vw] xl:w-[25vw]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundColor: product.color }}
                />
                <div className="relative flex h-[clamp(240px,34vh,410px)] items-center justify-center overflow-hidden p-5">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-35"
                    style={{
                      background: `radial-gradient(circle at 50% 42%, ${product.color}, transparent 58%)`,
                    }}
                  />
                  <Image
                    src={product.src}
                    alt={product.name}
                    width={750}
                    height={900}
                    draggable={false}
                    className="relative h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  />
                </div>
                <div className="relative min-h-[155px] border-t border-black/10 bg-[#f8f4eb] p-5 sm:p-7">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9b7623]">
                    {product.name}
                  </p>
                  <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                    {product.tag}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[30rem] text-sm leading-relaxed text-black/60 sm:text-base">
                    {product.blurb}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-[1500px] flex-col items-center gap-6 px-6 sm:px-10">
        <div className="flex items-center gap-2" aria-label="Selected product">
          {products.map((product, index) => (
            <span
              key={product.name}
              aria-label={activeIndex === index ? product.name : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-10 bg-gold" : "w-4 bg-white/25"
              }`}
            />
          ))}
        </div>

        <Reveal delay={0.2}>
          <MagneticButton
            href="#where-to-buy"
            className="inline-block rounded-full bg-gold px-7 py-3 text-sm font-bold uppercase tracking-wide text-ink-deep transition-colors hover:bg-gold-dark"
          >
            Find Dime
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}

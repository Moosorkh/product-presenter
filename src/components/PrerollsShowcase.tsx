"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

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

const loopedProducts = [...products, ...products, ...products];

function modulo(value: number, length: number) {
  return ((value % length) + length) % length;
}

export default function PrerollsShowcase() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const virtualIndexRef = useRef(products.length);
  const isDesktopRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const centerCard = (index: number, immediate = false) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!viewport || !track || !card) return;

    const left = card.offsetLeft - (viewport.clientWidth - card.clientWidth) / 2;
    gsap.killTweensOf(track);

    if (isDesktopRef.current) {
      if (immediate) {
        gsap.set(track, { x: -left, force3D: true });
        return;
      }

      gsap.to(track, {
        x: -left,
        duration: 0.62,
        ease: "power4.out",
        force3D: true,
        overwrite: "auto",
      });
      return;
    }

    gsap.set(track, { x: 0 });
    if (immediate) {
      track.scrollLeft = left;
      return;
    }

    gsap.to(track, {
      scrollLeft: left,
      duration: 0.72,
      ease: "power3.inOut",
      overwrite: true,
    });
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const media = window.matchMedia("(min-width: 768px)");
    const placeInMiddle = () => {
      isDesktopRef.current = media.matches;
      centerCard(products.length, true);
      setIsReady(true);
    };
    const handleBreakpointChange = () => {
      isDesktopRef.current = media.matches;
      gsap.set(track, { clearProps: "transform" });
      centerCard(virtualIndexRef.current, true);
    };
    const frame = requestAnimationFrame(placeInMiddle);
    const observer = new ResizeObserver(() =>
      centerCard(virtualIndexRef.current, true)
    );
    observer.observe(viewport);
    media.addEventListener("change", handleBreakpointChange);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", handleBreakpointChange);
      gsap.killTweensOf(track);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const move = (step: number) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    const nextIndex = virtualIndexRef.current + step;
    virtualIndexRef.current = nextIndex;
    setActiveIndex(modulo(nextIndex, products.length));
    centerCard(nextIndex);

    resetTimerRef.current = setTimeout(() => {
      if (nextIndex < products.length || nextIndex >= products.length * 2) {
        const normalized = products.length + modulo(nextIndex, products.length);
        virtualIndexRef.current = normalized;
        centerCard(normalized, true);
      }
    }, 780);
  };

  return (
    <section
      id="prerolls"
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
          onClick={() => move(-1)}
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
          onClick={() => move(1)}
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
            className={`no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[12vw] transition-opacity duration-300 will-change-transform sm:gap-7 md:w-max md:snap-none md:overflow-visible ${
              isReady ? "opacity-100" : "opacity-0"
            }`}
            style={{
              touchAction: "pan-x pan-y",
              overscrollBehaviorX: "contain",
            }}
          >
            {loopedProducts.map((product, index) => (
              <motion.div
                key={`${product.name}-${index}`}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                whileHover={{ y: -8 }}
                className="group relative w-[82vw] max-w-[430px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#f3eee3] text-center text-ink-deep shadow-[0_26px_80px_rgba(0,0,0,0.28)] sm:w-[46vw] md:snap-none lg:w-[30vw] xl:w-[25vw]"
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

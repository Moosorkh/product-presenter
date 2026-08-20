"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger, useGSAP);

type CardSize = "sm" | "md" | "lg" | "xl";

const products: Array<{
  name: string;
  tag: string;
  blurb: string;
  src: string;
  color: string;
  size: CardSize;
}> = [
  {
    name: "Signature Line",
    tag: "Blueberry Lemon Haze",
    blurb: "The original Dime all-in-one, built around bold terpene flavor.",
    src: "/ROYALPEAR-6-9.png",
    color: "#2157b9",
    size: "xl",
  },
  {
    name: "Balanced Line",
    tag: "Mowie Wowie",
    blurb: "A bright, balanced profile in Dime's rechargeable all-in-one hardware.",
    src: "/ROYALPEAR-4-13.png",
    color: "#a9d9ef",
    size: "sm",
  },
  {
    name: "Rosin Line",
    tag: "Garlic Cookies",
    blurb: "Solventless rosin, low-temperature hardware, and full terpene expression.",
    src: "/ROYALPEAR-3-17.png",
    color: "#c98f80",
    size: "lg",
  },
  {
    name: "Cannabis Gummies",
    tag: "Blue Raspberry",
    blurb: "A full-spectrum edible made for a smooth, measured experience.",
    src: "/ROYALPEAR-11-4.png",
    color: "#66a9df",
    size: "md",
  },
  {
    name: "Wellness Line",
    tag: "Strawberry THC Gummies",
    blurb: "A fruit-forward wellness format with Dime quality in every serving.",
    src: "/ROYALPEAR-1-2.png",
    color: "#e97c8e",
    size: "sm",
  },
  {
    name: "Broad Spectrum",
    tag: "Softgels + CBG",
    blurb: "A precise softgel format for a simple, consistent daily ritual.",
    src: "/ROYALPEAR.png",
    color: "#d29ac9",
    size: "md",
  },
  {
    name: "State Exclusives",
    tag: "Bombsicle",
    blurb: "Limited regional drops that bring new flavor to familiar hardware.",
    src: "/ROYALPEAR-2-22.png",
    color: "#ed643e",
    size: "lg",
  },
];

const sizeClasses: Record<CardSize, string> = {
  sm: "w-[64vw] max-w-[280px] sm:w-[30vw] sm:max-w-[260px] lg:w-[18vw] xl:w-[15vw]",
  md: "w-[76vw] max-w-[360px] sm:w-[38vw] sm:max-w-[340px] lg:w-[23vw] xl:w-[20vw]",
  lg: "w-[86vw] max-w-[440px] sm:w-[48vw] sm:max-w-[440px] lg:w-[31vw] xl:w-[27vw]",
  xl: "w-[92vw] max-w-[520px] sm:w-[56vw] sm:max-w-[540px] lg:w-[37vw] xl:w-[32vw]",
};

const imageHeightClasses: Record<CardSize, string> = {
  sm: "h-[clamp(180px,24vh,270px)] lg:h-[clamp(150px,20vh,210px)]",
  md: "h-[clamp(210px,28vh,330px)] lg:h-[clamp(170px,22vh,235px)]",
  lg: "h-[clamp(240px,33vh,390px)] lg:h-[clamp(190px,24vh,255px)]",
  xl: "h-[clamp(265px,37vh,430px)] lg:h-[clamp(210px,26vh,275px)]",
};

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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const collectionLayerRef = useRef<HTMLDivElement>(null);
  const portalMaskTextRef = useRef<SVGGElement>(null);
  const portalAnchorTextRef = useRef<SVGTextElement>(null);
  const portalAnchorRef = useRef<SVGRectElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const draggableRef = useRef<Draggable | null>(null);
  const stopAutoScrollRef = useRef<() => void>(() => {});
  const scheduleAutoScrollResumeRef = useRef<() => void>(() => {});
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

      // Idle auto-drift, like blacklead.studio's gallery: a slow constant
      // crawl that pauses the moment a drag starts and quietly resumes a
      // beat after the user lets go. The huge travel distance combined with
      // a live wrap in `modifiers` means it never needs to restart/loop —
      // modifiers run inside the same tween, so (unlike wrapAtRest) it's
      // safe to correct position every frame here.
      const AUTO_SCROLL_SPEED = 26;
      let autoScrollTween: gsap.core.Tween | null = null;
      let resumeTimer: ReturnType<typeof setTimeout> | null = null;

      const startAutoScroll = () => {
        autoScrollTween?.kill();
        const distance = 400000;
        autoScrollTween = gsap.to(track, {
          x: `-=${distance}`,
          duration: distance / AUTO_SCROLL_SPEED,
          ease: "none",
          modifiers: {
            x: gsap.utils.unitize((value: string) =>
              gsap.utils.wrap(-getSetWidth() * 2, 0, parseFloat(value))
            ),
          },
        });
      };

      const stopAutoScroll = () => {
        autoScrollTween?.kill();
        autoScrollTween = null;
      };

      const scheduleAutoScrollResume = () => {
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(startAutoScroll, 1800);
      };

      const frame = requestAnimationFrame(() => {
        place();
        applyBounds();
        startAutoScroll();
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
          if (resumeTimer) clearTimeout(resumeTimer);
          stopAutoScroll();
          gsap.killTweensOf(track);
        },
        onThrowComplete() {
          wrapAtRest();
          syncActiveIndex();
          scheduleAutoScrollResume();
        },
        onDragEnd() {
          if (!this.tween) {
            wrapAtRest();
            syncActiveIndex();
            scheduleAutoScrollResume();
          }
        },
        // A plain click (press + release with no real movement) never fires
        // onDragStart/onDragEnd, so without this the auto-drift stopped by
        // onPress would never be told to come back.
        onClick() {
          scheduleAutoScrollResume();
        },
      });
      draggableRef.current = draggable;
      stopAutoScrollRef.current = stopAutoScroll;
      scheduleAutoScrollResumeRef.current = scheduleAutoScrollResume;

      return () => {
        cancelAnimationFrame(frame);
        if (resumeTimer) clearTimeout(resumeTimer);
        resizeObserver.disconnect();
        stopAutoScroll();
        draggable.kill();
      };
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 900px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)",
        () => {
          const heading = headingRef.current;
          const section = sectionRef.current;
          const collectionLayer = collectionLayerRef.current;
          const portalMaskText = portalMaskTextRef.current;
          const portalAnchorText = portalAnchorTextRef.current;
          const portalAnchor = portalAnchorRef.current;

          if (
            !section ||
            !heading ||
            !collectionLayer ||
            !portalMaskText ||
            !portalAnchorText ||
            !portalAnchor
          ) {
            return;
          }

          const alignPortalToCharacter = () => {
            const firstCharacter = portalAnchorText.getExtentOfChar(0);
            const anchorX = firstCharacter.x + firstCharacter.width * 0.5;
            const anchorY = firstCharacter.y + firstCharacter.height * 0.5;

            gsap.set(portalAnchor, {
              attr: {
                x: anchorX - 8,
                y: anchorY - 4,
                width: 16,
                height: 8,
              },
              opacity: 1,
            });

            const maskBounds = portalMaskText.getBBox();
            const originX =
              ((anchorX - maskBounds.x) / maskBounds.width) * 100;
            const originY =
              ((anchorY - maskBounds.y) / maskBounds.height) * 100;

            gsap.set(portalMaskText, {
              transformOrigin: `${originX}% ${originY}%`,
              smoothOrigin: false,
            });
          };

          gsap.set(collectionLayer, {
            opacity: 1,
            WebkitMaskImage: 'url("#collection-title-portal")',
            maskImage: 'url("#collection-title-portal")',
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          });
          gsap.set(section, { pointerEvents: "auto" });
          gsap.set(heading, { opacity: 1 });
          gsap.set(portalMaskText, {
            opacity: 0,
            scale: 1,
            y: 0,
          });
          alignPortalToCharacter();
          const portalBounds = portalMaskText.getBBox();
          const portalCenterY = portalBounds.y + portalBounds.height * 0.5;

          const portalTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 64px",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: ({ progress }) => {
                section.style.pointerEvents = progress >= 0.94 ? "none" : "auto";
              },
            },
          });

          portalTimeline
            .set(portalMaskText, { opacity: 1 }, 0.3)
            .set(heading, { opacity: 0 }, 0.3)
            .to(
              portalMaskText,
              {
                y: () => collectionLayer.clientHeight * 0.5 - portalCenterY,
                scale: 1.12,
                duration: 0.18,
                ease: "power2.inOut",
              },
              0.3
            )
            .to(
              portalMaskText,
              {
                scale: 400,
                duration: 0.52,
                ease: "power2.in",
              },
              0.48
            );

          return () => {
            section.style.pointerEvents = "auto";
            portalTimeline.scrollTrigger?.kill();
            portalTimeline.kill();
          };
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  function nearestIndexToCenter() {
    const viewport = viewportRef.current;
    let nearestIndex = 0;
    if (!viewport) return nearestIndex;
    const viewportCenter =
      viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
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
    return nearestIndex;
  }

  function nudge(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    stopAutoScrollRef.current();
    gsap.killTweensOf(track);

    // Cards vary in width, so the next card's travel distance is measured
    // from real DOM geometry (center-to-center) rather than a fixed step.
    const currentIndex = nearestIndexToCenter();
    const currentCard = cardRefs.current[currentIndex];
    const targetCard = cardRefs.current[currentIndex + direction];
    if (!currentCard || !targetCard) return;

    const currentCenter = currentCard.getBoundingClientRect().left + currentCard.offsetWidth / 2;
    const targetCenter = targetCard.getBoundingClientRect().left + targetCard.offsetWidth / 2;
    const delta = targetCenter - currentCenter;
    const x = (gsap.getProperty(track, "x") as number) - delta;

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
        setActiveIndex(modulo(nearestIndexToCenter(), products.length));
        scheduleAutoScrollResumeRef.current();
      },
    });
  }

  return (
    <section
      id="prerolls"
      ref={sectionRef}
      className="relative z-20 overflow-x-clip overflow-y-visible text-[#f3ede1] lg:motion-safe:h-[240svh] lg:motion-safe:min-h-[1500px]"
    >
      <div className="relative lg:motion-safe:sticky lg:motion-safe:top-16 lg:motion-safe:h-[calc(100svh-64px)] lg:motion-safe:overflow-hidden">
        <div
          ref={collectionLayerRef}
          className="relative h-full bg-ink-deep py-[clamp(3.5rem,8vh,6rem)] lg:py-8"
        >
          <div className="mx-auto w-full max-w-[1500px] px-6 text-center sm:px-10">
            <Reveal className="mx-auto max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">
                The Dime collection
              </p>
              <h2
                ref={headingRef}
                className="relative z-50 mt-4 text-[clamp(2.8rem,5vw,5.4rem)] font-black leading-[0.94] tracking-[-0.055em]"
              >
                More ways to Think Higher.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#f3ede1]/65 sm:text-xl">
                Explore the full family, from signature all-in-ones and rosin to
                gummies, wellness, and regional releases.
              </p>
            </Reveal>
          </div>

      <div className="relative mt-9 sm:mt-11 lg:mt-5">
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
            className={`flex w-max cursor-grab items-end gap-3 px-[8vw] transition-opacity duration-300 will-change-transform active:cursor-grabbing sm:gap-4 sm:px-[6vw] ${
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
                className={`group relative shrink-0 select-none overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#f3eee3] text-center text-ink-deep shadow-[0_26px_80px_rgba(0,0,0,0.28)] ${sizeClasses[product.size]}`}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundColor: product.color }}
                />
                <div
                  className={`relative flex items-center justify-center overflow-hidden p-5 ${imageHeightClasses[product.size]}`}
                >
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
                <div className="relative min-h-[155px] border-t border-black/10 bg-[#f8f4eb] p-5 sm:p-7 lg:min-h-[140px] lg:p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9b7623]">
                    {product.name}
                  </p>
                  <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] sm:text-3xl lg:text-2xl">
                    {product.tag}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[30rem] text-sm leading-relaxed text-black/60 sm:text-base lg:text-sm lg:leading-snug">
                    {product.blurb}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-[1500px] flex-col items-center gap-6 px-6 sm:px-10 lg:mt-4 lg:gap-3">
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

        </div>

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
            <defs>
              <mask
                id="collection-title-portal"
                x="0"
                y="0"
                width="100%"
                height="100%"
                maskUnits="userSpaceOnUse"
              >
                <rect width="100%" height="100%" fill="white" />
                <g
                  ref={portalMaskTextRef}
                  fill="black"
                  style={{ transformBox: "view-box" }}
                >
                    <text
                      x="50%"
                      y="137"
                      textAnchor="middle"
                      className="text-[clamp(2.8rem,5vw,5.4rem)] font-black tracking-[-0.055em]"
                    >
                      More ways to Think
                    </text>
                    <text
                      ref={portalAnchorTextRef}
                      x="50%"
                      y="205"
                      textAnchor="middle"
                      className="text-[clamp(2.8rem,5vw,5.4rem)] font-black tracking-[-0.055em]"
                    >
                      Higher.
                    </text>
                    <rect
                      ref={portalAnchorRef}
                      width="8"
                      height="8"
                      rx="1"
                      opacity="0"
                    />
                </g>
              </mask>
            </defs>
        </svg>
      </div>
    </section>
  );
}

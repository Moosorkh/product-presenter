"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import VapePen from "./VapePen";
import Reveal from "./Reveal";
import StrainIcon from "./StrainIcon";
import MagneticButton from "./MagneticButton";
import { flavors, type Flavor } from "@/data/products";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const spring = { type: "spring", stiffness: 260, damping: 26 } as const;
const mobileInitialIndex = Math.min(2, flavors.length - 1);

function StageItem({
  flavor,
  isSelected,
  onSelect,
  itemRef,
}: {
  flavor: Flavor;
  isSelected: boolean;
  onSelect: () => void;
  itemRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={itemRef}
      onClick={onSelect}
      aria-label={flavor.name}
      aria-pressed={isSelected}
      className="flavor-picker__item pointer-events-none relative flex shrink-0 flex-col items-center px-2 pb-2 pt-14 outline-none md:pointer-events-auto"
      style={{ scrollSnapAlign: "center" }}
    >
      {isSelected && (
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-none absolute inset-x-0 top-0 bottom-4 z-0"
        >
          <div
            className="absolute left-1/2 top-0 h-72 w-32 -translate-x-1/2 blur-sm"
            style={{
              background:
                "linear-gradient(to bottom, rgba(203,160,90,0.4), rgba(203,160,90,0) 85%)",
              clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 h-20 w-44 -translate-x-1/2 rounded-full blur-md"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(203,160,90,0.5), transparent 70%)",
            }}
          />
        </motion.div>
      )}

      <motion.div
        animate={{
          scale: isSelected ? 1 : 0.66,
          opacity: isSelected ? 1 : 0.4,
          filter: isSelected
            ? "saturate(1) brightness(1)"
            : "saturate(0.15) brightness(0.55)",
        }}
        transition={spring}
        style={{ transformOrigin: "bottom center" }}
        className="relative z-10"
      >
      <VapePen
          color={flavor.penColor}
          accent={flavor.boxAccent}
          name={flavor.name}
          className="flavor-picker__pen h-64 w-auto sm:h-72 md:h-80 lg:h-[clamp(20rem,45vh,27rem)]"
        />
      </motion.div>
    </button>
  );
}

export default function FlavorPicker() {
  const [selected, setSelected] = useState(flavors[mobileInitialIndex]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const stRef = useRef<ScrollTrigger | null>(null);
  const indexRef = useRef(mobileInitialIndex);
  const scrollFrameRef = useRef<number | null>(null);

  function recenterTrack(flavor: Flavor, immediate = false) {
    const track = trackRef.current;
    const item = itemRefs.current[flavor.id];
    if (!track || !item) return;
    const target = item.offsetLeft - track.clientWidth / 2 + item.clientWidth / 2;
    if (immediate) {
      track.scrollLeft = target;
      return;
    }
    gsap.to(track, { scrollLeft: target, duration: 0.5, ease: "power2.out", overwrite: true });
  }

  function scrollTrackTo(flavor: Flavor) {
    const track = trackRef.current;
    const item = itemRefs.current[flavor.id];
    if (!track || !item) return;
    const target = item.offsetLeft - track.clientWidth / 2 + item.clientWidth / 2;
    track.scrollTo({ left: target, behavior: "smooth" });
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (min-height: 720px)", () => {
        const syncSelectedFlavor = (progress: number) => {
          const idx = Math.min(
            flavors.length - 1,
            Math.round(progress * (flavors.length - 1))
          );
          if (idx !== indexRef.current) {
            indexRef.current = idx;
            setSelected(flavors[idx]);
            recenterTrack(flavors[idx]);
          }
        };

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 64px",
          end: "+=" + flavors.length * 32 + "%",
          pin: true,
          scrub: 0.6,
          snap: 1 / (flavors.length - 1),
          onUpdate: (self) => {
            syncSelectedFlavor(self.progress);
          },
        });
        stRef.current = st;
        syncSelectedFlavor(st.progress);

        return () => {
          stRef.current = null;
        };
      });

      mm.add("(max-width: 767px)", () => {
        indexRef.current = mobileInitialIndex;
        setSelected(flavors[mobileInitialIndex]);

        const centerFrame = requestAnimationFrame(() => {
          recenterTrack(flavors[mobileInitialIndex], true);
        });
        const resizeObserver = new ResizeObserver(() => {
          recenterTrack(flavors[indexRef.current], true);
        });
        if (trackRef.current) resizeObserver.observe(trackRef.current);

        return () => {
          cancelAnimationFrame(centerFrame);
          resizeObserver.disconnect();
        };
      });

      return () => {
        if (scrollFrameRef.current !== null) {
          cancelAnimationFrame(scrollFrameRef.current);
        }
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  function handleTrackScroll() {
    if (stRef.current) return;
    if (scrollFrameRef.current !== null) {
      cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      const track = trackRef.current;
      if (!track || stRef.current) return;

      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      flavors.forEach((flavor, index) => {
        const item = itemRefs.current[flavor.id];
        if (!item) return;
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(itemCenter - center);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      if (nearestIndex !== indexRef.current) {
        indexRef.current = nearestIndex;
        setSelected(flavors[nearestIndex]);
      }
    });
  }

  function handleSelect(flavor: Flavor, index: number) {
    setSelected(flavor);
    indexRef.current = index;
    recenterTrack(flavor);
    const st = stRef.current;
    if (!st) return;
    const target = st.start + (index / (flavors.length - 1)) * (st.end - st.start);
    getLenis()?.scrollTo(target, { immediate: true });
  }

  function move(step: number) {
    const currentIndex = indexRef.current;
    const nextIndex = (currentIndex + step + flavors.length) % flavors.length;
    scrollTrackTo(flavors[nextIndex]);
  }

  return (
    <section
      id="vapes"
      ref={sectionRef}
      className="flavor-picker relative overflow-hidden bg-ink pb-7 pt-8 text-[#f3ede1] md:h-[calc(100svh-64px)] md:min-h-[636px] md:py-11"
    >
      <div className="relative mx-auto flex max-w-[1480px] flex-col px-6 md:h-full">
        <Reveal className="flavor-picker__intro mx-auto max-w-3xl text-center">
          <p className="flavor-picker__eyebrow text-base font-bold uppercase tracking-[0.3em] text-gold">
            Signature Line
          </p>
          <Image
            src="/PRODUCTS-1-scaled.png"
            alt=""
            aria-hidden
            width={2048}
            height={294}
            className="flavor-picker__rule mx-auto mt-3 h-2 w-28 opacity-70"
          />
          <h2 className="mt-3 text-4xl font-black sm:text-5xl lg:text-[3.5rem]">
            Eight flavors. One standard.
          </h2>
          <p className="flavor-picker__deck mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-[#f3ede1]/70">
            Every flavor in the line is built on the same all-in-one
            hardware, extracted and tested the same rigorous way.
          </p>

          <div className="flavor-picker__actions mt-7 flex flex-wrap justify-center gap-4">
            <MagneticButton
              href="#where-to-buy"
              className="flavor-picker__cta inline-block rounded-full bg-gold px-8 py-3.5 text-base font-bold uppercase tracking-wide text-ink-deep transition-colors hover:bg-gold-dark"
            >
              Find Dime
            </MagneticButton>
            <MagneticButton
              href="#nutrition"
              className="flavor-picker__cta inline-block rounded-full border border-gold/30 px-8 py-3.5 text-base font-bold uppercase tracking-wide text-[#f3ede1] transition-colors hover:border-gold hover:bg-gold/10"
            >
              Lab Results
            </MagneticButton>
          </div>
        </Reveal>

        <div className="flavor-picker__stage relative mt-1 flex min-h-[300px] flex-1 items-center md:min-h-0">
          <div
            ref={trackRef}
            onScroll={handleTrackScroll}
            className="no-scrollbar flex h-full min-h-0 w-full items-center gap-1 overflow-x-auto px-0 md:overflow-visible md:justify-center md:gap-4"
            style={{
              scrollSnapType: "x mandatory",
              touchAction: "pan-x pan-y",
              overscrollBehaviorX: "contain",
            }}
          >
            <span aria-hidden className="h-px w-1/2 shrink-0 md:hidden" />
            {flavors.map((flavor, index) => (
              <StageItem
                key={flavor.id}
                flavor={flavor}
                isSelected={selected.id === flavor.id}
                onSelect={() => {
                  if (window.matchMedia("(min-width: 768px)").matches) {
                    handleSelect(flavor, index);
                  }
                }}
                itemRef={(el) => {
                  itemRefs.current[flavor.id] = el;
                }}
              />
            ))}
            <span aria-hidden className="h-px w-1/2 shrink-0 md:hidden" />
          </div>

          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous flavor"
            className="absolute left-0 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/55 text-xl backdrop-blur-md md:hidden"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next flavor"
            className="absolute right-0 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/55 text-xl backdrop-blur-md md:hidden"
          >
            ›
          </button>
        </div>

        <div className="flavor-picker__details relative shrink-0 pb-3 text-center md:pb-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <p className="flex flex-wrap items-center justify-center gap-2.5 text-xl font-bold sm:text-2xl">
                {selected.name}
                <StrainIcon type={selected.type} className="h-5 w-5 text-gold" />
                <span className="text-base font-normal text-[#f3ede1]/60">
                  {selected.type}
                </span>
              </p>
              <p className="mx-auto mt-2 max-w-md text-base text-[#f3ede1]/60 sm:text-lg">
                {selected.tagline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      <div className="flavor-picker__progress relative mt-1 flex justify-center gap-2 pb-1 md:absolute md:bottom-5 md:left-1/2 md:mt-0 md:-translate-x-1/2 md:pb-0">
        {flavors.map((flavor) => (
          <span
            key={flavor.id}
            className="h-2 w-5 rounded-full transition-colors duration-300"
            style={{
              backgroundColor:
                flavor.id === selected.id ? "#cba05a" : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </section>
  );
}

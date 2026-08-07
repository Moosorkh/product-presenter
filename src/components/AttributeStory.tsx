"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { attributeCategories, heroFlavor } from "@/data/products";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const values: Record<string, string[]> = {
  genetics: heroFlavor.genetics,
  type: [heroFlavor.type],
  taste: heroFlavor.taste,
  effects: heroFlavor.effects,
  terps: heroFlavor.terps,
};

const profileProducts = [
  {
    src: "/ROYALPEAR-6-9.png",
    alt: "Dime Blueberry Lemon Haze Signature Line all-in-one vape",
  },
  {
    src: "/ROYALPEAR-3.png",
    alt: "Dime Mixed Berries nighttime THC gummies",
  },
  {
    src: "/ROYALPEAR-5.png",
    alt: "Dime fifth generation battery and packaging",
  },
  {
    src: "/ROYALPEAR-2.png",
    alt: "Dime infused prerolls",
  },
  {
    src: "/ROYALPEAR-6-9.png",
    alt: "Dime Blueberry Lemon Haze Signature Line all-in-one vape",
  },
] as const;

export default function AttributeStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const productRefs = useRef<Array<HTMLImageElement | null>>([]);
  const penWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs = useRef<Array<HTMLElement | null>>([]);
  const mobileScrollFrameRef = useRef<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  const handleMobileCardScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    if (mobileScrollFrameRef.current !== null) {
      cancelAnimationFrame(mobileScrollFrameRef.current);
    }

    mobileScrollFrameRef.current = requestAnimationFrame(() => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      mobileCardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setMobileIndex(nearestIndex);
      mobileScrollFrameRef.current = null;
    });
  };

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];
      const products = productRefs.current.filter(Boolean) as HTMLImageElement[];
      const total = attributeCategories.length;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.set(products, { autoAlpha: 0, scale: 0.9, y: 28 });
        gsap.set(products[0], { autoAlpha: 1, scale: 1, y: 0 });
        gsap.set(cards, {
          x: (index) => index * 10,
          y: (index) => index * 12,
          scale: (index) => 1 - index * 0.025,
          opacity: (index) => (index < 3 ? 1 : 0),
          rotation: (index) => (index % 2 === 0 ? -0.6 : 0.6),
          zIndex: (index) => total - index,
          transformOrigin: "50% 100%",
        });
        gsap.set(dots, { opacity: 0.25 });
        gsap.set(dots[0], { opacity: 1 });
        gsap.set(glowRef.current, { scale: 0.6, opacity: 0 });

        const end = "+=240%";
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end,
            scrub: 0.65,
            pin: true,
          },
        });

        cards.forEach((card, index) => {
          if (index === 0) return;
          const previous = cards[index - 1];
          const remaining = cards.slice(index);
          const position = index - 0.42;

          timeline
            .to(
              previous,
              {
                x: -64,
                y: 92,
                rotation: -7,
                scale: 0.9,
                opacity: 0,
                duration: 0.34,
                ease: "power2.in",
              },
              position
            )
            .to(
              remaining,
              {
                x: (stackIndex) => stackIndex * 10,
                y: (stackIndex) => stackIndex * 12,
                scale: (stackIndex) => 1 - stackIndex * 0.025,
                opacity: (stackIndex) => (stackIndex < 3 ? 1 : 0),
                rotation: (stackIndex) => (stackIndex % 2 === 0 ? -0.6 : 0.6),
                duration: 0.4,
                ease: "power2.out",
              },
              position + 0.08
            )
            .to(dots[index - 1], { opacity: 0.25, duration: 0.2 }, position + 0.08)
            .to(dots[index], { opacity: 1, duration: 0.2 }, position + 0.15)
            .to(
              products[index - 1],
              {
                autoAlpha: 0,
                scale: 1.06,
                y: -24,
                duration: 0.24,
                ease: "power2.in",
              },
              position
            )
            .fromTo(
              products[index],
              { autoAlpha: 0, scale: 0.9, y: 30 },
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                duration: 0.36,
                ease: "power3.out",
              },
              position + 0.18
            );
        });

        gsap.to(penWrapRef.current, {
          rotate: 3,
          y: -16,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end,
            scrub: 0.6,
          },
        });

        gsap.fromTo(
          glowRef.current,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1.5,
            opacity: 0.85,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: `+=${(1 / total) * 100 * 2.4}%`,
              scrub: 0.4,
            },
          }
        );
      });

      return () => {
        if (mobileScrollFrameRef.current !== null) {
          cancelAnimationFrame(mobileScrollFrameRef.current);
        }
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="genetics"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink md:h-screen md:min-h-[720px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: "url(/concrete-black-1024x773.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative px-6 pb-16 pt-14 md:hidden">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-gold">
            Product profile
          </p>
          <h2 className="mt-4 text-[clamp(2.75rem,13vw,4.25rem)] font-black leading-[0.92] tracking-[-0.055em] text-[#f3ede1]">
            The details behind every pull.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#f3ede1]/70">
            Swipe through the profile while the page remains free to scroll.
          </p>
        </div>

        <div className="relative mx-auto mt-5 h-[320px] max-w-md">
          {profileProducts.map((product, index) => (
            <div
              key={`${product.src}-${index}`}
              aria-hidden={mobileIndex !== index}
              className={`absolute inset-0 transition-[opacity,transform] duration-150 ease-out ${
                mobileIndex === index
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-[0.985] opacity-0"
              }`}
            >
              <Image
                src={product.src}
                alt={product.alt}
                width={750}
                height={900}
                loading="eager"
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="(max-width: 767px) 92vw, 1px"
                className="h-full w-full object-contain drop-shadow-[0_28px_42px_rgba(0,0,0,0.5)]"
              />
            </div>
          ))}
          <div
            aria-hidden
            className="absolute bottom-5 left-1/2 h-8 w-28 -translate-x-1/2 rounded-full bg-gold/30 blur-xl"
          />
        </div>

        <div
          onScroll={handleMobileCardScroll}
          className="no-scrollbar -mx-6 mt-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[9vw] pb-7"
          style={{ touchAction: "pan-x pan-y", overscrollBehaviorX: "contain" }}
        >
          {attributeCategories.map((category, index) => (
            <article
              key={category.key}
              ref={(element) => {
                mobileCardRefs.current[index] = element;
              }}
              className="min-h-[230px] w-[82vw] max-w-[350px] shrink-0 snap-center rounded-2xl border border-[#b6932f]/25 bg-[#f6f3eb] p-6 text-left text-[#171717] shadow-[0_18px_42px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9b7623]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#171717]/38">
                  Product profile
                </p>
              </div>
              <h3 className="mt-4 text-2xl font-black tracking-[-0.035em]">
                {category.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#171717]/68">
                {category.blurb}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {values[category.key].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#171717]/7 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          {attributeCategories.map((category, index) => (
            <span
              key={category.key}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                mobileIndex === index ? "w-8 bg-gold" : "w-3 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto hidden h-full max-w-[1480px] grid-cols-[0.98fr_1.02fr] items-center gap-12 px-8 md:grid lg:px-14">
        <div className="order-2 flex items-center justify-center md:order-1">
          <div className="relative h-[700px] w-full max-w-[520px]">
            <div
              ref={penWrapRef}
              className="absolute left-1/2 top-[-2rem] z-20 w-[min(92vw,560px)] -translate-x-1/2 will-change-transform"
            >
              <div className="relative h-[500px] sm:h-[570px] lg:h-[640px]">
                {profileProducts.map((product, index) => (
                  <Image
                    key={`${product.src}-${index}`}
                    ref={(element) => {
                      productRefs.current[index] = element;
                    }}
                    src={product.src}
                    alt={product.alt}
                    width={750}
                    height={900}
                    priority={index === 0}
                    className="absolute inset-0 mx-auto h-full w-full object-contain drop-shadow-[0_36px_54px_rgba(0,0,0,0.52)] will-change-transform"
                  />
                ))}
              </div>
              <div
                ref={glowRef}
                aria-hidden
                className="absolute left-1/2 top-[82%] h-7 w-7 -translate-x-1/2 rounded-full bg-gold blur-lg"
              />
            </div>

            <div className="absolute bottom-4 left-1/2 z-30 h-[210px] w-[min(88vw,350px)] -translate-x-1/2">
              {attributeCategories.map((category, index) => (
                <div
                  key={category.key}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className="absolute inset-0 rounded-2xl border border-[#b6932f]/25 bg-[#f6f3eb] p-6 text-[#171717] shadow-[0_18px_42px_rgba(0,0,0,0.3)] will-change-transform"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9b7623]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#171717]/38">
                      Product profile
                    </p>
                  </div>
                  <h3 className="mt-3 text-2xl font-black tracking-[-0.035em]">
                    {category.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#171717]/68">
                    {category.blurb}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {values[category.key].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#171717]/7 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative order-1 max-w-[640px] md:order-2">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-gold">
            Product profile
          </p>
          <h2 className="mt-6 text-[clamp(3.5rem,5.2vw,5.75rem)] font-black leading-[0.92] tracking-[-0.055em] text-[#f3ede1]">
            The details behind every pull.
          </h2>
          <p className="mt-7 max-w-[36rem] text-xl leading-relaxed text-[#f3ede1]/70">
            From genetics and terpene expression to taste and effect, every part
            of {heroFlavor.name} is selected to create one complete signature
            experience.
          </p>
          <div className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-xl">
            <span className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f3ede1]/55">
              Available sizes
            </span>
            {["1G", "2G"].map((size) => (
              <span
                key={size}
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#f3ede1]"
              >
                {size}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <a
              href="#nutrition"
              className="inline-flex rounded-full bg-gold px-7 py-3.5 text-sm font-black uppercase tracking-wide text-ink-deep transition-transform hover:scale-[1.03]"
            >
              See lab results
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 gap-2 md:flex">
        {attributeCategories.map((category, index) => (
          <span
            key={category.key}
            ref={(element) => {
              dotRefs.current[index] = element;
            }}
            className="h-1.5 w-6 rounded-full bg-gold"
          />
        ))}
      </div>
    </section>
  );
}

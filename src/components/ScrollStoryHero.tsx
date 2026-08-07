"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import VapePen from "./VapePen";
import { heroFlavor } from "@/data/products";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HERO_GOLD = "#cda456";
const HERO_RED = "#b3223f";
const HERO_PINK = "#e97d94";

export default function ScrollStoryHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const desktopHeroRef = useRef<HTMLDivElement>(null);
  const penWrapRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const finalCopyRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.set(subtitleRef.current, { opacity: 0, x: -44, filter: "blur(6px)" });
        gsap.set(finalCopyRef.current, { opacity: 0, x: -32, filter: "blur(6px)" });
        gsap.set(glowRef.current, { opacity: 0.12, scale: 0.85 });
        gsap.set(desktopHeroRef.current, {
          "--hero-pen-color": HERO_GOLD,
        });
        gsap.set(penWrapRef.current, {
          x: 0,
          xPercent: 0,
          transformOrigin: "50% 50%",
        });

        gsap.fromTo(
          penWrapRef.current,
          {
            y: 90,
            opacity: 0,
            scale: 1.05,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          }
        );

        gsap.fromTo(
          headlineRef.current,
          {
            y: 28,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.08,
            ease: "power2.out",
          }
        );

        gsap.to(glowRef.current, {
          opacity: 0.2,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=300%",
            scrub: 0.7,
            pin: desktopHeroRef.current,
          },
        });

        tl.to(
          penWrapRef.current,
          {
            xPercent: 0,
            scale: 0.72,
            duration: 0.55,
            ease: "power2.out",
          },
          0
        )
          .to(
            desktopHeroRef.current,
            {
              "--hero-pen-color": HERO_RED,
              duration: 0.42,
              ease: "power2.inOut",
            },
            0.58
          )
          .to(
            penWrapRef.current,
            {
              x: "46vw",
              scale: 0.72,
              duration: 0.45,
              ease: "power2.inOut",
            },
            2.08
          )
          .to(
            desktopHeroRef.current,
            {
              "--hero-pen-color": HERO_PINK,
              duration: 0.45,
              ease: "power2.inOut",
            },
            1.28
          )
          .to(
            headlineRef.current,
            {
              opacity: 0,
              x: 90,
              filter: "blur(8px)",
              duration: 0.32,
              ease: "none",
            },
            1.36
          )
          .to(
            subtitleRef.current,
            {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              duration: 0.32,
              ease: "none",
            },
            1.7
          )
          .to(
            subtitleRef.current,
            {
              opacity: 0,
              x: -26,
              filter: "blur(5px)",
              duration: 0.28,
              ease: "none",
            },
            2.4
          )
          .to(
            finalCopyRef.current,
            {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              duration: 0.4,
              ease: "none",
            },
            2.72
          )
          .to(
            glowRef.current,
            {
              opacity: 0.16,
              scale: 1.08,
              duration: 1,
              ease: "none",
            },
            0.2
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative bg-[#080808] text-[#f7f3e8]">
      <div
        ref={desktopHeroRef}
        className="relative hidden h-screen overflow-hidden md:block"
        style={
          {
            "--hero-pen-color": HERO_GOLD,
          } as CSSProperties
        }
      >
        <Image
          src="/concrete-black-1024x773.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-95 brightness-[1.45] contrast-90"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_43%,rgba(205,164,86,0.3),transparent_38%),linear-gradient(90deg,rgba(9,11,14,0.08),rgba(9,11,14,0.38)_48%,rgba(9,11,14,0.2))]" />
        <div
          ref={glowRef}
          className="pointer-events-none absolute left-[15%] top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--hero-pen-color) 0%, rgba(204,160,84,0.12) 42%, transparent 72%)",
          }}
        />

        <div className="relative mx-auto h-full max-w-[1500px] px-10">
          <div
            ref={subtitleRef}
            className="absolute left-[7%] top-1/2 z-20 max-w-[min(36vw,32rem)] -translate-y-1/2 opacity-0"
          >
            <p className="text-[1.02rem] leading-[1.45] text-[#f7f3e8]/82 lg:text-[1.18rem]">
              {heroFlavor.name} is built for smokers who want bold flavor, polished
              hardware, and a cleaner all-in-one experience from the first pull to
              the last.
            </p>
          </div>

          <div
            ref={finalCopyRef}
            className="absolute left-[7%] top-1/2 z-20 max-w-[min(48vw,46rem)] -translate-y-1/2 opacity-0"
          >
            <h2 className="whitespace-nowrap text-[clamp(3.5rem,min(6.5vw,10vh),7.5rem)] font-black leading-[0.86] tracking-[-0.055em] text-[#f7f3e8]">
              Think Higher.
            </h2>
            <p className="mt-9 max-w-[34rem] text-[1.08rem] leading-[1.45] text-[#f7f3e8]/76 lg:text-[1.2rem]">
              The signature {heroFlavor.line.toLowerCase()} from Dime Industries,
              designed to deliver expressive terpene flavor and a premium finish in
              one ready-to-go device.
            </p>
          </div>

          <div className="absolute left-[19%] top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <div ref={penWrapRef} className="relative will-change-transform">
              <div className="absolute inset-x-8 bottom-3 h-10 rounded-full bg-[#6f321f]/24 blur-2xl" />
              <VapePen
                color="var(--hero-pen-color)"
                accent={heroFlavor.boxAccent}
                name={heroFlavor.name}
                className="relative h-[min(78vh,760px)] w-auto drop-shadow-[0_30px_48px_rgba(0,0,0,0.52)] lg:h-[min(88vh,960px)]"
              />
            </div>
          </div>

          <div
            ref={headlineRef}
            className="absolute left-[52%] top-1/2 z-20 w-[min(48vw,54rem)] -translate-y-1/2"
          >
            <p className="mb-[clamp(0.75rem,2vh,1.25rem)] text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[#cda456]">
              The original {heroFlavor.line.toLowerCase()}
            </p>
            <h1 className="text-[clamp(3.25rem,min(6.35vw,10.5vh),7.6rem)] font-black leading-[0.88] tracking-[-0.065em] text-[#f7f3e8]">
              <span className="block">{heroFlavor.name}</span>
              <span className="block whitespace-nowrap text-[0.82em]">
                all-in-one vape
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="mobile-hero relative overflow-hidden px-5 pb-12 pt-[clamp(3.5rem,10svh,7rem)] md:hidden">
        <Image
          src="/concrete-black-1024x773.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,8,0.38),rgba(5,6,8,0.78))]" />
        <div
          className="absolute inset-x-0 top-0 h-80"
          style={{
            background: `radial-gradient(circle at 50% 34%, ${HERO_GOLD}50 0%, transparent 70%)`,
          }}
        />
        <div className="mobile-hero__content relative mx-auto max-w-md text-center">
          <div className="mobile-hero__copy">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#cda456]">
              The original {heroFlavor.line.toLowerCase()}
            </p>
            <h1 className="mt-4 text-[clamp(2.75rem,13vw,4rem)] font-black leading-[0.92] tracking-[-0.05em] text-[#f7f3e8]">
              {heroFlavor.name}
            </h1>
            <p className="mt-5 text-[clamp(0.94rem,4vw,1.05rem)] leading-[1.65] text-[#f7f3e8]/78">
              {heroFlavor.tagline}. Designed for bold flavor, polished hardware,
              and a ready-to-go premium experience.
            </p>
          </div>
          <div className="mobile-hero__product relative mt-8 flex justify-center">
            <div className="absolute inset-x-16 bottom-2 h-8 rounded-full bg-[#6f321f]/18 blur-2xl" />
            <VapePen
              color={HERO_GOLD}
              accent={heroFlavor.boxAccent}
              name={heroFlavor.name}
              className="mobile-hero__pen relative h-[clamp(330px,46svh,430px)] w-auto"
            />
          </div>
          <div className="mobile-hero__mark mt-7">
            <Image
              src="/Untitled-design.png"
              alt="Think Higher"
              width={594}
              height={148}
              className="mx-auto h-6 w-auto opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

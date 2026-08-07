"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

export default function WellnessTeaser() {
  return (
    <section className="relative isolate overflow-hidden bg-[#e5bd6f] text-[#17130b]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "url(/concrete-black-1024x773.jpg)",
          backgroundSize: "700px auto",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        className="absolute -right-32 top-1/2 h-[38rem] w-[38rem] -translate-y-1/2 rounded-full bg-[#fff4cf]/75 blur-[100px]"
      />

      <div className="relative mx-auto grid min-h-[680px] max-w-[1480px] items-center gap-8 px-7 py-20 sm:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 max-w-[700px]"
        >
          <p className="text-sm font-black uppercase tracking-[0.32em] text-[#71551b]">
            Ready when you are
          </p>
          <h2 className="mt-6 text-[clamp(4rem,7vw,7.75rem)] font-black leading-[0.85] tracking-[-0.065em]">
            Find your
            <br />
            next Dime.
          </h2>
          <p className="mt-8 max-w-xl text-xl leading-relaxed text-[#17130b]/68">
            Explore the full lineup at a licensed retailer near you, or verify
            the product already in your hand.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <MagneticButton
              href="#where-to-buy"
              className="inline-flex rounded-full bg-[#17130b] px-8 py-4 text-sm font-black uppercase tracking-wide text-[#f7f1e4] transition-transform hover:scale-[1.03]"
            >
              Find Dime
            </MagneticButton>
            <MagneticButton
              href="#nutrition"
              className="inline-flex rounded-full border border-[#17130b]/25 bg-white/20 px-8 py-4 text-sm font-black uppercase tracking-wide transition-colors hover:bg-white/40"
            >
              Validate product
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, rotate: 4 }}
          whileInView={{ opacity: 1, x: 0, rotate: -3 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex min-h-[430px] items-center justify-center"
        >
          <p
            aria-hidden
            className="absolute whitespace-nowrap text-[clamp(5rem,9vw,10rem)] font-black tracking-[-0.06em] text-transparent"
            style={{ WebkitTextStroke: "1.5px rgba(23,19,11,0.2)" }}
          >
            ROYAL PEAR
          </p>
          <div className="relative rounded-[2.5rem] border border-white/45 bg-[#fff8e6]/65 p-8 shadow-[0_38px_80px_rgba(75,52,6,0.22)] backdrop-blur-sm sm:p-12">
            <Image
              src="/ROYALPEAR.png"
              alt="Royal Pear Softgels"
              width={750}
              height={900}
              className="h-[320px] w-auto object-contain drop-shadow-[0_24px_24px_rgba(56,39,4,0.2)] sm:h-[390px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

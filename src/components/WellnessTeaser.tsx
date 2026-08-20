"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

export default function WellnessTeaser() {
  return (
    <section
      data-final-cta
      className="relative text-[#f7f1e7] md:h-[calc(100svh-64px)] md:min-h-[680px]"
    >
      <div className="relative mx-auto grid min-h-[680px] max-w-[1480px] items-center gap-8 px-7 py-20 sm:px-12 md:h-full md:min-h-0 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 max-w-[700px]"
        >
          <p className="text-sm font-black uppercase tracking-[0.32em] text-[#efbd59]">
            Ready when you are
          </p>
          <h2 className="mt-6 text-[clamp(4rem,7vw,7.75rem)] font-black leading-[0.85] tracking-[-0.065em]">
            Find your
            <br />
            next Dime.
          </h2>
          <p className="mt-8 max-w-xl text-xl leading-relaxed text-white/68">
            Explore the full lineup at a licensed retailer near you, or verify
            the product already in your hand.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <MagneticButton
              href="#where-to-buy"
              className="inline-flex rounded-full bg-[#d3a24c] px-8 py-4 text-sm font-black uppercase tracking-wide text-[#17130b] transition-transform hover:scale-[1.03] hover:bg-[#e3b65e]"
            >
              Find Dime
            </MagneticButton>
            <MagneticButton
              href="#nutrition"
              className="inline-flex rounded-full border border-white/30 bg-black/25 px-8 py-4 text-sm font-black uppercase tracking-wide text-[#f7f1e7] backdrop-blur-sm transition-colors hover:border-[#efbd59]/70 hover:bg-black/40"
            >
              Validate product
            </MagneticButton>
          </div>
        </motion.div>

        <div aria-hidden className="hidden min-h-[430px] lg:block" />
      </div>
    </section>
  );
}

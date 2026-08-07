"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import { faqs } from "@/data/products";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#efefec] py-24 text-[#111820] sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-multiply"
        style={{
          backgroundImage: "url(/concrete-black-1024x773.jpg)",
          backgroundSize: "720px auto",
          backgroundPosition: "center",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-center text-xs font-black uppercase tracking-[0.32em] text-[#9b6f16]">
            FAQ
          </p>
          <h2 className="mx-auto mt-4 max-w-md text-center text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl">
            Related questions
          </h2>
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="space-y-3">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <Reveal key={item.q} delay={i * 0.045} y={14}>
                  <div
                    className={`overflow-hidden rounded-2xl border bg-white shadow-[0_12px_35px_rgba(16,24,32,0.06)] transition-colors ${
                      isOpen ? "border-gold/70" : "border-black/[0.04]"
                    }`}
                  >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-bold leading-snug sm:px-7"
                  >
                    <span>{item.q}</span>
                    <motion.span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f2e2bd] text-xl text-[#17130b]"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      +
                    </motion.span>
                  </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.32,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden lg:hidden"
                        >
                          <p className="px-6 pb-6 text-sm leading-relaxed text-[#111820]/65 sm:px-7">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.12} y={18} className="hidden lg:block">
            <div className="sticky top-32 min-h-[300px] rounded-[2rem] border border-white bg-white/55 p-10 shadow-[0_24px_70px_rgba(16,24,32,0.06)] backdrop-blur-sm">
              <AnimatePresence mode="wait" initial={false}>
                {openIndex !== null ? (
                  <motion.div
                    key={openIndex}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9b6f16]">
                      Answer {String(openIndex + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-5 text-2xl font-black leading-tight tracking-[-0.025em]">
                      {faqs[openIndex].q}
                    </h3>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#111820]/68">
                      {faqs[openIndex].a}
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg text-[#111820]/55"
                  >
                    Select a question to see its answer.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

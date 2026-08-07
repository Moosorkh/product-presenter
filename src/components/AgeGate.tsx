"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "dime-age-gate-confirmed";

export default function AgeGate() {
  // Starts closed so server and first client render match (sessionStorage
  // isn't available during SSR); the effect reveals it post-hydration if
  // the visitor hasn't confirmed yet this session. A lazy useState
  // initializer would read sessionStorage before hydration and mismatch
  // the server-rendered markup, so the effect is the correct tool here
  // despite the lint rule's general preference against setState-in-effect.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (sessionStorage.getItem(STORAGE_KEY) !== "true") setVisible(true);
  }, []);

  function confirm() {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  function decline() {
    window.location.href = "https://www.google.com";
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-6 max-w-sm rounded-2xl border border-gold/30 bg-ink-deep p-8 text-center text-[#f3ede1]"
          >
            <Image
              src="/Dime-R-Logo-01-2.png"
              alt="Dime Industries"
              width={2048}
              height={885}
              className="mx-auto h-9 w-auto"
            />
            <h2 className="mt-4 text-xl font-black">Are you 21 or older?</h2>
            <p className="mt-2 text-sm text-[#f3ede1]/60">
              This is a demo product page for cannabis products. You must be
              of legal age to view it.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={decline}
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-[#f3ede1] transition hover:border-white/40"
              >
                No
              </button>
              <button
                onClick={confirm}
                className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink-deep transition hover:bg-gold-dark"
              >
                Yes, I&apos;m 21+
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

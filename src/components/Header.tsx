"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "./MagneticButton";

const links = ["Vapes", "Edibles", "Prerolls", "Accessories"];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const paddingY = useTransform(scrollY, [0, 140], [17, 9]);
  const logoScale = useTransform(scrollY, [0, 140], [1, 0.9]);
  const shadowOpacity = useTransform(scrollY, [0, 140], [0.08, 0.24]);
  const boxShadow = useTransform(
    shadowOpacity,
    (v) => `0 8px 24px -12px rgba(0,0,0,${v})`
  );

  return (
    <motion.header
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-[#b78a2f]/20 bg-[#f5f1e8]/95 text-[#17130b] backdrop-blur-xl"
      style={{ paddingTop: paddingY, paddingBottom: paddingY, boxShadow }}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-5 px-5 md:grid-cols-[auto_1fr_auto] md:px-8">
        <motion.a
          href="#top"
          className="flex origin-left items-center"
          style={{ scale: logoScale }}
          onClick={() => setMobileOpen(false)}
          whileHover={{ y: -2 }}
        >
            <Image
              src="/Dime-R-Logo-01-2.png"
              alt="Dime Industries"
              width={2048}
              height={885}
              priority
              className="h-9 w-auto sm:h-10"
            />
        </motion.a>

        <nav className="hidden items-center justify-center gap-6 text-xs font-black uppercase tracking-[0.14em] md:flex lg:gap-10">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="group relative py-2 text-[#17130b]/70 transition hover:text-[#17130b]"
            >
              {link}
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MagneticButton
            href="#where-to-buy"
            className="hidden rounded-full border border-[#17130b]/45 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-[#17130b] transition-colors hover:border-[#17130b] hover:bg-[#17130b] hover:text-[#f5f1e8] sm:block"
          >
            Find Dime
          </MagneticButton>
          <MagneticButton
            href="#nutrition"
            className="rounded-full bg-gold px-5 py-2.5 text-xs font-black uppercase tracking-wide text-[#17130b] shadow-[0_8px_20px_rgba(183,138,47,0.2)]"
          >
            Validate
          </MagneticButton>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <motion.span
              className="block h-0.5 w-5 bg-[#17130b]"
              animate={mobileOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 w-5 bg-[#17130b]"
              animate={mobileOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#b78a2f]/20 bg-[#f5f1e8] md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-2 py-3 text-sm font-bold uppercase tracking-wide text-[#17130b]/75 transition hover:bg-gold/15 hover:text-[#17130b]"
                >
                  {link}
                </a>
              ))}
              <a
                href="#where-to-buy"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-lg border border-[#17130b]/30 px-2 py-3 text-center text-sm font-bold uppercase tracking-wide text-[#17130b]"
              >
                Find Dime
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

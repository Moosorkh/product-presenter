"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type MagneticButtonProps = {
  href: string;
  className?: string;
  children: ReactNode;
  strength?: number;
};

export default function MagneticButton({
  href,
  className,
  children,
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      quickX.current = gsap.quickTo(ref.current, "x", { duration: 0.5, ease: "power3.out" });
      quickY.current = gsap.quickTo(ref.current, "y", { duration: 0.5, ease: "power3.out" });
    },
    { scope: ref }
  );

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    quickX.current?.(relX * strength);
    quickY.current?.(relY * strength);
  }

  function handleLeave() {
    quickX.current?.(0);
    quickY.current?.(0);
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </a>
  );
}

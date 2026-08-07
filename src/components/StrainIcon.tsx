import type { StrainType } from "@/data/products";

export default function StrainIcon({ type, className }: { type: StrainType; className?: string }) {
  const size = className ?? "h-4 w-4";

  if (type === "Sativa") {
    return (
      <svg viewBox="0 0 24 24" className={size} fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="4.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="12"
            y1="12"
            x2="12"
            y2="3"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
      </svg>
    );
  }

  if (type === "Indica") {
    return (
      <svg viewBox="0 0 24 24" className={size} fill="currentColor">
        <path d="M12 3a9 9 0 1 0 8.94 10.12A7 7 0 0 1 12 3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={size} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
